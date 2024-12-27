import React, { useState } from 'react';
import axios from "axios";
import '../css/register.css';
import MenuBar from '../index/menuBar';
import Footer from '../index/Footer';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });
    const [otp, setOtp] = useState('');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const validateUsername = async () => {
        const { username } = formData;
        const usernameRegex = /^(?=.{3,20}$)[A-Za-z0-9]+$/;
        if (!usernameRegex.test(username)) {
            return "Tên người dùng phải dài từ 3-20 ký tự, không có ký tự đặc biệt hoặc khoảng trắng.";
        }
        return null;
    };

    const validatePassword = () => {
        const { password, username } = formData;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
        if (password.length < 6) {
            return "Mật khẩu phải có ít nhất 6 kí tự, một chữ hoa hoặc một chữ thường, một chữ số !";
        }
        if (password.toLowerCase() === username.toLowerCase()) {
            return "Mật khẩu không được trùng với tên tài khoản.";
        }
        if (!passwordRegex.test(password)) {
            return "Mật khẩu phải có ít nhất 6 kí tự, một chữ hoa hoặc một chữ thường, một chữ số !";
        }
        return null;
    };

    const validateEmail = () => {
        const { email } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? null : "Invalid email format.";
    };

    const validatePhone = () => {
        const { phone } = formData;
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone) ? null : "Số điện thoại phải 10 số.";
    };

    const validateAddress = () => {
        const { address } = formData;
        return address.length <= 255 ? null : "không được quá 255 kí tự.";
    };

    // Đồng bộ giỏ hàng của khách với người dùng đã đăng nhập
    const syncGuestCartToUserCart = async (userToken) => {
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        if (guestCart.length > 0) {
            try {
                await Promise.all(
                    guestCart.map(async (item) => {
                        const validToken = userToken;
                        const formData = new FormData();
                        formData.append('productId', item.product.id);
                        formData.append('selectedSize', item.selectedSize.id);
                        formData.append('selectedColor', item.selectedColor.id);
                        formData.append('quantity', item.quantity);
                        return fetch('http://localhost:8088/api/v1/cart/add', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                Authorization: `Bearer ${validToken}`,
                            },
                        });
                    })
                );
                alert('All guest cart items added to user cart successfully!');
                localStorage.removeItem('guestCart');
            } catch (error) {
                console.error('Error syncing guest cart to user cart:', error);
            }
        }
    };

    // Xử lý đăng nhập
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const { username, password } = formData;
            const response = await axios.post("http://localhost:8088/api/v1/auth/login",
                new URLSearchParams({ username, password }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const newToken = response.data.token;
            const refreshToken = response.data.refreshToken;

            localStorage.setItem("token", newToken);
            localStorage.setItem("refreshToken", refreshToken); // Lưu refresh token
            localStorage.setItem("role", response.data.role);
            setToken(newToken);

            // Đồng bộ giỏ hàng khách sau khi đăng nhập thành công
            await syncGuestCartToUserCart(newToken);

            window.location.href = "/";
        } catch (error) {
            alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const newValidationErrors = {};

        // Run all validation functions
        const usernameError = await validateUsername();
        const passwordError = validatePassword();
        const emailError = validateEmail();
        const phoneError = validatePhone();
        const addressError = validateAddress();

        // Set validation errors if they exist
        if (usernameError) newValidationErrors.username = usernameError;
        if (passwordError) newValidationErrors.password = passwordError;
        if (formData.password !== formData.confirmPassword) {
            newValidationErrors.confirmPassword = "Passwords do not match!";
        }
        if (emailError) newValidationErrors.email = emailError;
        if (phoneError) newValidationErrors.phone = phoneError;
        if (addressError) newValidationErrors.address = addressError;

        // Show validation errors if any
        if (Object.keys(newValidationErrors).length > 0) {
            setValidationErrors(newValidationErrors);
            setLoading(false);
            return;
        }

        // Prepare data to send
        const { confirmPassword, ...dataToSend } = formData;

        try {
            const response = await fetch('http://localhost:8088/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify(dataToSend),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Check for specific backend error messages
                if (errorData.message.includes("Tài khoản này đã tồn tại!")) {
                    setValidationErrors((prev) => ({ ...prev, username: errorData.message }));
                } else if (errorData.message.includes("Email đã được sử dụng. Vùi lòng sử dung email khác!")) {
                    setValidationErrors((prev) => ({ ...prev, email: errorData.message }));
                } else {
                    setErrorMessage(errorData.message); // General error message
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem('otp', data.otp);
            localStorage.setItem('user', JSON.stringify(data.user));
            setShowOtpForm(true);  // Show OTP form after successful registration
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(''); // Xóa lỗi cũ
    
        const storedOtp = localStorage.getItem('otp');
        const user = JSON.parse(localStorage.getItem('user'));
    
    
        try {
            const response = await fetch('http://localhost:8088/api/v1/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ otp, user }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Kiểm tra nếu phản hồi từ server không thành công
            if (!response.ok) {
                const errorData = await response.json();
    
                // Kiểm tra thông báo lỗi từ server, ví dụ "OTP không hợp lệ hoặc đã hết hạn"
                if (errorData.message === "OTP không hợp lệ hoặc đã hết hạn.") {
                    setErrorMessage("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu OTP mới.");
                    alert("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu OTP mới.");
                } else {
                    setErrorMessage(errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
                    alert(errorData.message); // Hiển thị thông báo từ server
                }
    
                setLoading(false);
                return;
            }
    
            const data = await response.json();
            alert(data.message); // Hiển thị thông báo từ server
            handleLogin(e); // Đăng nhập sau khi OTP được xác nhận
    
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <div>
            <MenuBar />
            <div style={{ height: '100px' }}></div>
            <div className="register-container">
                {/* Conditionally render the registration form or OTP form */}
                {showOtpForm ? (
                    <form onSubmit={handleOtpSubmit} className="otp-form" style={{ marginBottom: 150 }}>
                        <h2>Enter OTP</h2>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <div>
                            <label htmlFor="otp">OTP:</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="Enter OTP"
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="submit" className="btn-register" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button type="button" className="btn-register" onClick={() => setShowOtpForm(false)}>
                                Go Back
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="register-form">
                        <h1>Đăng ký</h1>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.username && (
                                <div className="error-message">{validationErrors.username}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.email && (
                                <div className="error-message">{validationErrors.email}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.password && (
                                <div className="error-message">{validationErrors.password}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.confirmPassword && (
                                <div className="error-message">{validationErrors.confirmPassword}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phone">Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.phone && (
                                <div className="error-message">{validationErrors.phone}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.address && (
                                <div className="error-message">{validationErrors.address}</div>
                            )}
                        </div>

                        <button type="submit" className="btn-register" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Register;
