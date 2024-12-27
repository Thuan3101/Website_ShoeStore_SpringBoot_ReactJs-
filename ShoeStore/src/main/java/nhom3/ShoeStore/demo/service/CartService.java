package nhom3.ShoeStore.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nhom3.ShoeStore.demo.model.CartItem;
import nhom3.ShoeStore.demo.model.Color;
import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.model.Size;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.repository.CartItemRepository;
import nhom3.ShoeStore.demo.repository.ProductRepository;
import nhom3.ShoeStore.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;

@Service
public class CartService {


	@Autowired
	private CartItemRepository cartItemRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SizeService sizeService;

	public void addProductToCart(Long productId, Long userId, int quantity, Size selectedSize, Color selectedColor) {
		// Retrieve product by ID
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		// Retrieve user by ID
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// Check if the cart item already exists for the user with the same product,
		// size, and color
		Optional<CartItem> existingCartItem = cartItemRepository.findByUserId(userId).stream()
				.filter(item -> item.getProduct().getId().equals(productId)
						&& item.getSelectedSize().getId().equals(selectedSize.getId())
						&& item.getSelectedColor().getId().equals(selectedColor.getId())) // Check selected color
				.findFirst();

		if (existingCartItem.isPresent()) {
			// Update the quantity if the item already exists
			CartItem cartItem = existingCartItem.get();
			cartItem.setQuantity(cartItem.getQuantity() + quantity);
			cartItemRepository.save(cartItem);
		} else {
			// Create a new cart item if it doesn't exist
			CartItem cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setUser(user);
			cartItem.setQuantity(quantity);
			cartItem.setSelectedSize(selectedSize); // Set the selected Size object
			cartItem.setSelectedColor(selectedColor); // Set the selected Color object
			cartItem.setAddedDate(new Timestamp(System.currentTimeMillis()));
			cartItemRepository.save(cartItem);
		}
	}

	// Method to get cart for user
	public List<CartItem> getCartForUser(Long userId) {
		return cartItemRepository.findByUserId(userId);
	}

	// Method to update cart item quantity
	public void updateCartItem(Long productId, int quantity, Long userId) {
		Optional<CartItem> existingCartItem = cartItemRepository.findByUserId(userId).stream()
				.filter(item -> item.getProduct().getId().equals(productId)).findFirst();

		if (existingCartItem.isPresent()) {
			CartItem cartItem = existingCartItem.get();
			if (quantity == 0) {
				cartItemRepository.delete(cartItem);
			} else {
				cartItem.setQuantity(quantity);
				cartItemRepository.save(cartItem);
			}
		} else {
			throw new RuntimeException("Cart item not found");
		}
	}

	public boolean removeFromCart(Long userId, Long cartItemId) {
	    Optional<CartItem> cartItem = cartItemRepository.findByIdAndUserId(cartItemId, userId);
	    if (cartItem.isPresent()) {
	        cartItemRepository.delete(cartItem.get());
	        return true;
	    } else {
	        return false;
	    }
	}
	
	public boolean deleteCartItemById(Long itemId) {
	    Optional<CartItem> cartItemOptional = cartItemRepository.findById(itemId);
	    if (cartItemOptional.isPresent()) {
	        cartItemRepository.delete(cartItemOptional.get());
	        return true;
	    }
	    return false;
	}
	
	public boolean updateCartItemQuantity(Long userId, Long cartItemId, int quantity) {
	    // Retrieve the cart item based on userId and cartItemId
	    Optional<CartItem> optionalCartItem = cartItemRepository.findByIdAndUserId(cartItemId, userId);
	    
	    if (optionalCartItem.isPresent()) {
	        CartItem cartItem = optionalCartItem.get();
	        cartItem.setQuantity(quantity);
	        cartItemRepository.save(cartItem); // Update the item in the database
	        return true;
	    }
	    return false; // Return false if the cart item is not found
	}



}
