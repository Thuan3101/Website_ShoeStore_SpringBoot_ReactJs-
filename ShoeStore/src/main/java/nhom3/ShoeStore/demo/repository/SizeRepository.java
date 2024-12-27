package nhom3.ShoeStore.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nhom3.ShoeStore.demo.model.Size;

public interface SizeRepository extends JpaRepository<Size, Long> {
    // Các phương thức truy vấn khác nếu cần
}

