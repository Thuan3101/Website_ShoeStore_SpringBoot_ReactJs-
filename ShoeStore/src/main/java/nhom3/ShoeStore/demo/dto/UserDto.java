package nhom3.ShoeStore.demo.dto;

public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String address;
    private String roleName; // Lưu tên role thay vì GrantedAuthority

    public UserDto() {}

	public UserDto(Long id, String username, String password, String email, String phone, String address,
			String roleName) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.roleName = roleName;
	}

    
    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
}
