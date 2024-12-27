import React, { useState, useEffect } from 'react';
import '../css/BannerFooter.css';

const BannerFooter = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/banner_NIKE.webp?v=1726290728738",
        "https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/banner_CONVERSE.webp?v=1726290746025",
        "https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/banner_NEW_BALANCE.webp?v=1726293050687"
    ];

    const totalImages = images.length;

    const showImage = (index) => {
        setCurrentIndex(index);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    };

    useEffect(() => {
        const autoSlide = setInterval(nextImage, 4000);
        return () => clearInterval(autoSlide);
    }, []);

    return (
        <div>
            <div className="carousel">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`banner-img-${index}`}
                        className={`baner-img ${index === currentIndex ? 'active' : ''}`}
                    />
                ))}
                <div className="prev" onClick={prevImage}>&#10094;</div>
                <div className="next" onClick={nextImage}>&#10095;</div>
            </div>
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => showImage(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default BannerFooter;
