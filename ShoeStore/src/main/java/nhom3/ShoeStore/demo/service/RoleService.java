package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.Role;
import nhom3.ShoeStore.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role findByName(String name) {
        return roleRepository.findByName(name);
    }

    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    // Bạn có thể thêm các phương thức khác để quản lý vai trò nếu cần
}
