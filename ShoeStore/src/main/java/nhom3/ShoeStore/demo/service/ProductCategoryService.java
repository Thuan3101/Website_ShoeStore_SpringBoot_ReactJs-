package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.ProductCategory;
import nhom3.ShoeStore.demo.model.ProductCategoryId;
import nhom3.ShoeStore.demo.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public List<ProductCategory> findAll() {
        return productCategoryRepository.findAll();
    }

    public Page<ProductCategory> findAll(Pageable pageable) {
        return productCategoryRepository.findAll(pageable);
    }

    public ProductCategory findById(Long productId, Long categoryId) {
        return productCategoryRepository.findById(new ProductCategoryId(productId, categoryId)).orElse(null);
    }

    // Add existsByProductAndCategory method
    public boolean existsByProductAndCategory(Long productId, Long categoryId) {
        return productCategoryRepository.existsByProductIdAndCategoryId(productId, categoryId);
    }

    public void save(ProductCategory productCategory) {
        productCategoryRepository.save(productCategory);
    }

    // Add saveAll method to save a list of ProductCategory entities
    public void saveAll(List<ProductCategory> productCategories) {
        productCategoryRepository.saveAll(productCategories);
    }

    @Transactional
    public void delete(Long productId, Long categoryId) {
        productCategoryRepository.deleteByProductIdAndCategoryId(productId, categoryId);
    }

    
}
