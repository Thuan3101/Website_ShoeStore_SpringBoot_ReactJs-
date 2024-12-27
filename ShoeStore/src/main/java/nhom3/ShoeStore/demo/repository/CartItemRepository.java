package nhom3.ShoeStore.demo.repository;

import nhom3.ShoeStore.demo.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	List<CartItem> findByUserId(Long userId);

	void deleteByProductId(Long productId);

	Optional<CartItem> findByIdAndUserId(Long cartItemId, Long userId);

	void deleteCartItemById(Long cartItemId);

}
