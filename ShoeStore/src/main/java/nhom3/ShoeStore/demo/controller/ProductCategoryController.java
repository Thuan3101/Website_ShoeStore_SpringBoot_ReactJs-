package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.model.ProductCategory;
import nhom3.ShoeStore.demo.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/product-categories")
public class ProductCategoryController {

	@Autowired
	private ProductCategoryService productCategoryService;

	/**
     * lấy danh sách danh mục sản phẩm với phân trang
     * @param 
     */
	@GetMapping
	public ResponseEntity<Map<String, Object>> getAll(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<ProductCategory> productCategoryPage = productCategoryService.findAll(pageable);

			// Tạo đối tượng phản hồi chứa dữ liệu và thông tin phân trang
			Map<String, Object> response = new HashMap<>();
			response.put("productCategories", productCategoryPage.getContent());
			response.put("currentPage", productCategoryPage.getNumber());
			response.put("totalItems", productCategoryPage.getTotalElements());
			response.put("totalPages", productCategoryPage.getTotalPages());

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	/**
     * xóa danh mục sản phẩm
     * @param 
     */
	@DeleteMapping("/{productId}/{categoryId}")
	public ResponseEntity<Void> delete(@PathVariable Long productId, @PathVariable Long categoryId) {
	    productCategoryService.delete(productId, categoryId);
	    return ResponseEntity.noContent().build();
	}

	/**
     * Thêm mới một danh mục sản phẩm
     * @param 
     */
	@PostMapping("/bulk")
	public ResponseEntity<Map<String, Boolean>> createBulk(@RequestBody List<ProductCategory> productCategories) {
	    boolean exists = false;
	    
	    for (ProductCategory pc : productCategories) {
	        // Check if the relationship already exists
	        if (productCategoryService.existsByProductAndCategory(pc.getProduct().getId(), pc.getCategory().getId())) {
	            exists = true;
	            break;
	        }
	    }

	    if (exists) {
	        return ResponseEntity.ok(Collections.singletonMap("exists", true));
	    }

	    // Save new relationships that do not exist
	    productCategoryService.saveAll(productCategories);
	    return ResponseEntity.ok(Collections.singletonMap("exists", false));
	}


	@PostMapping
	public ResponseEntity<ProductCategory> create(@RequestBody ProductCategory productCategory) {
		productCategoryService.save(productCategory);
		return ResponseEntity.status(201).body(productCategory);
	}

}
