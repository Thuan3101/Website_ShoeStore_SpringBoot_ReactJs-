import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/register.css";
import MenuBar from '../index/menuBar';
import Footer from '../index/Footer';


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState("guest");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Lấy query parameter 'redirect'
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || "/";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/";
        }
    }, []);



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
            setRole(response.data.role);

            // Đồng bộ giỏ hàng khách sau khi đăng nhập thành công
            await syncGuestCartToUserCart(newToken);

                window.location.href = "/";
            
        } catch (error) {
            alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
    };

    return (
        <div>
            <MenuBar />
            <div style={{ height: '100px' }}></div>
            <div className="register-container">
                <h1>Đăng nhập</h1>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleLogin} className="register-form">
                    {/* Registration Fields */}
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-register" disabled={loading}>
                        {loading ? 'Registering...' : 'Login'}
                    </button>
                    <div className="footer_modal_login">
                        <div className="register-link">
                            <p>Chưa có tài khoản?</p>
                            <a href="/register" className="btn-register">Tạo tài khoản</a>
                        </div>
                        <div className="register-link">
                            <p>Quên mật khẩu?</p>
                            <a href="/forgot-password" className="btn-register">Quên mật khẩu</a>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
