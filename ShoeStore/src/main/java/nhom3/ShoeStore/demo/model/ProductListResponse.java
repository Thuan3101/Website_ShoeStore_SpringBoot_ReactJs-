package nhom3.ShoeStore.demo.model;

import java.util.List;

public class ProductListResponse {
	private List<Product> products;
	private int totalPages;
	private String errorMessage;

	public ProductListResponse(List<Product> products, int totalPages) {
		this.products = products;
		this.totalPages = totalPages;
	}

	public ProductListResponse(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	// Getters and setters
	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
