import React, { useEffect } from "react";
import MenuBar from "../index/menuBar";
import BannerFooter from "../index/BannerFooter";
import Footer from "../index/Footer";
import BannerHeader from "../index/BannerHeader";
import Body from "../index/Body";
import CategorySelect from "../CategorySelect/CategorySelect";

function IndexPage({ message, setMessage }) {
    
    useEffect(() => {
        // Check if the message indicates a 500 error and reload the page
        if (message.includes("500")) {
            window.location.reload();
        }
    }, [message]);

    return (
        <div>
            <MenuBar />
            <BannerHeader />
            <CategorySelect />
            <Body message={message} />
            <BannerFooter />
            <Footer />
        </div>
    );
}

export default IndexPage;
