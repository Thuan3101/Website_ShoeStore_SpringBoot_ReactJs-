import React, { useState, useEffect } from 'react';
import '../css/BannerHeader.css'; // Make sure to move the CSS styles to this file or include them in a styled component

const BannerHeader = () => {
    const images = [
        "https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/e5.image.png?v=1726143618259",
        "https://firebasestorage.googleapis.com/v0/b/red89-f8933.appspot.com/o/BaiTapLon_WWW%2Findex.png?alt=media&token=225e2b90-bb18-48b4-8db0-98c892cc58fc",
        "https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/bitis_web_banner_litedash_dbc2fc041b1a433ab2c168b55e16a401_master.webp?v=1726315794112"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to show image at specific index
    const showImage = (index) => {
        setCurrentIndex(index);
    };

    // Show next image
    const nextImage = () => {
        setCurrentIndex((currentIndex + 1) % images.length);
    };

    // Show previous image
    const prevImage = () => {
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    };

    // Auto-slide images every 4 seconds
    useEffect(() => {
        const interval = setInterval(nextImage, 4000);
        return () => clearInterval(interval); // Clear interval on component unmount
    }, [currentIndex]);

    return (
        <div>
            <div className="carousel1">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt="banner-img"
                        className={index === currentIndex ? "baner-img active1" : "baner-img"}
                        style={{ display: index === currentIndex ? "block" : "none" }}
                    />
                ))}
            </div>
            <div className="carousel-dots1">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`carousel-dot1 ${index === currentIndex ? "active1" : ""}`}
                        onClick={() => showImage(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default BannerHeader;
