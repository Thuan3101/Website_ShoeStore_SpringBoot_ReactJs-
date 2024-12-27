package nhom3.ShoeStore.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "cart_items")
public class CartItem implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne // Adjust as needed for your relation
    @JoinColumn(name = "size_id", nullable = false) // Ensure this matches your database column
    private Size selectedSize;

    @ManyToOne // Adjust as needed for your relation
    @JoinColumn(name = "color_id", nullable = false) // Ensure this matches your database column
    private Color selectedColor;

    @Column(name = "added_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp addedDate;

    // Default constructor
    public CartItem() {
        super();
    }

    // Constructor for Product, Quantity, Size, and Color
    public CartItem(Product product, int quantity, Size selectedSize, Color selectedColor) {
        this.product = product;
        this.quantity = quantity;
        this.selectedSize = selectedSize; // Accept Size object
        this.selectedColor = selectedColor; // Accept Color object
    }
    

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Size getSelectedSize() {
        return selectedSize;
    }

    public void setSelectedSize(Size selectedSize) {
        this.selectedSize = selectedSize;
    }

    public Color getSelectedColor() {
        return selectedColor;
    }

    public void setSelectedColor(Color selectedColor) {
        this.selectedColor = selectedColor;
    }

    public Timestamp getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(Timestamp addedDate) {
        this.addedDate = addedDate;
    }
}
