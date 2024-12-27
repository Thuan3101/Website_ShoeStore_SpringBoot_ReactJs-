package nhom3.ShoeStore.demo.model;

import java.io.Serializable;
import java.util.Objects;

public class ProductCategoryId implements Serializable {

    private Long product;
    private Long category;

    public ProductCategoryId() {}

    public ProductCategoryId(Long product, Long category) {
        this.product = product;
        this.category = category;
    }

    public Long getProduct() {
        return product;
    }

    public void setProduct(Long product) {
        this.product = product;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductCategoryId that = (ProductCategoryId) o;
        return Objects.equals(product, that.product) &&
               Objects.equals(category, that.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(product, category);
    }
}
