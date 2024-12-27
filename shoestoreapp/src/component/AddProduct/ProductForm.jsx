// src/ProductForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
    const initialProductState = {
        shoe_id: '',
        name: '',
        brand: '',
        description: '',
        price: '',
        currency: 'VND',
        categories: [],
        options: {
            colors: [{ color: '', hex: '', image: '' }],
            sizes: [{ size: '', euSize: '', ukSize: '' }],
            materials: [{ material: '', careInstructions: '' }],
        },
        availability: { inStock: true, quantity: '' },
        images: [''],
        ratings: { average: 0, reviews: 0 },
    };

    const [product, setProduct] = useState(initialProductState);
    const [file, setFile] = useState(null);

    const resetForm = () => {
        setProduct(initialProductState);
        setFile(null);
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleOptionsChange = (type, index, e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => {
            const newOptions = { ...prevProduct.options };
            newOptions[type][index][name] = value;
            return { ...prevProduct, options: newOptions };
        });
    };

    const addOption = (type) => {
        setProduct((prevProduct) => {
            const newOptions = { ...prevProduct.options };
            if (type === 'colors') {
                newOptions.colors.push({ color: '', hex: '', image: '' });
            } else if (type === 'sizes') {
                newOptions.sizes.push({ size: '', euSize: '', ukSize: '' });
            } else if (type === 'materials') {
                newOptions.materials.push({ material: '', careInstructions: '' });
            }
            return { ...prevProduct, options: newOptions };
        });
    };


    const removeOption = (type, index) => {
        setProduct((prevProduct) => {
            const newOptions = { ...prevProduct.options };
            newOptions[type].splice(index, 1);
            return { ...prevProduct, options: newOptions };
        });
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile && uploadedFile.type === "application/json") {
            setFile(uploadedFile);
        } else {
            alert("Please upload a valid JSON file.");
        }
    };

    const handleFileUpload = async () => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target.result);

                // Gửi toàn bộ mảng sản phẩm một lần
                const response = await axios.post(
                    'http://localhost:8088/api/v1/admin/product/add',
                    JSON.stringify(json),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                alert(response.data);
                resetForm();
                window.location.href = "/admin/product-management";
            } catch (error) {
                console.error('Error processing file:', error);
                alert('Failed to upload products from file');
            }
        };
        reader.readAsText(file);
    };



    const validatePayload = () => {
        const { options } = product;
        return (
            options.colors.every(c => c.color && c.hex && c.image) &&
            options.sizes.every(s => s.size && s.euSize && s.ukSize) &&
            options.materials.every(m => m.material && m.careInstructions)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePayload()) {
            alert('Please ensure all options are properly filled.');
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:8088/api/v1/admin/product/add',
                JSON.stringify({ product }),
                { headers: { 'Content-Type': 'application/json' } }
            );
            alert(response.data);
            resetForm();
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data); 
            } else {
                console.error('There was an error adding the product!', error);
                alert('Failed to add product');
            }
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>Add New Product</h2>
                <div>
                    <label>Shoe ID:</label>
                    <input type="text" name="shoe_id" value={product.shoe_id} onChange={handleChange} required />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Brand:</label>
                    <input type="text" name="brand" value={product.brand} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={product.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={product.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Categories:</label>
                    <input
                        type="text"
                        name="categories"
                        value={product.categories.join(',')}
                        onChange={(e) => setProduct({ ...product, categories: e.target.value.split(',') })}
                        required
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={product.availability.quantity} onChange={(e) => setProduct({ ...product, availability: { ...product.availability, quantity: e.target.value } })} required />
                </div>

                {/* Color Options Section */}
                <div>
                    <h3>Colors</h3>
                    {product.options.colors.map((color, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                name="color"
                                placeholder="Color"
                                value={color.color}
                                onChange={(e) => handleOptionsChange('colors', index, e)}
                                required
                            />
                            <input
                                type="text"
                                name="hex"
                                placeholder="Hex Code"
                                value={color.hex}
                                onChange={(e) => handleOptionsChange('colors', index, e)}
                                required
                            />
                            <input
                                type="text"
                                name="image"
                                placeholder="Image URL"
                                value={color.image}
                                onChange={(e) => handleOptionsChange('colors', index, e)}
                                required
                            />
                            <button type="button" onClick={() => removeOption('colors', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addOption('colors')} style={{ padding: '5px 10px', backgroundColor: '#007bff ', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Color</button>
                </div>

                {/* Sizes Section */}
                <div>
                    <h3>Sizes</h3>
                    {product.options.sizes.map((size, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                name="size"
                                placeholder="Size"
                                value={size.size}
                                onChange={(e) => handleOptionsChange('sizes', index, e)}
                                required
                            />
                            <input
                                type="text"
                                name="euSize"
                                placeholder="EU Size"
                                value={size.euSize}
                                onChange={(e) => handleOptionsChange('sizes', index, e)}
                                required
                            />
                            <input
                                type="text"
                                name="ukSize"
                                placeholder="UK Size"
                                value={size.ukSize}
                                onChange={(e) => handleOptionsChange('sizes', index, e)}
                                required
                            />
                            <button type="button" onClick={() => removeOption('sizes', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addOption('sizes')} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Size</button>
                </div>

                {/* Materials Section */}
                <div>
                    <h3>Materials</h3>
                    {product.options.materials.map((material, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                name="material"
                                placeholder="Material"
                                value={material.material}
                                onChange={(e) => handleOptionsChange('materials', index, e)}
                                required
                            />
                            <input
                                type="text"
                                name="careInstructions"
                                placeholder="Care Instructions"
                                value={material.careInstructions}
                                onChange={(e) => handleOptionsChange('materials', index, e)}
                                required
                            />
                            <button type="button" onClick={() => removeOption('materials', index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addOption('materials')} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Material</button>
                </div>

                {/* Images Section */}
                <div>
                    <h3>Images</h3>
                    {product.images.map((image, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => {
                                    const newImages = [...product.images];
                                    newImages[index] = e.target.value;
                                    setProduct({ ...product, images: newImages });
                                }}
                                placeholder="Image URL"
                                required
                            />
                            <button type="button" onClick={() => {
                                const newImages = [...product.images];
                                newImages.splice(index, 1);
                                setProduct({ ...product, images: newImages });
                            }}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setProduct({ ...product, images: [...product.images, ''] })} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Image</button>
                </div>

                {/* Ratings Section */}
                <div>
                    <label>Average Rating:</label>
                    <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        name="average"
                        value={product.ratings.average}
                        onChange={(e) => setProduct({ ...product, ratings: { ...product.ratings, average: e.target.value } })}
                        required
                    />
                </div>
                <div>
                    <label>Number of Reviews:</label>
                    <input
                        type="number"
                        name="reviews"
                        value={product.ratings.reviews}
                        onChange={(e) => setProduct({ ...product, ratings: { ...product.ratings, reviews: e.target.value } })}
                        required
                    />
                </div>
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Product</button>
                {/* JSON File Upload Section */}
                <div style={{ marginTop: '20px' }}>
                    <h2>Upload Products from JSON File</h2>
                    <input type="file" accept=".json" onChange={handleFileChange} />
                    <button type="button" onClick={handleFileUpload} style={{ padding: '5px 10px', backgroundColor: 'green', color: '#fff', border: 'none', borderRadius: '5px' }}>Upload Products</button>
                </div>
            </form>


        </div>
    );
};

export default ProductForm;
