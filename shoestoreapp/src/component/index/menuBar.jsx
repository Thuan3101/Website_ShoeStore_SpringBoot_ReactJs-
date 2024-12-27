import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/menuBar.css';

function Menubar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("guest");
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem('token'));

    // State cho tìm kiếm
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0); // Tổng số sản phẩm từ API

    const searchContainerRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setRole(payload.role || "guest");
            setIsLoggedIn(true);
            setToken(token);
        }

        // Đóng kết quả tìm kiếm khi nhấp ra ngoài
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setSearchResults([]); // Đặt lại kết quả khi không có từ khóa
            setTotalProducts(0);
            setShowSearchResults(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8088/api/v1/products/search?q=${query}`);
            const products = response.data.products || [];
            const total = response.data.totalProducts || 0;

            setSearchResults(products.slice(0, 15)); // Hiển thị 5 sản phẩm đầu tiên
            setTotalProducts(total); // Cập nhật tổng số sản phẩm
            setShowSearchResults(true);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        }
    };


    // Chuyển đến trang chi tiết sản phẩm
    const handleProductClick = (slug) => {
        window.location.href = `/product-detail/${slug}`;
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

    // Mở modal đăng nhập
    const handleOpenModal = () => {
        if (role === "guest") {
            setShowModal(true);
        } else {
            window.location.href = "/account";
        }
    };

    // Đóng modal đăng nhập
    const handleCloseModal = () => {
        setShowModal(false);
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

            setIsLoggedIn(true);
            setRole(response.data.role);
            setShowModal(false);

            // Đồng bộ giỏ hàng khách sau khi đăng nhập thành công
            await syncGuestCartToUserCart(newToken);

            window.location.href = "/";
        } catch (error) {
            alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
    };

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8088/api/v1/auth/logout", null, {
                withCredentials: true
            });

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken"); // Xóa refresh token
            localStorage.removeItem("role");
            setToken(null);
            setIsLoggedIn(false);
            setRole("guest");
            window.location.href = "/";
        } catch (error) {
            alert("Đã xảy ra lỗi khi đăng xuất: " + error.message);
        }
    };

    return (
        <header className="container-home">
            <div className="menu-home">
                <div className="logo-container">
                    <a href="/">
                        <img
                            src="https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/360_F_459839852_CcutU8xMpaEawDM7s9xsnYyxEI1rBtSs.jpg?v=1726298160466"
                            alt="Logo"
                            className="logo-home"
                        />
                    </a>
                </div>
                <ul className="ul-home">
                    {/* Thanh tìm kiếm */}
                    <div className="search-container" ref={searchContainerRef}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => setShowSearchResults(true)}
                        />
                        {showSearchResults && (
                            <div className="search-popup">
                                {searchResults.length > 0 ? (
                                    searchResults.map((product) => (
                                        <div key={product.id} className="search-item" onClick={() => handleProductClick(product.slug)}>
                                            <img src={product.images[0]} alt={product.name} className="search-item-img" />
                                            <span>{product.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">Không tìm thấy sản phẩm nào</div>
                                )}
                                {/* {searchResults.length < totalProducts && (
                                    <button className="see-more-btn" onClick={handleSeeMore}>
                                        Xem thêm ({totalProducts - searchResults.length} sản phẩm)
                                    </button>
                                )} */}

                            </div>
                        )}
                    </div>
                    <li className="li-home cart-icon">
                        <a href="/cart">
                            <i className="fas fa-shopping-cart"></i>
                        </a>
                    </li>
                    <li className="li-home login-icon">
                        <a href="/account" onClick={(e) => { e.preventDefault(); handleOpenModal(); }}>
                            <i className="fas fa-user"></i>
                        </a>
                    </li>
                    {(role === "admin" || role === "superadmin") && (
                        <li className="li-home admin-link">
                            <a href="/admin/dashboard">
                                <i className="fas fa-area-chart"></i>
                            </a>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li className="li-home logout-icon">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="fas fa-sign-out-alt"></i>
                            </a>
                        </li>
                    )}
                </ul>
            </div>

            {showModal && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="modal-username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    minLength="3"
                                    maxLength="20"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="modal-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <button type="submit" className="btn-login">Login</button>
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
                </div>
            )}
        </header>
    );
}

export default Menubar;
