import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductDetail.css';
import VoucherList from './VoucherDetails';
import Menubar from '../index/menuBar';
import BannerFooter from '../index/BannerFooter';
import Footer from '../index/Footer';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0); // Chỉ số cho màu sắc đã chọn
    const [selectedSize, setSelectedSize] = useState(0); // Chỉ số cho kích thước đã chọn
    const [showMoreDescription, setShowMoreDescription] = useState(false);
    const [colorImage, setColorImage] = useState(''); // Biến trạng thái cho hình ảnh màu

    const token = localStorage.getItem("token");

    useEffect(() => {
        window.scrollTo(0, 0); // Đặt vị trí cuộn về đầu trang
    }, [slug]);


    useEffect(() => {
        fetch(`http://localhost:8088/api/v1/products/${slug}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const productData = data.product;
                setProduct(productData);
                // Thiết lập giá trị mặc định cho selectedColor và colorImage
                setSelectedColor(0); // Lấy chỉ số đầu tiên cho màu sắc
                setColorImage(productData.options.colors[0].image); // Lấy hình ảnh màu sắc đầu tiên
                if (productData.options.sizes.length > 0) {
                    setSelectedSize(0); // Lấy chỉ số đầu tiên cho kích thước
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setProduct(null);
            });
    }, [slug]);


    const addToCart = () => {
        const formData = new FormData();
        formData.append('productId', product.id);
        const selectedSizeObject = product.options.sizes[selectedSize]; // Lấy đối tượng kích thước dựa trên chỉ số
        formData.append('selectedSize', selectedSizeObject.id); // Thêm ID của kích thước
        formData.append('selectedColor', product.options.colors[selectedColor].id); // Thêm ID của màu sắc
        formData.append('quantity', quantity);

        if (!token) {
            // Nếu chưa có token (người dùng chưa đăng nhập)
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];

            // Kiểm tra xem sản phẩm với cùng productId, selectedSize, và selectedColor đã tồn tại trong giỏ hàng chưa
            const existingCartItem = guestCart.find(
                (item) =>
                    item.product.id === product.id &&
                    item.selectedSize.id === selectedSizeObject.id &&
                    item.selectedColor.id === product.options.colors[selectedColor].id
            );

            if (existingCartItem) {
                // Nếu sản phẩm đã tồn tại, chỉ cần tăng số lượng
                existingCartItem.quantity += quantity;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
                guestCart.push({
                    id: Date.now(), // Hoặc tạo ID khác nếu cần
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        slug: product.slug,
                        options: {
                            sizes: [selectedSizeObject],
                            colors: [product.options.colors[selectedColor]],
                        },
                    },
                    selectedSize: selectedSizeObject,
                    selectedColor: product.options.colors[selectedColor],
                    quantity: quantity,
                });
            }

            // Lưu lại giỏ hàng tạm thời vào localStorage
            localStorage.setItem('guestCart', JSON.stringify(guestCart));
            alert('Product added to cart successfully in guest mode!'); // Thông báo thành công
        } else {
            // Nếu có token (người dùng đã đăng nhập)
            fetch('http://localhost:8088/api/v1/cart/add', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) =>
                    response.ok
                        ? response.text()
                        : Promise.reject('Failed to add product to cart')
                )
                .then(() => alert('Product added to cart successfully!'))
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error adding product to cart.');
                });
        }
    };


    const handleIncreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const updateColorImage = (e) => {
        const selectedIndex = e.target.value; // Vị trí của phần tử
        setSelectedColor(selectedIndex); // Cập nhật selectedColor với vị trí
        const selectedColorImage = product.options.colors[selectedIndex]?.image; // Lấy hình ảnh dựa trên chỉ số
        setColorImage(selectedColorImage || 'defaultImageUrl'); // Cập nhật hình ảnh
    };

    const toggleDescription = () => {
        setShowMoreDescription(prev => !prev);
    };

    const handleSizeChange = (e) => {
        const selectedIndex = e.target.value; // Vị trí của phần tử
        setSelectedSize(selectedIndex); // Cập nhật selectedSize với vị trí
        const selectedSizeObject = product.options.sizes[selectedIndex]; // Lấy đối tượng kích thước
        console.log(selectedSizeObject); // In ra thông tin kích thước nếu cần
    };

    if (!product) {
        return <p>Loading product details...</p>;
    }

    return (
        <main>
            <Menubar />
            <div className="container-pr-detail" id="productDetailContainer">
                <div className="container-details-1">
                    <img
                        id="colorImage"
                        src={colorImage} // Sử dụng biến trạng thái cho hình ảnh
                        alt="Product"
                        className="imgpr-detail"
                        onError={(e) => { e.target.src = 'defaultImageUrl'; }} // fallback image
                    />
                    <div>
                        <div className="description-title">Mô tả sản phẩm</div>
                        <div className="description-content" id="descriptionContent">
                            <p className="despr-detail" id="description">{product.description}</p>
                            <div className="section-title">Đế giày</div>
                            {showMoreDescription && (
                                <p className="despr-detail">[Phiên Bản Kỷ Năm 40 Năm] Giày thể thao nam Hunter X DSMH09700 sử dụng bộ đế mới được ra mắt thị trường của Biti’s Hunter X bao gồm những đặc điểm nổi bật như độ bền cao, êm ái, và phong cách năng động.</p>
                            )}
                        </div>
                        <div className="button-container">
                            <button className="button" onClick={toggleDescription}>
                                <i className="fas fa-chevron-down"></i> {showMoreDescription ? 'Ẩn mô tả' : 'Xem thêm'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container-details-2">
                    <h1 className="namepr-detail">{product.name}</h1>
                    <p className="pricepr-detail">{product.price.toLocaleString('vi-VN')} đ</p>
                    <div className="sizes">
                        <h3>Kích thước:</h3>
                        <select id="size-select" name="selectedSize" className="size-dropdown" onChange={handleSizeChange}>
                            {product.options.sizes.map((size, index) => (
                                <option key={size.id} value={index}>{`${size.euSize}, ${size.size}, ${size.ukSize}`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="colors">
                        <h3>Màu sắc:</h3>
                        <select id="color-select" name="selectedColor" className="color-dropdown" onChange={updateColorImage}>
                            {product.options.colors.map((color, index) => (
                                <option key={color.id} value={index}>{color.color}</option> // Sử dụng chỉ số cho giá trị
                            ))}
                        </select>
                    </div>
                    <div className="form">
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <button type="button" className="quantity-btn" onClick={handleDecreaseQuantity}>-</button>
                            <input type="text" id="quantity" name="quantity" value={quantity} className="input-amount" readOnly />
                            <button type="button" className="quantity-btn" onClick={handleIncreaseQuantity}>+</button>
                        </div>
                    </div>
                    <button type="button" className="addbtn-detail" onClick={addToCart}>Đặt mua</button>
                    <div><VoucherList /></div>
                </div>
            </div>
            <BannerFooter />
            <Footer />
        </main>
    );
};

export default ProductDetail;
