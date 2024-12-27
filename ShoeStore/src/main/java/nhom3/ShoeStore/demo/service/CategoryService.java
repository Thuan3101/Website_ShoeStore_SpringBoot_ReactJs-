package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.Category;
import nhom3.ShoeStore.demo.repository.CategoryRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Retrieve all categories without pagination
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    // Retrieve paginated categories
    public Page<Category> findAllCategoriesWithPagination(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    // Find category by name
    public Category findByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Create new category with name uniqueness check
    public Category createCategory(String name, String description) throws IllegalArgumentException {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }

        // Check if the category name already exists
        if (categoryRepository.findByName(name) != null) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        // Create new category
        Category newCategory = new Category();
        newCategory.setName(name);
        newCategory.setDescription(description != null ? description : ""); // Description can be null
        return categoryRepository.save(newCategory);
    }

    // Delete category by ID
    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Update category
    public Category updateCategory(Long id, String name, String description) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            category.setName(name);
            category.setDescription(description);
            return categoryRepository.save(category);
        }
        return null;
    }
}
