import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Menubar from "../index/menuBar";
import BannerFooter from "../index/BannerFooter";
import Footer from "../index/Footer";

const OrderDetails = () => {
    const { orderId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const orderNumber = location.state?.orderNumber;

    const fetchOrderItems = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(
                `http://localhost:8088/api/v1/order/${orderId}/items`,
                config
            );

            setOrderItems(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch order details. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderItems();
    }, [orderId]);

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <Menubar />
            <div style={{ height: '100px' }}></div>
            <div style={styles.container}>
                <h2>Chi tiết đơn hàng #{orderNumber}</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Description</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Categories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.cell}>{index + 1}</td>
                                <td style={styles.cell}>{item.product.name}</td>
                                <td style={styles.cell}>{item.product.brand}</td>
                                <td style={styles.cell}>{item.product.description}</td>
                                <td style={styles.cell}>
                                    {item.unitPrice.toFixed(2)} {item.product.currency}
                                </td>
                                <td style={styles.cell}>{item.quantity}</td>
                                <td style={styles.cell}>
                                    {item.selectedColor.color}
                                    <img
                                        src={item.selectedColor.image}
                                        alt={item.selectedColor.color}
                                        width="20"
                                        height="20"
                                    />
                                </td>
                                <td style={styles.cell}>{item.selectedSize.size}</td>
                                <td style={styles.cell}>
                                    {item.product.categories.join(", ")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <BannerFooter />
            <Footer />
        </div>
    );
};

// Styles cho OrderDetails
const styles = {
    container: {
        marginTop: "120px",
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        minHeight: "70vh",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
    },
    cell: {
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "center",
    },
};

export default OrderDetails;
