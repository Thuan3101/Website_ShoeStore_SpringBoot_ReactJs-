package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.service.UserService;
import nhom3.ShoeStore.demo.controller.SendOtpController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class PasswordResetController {

	@Autowired
	private UserService userService;

	@Autowired
	private SendOtpController sendOtpController;

	// Biến lưu trữ OTP tạm thời
	private Map<String, String> otpStorage = new HashMap<>();

	/**
	 * Gửi OTP qua email khi người dùng yêu cầu lấy lại mật khẩu.
	 * 
	 * @param payload chứa 'identifier' là username hoặc email của người dùng
	 */
	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
		String identifier = payload.get("identifier");

		if (identifier == null || identifier.isEmpty()) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Identifier is missing."));
		}

		// Find user by username or email
		User user = userService.findByUsernameOrEmail(identifier);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("message", "User not found."));
		}

		// Generate OTP and send it to the user's email
		String otp = sendOtpController.sendOtp(user.getEmail());
		otpStorage.put(user.getUsername(), otp);

		// Return a response including the user's email
		Map<String, String> response = new HashMap<>();
		response.put("message", "OTP has been sent to your email.");
		response.put("email", user.getEmail()); // Include the email in the response

		return ResponseEntity.ok(response);
	}

	/**
	 * Xác thực OTP mà người dùng đã nhận được.
	 * 
	 * @param payload chứa 'identifier' (username hoặc email) và 'otp'
	 */
	@PostMapping("/verify-otp-reset")
	public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {    
	    String identifier = payload.get("identifier");
	    String otp = payload.get("otp");

	    if (identifier == null || identifier.isEmpty() || otp == null || otp.isEmpty()) {
	        return ResponseEntity.badRequest()
	                .body(Collections.singletonMap("message", "Identifier and OTP are required."));
	    }

	    User user = userService.findByUsernameOrEmail(identifier);

	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(Collections.singletonMap("message", "User not found."));
	    }

	    String storedOtp = otpStorage.get(user.getUsername());

	    if (storedOtp == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(Collections.singletonMap("message", "No OTP was found for this user. Please request a new OTP."));
	    }

	    if (!storedOtp.equals(otp)) {
	        return ResponseEntity.badRequest()
	                .body(Collections.singletonMap("message", "Invalid OTP. Please check your email and try again."));
	    }

	    return ResponseEntity.ok(Collections.singletonMap("message", "OTP verified. You can now reset your password."));
	}


	/**
	 * Đặt lại mật khẩu mới sau khi OTP đã được xác thực.
	 * 
	 * @param payload chứa 'identifier' (username hoặc email) và 'newPassword'
	 */
	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
		String identifier = payload.get("identifier");
		String newPassword = payload.get("newPassword");

		User user = userService.findByUsernameOrEmail(identifier);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("message", "User not found."));
		}

		// Mã hóa mật khẩu mới trước khi lưu
		user.setPassword(newPassword);
		userService.saveUser(user);

		// Xóa OTP sau khi đặt lại mật khẩu thành công
		otpStorage.remove(user.getUsername());

		return ResponseEntity.ok(Collections.singletonMap("message", "Password has been reset successfully."));
	}
}
