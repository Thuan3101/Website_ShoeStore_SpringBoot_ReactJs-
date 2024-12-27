package nhom3.ShoeStore.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nhom3.ShoeStore.demo.model.Category;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAll(Pageable pageable);
    Category findByName(String name);
    
}
