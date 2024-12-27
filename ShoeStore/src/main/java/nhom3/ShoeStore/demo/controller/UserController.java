package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.dto.OrderDto;
import nhom3.ShoeStore.demo.dto.UserDto;
import nhom3.ShoeStore.demo.model.Order;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;
import nhom3.ShoeStore.demo.service.OrderService;
import nhom3.ShoeStore.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	
    @Autowired
    private OrderService orderService;

	/**
	 * Kiểm tra xác thực JWT Token
	 */
	private boolean isAuthenticated(HttpServletRequest request) {
		String authorization = request.getHeader("Authorization");
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			return false;
		}

		// Lấy token từ header Authorization
		String token = authorization.substring(7);

		try {
			// Lấy username từ token
			String username = jwtTokenUtil.getUsernameFromToken(token);

			// Kiểm tra nếu username từ token là null hoặc không tìm thấy trong cơ sở dữ
			// liệu
			if (username == null) {
				return false;
			}

			User user = userService.findByUsername(username);
			// Xác thực token dựa trên username
			return user != null && jwtTokenUtil.validateToken(token, username);
		} catch (Exception e) {
			// Bắt lỗi nếu có vấn đề trong quá trình xác thực token
			return false;
		}
	}

	/**
	 * Lấy thông tin người dùng theo ID với xác thực JWT
	 * 
	 * @param id      ID của người dùng
	 * @param request HttpServletRequest để kiểm tra JWT Token
	 * @return Thông tin người dùng hoặc thông báo lỗi nếu không tìm thấy hoặc không
	 *         hợp lệ
	 */
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id, HttpServletRequest request) {
		if (!isAuthenticated(request)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.singletonMap("message", "Unauthorized: Invalid or missing token"));
		}

		User user = userService.getUserById(id);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("message", "User not found"));
		}

		UserDto userDto = new UserDto(user.getId(), user.getUsername(), null, // Không trả về mật khẩu
				user.getEmail(), user.getPhone(), user.getAddress(), user.getRole().getName());

		return ResponseEntity.ok(userDto);
	}

	/**
	 * Lấy thông tin người dùng theo username với xác thực JWT
	 * 
	 * @param username Tên người dùng
	 * @param request  HttpServletRequest để kiểm tra JWT Token
	 * @return Thông tin người dùng hoặc thông báo lỗi nếu không tìm thấy hoặc không
	 *         hợp lệ
	 */
	@GetMapping("/username/{username}")
	public ResponseEntity<?> getUserByUsername(@PathVariable String username, HttpServletRequest request) {
		if (!isAuthenticated(request)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.singletonMap("message", "Unauthorized: Invalid or missing token"));
		}

		User user = userService.findByUsername(username);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("message", "User not found"));
		}

		UserDto userDto = new UserDto(user.getId(), user.getUsername(), null, // Không trả về mật khẩu
				user.getEmail(), user.getPhone(), user.getAddress(), user.getRole().getName());

		return ResponseEntity.ok(userDto);
	}

	/**
	 * Lấy thông tin người dùng hiện tại từ JWT Token
	 * 
	 * @param request HttpServletRequest để lấy JWT Token từ header
	 * @return Thông tin người dùng hoặc thông báo lỗi nếu không hợp lệ
	 */
	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
		// Kiểm tra xác thực JWT Token
		if (!isAuthenticated(request)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.singletonMap("message", "Unauthorized: Invalid or missing token"));
		}

		try {
			// Lấy token từ header Authorization
			String authorization = request.getHeader("Authorization");
			String token = authorization.substring(7); // Bỏ tiền tố "Bearer "

			// Lấy username từ token bằng JwtTokenUtil
			String username = jwtTokenUtil.getUsernameFromToken(token);

			// Tìm người dùng theo username
			User user = userService.findByUsername(username);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Collections.singletonMap("message", "User not found"));
			}

			// Chuyển đổi User sang UserDto để trả về
			UserDto userDto = new UserDto(user.getId(), user.getUsername(), null, // Không trả về mật khẩu
					user.getEmail(), user.getPhone(), user.getAddress(), user.getRole().getName());

			return ResponseEntity.ok(userDto);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.singletonMap("message", "Unauthorized: Invalid token"));
		}
	}
	/**
     * Lấy danh sách đơn đặt hàng của người dùng hiện tại từ JWT Token
     *
     * @param request HttpServletRequest để lấy JWT Token từ header
     * @return Danh sách đơn đặt hàng của người dùng
     */
    @GetMapping("/my-orders")
    public ResponseEntity<?> getUserOrders(HttpServletRequest request) {
        // Kiểm tra xác thực JWT Token
        if (!isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Unauthorized: Invalid or missing token"));
        }

        try {
            // Lấy token từ header Authorization
            String authorization = request.getHeader("Authorization");
            String token = authorization.substring(7);

            // Lấy username từ token
            String username = jwtTokenUtil.getUsernameFromToken(token);

            // Lấy thông tin người dùng từ username
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "User not found"));
            }

            // Lấy danh sách đơn hàng của người dùng
            List<Order> orders = orderService.getOrdersByUser(user);

            // Chuyển đổi danh sách Order sang OrderDto để trả về
            List<OrderDto> orderDtos = orders.stream().map(order ->
                    new OrderDto(
                            order.getOrderId(),
                            order.getOrderDate(),
                            order.getTotalPrice(),
                            order.getStatus().toString(),
                            order.getFirstName() + " " + order.getLastName(),
                            order.getShippingAddress(),
                            order.getPhoneNumber(),
                            order.getEmail()
                    )).collect(Collectors.toList());

            return ResponseEntity.ok(orderDtos);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Internal server error"));
        }
    }


}
