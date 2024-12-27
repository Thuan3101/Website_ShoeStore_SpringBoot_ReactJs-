package nhom3.ShoeStore.demo.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class OrderDto {
    private Long orderId;
    private Timestamp orderDate;
    private BigDecimal totalPrice;
    private String status;
    private String customerName;
    private String shippingAddress;
    private String phoneNumber;
    private String email;

    public OrderDto(Long orderId, Timestamp orderDate, BigDecimal totalPrice, String status,
                    String customerName, String shippingAddress, String phoneNumber, String email) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.status = status;
        this.customerName = customerName;
        this.shippingAddress = shippingAddress;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public Timestamp getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Timestamp orderDate) {
		this.orderDate = orderDate;
	}

	public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

    
}
