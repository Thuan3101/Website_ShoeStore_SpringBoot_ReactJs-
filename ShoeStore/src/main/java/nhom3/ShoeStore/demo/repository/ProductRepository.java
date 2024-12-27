package nhom3.ShoeStore.demo.repository;

import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.model.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	Optional<Product> findBySlug(String slug);

	// Method to find products by a list of IDs with pagination
	@Query("SELECT p FROM Product p WHERE p.id IN ?1")
	Page<Product> findAllById(List<Long> ids, Pageable pageable);

	// Method to find products by a category name using the ProductCategory mapping
	@Query("SELECT p FROM Product p JOIN ProductCategory pc ON p.id = pc.product.id JOIN pc.category c WHERE c.name = ?1")
	Page<Product> findAllByCategoryName(String categoryName, Pageable pageable);

	Page<Product> findAll(Pageable pageable);

	@Query("SELECT p FROM Product p WHERE p.availability.quantity IS NOT NULL ORDER BY p.availability.quantity ASC")
	Page<Product> findAllOrderByQuantity(Pageable pageable);

	@Query("SELECT p FROM Product p WHERE p.availability.quantity IS NOT NULL ORDER BY p.availability.quantity DESC")
	Page<Product> findAllOrderByQuantityDesc(Pageable pageable);

	@Query("SELECT p FROM Product p ORDER BY p.shoe_id ASC")
	Page<Product> findAllOrderByShoeId(Pageable pageable);

	@Query("SELECT p FROM Product p ORDER BY p.shoe_id DESC")
	Page<Product> findAllOrderByShoeIdDesc(Pageable pageable);

	Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
	
	
	@Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.shoe_id = ?1")
	boolean existsByShoe_id(String shoe_id);



}
