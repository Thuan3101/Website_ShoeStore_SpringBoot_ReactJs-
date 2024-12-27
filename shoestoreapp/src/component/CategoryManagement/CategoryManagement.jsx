import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Main Category Management Component
const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const pageSize = 10;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        loadCategories(currentPage); // Load categories when component mounts or page changes
    }, [token, currentPage]);

    const loadCategories = async (page) => {
        try {
            const response = await fetch(`http://localhost:8088/api/v1/admin/categories?page=${page}&size=${pageSize}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setCategories(data.categories);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const editCategory = (id) => {
        const updatedCategories = categories.map(category => {
            if (category.id === id) {
                return { ...category, isEditing: true };
            }
            return category;
        });
        setCategories(updatedCategories);
    };

    const saveCategory = async (id, updatedCategory) => {
        try {
            const response = await fetch(`http://localhost:8088/api/v1/admin/categories/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCategory)
            });
            if (response.ok) {
                alert('Cập nhật danh mục thành công');
                loadCategories(currentPage);
            } else {
                throw new Error('Error updating category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                const response = await fetch(`http://localhost:8088/api/v1/admin/categories/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Xóa danh mục thành công');
                    loadCategories(currentPage);
                } else {
                    alert('Lỗi khi xóa danh mục');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleAddCategory = async (event) => {
        event.preventDefault();
        if (!newCategory.name) {
            alert('Tên danh mục không được để trống');
            return;
        }

        try {
            const response = await fetch('http://localhost:8088/api/v1/admin/categories/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });

            if (response.ok) {
                alert('Danh mục mới đã được thêm thành công');
                loadCategories(currentPage);
                setNewCategory({ name: '', description: '' });
                setModalVisible(false);
            } else {
                throw new Error('Error adding category');
            }
        } catch (error) {
            alert('Error adding category: ' + error.message);
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
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Quản lý Danh Mục</h1>
                <button
                    onClick={() => setModalVisible(true)}
                    style={{ marginBottom: '20px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                    Thêm danh mục mới
                </button>

                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>#</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Category_ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Tên Danh Mục</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Mô Tả</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{(currentPage * pageSize) + (index + 1)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        {category.isEditing ? (
                                            <input type="text" defaultValue={category.name} onBlur={(e) => {
                                                saveCategory(category.id, { name: e.target.value, description: category.description });
                                                editCategory(category.id);
                                            }} />
                                        ) : (
                                            <span>{category.name}</span>
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        {category.isEditing ? (
                                            <input type="text" defaultValue={category.description} onBlur={(e) => {
                                                saveCategory(category.id, { name: category.name, description: e.target.value });
                                                editCategory(category.id);
                                            }} />
                                        ) : (
                                            <span>{category.description || 'Không có mô tả'}</span>
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        {category.isEditing ? (
                                            <button onClick={() => editCategory(category.id)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>Lưu</button>
                                        ) : (
                                            <button onClick={() => editCategory(category.id)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', color: '#fff', border: 'none', borderRadius: '5px' }}>Sửa</button>
                                        )}
                                        <button onClick={() => deleteCategory(category.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage <= 0}
                        style={{ marginRight: '10px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        style={{ marginLeft: '10px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Next
                    </button>
                </div>

                {/* Modal for Adding Category */}
                {modalVisible && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px'
                        }}>
                            <h2>Thêm Danh Mục</h2>
                            <form onSubmit={handleAddCategory}>
                                <div>
                                    <label>Tên Danh Mục:</label>
                                    <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required style={{ width: '100%', padding: '8px', margin: '10px 0' }} />
                                </div>
                                <div>
                                    <label>Mô Tả:</label>
                                    <textarea value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} style={{ width: '100%', padding: '8px', margin: '10px 0' }} />
                                </div>
                                <button type="submit" style={{ marginLeft: '10px', color: 'red' }}>Thêm</button>
                                <button type="button" onClick={() => setModalVisible(false)} style={{ marginLeft: '10px', color: 'red' }}>Hủy</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
