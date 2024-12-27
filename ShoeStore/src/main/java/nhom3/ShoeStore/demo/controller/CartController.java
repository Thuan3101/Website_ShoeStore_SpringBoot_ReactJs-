package nhom3.ShoeStore.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import nhom3.ShoeStore.demo.model.CartItem;
import nhom3.ShoeStore.demo.model.Color;
import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.model.Size;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;
import nhom3.ShoeStore.demo.service.CartService;
import nhom3.ShoeStore.demo.service.ColorService;
import nhom3.ShoeStore.demo.service.ProductService;
import nhom3.ShoeStore.demo.service.SizeService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/cart")
public class CartController {
	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private CartService cartService;

	@Autowired
	private SizeService sizeService;

	@Autowired
	private ColorService colorService;

	@Autowired
	private ProductService productService;

	private String getSelectedSizeFromSessionOrRequest(Long productId, HttpSession session) {
		// Check if the selected size is stored in the session
		Map<Long, String> selectedSizes = (Map<Long, String>) session.getAttribute("selectedSizes");
		if (selectedSizes != null) {
			return selectedSizes.get(productId); // Get size for the specific product ID
		}
		return null; // Or a default value if no size is found
	}

	/**
     * lấy thông tin giỏ hàng
     * @param 
     */
	@GetMapping
	@ResponseBody
	public ResponseEntity<List<CartItem>> getCartItems(
			@RequestHeader(value = "Authorization", required = false) String authorizationHeader, HttpSession session) {

		List<CartItem> cartItems = new ArrayList<>();

		// Check for Authorization header and extract userId from token
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);
			Long userId = jwtTokenUtil.getUserIdFromToken(token); // Extract userId from token

			if (userId != null && userId != 0) {
				cartItems = cartService.getCartForUser(userId);
			}
		} else {
			// Nếu không có userId, xử lý giỏ hàng tạm thời
			Map<String, CartItem> cart = (Map<String, CartItem>) session.getAttribute("cart");

			if (cart != null) {
				for (Map.Entry<String, CartItem> entry : cart.entrySet()) {
					String cartKey = entry.getKey();
					CartItem cartItem = entry.getValue();
					String[] keyParts = cartKey.split("_");
					Long productId = Long.valueOf(keyParts[0]);

					Product product = productService.getProductById(productId);
					if (product != null) {
						Size selectedSize = cartItem.getSelectedSize();
						Color selectedColor = cartItem.getSelectedColor();
						cartItems.add(new CartItem(product, cartItem.getQuantity(), selectedSize, selectedColor));
					}
				}
			}
		}

		return ResponseEntity.ok(cartItems);
	}

	/**
     * Thêm mới sản phẩm vào giỏ hàng
     * @param 
     */
	@PostMapping("/add")
	@ResponseBody
	public ResponseEntity<Map<String, String>> addToCartForUser(@RequestParam("productId") Long productId,
			@RequestParam("quantity") int quantity, @RequestParam("selectedSize") Long selectedSizeId,
			@RequestParam("selectedColor") Long selectedColorId, HttpServletRequest request) {
		try {
			String token = request.getHeader("Authorization");
			Map<String, String> response = new HashMap<>();

			// Kiểm tra token. Nếu không có token hoặc token không hợp lệ, xử lý như là
			// khách
			if (token == null || !token.startsWith("Bearer ")) {
				response.put("message", "Product added to cart for guest");
				response.put("status", "guest");
				return ResponseEntity.ok(response);
			}

			Long userId = jwtTokenUtil.getUserIdFromToken(token.substring(7));
			Size selectedSize = sizeService.getSizeById(selectedSizeId);
			Color selectedColor = colorService.getColorById(selectedColorId);

			if (selectedSize == null || selectedColor == null) {
				response.put("message", "Selected size or color is invalid");
				return ResponseEntity.badRequest().body(response);
			}

			if (userId != null && userId != 0) {
				cartService.addProductToCart(productId, userId, quantity, selectedSize, selectedColor);
				response.put("message", "Product added to cart for user");
				response.put("status", "user");
				return ResponseEntity.ok(response);
			} else {
				response.put("message", "User ID not found in token.");
				response.put("status", "unauthorized");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "An error occurred");
			errorResponse.put("status", "error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	/**
     * cập nhật giỏ hàng
     * @param 
     */
	@PostMapping("/update")
	public String updateCart(@RequestParam("productId") Long productId, @RequestParam("quantity") int quantity,
			HttpServletRequest request) {
		HttpSession session = request.getSession();
		Long userId = (Long) session.getAttribute("userId");

		if (userId != null) {
			cartService.updateCartItem(productId, quantity, userId);
		} else {
			Map<Long, Integer> cart = (Map<Long, Integer>) session.getAttribute("cart");

			if (cart != null && cart.containsKey(productId)) {
				if (quantity == 0) {
					cart.remove(productId);
				} else {
					cart.put(productId, quantity);
				}
				session.setAttribute("cart", cart);
			}
		}

		return "redirect:/cart/view";
	}

	/**
	 * xóa sản phẩm khỏi giỏ hàng
	 * 
	 * @param
	 */
	@DeleteMapping("/remove/{cartItemId}")
	public ResponseEntity<String> removeProductFromCart(@RequestHeader("Authorization") String authorizationHeader,
			@PathVariable Long cartItemId) {

		try {
			// Extract the token from the Authorization header
			if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				String token = authorizationHeader.substring(7);
				Long userId = jwtTokenUtil.getUserIdFromToken(token); // Extract userId from token

				if (userId != null && userId != 0) {
					boolean isRemoved = cartService.removeFromCart(userId, cartItemId); // Remove item using userId and
																						// cartItemId
					if (isRemoved) {
						return ResponseEntity.ok("Product removed from cart successfully.");
					} else {
						return ResponseEntity.status(404).body("Product not found in cart.");
					}
				} else {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID not found in token.");
				}
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body("Authorization header missing or malformed.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error removing product from cart: " + e.getMessage());
		}
	}
	
	/**
     * Cập nhật sô lượng giỏ hàng
     * @param 
     */
	@PatchMapping("/update-quantity/{cartItemId}")
	@ResponseBody
	public ResponseEntity<String> updateCartItemQuantity(
	        @RequestHeader("Authorization") String authorizationHeader,
	        @PathVariable Long cartItemId,
	        @RequestBody Map<String, Integer> requestBody) {
	    try {
	        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	            String token = authorizationHeader.substring(7);
	            Long userId = jwtTokenUtil.getUserIdFromToken(token);

	            if (userId != null && userId != 0) {
	                int quantity = requestBody.get("quantity");
	                boolean isUpdated = cartService.updateCartItemQuantity(userId, cartItemId, quantity);

	                if (isUpdated) {
	                    return ResponseEntity.ok("Cart item quantity updated successfully.");
	                } else {
	                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found.");
	                }
	            } else {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID not found in token.");
	            }
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header missing or malformed.");
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Error updating cart item quantity: " + e.getMessage());
	    }
	}



}
