package nhom3.ShoeStore.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import nhom3.ShoeStore.demo.model.Category;
import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.model.ProductCategory;
import nhom3.ShoeStore.demo.repository.CartItemRepository;
import nhom3.ShoeStore.demo.repository.CategoryRepository;
import nhom3.ShoeStore.demo.repository.ProductCategoryRepository;
import nhom3.ShoeStore.demo.repository.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

	@Autowired
	private final ProductRepository productRepository;

	@Autowired
	private final CategoryService categoryService;

	@Autowired
	private final ProductCategoryRepository productCategoryRepository;

	@Autowired
	private final CartItemRepository cartItemRepository;

	@Autowired
	private final CategoryRepository categoryRepository;

	public Page<Product> searchProductsByName(String name, Pageable pageable) {
		return productRepository.findByNameContainingIgnoreCase(name, pageable);
	}

	public ProductService(ProductRepository productRepository, CategoryService categoryService,
			ProductCategoryRepository productCategoryRepository, CartItemRepository cartItemRepository,
			CategoryRepository categoryRepository) {
		this.productRepository = productRepository;
		this.categoryService = categoryService;
		this.productCategoryRepository = productCategoryRepository;
		this.cartItemRepository = cartItemRepository;
		this.categoryRepository = categoryRepository;
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public Page<Product> getProductsByPage(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return productRepository.findAll(pageable);
	}

	public Page<Product> getProductsByPageForAdmin(int page, int size, String sortField, String sortOrder) {
		Pageable pageable = PageRequest.of(page, size);

		// Kiểm tra nếu sortField là quantity
		if ("quantity".equals(sortField)) {
			if ("asc".equalsIgnoreCase(sortOrder)) {
				return productRepository.findAllOrderByQuantity(pageable);
			} else {
				return productRepository.findAllOrderByQuantityDesc(pageable);
			}
		} else if ("shoe_id".equals(sortField)) { // Thêm điều kiện cho shoe_id
			if ("asc".equalsIgnoreCase(sortOrder)) {
				return productRepository.findAllOrderByShoeId(pageable);
			} else {
				return productRepository.findAllOrderByShoeIdDesc(pageable);
			}
		} else { // Sắp xếp cho các trường còn lại
			Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
			pageable = PageRequest.of(page, size, sort);
			return productRepository.findAll(pageable);
		}
	}

	public Product getProductById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
	}

	public Product getProductBySlug(String slug) {
		return productRepository.findBySlug(slug)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
	}

	public Page<Product> getProductsByCategoryName(String categoryName, Pageable pageable) {
		return productRepository.findAllByCategoryName(categoryName, pageable);
	}

	@Transactional
	public void saveProduct(Product product, List<String> categoryNames) {
	    // Check if a product with the same shoe_id already exists
	    if (productRepository.existsByShoe_id(product.getShoe_id())) {
	        throw new DuplicateKeyException("Shoe ID " + product.getShoe_id() + " already exists!");
	    }

	    // Generate a unique slug
	    String slug = generateSlug(product.getName(), product.getId());
	    product.setSlug(slug);

	    // Save the product first
	    productRepository.save(product); // Persist the product to get an ID

	    // Create or retrieve categories and associate them with the product
	    for (String categoryName : categoryNames) {
	        Category category = Optional.ofNullable(categoryService.findByName(categoryName))
	                .orElseGet(() -> categoryService.createCategory(categoryName, ""));
	        associateProductWithCategory(product, category); // Ensure this method handles associations correctly
	    }
	}


	private void associateProductWithCategory(Product product, Category category) {
		ProductCategory productCategory = new ProductCategory();
		productCategory.setProduct(product);
		productCategory.setCategory(category);
		productCategoryRepository.save(productCategory);
	}

	public void updateProduct(Long id, Product product) {
		// Check if the product exists
		if (productRepository.existsById(id)) {
			product.setId(id);
			productRepository.save(product); // Save the updated product
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
		}
	}

	@Transactional
	public void deleteProduct(Long id) {
		Product product = getProductById(id);
		productCategoryRepository.deleteByProductId(id);
		cartItemRepository.deleteByProductId(id);
		productRepository.delete(product);
	}

	private String generateSlug(String name, Long id) {
		String baseSlug = name.replaceAll(" ", "-").toLowerCase();
		String slug = baseSlug;

		if (id != null) {
			slug += "-" + id;
		}

		int count = 1;
		while (productRepository.findBySlug(slug).isPresent()) {
			slug = baseSlug + "-" + count;
			count++;
		}

		return slug;
	}

	public int getTotalPages(int size) {
		long totalProducts = productRepository.count();
		return (int) Math.ceil((double) totalProducts / size);
	}
}
