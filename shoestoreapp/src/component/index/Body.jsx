import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/index.css'; // Đường dẫn tới file CSS của bạn

const Body = ({ message }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 30;

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0); // Chỉ số cho màu sắc đã chọn
    const [selectedSize, setSelectedSize] = useState(0); // Chỉ số cho kích thước đã chọn
    const token = localStorage.getItem("token");

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleNavigateToCollections = (slug) => {
        navigate(`/product-detail/${slug}`); // Chuyển hướng đến trang collections với slug
    };

    useEffect(() => {
        fetchProducts(0, pageSize); // Fetch initial products
    }, []);

    const fetchProducts = async (page, size) => {
        try {
            const response = await axios.get(`http://localhost:8088/api/v1/products?page=${page}&size=${size}`);
            const { products, totalPages } = response.data;
            if (products && products.length > 0) {
                if (page === 0) {
                    setProducts(products); // Set products for the first page
                } else {
                    setProducts(prev => [...prev, ...products]); // Append products for subsequent pages
                }
                setCurrentPage(page);
                manageLoadMoreButton(totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const manageLoadMoreButton = (totalPages) => {
        const loadMoreButton = document.getElementById("load-more-button");
        loadMoreButton.style.display = (currentPage < totalPages - 1) ? "block" : "none"; // Show or hide button
    };

    const loadMoreProducts = () => {
        fetchProducts(currentPage + 1, pageSize); // Fetch the next page
    };

    const handleAddToCart = (product) => {
        const formData = new FormData();
        formData.append('productId', product.id);
        const selectedSizeObject = product.options.sizes[selectedSize]; // Lấy đối tượng kích thước dựa trên chỉ số
        formData.append('selectedSize', selectedSizeObject.id); // Thêm ID của kích thước
        formData.append('selectedColor', product.options.colors[selectedColor].id); // Thêm ID của màu sắc
        formData.append('quantity', quantity);

        if (!token) {
            // Nếu chưa có token (người dùng chưa đăng nhập)
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];

            // Thêm sản phẩm mới vào giỏ hàng tạm thời
            guestCart.push({
                id: Date.now(), // Hoặc tạo ID khác nếu cần
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    slug: product.slug,
                    options: {
                        sizes: [selectedSizeObject],
                        colors: [product.options.colors[selectedColor]]
                    }
                },
                selectedSize: selectedSizeObject,
                selectedColor: product.options.colors[selectedColor],
                quantity: quantity
            });

            // Lưu lại giỏ hàng tạm thời vào localStorage
            localStorage.setItem('guestCart', JSON.stringify(guestCart));
            alert('Product added to cart successfully in guest mode!'); // Thông báo thành công
            window.location.href = '/cart'; // Chuyển hướng đến trang giỏ hàng
        } else {
            // Nếu có token (người dùng đã đăng nhập)
            fetch('http://localhost:8088/api/v1/cart/add', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => response.ok ? response.text() : Promise.reject('Failed to add product to cart'))
                .then(() => alert('Product added to cart successfully!'))
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error adding product to cart.');
                });
        }
    };

    return (
        <main>
            <div className="container-product">
                <main style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>{message}</p> {/* Hiển thị thông điệp từ props */}
                </main>
                <div className="products-home">
                    <h2>Sản phẩm nổi bật ✨</h2>
                    <div className="product-list">
                        <div className="showProduct" id="product-container">
                            {products.map(product => {
                                const formattedPrice = product.price.toLocaleString('vi-VN') + ' đ';
                                return (
                                    <div
                                        key={`${product.slug}-${product.brand || ''}`} // Dùng slug và brand (hoặc bất kỳ thuộc tính nào khác) để tạo key duy nhất
                                        className="cartProduct"
                                        onClick={() => handleNavigateToCollections(product.slug)} // Gọi hàm khi nhấp vào sản phẩm
                                    >
                                        <img loading="lazy" src={product.images[0]} className="imgProduct" alt="Product Image" />
                                        <div className="title">
                                            <div className="details">
                                                <div className="title-1">
                                                    <h2 className="nameProduct">{product.name}</h2>
                                                    <p>Price: {formattedPrice}</p>
                                                    {/* Nút chọn mua */}
                                                    <button
                                                        style={{ display: 'block', height: '40px', width: '100%' }}
                                                        className="buy-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn chặn sự kiện click vào container
                                                            handleAddToCart(product); // Gọi hàm xử lý khi nhấn nút
                                                        }}
                                                    >
                                                        <i className="fas fa-shopping-cart"></i> Chọn Mua
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
            <div id="load-more-container">
                <button id="load-more-button" style={{ display: 'none' }} onClick={loadMoreProducts}>Xem Thêm</button>
            </div>
        </main>
    );
};

export default Body;
