package nhom3.ShoeStore.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "products")
public class Product implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 255)
	private String shoe_id;

	@Column(nullable = false, length = 255)
	private String name;

	@Column(nullable = false, length = 255)
	private String brand;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Column(length = 3)
	private String currency;

//    @ElementCollection
//    @CollectionTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id"))
	@Column(name = "categories")
	private List<String> categories;

	@Embedded
	private Options options;

	@Embedded
	private Availability availability;

	@ElementCollection
	@CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
	@Column(name = "image_url")
	private List<String> images;

	@Embedded
	private Ratings ratings;

//    @Column(name = "stock_quantity", columnDefinition = "INT DEFAULT 0")
//    private int stockQuantity;

	@Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
	private Timestamp createdAt;

	@Column(unique = true, length = 255)
	private String slug;

	// Getters and Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getShoe_id() {
		return shoe_id;
	}

	public void setShoe_id(String shoe_id) {
		this.shoe_id = shoe_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public List<String> getCategories() {
		return categories;
	}

	public void setCategories(List<String> categories) {
		this.categories = categories;
	}

	public Options getOptions() {
		return options;
	}

	public void setOptions(Options options) {
		this.options = options;
	}

	public Availability getAvailability() {
		return availability;
	}

	public void setAvailability(Availability availability) {
		this.availability = availability;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public Ratings getRatings() {
		return ratings;
	}

	public void setRatings(Ratings ratings) {
		this.ratings = ratings;
	}

//    public int getStockQuantity() {
//        return stockQuantity;
//    }
//
//    public void setStockQuantity(int stockQuantity) {
//        this.stockQuantity = stockQuantity;
//    }

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}
}
