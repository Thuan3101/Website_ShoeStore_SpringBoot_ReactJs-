package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.Order;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.repository.OrderItemRepository;
import nhom3.ShoeStore.demo.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;

	@Autowired
	public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
	}

	public Order createOrder(Order order) {
		return orderRepository.save(order);
	}

	public Order getOrderById(Long orderId) {
		return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
	}

	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}

	public void deleteOrder(Long orderId) {
		orderRepository.deleteById(orderId);
	}

	// Add more methods as needed, such as updating order status
	public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }
}
