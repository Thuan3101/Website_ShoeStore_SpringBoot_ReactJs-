package nhom3.ShoeStore.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "product_category")
@IdClass(ProductCategoryId.class)
public class ProductCategory implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Id
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

    
}
