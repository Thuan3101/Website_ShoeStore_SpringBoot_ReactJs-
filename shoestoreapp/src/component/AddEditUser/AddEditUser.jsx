import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Menu Item Component
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

// Add/Edit User Component
const AddEditUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = new URLSearchParams(location.search).get('id');

    const [formData, setFormData] = useState({
        id: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        password: ''
    });

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8088/api/v1/admin/add-edit-user?id=${userId}`)
                .then(response => {
                    const user = response.data;
                    setFormData({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        role: user.role.name,
                        password: user.password
                    });
                })
                .catch(error => console.error('Error fetching user:', error));
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                ...formData,
                roleName: formData.role
            };

            delete userData.role;

            await axios.post('http://localhost:8088/api/v1/admin/add-edit-user/save', userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            navigate('/admin/user-management');
        } catch (error) {
            alert('An error occurred while saving the user: ' + error.response?.data || error.message);
        }
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', background: '#f4f4f4', height: '100vh' }}>
            {/* Side Menu */}
            <div style={{ width: '250px', padding: '20px', background: '#343a40', color: '#fff', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.2)', overflowY: 'auto' }}>
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
                <div >
                    <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>{formData.id ? 'Chỉnh sửa người dùng' : 'Thêm mới người dùng'}</h1>
                    <form id="userForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column',maxWidth: '600px', margin: '0 auto' }}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />

                        <label htmlFor="address">Address:</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange}></textarea>

                        <label htmlFor="role">Role:</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange}>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                        </select>

                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

                        <button type="submit" style={{ marginTop: '20px', padding: '10px 15px', borderRadius: '5px', backgroundColor: 'green', color: '#fff', border: 'none', cursor: 'pointer' }}>Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEditUser;
