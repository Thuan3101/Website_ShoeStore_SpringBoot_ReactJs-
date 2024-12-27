package nhom3.ShoeStore.demo.repository;

import nhom3.ShoeStore.demo.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

	Page<User> findAll(Pageable pageable);

	Optional<User> findByEmail(String email);

	// Tìm kiếm người dùng theo username hoặc email
	Optional<User> findByUsernameOrEmail(String username, String email);

	// Add these methods to check if a username or email already exists
	boolean existsByUsername(String username);

	boolean existsByEmail(String email);
}
