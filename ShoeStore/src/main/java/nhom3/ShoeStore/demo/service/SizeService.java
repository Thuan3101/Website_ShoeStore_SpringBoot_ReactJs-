package nhom3.ShoeStore.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nhom3.ShoeStore.demo.model.Size;
import nhom3.ShoeStore.demo.repository.SizeRepository;

@Service
public class SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    public Size getSizeById(Long sizeId) {
        return sizeRepository.findById(sizeId).orElseThrow(() -> new RuntimeException("Size not found")); // Ensure exception handling
    }
}


