import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

// Main Product Category Management Component
function ProductCategoryManagement() {
    const [productCategories, setProductCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        loadProductCategories(currentPage);
        loadDropdowns();
    }, [currentPage, token]);

    const loadProductCategories = (page) => {
        axios
            .get(`http://localhost:8088/api/v1/admin/product-categories?page=${page}&size=${pageSize}`)
            .then((response) => {
                setProductCategories(response.data.productCategories);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => console.error('Error loading product categories:', error));
    };

    const loadDropdowns = () => {
        axios.get('http://localhost:8088/api/categories').then((response) => setCategories(response.data));
        axios.get('http://localhost:8088/api/products').then((response) => {
            setProducts(response.data);
            setFilteredProducts(response.data); // Set initial filtered list
        });
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const deleteProductCategory = (productId, categoryId) => {
        if (window.confirm('Are you sure you want to delete this product from the category?')) {
            axios
                .delete(`http://localhost:8088/api/v1/admin/product-categories/${productId}/${categoryId}`)
                .then(() => {
                    loadProductCategories(currentPage);
                    alert('Product removed from category successfully!');
                })
                .catch((error) => {
                    console.error('Error deleting product category:', error);
                    alert('Unable to delete product from category. Please try again.');
                });
        }
    };

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        setFilteredProducts(products.filter(
            (product) => product.name.toLowerCase().includes(lowerQuery) || product.shoe_id.includes(query)
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedCategoryIds.length === 0 || selectedProductIds.length === 0) {
            alert('Please select at least one category and one product.');
            return;
        }

        const data = selectedProductIds.map((productId) =>
            selectedCategoryIds.map((categoryId) => ({
                product: { id: productId },
                category: { id: categoryId },
            }))
        ).flat();

        axios
            .post('http://localhost:8088/api/v1/admin/product-categories/bulk', data)
            .then(() => {
                alert('Products added to categories successfully!');
                loadProductCategories(currentPage);
                setSelectedCategoryIds([]);
                setSelectedProductIds([]);
            })
            .catch((error) => {
                console.error('Error adding products to categories:', error);
                alert('There was an error adding products to categories.');
            });
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
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Quản lý Danh Mục Sản Phẩm</h1>
                <section>
                    <h2>Danh Sách Danh Mục Sản Phẩm</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>#</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Category ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Category Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Shoe ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Product Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productCategories.map((category, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{currentPage * pageSize + index + 1}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.category.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.category.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.product.shoe_id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.product.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        <button onClick={() => deleteProductCategory(category.product.id, category.category.id)} style={{ marginLeft: '10px', color: 'red' }}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                </section>

                <section style={{ marginTop: '20px' }}>
                    <h2>Thêm Sản Phẩm Vào Danh Mục</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                            <label htmlFor="categories">Categories:</label>
                            <select
                                style={{ margin: '10px' }}
                                id="categories"
                                multiple
                                value={selectedCategoryIds}
                                onChange={(e) => setSelectedCategoryIds(Array.from(e.target.selectedOptions, option => option.value))}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                            <label htmlFor="products">Products:</label>
                            <input
                                style={{ margin: '10px', color: 'black',  width: '98%' }}
                                type="text"
                                placeholder="Search Products"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <select
                                style={{ margin: '10px' }}
                                id="products"
                                multiple
                                value={selectedProductIds}
                                onChange={(e) => setSelectedProductIds(Array.from(e.target.selectedOptions, option => option.value))}
                            >
                                {filteredProducts.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={{ margin: '10px', color: 'red' }}>Add Products to Categories</button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default ProductCategoryManagement;
