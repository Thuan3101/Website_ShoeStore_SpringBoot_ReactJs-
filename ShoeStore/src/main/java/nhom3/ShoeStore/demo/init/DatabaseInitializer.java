package nhom3.ShoeStore.demo.init;

import nhom3.ShoeStore.demo.model.Role;
import nhom3.ShoeStore.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem vai trò đã tồn tại chưa, nếu chưa thì thêm vào
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName("admin");
            roleRepository.save(adminRole);

            Role superadminRole = new Role();
            superadminRole.setName("superadmin");
            roleRepository.save(superadminRole);

            Role customerRole = new Role();
            customerRole.setName("customer");
            roleRepository.save(customerRole);

            System.out.println("Roles initialized: admin, superadmin, customer");
        }
    }
}
