package nhom3.ShoeStore.demo.model;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

@Embeddable
public class Availability implements Serializable {

    private boolean inStock;
    private int quantity;

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
