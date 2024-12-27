package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.repository.UserRepository;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	public User saveUser(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	public User updateUser(Long id, User updatedUser) {
		// Fetch existing user by ID
		User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		// Update the fields you want to allow updates for
		existingUser.setUsername(updatedUser.getUsername());
		existingUser.setEmail(updatedUser.getEmail());
		existingUser.setPhone(updatedUser.getPhone());
		existingUser.setAddress(updatedUser.getAddress());
		existingUser.setRole(updatedUser.getRole());

		// If password is provided, encode it and update
		if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
			existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
		}

		// Save the updated user
		return userRepository.save(existingUser);
	}

	public User findByUsername(String username) {
		return userRepository.findByUsername(username).orElse(null);
	}

	// Tìm người dùng theo username hoặc email
	public User findByUsernameOrEmail(String identifier) {
		Optional<User> user = userRepository.findByUsernameOrEmail(identifier, identifier);
		return user.orElse(null);
	}

	public Page<User> getAllUsers(Pageable pageable) {
		return userRepository.findAll(pageable); // Ensure this returns Page<User>
	}

	public User getUserById(Long id) {
		Optional<User> user = userRepository.findById(id);
		return user.orElse(null);
	}

	public User getUserByUsername(String username) {
		Optional<User> userOptional = userRepository.findByUsername(username);
		return userOptional.orElse(null); // Trả về null nếu không tìm thấy user
	}

	public void deleteUserById(Long id) {
		// Fetch the user by ID
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		// Check if the user has a "superadmin" role
		if ("superadmin".equalsIgnoreCase(user.getRole().getName())) {
			throw new IllegalArgumentException("Cannot delete user with superadmin role");
		}

		// Proceed to delete if the user is not a superadmin
		userRepository.deleteById(id);
	}

	public String generateUserToken(String username) {
		User user = findByUsername(username);
		if (user == null) {
			throw new RuntimeException("User not found");
		}
		return jwtTokenUtil.generateToken(user);
	}

	// Check if username exists
	public boolean existsByUsername(String username) {
		return userRepository.existsByUsername(username);
	}

	// Check if email exists
	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}

}
