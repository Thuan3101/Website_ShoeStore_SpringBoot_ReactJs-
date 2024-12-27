package nhom3.ShoeStore.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nhom3.ShoeStore.demo.model.Color;
import nhom3.ShoeStore.demo.repository.ColorRepository;

@Service
public class ColorService {

	@Autowired
	private ColorRepository colorRepository; // Assuming you have a repository for colors

	public Color getColorById(Long id) {
		return colorRepository.findById(id).orElseThrow(() -> new RuntimeException("Color not found"));
	}
}
