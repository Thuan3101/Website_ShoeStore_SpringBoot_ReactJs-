import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Body from "./Body";
import MenuBar from "../index/menuBar";
import BannerFooter from "../index/BannerFooter";
import Footer from "../index/Footer";
import BannerHeader from "../index/BannerHeader";
import CategorySelect from "../CategorySelect/CategorySelect";

function Collections() {
    const { slug } = useParams(); // Get slug from URL
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        const fetchIndexMessage = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Bạn chưa đăng nhập.");
                return;
            }

            try {
                const response = await axios.get("http://localhost:8088/index", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Response from server:", response.data);

                const responseMessage = response.data?.message || response.data;
                setMessage(typeof responseMessage === 'string' ? responseMessage : "Đã xảy ra lỗi không xác định.");
            } catch (error) {
                handleApiError(error);
            }
        };

        fetchIndexMessage();
    }, []);

    const handleApiError = (error) => {
        if (error.response) {
            console.error("Error response:", error.response);
            if (error.response.status === 401) {
                setMessage("Không có quyền truy cập. Vui lòng đăng nhập lại.");
            } else {
                setMessage(`Đã xảy ra lỗi. Mã lỗi: ${error.response.status}`);
            }
        } else {
            console.error("Error:", error);
            setMessage("Đã xảy ra lỗi không xác định.");
        }
    };

    return (
        <div>
            <MenuBar />
            <BannerHeader />
            <CategorySelect />
            <Body message={message} slug={slug} /> {/* Pass slug to Body */}
            <BannerFooter />
            <Footer />
        </div>
    );
}

export default Collections;
