import React from 'react';
import '../css/Footer.css'; // Optional: for external CSS if you choose

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Info */}
                <div className="footer-section about">
                    <h2>About Us</h2>
                    <p>Your one-stop shop for the latest and greatest in shoes. We offer a wide variety of styles for all occasions. Find your perfect fit with us!</p>
                </div>

                {/* Quick Links */}
                {/* Quick Links */}
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <div className="quick-link"><a href="/about">About Us</a></div>
                    <div className="quick-link"><a href="/products">Shop</a></div>
                    <div className="quick-link"><a href="/contact">Contact</a></div>
                    <div className="quick-link"><a href="/faq">FAQ</a></div>
                    <div className="quick-link"><a href="/return-policy">Return Policy</a></div>
                </div>


                {/* Contact Info */}
                <div className="footer-section contact">
                    <h2>Contact Us</h2>
                    <p><i className="fas fa-map-marker-alt"></i> 123 Shoe Lane, Fashion City</p>
                    <p><i className="fas fa-phone"></i> +123-456-7890</p>
                    <p><i className="fas fa-envelope"></i> support@shoestore.com</p>
                </div>

                {/* Social Media Links */}
                <div className="footer-section social">
                    <h2>Follow Us</h2>
                    <a href="#"><i className="fab fa-facebook" style={{ fontSize: '30px', color: 'rgb(30, 52, 151)' }}></i></a>
                    <a href="#"><i className="fab fa-twitter" style={{ fontSize: '30px', marginLeft: '10px', color: 'rgb(34, 124, 184)' }}></i></a>
                    <a href="#"><i className="fab fa-instagram" style={{ fontSize: '30px', marginLeft: '10px', color: 'rgb(179, 48, 135)' }}></i></a>
                    <a href="#"><i className="fab fa-youtube" style={{ fontSize: '30px', marginLeft: '10px', color: 'rgb(184, 51, 18)' }}></i></a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Shoe Store. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
