package nhom3.ShoeStore.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nhom3.ShoeStore.demo.model.Color;

public interface ColorRepository extends JpaRepository<Color, Long> {
}

