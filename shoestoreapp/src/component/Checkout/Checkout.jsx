import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Checkout.css';
import Menubar from "../index/menuBar";
import Footer from "../index/Footer";

function Checkout() {
    const [checkoutCartItems, setCheckoutCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        shippingAddress: "",
        phoneNumber: "",
        paymentMethod: "cod"
    });
    const [formErrors, setFormErrors] = useState({
        email: "",
        phoneNumber: ""
    });

    const token = localStorage.getItem('token');
    if (!token) {
        navigate("/login?redirect=checkout");
    }

    useEffect(() => {
        // Load cart items from localStorage
        const savedItems = JSON.parse(localStorage.getItem('checkoutCartItems')) || [];
        setCheckoutCartItems(savedItems);

        // Calculate total price
        const calculatedTotal = savedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalPrice(calculatedTotal);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePaymentMethodChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            paymentMethod: e.target.value
        }));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(09|08|03|07|05|06|04|01)\d{8}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleOrderConfirmation = () => {
        let valid = true;
        const errors = { email: "", phoneNumber: "" };

        // Validate email
        if (!validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address.";
            valid = false;
        }

        // Validate phone number
        if (!validatePhoneNumber(formData.phoneNumber)) {
            errors.phoneNumber = "Please enter a valid Vietnamese phone number.";
            valid = false;
        }

        // If any validation fails, set errors and return
        if (!valid) {
            setFormErrors(errors);
            return;
        }

        const token = localStorage.getItem('token');
        const orderData = {
            ...formData,
            items: checkoutCartItems.map(item => ({
                itemId: item.id,
                productId: item.product.id,
                selectedSizeId: item.selectedSize.id,
                selectedColorId: item.selectedColor.id,
                quantity: item.quantity,
                unitPrice: item.product.price
            })),
            totalPrice
        };

        fetch('http://localhost:8088/api/v1/order/place', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(orderData)
        })
            .then(response => {
                sendConfirmationEmail();
                window.localStorage.removeItem('checkoutCartItems');
                window.location.href = "/";
                if (!response.ok) throw new Error('Order placement failed');
                return response.json();
            })
            .then(data => {
                console.log('Order placed:', data);
                navigate('/confirmation');
            })
            .catch(error => console.error('Error placing order:', error));
    };

    const openConfirmationModal = () => {
        setShowModal(true);
    };

    const closeConfirmationModal = () => {
        setShowModal(false);
    };

    const sendConfirmationEmail = () => {
        fetch('http://localhost:8088/api/v1/order/send-confirmation-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                items: checkoutCartItems.map(item => ({
                    name: item.product.name,
                    size: item.selectedSize.euSize,
                    color: item.selectedColor.color,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.selectedColor.image
                })),
                totalPrice,
                paymentMethod: formData.paymentMethod
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to send confirmation email: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Confirmation email sent successfully:', data);
                alert("A confirmation email has been sent to your email address.");
            })
            .catch(error => {
                console.error('Error sending confirmation email:', error);
                // alert("There was an error sending the confirmation email. Please try again.");
            });
    };

    return (
        <div>
            <Menubar />
            <div style={{ height: '80px' }}></div>
            <div className="checkout-container">
                <div className="checkout-cart">
                    <h2>Giỏ hàng của bạn</h2>
                    <div className="checkout-cart-items">
                        {checkoutCartItems.length > 0 ? (
                            checkoutCartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.selectedColor.image} alt="Product" className="img-item" />
                                    <div className="item-details">
                                        <h2>{item.product.name}</h2>
                                        <p>Size: {item.selectedSize.euSize}</p>
                                        <p>Màu sắc: {item.selectedColor.color}</p>
                                        <p>Giá: {item.product.price.toLocaleString('vi-VN')} đ</p>
                                        <p>Số lượng: {item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items in the cart.</p>
                        )}
                    </div>
                    <div className="total-price">
                        Tổng giá trị: {totalPrice.toLocaleString('vi-VN')} đ
                    </div>
                </div>

                <div className="checkout-order">
                    <div className="order-form">
                        <h2>Thông tin đặt hàng</h2>
                        <input type="text" name="firstName" placeholder="Họ" required value={formData.firstName} onChange={handleInputChange} />
                        <input type="text" name="lastName" placeholder="Tên" required value={formData.lastName} onChange={handleInputChange} />
                        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} />
                        {formErrors.email && <p className="error-message">{formErrors.email}</p>}
                        <input type="text" name="shippingAddress" placeholder="Địa chỉ giao hàng" required value={formData.shippingAddress} onChange={handleInputChange} />
                        <input type="tel" name="phoneNumber" placeholder="Số điện thoại" required value={formData.phoneNumber} onChange={handleInputChange} />
                        {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}

                        <label htmlFor="paymentMethod">Phương thức thanh toán:</label>
                        <select id="paymentMethod" name="paymentMethod" required value={formData.paymentMethod} onChange={handlePaymentMethodChange}>
                            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                            <option value="bank">Chuyển khoản ngân hàng</option>
                            <option value="credit">Thẻ tín dụng</option>
                        </select>

                        <div className="payment-info">
                            <h3>Thông tin thanh toán</h3>
                            <div className="payment-details">
                                <p>Phương thức thanh toán đã chọn: <span>{formData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : formData.paymentMethod}</span></p>
                                <p>Tổng giá trị thanh toán: {totalPrice.toLocaleString('vi-VN')} đ</p>
                                <p>Lưu ý: Đơn hàng sẽ được xác nhận qua điện thoại trước khi giao.</p>
                            </div>
                        </div>
                        <button className="confirm-order-btn" onClick={openConfirmationModal}>Xác nhận đơn hàng</button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Xác nhận Đơn Hàng</h2>
                        <p>Thông tin đặt hàng</p>
                        <p>Họ: {formData.firstName}</p>
                        <p>Tên: {formData.lastName}</p>
                        <p>Email: {formData.email}</p>
                        <p>Địa chỉ giao hàng: {formData.shippingAddress}</p>
                        <p>Số điện thoại: {formData.phoneNumber}</p>
                        <p>Tổng giá trị: {totalPrice.toLocaleString('vi-VN')} đ</p>
                        <button onClick={handleOrderConfirmation} style={{margin:10, color: 'red'}}>Xác nhận và Đặt hàng</button>
                        <button onClick={closeConfirmationModal}>Quay lại</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Checkout;
