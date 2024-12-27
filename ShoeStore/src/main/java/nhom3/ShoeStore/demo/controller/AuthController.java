package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.dto.UserDto;
import nhom3.ShoeStore.demo.model.Role;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.model.VerifyOtpRequest;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;
import nhom3.ShoeStore.demo.service.RoleService;
import nhom3.ShoeStore.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private SendOtpController sendOtpController;

    // Lưu OTP tạm thời vào Map (có thể thay đổi thành cách lưu trữ khác như cache hoặc database)
    private Map<String, String> otpStorage = new HashMap<>();
    private Map<String, Long> otpExpirationTimes = new HashMap<>();

    private static final long OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes expiration

    /**
     * Đăng kí mới người dùng và gửi OTP xác thực 
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if username already exists
            if (userService.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest().body(new ResponseMessage("Tài khoản này đã tồn tại! "));
            }

            // Check if email already exists
            if (userService.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body(new ResponseMessage("Email đã được sử dụng. Vui lòng sử dụng email khác!"));
            }

            // Fetch 'customer' role
            Role customerRole = roleService.findByName("customer");
            if (customerRole == null) {
                throw new RuntimeException("Role 'customer' not found.");
            }

            // Assign role to user
            user.setRole(customerRole);

            // Generate OTP và lưu vào Map
            String otp = sendOtpController.sendOtp(user.getEmail());

            // Lưu OTP vào map và thiết lập thời gian hết hạn
            otpStorage.put(user.getEmail(), otp);
            otpExpirationTimes.put(user.getEmail(), System.currentTimeMillis() + OTP_EXPIRATION_TIME);

            // Convert User to UserDto
            UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getPassword(), user.getEmail(),
                    user.getPhone(), user.getAddress(), user.getRole().getName());

            // Prepare response data
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("otp", otp);  // Gửi OTP cho người dùng để xác thực
            responseBody.put("user", userDto);
            responseBody.put("message", "OTP đã được gửi vào email của bạn. Vui lòng xác thực.");

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ResponseMessage(e.getMessage()));
        }
    }

    /**
     * Xác thực người dùng với OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String otp = request.getOtp();
        UserDto userDto = request.getUser();

        // Chuyển đổi từ UserDto sang User
        User user = convertUserDtoToUser(userDto);

        // Kiểm tra vai trò của người dùng
        if (user.getRole() == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User role is missing."));
        }

        // Lấy OTP đã lưu trong Map
        String storedOtp = otpStorage.get(user.getEmail());

        // Kiểm tra nếu OTP đã hết hạn
        if (storedOtp == null || isOtpExpired(user.getEmail())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "OTP không hợp lệ hoặc đã hết hạn."));
        }

        // Kiểm tra OTP
        if (!otp.equals(storedOtp)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "OTP không chính xác."));
        }

        // Lưu thông tin người dùng vào cơ sở dữ liệu sau khi OTP hợp lệ
        userService.saveUser(user);

        // Xóa OTP sau khi xác thực thành công
        otpStorage.remove(user.getEmail());
        otpExpirationTimes.remove(user.getEmail());

        return ResponseEntity.ok(Collections.singletonMap("message", "OTP xác thực thành công."));
    }

    /**
     * Kiểm tra xem OTP có hết hạn không
     */
    private boolean isOtpExpired(String email) {
        Long expirationTime = otpExpirationTimes.get(email);
        return expirationTime != null && System.currentTimeMillis() > expirationTime;
    }

    /**
     * Đăng nhập và tạo jwt cho người dùng
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(username, password));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "User not found"));
            }

            String token = jwtTokenUtil.generateToken(user);
            String refreshToken = jwtTokenUtil.generateRefreshToken(user);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", token);
            responseBody.put("refreshToken", refreshToken); // Trả về refresh token
            responseBody.put("role", user.getRole().getName());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }

    /**
     * Đăng xuất
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Clear authentication information
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().body(new ResponseMessage("Logout successful!"));
    }

    /**
     * Làm mới token 
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        String username = jwtTokenUtil.getUsernameFromToken(refreshToken);

        if (username != null && jwtTokenUtil.validateRefreshToken(refreshToken)) {
            User user = userService.getUserByUsername(username);

            if (user != null) {
                // Generate a new access token
                String newAccessToken = jwtTokenUtil.generateToken(user);
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("token", newAccessToken);
                return ResponseEntity.ok(responseBody);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid refresh token"));
    }

    // Helper method to convert UserDto to User
    private User convertUserDtoToUser(UserDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setUsername(userDto.getUsername());
        user.setPhone(userDto.getPhone());
        user.setAddress(userDto.getAddress());

        // Thiết lập role từ tên role trong UserDto
        Role role = roleService.findByName(userDto.getRoleName());
        if (role == null) {
            throw new RuntimeException("Role '" + userDto.getRoleName() + "' not found.");
        }
        user.setRole(role);

        return user;
    }

    // Class ResponseMessage to create response
    public class ResponseMessage {
        private String message;

        public ResponseMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    // Class to represent OTP request payload
    public static class OtpRequest {
        private String otp;

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}
