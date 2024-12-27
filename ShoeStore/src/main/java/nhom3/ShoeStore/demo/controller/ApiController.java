package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.model.Category;
import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.service.CategoryService;
import nhom3.ShoeStore.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private ProductService productService;

	/**
     * Lấy danh sách danh mục
     * @param 
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> listAllCategories() {
        try {
            List<Category> categories = categoryService.findAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

	/**
     * Lấy danh sách sản phẩm
     * @param 
     */
    @GetMapping("/products")
    public ResponseEntity<List<Product>> listAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
