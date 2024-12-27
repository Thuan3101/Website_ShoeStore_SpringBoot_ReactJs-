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

// Main Product Management Component
const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentSortField, setCurrentSortField] = useState('name');
    const [currentSortOrder, setCurrentSortOrder] = useState('asc');
    const pageSize = 10;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        fetchProducts(currentPage); // Load products initially
    }, [token, currentPage]);

    const fetchProducts = async (page) => {
        try {
            const response = await fetch(`http://localhost:8088/api/v1/admin/products?page=${page}&size=${pageSize}`);
            const data = await response.json();
            if (!data.products) throw new Error("Products data is missing");
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const sortTable = (field) => {
        const newOrder = currentSortField === field && currentSortOrder === 'asc' ? 'desc' : 'asc';
        setCurrentSortField(field);
        setCurrentSortOrder(newOrder);

        const sortedProducts = [...products].sort((a, b) => {
            return newOrder === 'asc'
                ? a[field] > b[field] ? 1 : -1
                : a[field] < b[field] ? 1 : -1;
        });
        setProducts(sortedProducts);
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`http://localhost:8088/api/v1/admin/product/delete/${id}`, { method: 'DELETE' });
                fetchProducts(currentPage); // Refresh current page after deletion
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleNavigateToCollections = (slug) => {
        navigate(`/product-detail/${slug}`); // Chuyển hướng đến trang collections với slug
    };

    const limitWords = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
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
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Quản lý Sản phẩm</h1>
                <button
                    onClick={() => navigate('/admin/add-product')}
                    style={{ marginBottom: '20px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                    Thêm Sản phẩm Mới
                </button>

                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>#</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}><a href="#" onClick={() => sortTable('shoe_id')}>Shoe_ID</a></th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: 'black' }}>Image</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}><a href="#" onClick={() => sortTable('name')} >Name</a></th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}><a href="#" onClick={() => sortTable('brand')} >Brand</a></th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: 'black' }}>Description</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}><a href="#" onClick={() => sortTable('price')} >Price</a></th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}><a href="#" onClick={() => sortTable('quantity')} >Quantity</a></th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: 'black' }}>Category</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}><a href="#" onClick={() => sortTable('createdAt')} >Created At</a></th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: 'black' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{currentPage * pageSize + index + 1}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.shoe_id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        <img src={product.images[0]} alt="Product" style={{ maxWidth: '100px' }} />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{limitWords(product.name, 5)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.brand}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        {limitWords(product.description, 5)}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.price}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.availability.quantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.categories.join(', ')}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.createdAt}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        <button onClick={() => navigate(`/admin/edit-product/${product.id}`)} style={{ marginLeft: '10px', color: 'red' }}>Sửa</button>
                                        <button onClick={() => handleNavigateToCollections(product.slug)} style={{ marginLeft: '10px', color: 'red' }}>Xem chi tiết</button>
                                        <button onClick={() => deleteProduct(product.id)} style={{ marginLeft: '10px', color: 'red' , marginTop:10}}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            </div>
        </div>

    );
};

export default ProductManagement;
