// CartItem.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const navigate = useNavigate();
    const formattedPrice = item.product.price.toLocaleString('vi-VN') + ' đ';

    const [quantity, setQuantity] = useState(item.quantity); // Local state for quantity
    const [hasQuantityChanged, setHasQuantityChanged] = useState(false); // Track if quantity changed

    useEffect(() => {
        setHasQuantityChanged(quantity !== item.quantity);
    }, [quantity, item.quantity]);

    const handleNavigateToCollections = (slug) => {
        navigate(`/product-detail/${slug}`);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleUpdateQuantity = () => {
        onUpdateQuantity(item.id, quantity); // Calls the update function with the new quantity
        setHasQuantityChanged(false); // Reset the change state after updating
    };

    return (
        <div className="cart-item">
            <a onClick={() => handleNavigateToCollections(item.product.slug)} >
                <img src={item.selectedColor.image} alt="Product" className="img-item" />
            </a>
            <div className="item-details">
                <a onClick={() => handleNavigateToCollections(item.product.slug)}>
                    <h2>{item.product.name}</h2>
                    <p>Kích thước: {item.selectedSize.euSize}, {item.selectedSize.size}, {item.selectedSize.ukSize}</p>
                    <p>Màu sắc: {item.selectedColor.color}</p>
                </a>
                <div className="price-quantity">
                    <p>{formattedPrice}</p>
                    <div className="quantity-update">
                        <label>Số lượng:</label>
                        <div className="quantity-controls">
                            <button style={{marginRight:10}} onClick={handleDecreaseQuantity} className="quantity-btn">-</button>
                            <span className="quantity-value">{quantity}</span>
                            <button style={{marginLeft:10}} onClick={handleIncreaseQuantity} className="quantity-btn">+</button>
                        </div>
                    </div>
                    <div> {hasQuantityChanged && (
                        <button onClick={handleUpdateQuantity} className="update-quantity-btn">
                            Cập nhật
                        </button>
                    )}
                        <button onClick={() => onRemove(item.id)} className="remove-from-cart-btn">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
