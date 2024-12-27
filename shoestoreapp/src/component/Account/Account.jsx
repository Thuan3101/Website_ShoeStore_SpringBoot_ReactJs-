import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import Menubar from "../index/menuBar";
import BannerFooter from "../index/BannerFooter";
import Footer from "../index/Footer";


const Account = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState("accountInfo");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("guest");
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Hàm lấy thông tin người dùng hiện tại
    const fetchCurrentUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(
                `http://localhost:8088/api/v1/users/me`,
                config
            );

            setUser(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch user data. Please try again.");
            setLoading(false);
        }
    };

    // Hàm lấy danh sách đơn hàng
    const fetchUserOrders = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No token found. Please log in.");
            setOrderLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(
                `http://localhost:8088/api/v1/users/my-orders`,
                config
            );

            setOrders(response.data);
            setOrderLoading(false);
        } catch (err) {
            setError("Failed to fetch orders. Please try again.");
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchUserOrders();
    }, []);

    // Hàm xử lý chọn tab
    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
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

    // Component Thông tin tài khoản
    const AccountInfo = () => (
        <div>
            <h2>Thông tin tài khoản</h2>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Address:</strong> {user?.address}</p>
        </div>
    );

    // Component Quản lý đơn hàng
    const OrderManagement = () => {
        if (orderLoading) return <div>Loading orders...</div>;
        if (orders.length === 0) return <div><h2>Quản lý đơn hàng</h2>Không có đơn hàng nào.</div>;

        return (
            <div>
                <h2>Quản lý đơn hàng</h2>
                <div style={styles.orderList}>
                    {orders.map((order, index) => (
                        <div key={order.orderId} style={styles.orderItem}>
                            <h3>Đơn hàng số {index + 1}</h3>
                            <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString('vi-VN') + ' đ'} VND</p>
                            <p><strong>Trạng thái:</strong> {order.status}</p>
                            <p><strong>Tên khách hàng:</strong> {order.customerName}</p>
                            <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
                            <p><strong>Số điện thoại:</strong> {order.phoneNumber}</p>
                            <p><strong>Email:</strong> {order.email}</p>
                            <button
                                style={{margin:10, color: 'red'}}
                                onClick={() => navigate(`/order-details/${order.orderId}`, { state: { orderNumber: index + 1 } })}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Component Danh sách địa chỉ
    const AddressList = () => (
        <div>
            <h2>Danh sách địa chỉ</h2>
            <p>Địa chỉ của người dùng sẽ được hiển thị ở đây.</p>
        </div>
    );

    // Hàm render nội dung theo tab
    const renderContent = () => {
        switch (selectedTab) {
            case "accountInfo":
                return <AccountInfo />;
            case "orderManagement":
                return <OrderManagement />;
            case "addressList":
                return <AddressList />;
            default:
                return <AccountInfo />;
        }
    };

    if (loading) return <div>Loading user data...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <Menubar />
            <div style={styles.pageContainer}>
                <div style={styles.container}>
                    <div style={styles.sidebar}>
                        <div
                            style={selectedTab === "accountInfo" ? styles.activeMenuItem : styles.menuItem}
                            onClick={() => handleTabClick("accountInfo")}
                        >
                            Thông tin tài khoản
                        </div>
                        <div
                            style={selectedTab === "orderManagement" ? styles.activeMenuItem : styles.menuItem}
                            onClick={() => handleTabClick("orderManagement")}
                        >
                            Quản lý đơn hàng
                        </div>
                        <div
                            style={selectedTab === "addressList" ? styles.activeMenuItem : styles.menuItem}
                            onClick={() => handleTabClick("addressList")}
                        >
                            Danh sách địa chỉ
                        </div>
                        {/* <div
                            style={{ ...styles.menuItem, color: "red" }}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </div> */}
                    </div>
                    <div style={styles.content}>
                        {renderContent()}
                    </div>
                </div>
            </div>
            <BannerFooter />
            <Footer />
        </div>
    );
};

// Styles cho toàn bộ trang
const styles = {
    pageContainer: {
        marginTop: "80px",
        display: "flex",
        justifyContent: "center", // Căn giữa theo chiều ngang
        width: "100vw", // Sử dụng toàn bộ chiều rộng viewport
        backgroundColor: "#f0f2f5",
        padding: "20px 0", // Tạo khoảng cách trên và dưới
        minHeight: "70vh",
    },
    container: {
        display: "flex",
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        overflow: "hidden", // Để tránh nội dung tràn ra ngoài
    },
    sidebar: {
        minWidth: "250px",
        maxWidth: "300px",
        padding: "10px",
        backgroundColor: "#f2f3f4",
    },
    menuItem: {
        padding: "15px",
        marginBottom: "10px",
        cursor: "pointer",
        textAlign: "center",
        transition: "0.3s",
    },
    activeMenuItem: {
        padding: "15px",
        marginBottom: "10px",
        cursor: "pointer",
        textAlign: "center",
        fontWeight: "bold",
        color: "#1e90ff",
        backgroundColor: "#e0f0ff",
        borderRadius: "5px",
    },
    content: {
        flex: 1,
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "0 10px 10px 0",
        display: "flex",
        justifyContent: "flex-start", // Căn giữa theo chiều ngang
        alignItems: "flex-start", // Căn giữa theo chiều dọc
    },
    orderList: {
        width: "1200px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    orderItem: {
        width: "100%",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
};


export default Account;
