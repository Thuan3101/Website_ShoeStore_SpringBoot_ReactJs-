package nhom3.ShoeStore.demo.repository;

import nhom3.ShoeStore.demo.model.ProductCategory;
import nhom3.ShoeStore.demo.model.ProductCategoryId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, ProductCategoryId> {
    void deleteByProductId(Long productId); 
    boolean existsByProductIdAndCategoryId(Long productId, Long categoryId);
    @Query("SELECT pc.product.id FROM ProductCategory pc WHERE pc.category.id = ?1")
    List<Long> findProductIdsByCategoryId(Long categoryId);
    void deleteByProductIdAndCategoryId(Long productId, Long categoryId); // Delete only the specific product-category
}

