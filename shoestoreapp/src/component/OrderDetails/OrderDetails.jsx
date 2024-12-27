import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [newQuantity, setNewQuantity] = useState(0);

    const fetchOrderItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8088/api/v1/order/${orderId}/items`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setOrderItems(response.data); // Set orderItems directly
                console.log(response.data);

            } else {
                throw new Error('Error fetching order items');
            }
        } catch (err) {
            // Check if the error response is a 404
            if (err.response && err.response.status === 404) {
                window.location.href = "http://localhost:3000/admin/order-management"; // Redirect on 404
            } else {
                setError(err.message); // Set the error message for other errors
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        fetchOrderItems();
    }, [orderId, token, navigate]);

    const handleDelete = async (orderItemId) => {
        try {
            const response = await axios.delete(`http://localhost:8088/api/v1/order/item/${orderItemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Check for a 204 status code for successful deletion
            if (response.status === 204) {
                // Remove the deleted item from the state
                await fetchOrderItems(); // Fetch updated order items
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (err) {
            // Handle error
            if (err.response) {
                // Check if the error response is a 410 Gone
                if (err.response.status === 410) {
                    // Redirect to the order management page if the last item was deleted
                    window.location.href = "http://localhost:3000/admin/order-management";
                } else {
                    setError(err.response.data.message || 'An error occurred'); // Set a more descriptive error
                }
            } else {
                setError(err.message); // Handle network or other errors
            }
        }
    };

    const openEditModal = (itemId, currentQuantity) => {
        setEditingItemId(itemId);
        setNewQuantity(currentQuantity);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setNewQuantity(0);
    };

    const handleUpdateQuantity = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8088/api/v1/order/item/${editingItemId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                closeEditModal();
                await fetchOrderItems();
            } else {
                throw new Error('Error updating item quantity');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        fetchOrderItems();
    }, [orderId, token, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Chi Tiết Đặt Hàng</h1>
                {orderItems.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Mã sản phẩm</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Tên sản phẩm</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Thương hiệu</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Mô tả</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Giá</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Số lượng</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Màu Đã Chọn</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Kích Thước Đã Chọn</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Danh Mục</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item.orderItemId}>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.product.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.product.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.product.brand}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.product.description}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.unitPrice.toFixed(2)} {item.product.currency}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.quantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        {item.selectedColor.color}
                                        <img src={item.selectedColor.image} alt={item.selectedColor.color} width="20" height="20" />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.selectedSize.size}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        {item.product.categories.join(', ')}
                                    </td>
                                    <td style={{ padding: '10px' , display:'flex'}}>
                                        <button
                                            onClick={() => handleDelete(item.orderItemId)}
                                            style={{ marginLeft: '10px', color: 'red' }}
                                        >
                                            Xóa
                                        </button>
                                        <button onClick={() => openEditModal(item.orderItemId, item.quantity)} style={{ marginLeft: '10px', color: 'red' }}>Sửa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No items found for this order.</p>
                )}
            </div>
            {/* Popup Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '300px' }}>
                        <h3>Cập nhật số lượng</h3>
                        <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        />
                        <button onClick={handleUpdateQuantity} style={{ marginRight: '10px' }}>Cập nhật</button>
                        <button onClick={closeEditModal}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
