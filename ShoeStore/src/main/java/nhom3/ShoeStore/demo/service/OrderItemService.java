package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.OrderItem;
import nhom3.ShoeStore.demo.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public OrderItem addOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrder_OrderId(orderId);
    }

    public void deleteOrderItem(Long orderItemId) {
        orderItemRepository.deleteById(orderItemId);
    }

    // New method to get an OrderItem by its ID
    public OrderItem getOrderItemById(Long itemId) {
        return orderItemRepository.findById(itemId).orElseThrow(() -> 
            new RuntimeException("Order item not found with ID: " + itemId));
    }

    // Add more methods as needed
}
