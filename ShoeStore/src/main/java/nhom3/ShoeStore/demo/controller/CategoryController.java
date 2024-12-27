package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.model.Category;
import nhom3.ShoeStore.demo.service.CartService;
import nhom3.ShoeStore.demo.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/categories")
public class CategoryController {
	@Autowired
	private CartService cartService;

	@Autowired
	private CategoryService categoryService;

	/**
     * lấy danh sách tất cả danh mục với phân trang
     * @param 
     */
	@GetMapping
	public ResponseEntity<Map<String, Object>> listAllCategories(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<Category> categoryPage = categoryService.findAllCategoriesWithPagination(pageable);

			Map<String, Object> response = new HashMap<>();
			response.put("categories", categoryPage.getContent());
			response.put("currentPage", categoryPage.getNumber());
			response.put("totalItems", categoryPage.getTotalElements());
			response.put("totalPages", categoryPage.getTotalPages());

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Error retrieving categories"));
		}
	}

	/**
     * thêm mới một danh mục
     * @param 
     */
	@PostMapping("/add")
	public ResponseEntity<String> addCategory(@RequestBody Category category) {
		try {
			Category newCategory = categoryService.createCategory(category.getName(), category.getDescription());
			return ResponseEntity.status(201).body("Danh mục mới đã được tạo: " + newCategory.getName());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(400).body(e.getMessage()); // Return the validation error
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Có lỗi xảy ra khi tạo danh mục");
		}
	}

	/**
     * Xóa danh mục theo id
     * @param 
     */
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
		try {
			boolean isDeleted = categoryService.deleteCategory(id);
			if (isDeleted) {
				return ResponseEntity.noContent().build();
			} else {
				return ResponseEntity.status(404).build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	/**
     * cập nhật tên danh mục và mô tả theo id
     * @param 
     */
	@PutMapping("/update/{id}")
	public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> updates) {
		try {
			String name = updates.get("name");
			String description = updates.get("description");

			// Gọi phương thức updateCategory với đủ 3 tham số
			Category updatedCategory = categoryService.updateCategory(id, name, description);
			if (updatedCategory != null) {
				return ResponseEntity.ok(updatedCategory);
			} else {
				return ResponseEntity.status(404).body(null);
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	/**
     * tìm danh mục theo tên
     * @param 
     */
	@GetMapping("/find")
	public ResponseEntity<Category> findCategoryByName(@RequestParam String name) {
		try {
			Category category = categoryService.findByName(name);
			if (category != null) {
				return ResponseEntity.ok(category);
			} else {
				return ResponseEntity.status(404).body(null);
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

}
