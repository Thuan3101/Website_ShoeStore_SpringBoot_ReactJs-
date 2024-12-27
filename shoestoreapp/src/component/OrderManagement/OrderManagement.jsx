import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ children, href }) => {
    return (
        <div style={{ margin: '10px 0' }}>
            <a
                href={href}
                style={{
                    textDecoration: 'none',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s',
                    display: 'block',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                {children}
            </a>
        </div>
    );
};

const OrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8088/api/v1/order/all');
                // Sắp xếp tăng dần theo `orderDate`
                const sortedOrders = response.data.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
                setOrders(sortedOrders);

                console.log(response.data);
            } catch (err) {
                setError('Error fetching orders: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, navigate]);

    const handleDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://localhost:8088/api/v1/order/${orderId}`);
                setOrders(orders.filter(order => order.orderId !== orderId)); // Update state after deletion
            } catch (err) {
                alert('Error deleting order: ' + err.message);
            }
        }
    };

    // Mở modal hiển thị chi tiết đơn đặt hàng
    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // Chuyển đổi định dạng thời gian
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;


    return (

        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', background: '#f4f4f4', height: '100vh' }}>
            {/* Side Menu */}
            <div style={{ width: '250px', padding: '20px', background: '#343a40', color: '#fff', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.2)' }}>
                <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>Menu Quản Trị</h2>
                <MenuItem href="/">Home</MenuItem>
                <MenuItem href="/admin/dashboard">Dashboard</MenuItem>
                <MenuItem href="/admin/order-management">Quản lý Đặt Hàng</MenuItem>
                <MenuItem href="/admin/user-management">Quản lý Người dùng</MenuItem>
                <MenuItem href="/admin/add-product">Thêm Sản phẩm</MenuItem>
                <MenuItem href="/admin/add-edit-user">Thêm/Sửa Người dùng</MenuItem>
                <MenuItem href="/admin/product-management">Quản lý Sản phẩm</MenuItem>
                <MenuItem href="/admin/category-management">Quản lý Danh Mục</MenuItem>
                <MenuItem href="/admin/product-category-management">Quản lý Danh Mục Sản Phẩm</MenuItem>
            </div>

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Quản lý Đặt Hàng</h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Order ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>User</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Total Price</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Status</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Order_date</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{order.orderId}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{order.user?.username || 'N/A'}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{order.totalPrice.toLocaleString('vi-VN') + ' đ' || '0.00'}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{order.status}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{formatDate(order.orderDate)}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    <button onClick={() => navigate(`/admin/order-details/${order.orderId}`)} style={{ marginLeft: '10px', color: 'red' }}>View</button>
                                    <button onClick={() => handleShowDetails(order)} style={{ marginLeft: '10px', color: 'red' }}>Show Details</button>
                                    <button onClick={() => handleDelete(order.orderId)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal hiển thị chi tiết đơn hàng */}
            {showModal && selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '500px', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        <h2>Order Details</h2>
                        <p><b>First Name:</b> {selectedOrder.firstName}</p>
                        <p><b>Last Name:</b> {selectedOrder.lastName}</p>
                        <p><b>Email:</b> {selectedOrder.email}</p>
                        <p><b>Phone:</b> {selectedOrder.phoneNumber}</p>
                        <p><b>Shipping Address:</b> {selectedOrder.shippingAddress}</p>
                        <p><b>Notes:</b> {selectedOrder.notes}</p>
                        <p><b>Order Date:</b> {formatDate(selectedOrder.orderDate)}</p>
                        <p><b>Status:</b> {selectedOrder.status}</p>
                        <p><b>Total Price:</b>{selectedOrder.totalPrice.toLocaleString('vi-VN') + ' đ'}</p>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
