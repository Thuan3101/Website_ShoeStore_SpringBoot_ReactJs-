package nhom3.ShoeStore.demo.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import nhom3.ShoeStore.demo.model.Role;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;
import nhom3.ShoeStore.demo.service.RoleService;
import nhom3.ShoeStore.demo.service.UserService;

@Controller
public class PageController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserService userService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	
	@Autowired
	private RoleService roleService;
	
	@GetMapping("/")
	public String showIndexPage() {
		return "index";
	}

	@GetMapping("/index")
	public ResponseEntity<Map<String, String>> showIndex(@RequestHeader(value = "Authorization", required = false) String authorization) {
	    if (authorization != null && authorization.startsWith("Bearer ")) {
	        String token = authorization.substring(7);
	        String username = jwtTokenUtil.getUsernameFromToken(token);

	        if (username != null) {
	            // Trả về đối tượng JSON với thông điệp
	            Map<String, String> response = new HashMap<>();
	            response.put("message", "Welcome, " + username);
	            return ResponseEntity.ok(response);
	        }
	    }
	    // Trả về thông báo không có quyền truy cập
	    Map<String, String> errorResponse = new HashMap<>();
	    errorResponse.put("message", "Unauthorized");
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
	}



	@GetMapping("/register")
	public String showRegistrationForm(Model model) {
		model.addAttribute("user", new User());
		return "register";
	}


	@GetMapping("/login")
	public String showLoginForm() {
		return "login";
	}


}
