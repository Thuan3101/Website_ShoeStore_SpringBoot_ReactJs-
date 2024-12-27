package nhom3.ShoeStore.demo.model;

import nhom3.ShoeStore.demo.dto.UserDto;

public class VerifyOtpRequest {
	private String otp;
	private UserDto user;

	// Getters và Setters
	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}
}
