import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/index.css';

const Body = ({ message, slug }) => { // Accept slug as prop
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 30;

    const navigate = useNavigate();

    const handleNavigateToCollections = (productSlug) => {
        navigate(`/product-detail/${productSlug}`);
    };

    useEffect(() => {
        if (slug) {
            fetchProducts(0, pageSize); // Fetch products when slug changes
        }
    }, [slug]);

    const fetchProducts = async (page, size) => {
        try {
            const response = await axios.get(`http://localhost:8088/api/v1/products/collections`, {
                params: { name: slug, page, size }
            });
    
            console.log('API Response:', response.data); // Check the API response here
    
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
        loadMoreButton.style.display = (currentPage < totalPages - 1) ? "block" : "none";
    };

    const loadMoreProducts = () => {
        fetchProducts(currentPage + 1, pageSize);
    };

    return (
        <main>
            <div className="container-product">
                <p>{message}</p> {/* Display message */}
                <div className="products-home">
                    <h2>Sản phẩm nổi bật ✨</h2>
                    <div className="product-list">
                        <div className="showProduct" id="product-container">
                            {products.map(product => {
                                const formattedPrice = product.price.toLocaleString('vi-VN') + ' đ';
                                return (
                                    <div
                                        key={`${product.slug}-${product.brand || ''}`}
                                        className="cartProduct"
                                        onClick={() => handleNavigateToCollections(product.slug)}
                                    >
                                        <img loading="lazy" src={product.images[0]} className="imgProduct" alt="Product Image" />
                                        <div className="title">
                                            <div className="details">
                                                <h2 className="nameProduct">{product.name}</h2>
                                                <p>Price: {formattedPrice}</p>
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
