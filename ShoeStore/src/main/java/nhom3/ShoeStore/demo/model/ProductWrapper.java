package nhom3.ShoeStore.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductWrapper {
    @JsonProperty("product")
    private Product product;

    // Getters and Setters
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
