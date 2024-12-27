import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Menu Item Component
const MenuItem = ({ children, href }) => {
    return (
        <div style={{ margin: '10px 0' }}>
            <a
                href={href}
                style={{
                    textDecoration: 'none',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s',
                    display: 'block',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                {children}
            </a>
        </div>
    );
};

// Reusable Field component for text input and textareas
const Field = ({ label, value, onChange, type = 'text', isTextarea = false }) => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', color: '#343a40' }}>{label}</label>
        {isTextarea ? (
            <textarea
                value={value}
                onChange={onChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', borderColor: '#ddd' }}
                rows="4"
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', borderColor: '#ddd' }}
            />
        )}
    </div>
);

// Component to handle image input as comma-separated URLs
const ImageField = ({ images, onChange }) => (
    <Field
        label="Images (comma-separated URLs)"
        value={images}
        onChange={(e) => onChange(e.target.value)}
    />
);

// Dynamic list for colors, sizes, and materials with add and remove functions
const DynamicListField = ({ label, items, onChange, onAdd, fields }) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#343a40' }}>{label}</label>
            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                    {fields.map((field, fieldIndex) => (
                        <Field
                            key={fieldIndex}
                            label={field.placeholder}
                            value={item[field.name] || ''}
                            onChange={(e) => onChange(index, field.name, e.target.value)}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => onChange(index, null, null)} // Remove item
                        style={{
                            marginLeft: '10px',
                            padding: '10px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                style={{
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Add {label}
            </button>
        </div>
    );
};

// Edit Product Component
const EditProduct = () => {
    const [product, setProduct] = useState({
        id: '',
        shoe_id: '',
        name: '',
        brand: '',
        description: '',
        price: 0,
        currency: 'VND',
        categories: '',
        quantity: 0,
        images: '',
        colors: [],
        sizes: [],
        materials: [],
        rating: 0,
        reviews: 0,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { slug } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Fetch product details on mount
    useEffect(() => {
        if (slug) {
            fetch(`http://localhost:8088/api/v1/admin/product/${slug}`)
                .then(response => response.json())
                .then(data => {
                    setProduct({
                        ...data,
                        categories: data.categories.join(', '),
                        images: data.images.join(', '),
                        colors: data.options.colors || [],
                        quantity: data.availability?.quantity || 0,
                        sizes: data.options.sizes || [],
                        materials: data.options.materials || [],
                        rating: data.ratings?.average || 0,
                        reviews: data.ratings?.reviews || 0,
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                    alert('Failed to load product details.');
                    setLoading(false);
                });
        }
    }, [slug]);

    // Update fields
    const updateField = (field, value) => {
        setProduct(prev => ({ ...prev, [field]: value }));
    };

    // Update dynamic list fields
    const updateListField = (key, index, subField, value) => {
        const updatedList = [...product[key]];
        if (subField === null) {
            // If subField is null, this means we are removing an item
            updatedList.splice(index, 1);
        } else {
            updatedList[index][subField] = value;
        }
        setProduct(prev => ({ ...prev, [key]: updatedList }));
    };

    // Add new item to the dynamic list
    const addField = (key) => {
        const newItem = key === 'sizes' ? { size: '', euSize: '', ukSize: '' } : key === 'colors' ? { color: '', hex: '', image: '' } : { material: '', careInstructions: '' };
        setProduct(prev => ({ ...prev, [key]: [...prev[key], newItem] }));
    };

    // Save updated product data
    const saveProduct = () => {
        // Form validation
        if (!product.name || product.price <= 0) {
            alert('Please provide a valid product name and price.');
            return;
        }

        setSaving(true);
        const categories = product.categories.split(',').map(c => c.trim());
        const images = product.images.split(',').map(url => url.trim());
        const slug = `${product.name.replace(/\s+/g, '-').toLowerCase()}-${product.id}`;

        // Prepare product data
        const productData = {
            id: product.id,
            shoe_id: product.shoe_id,
            name: product.name,
            brand: product.brand,
            description: product.description,
            price: product.price,
            currency: product.currency,
            categories: categories,
            images: images,
            availability: {
                inStock: product.quantity > 0,
                quantity: product.quantity,
            },
            options: {
                colors: product.colors,
                sizes: product.sizes,
                materials: product.materials,
            },
            ratings: {
                average: product.rating,
                reviews: product.reviews,
            },
            slug: slug,
        };

        fetch(`http://localhost:8088/api/v1/admin/product/update/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
        })
            .then(response => response.json())
            .then(data => {
                setSaving(false);
                if (data.success) {
                    alert('Product updated successfully.');
                    navigate('/admin/product-management'); // Navigate back to product list
                } else {
                    alert('Error updating product: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert('Failed to update product.');
                setSaving(false);
            });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', background: '#f4f4f4', height: '100vh' }}>
            {/* Side Menu */}
            <div style={{ width: '250px', padding: '20px', background: '#343a40', color: '#fff', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.2)', overflowY: 'auto' }}>
                <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>Menu Quản Trị</h2>
                <MenuItem href="/">Home</MenuItem>
                <MenuItem href="/admin/dashboard">Dashboard</MenuItem>
                <MenuItem href="/admin/order-management">Quản lý Đặt Hàng</MenuItem>
                <MenuItem href="/admin/user-management">Quản lý Người dùng</MenuItem>
                <MenuItem href="/admin/add-product">Thêm Sản phẩm</MenuItem>
                <MenuItem href="/admin/add-edit-user">Thêm/Sửa Người dùng</MenuItem>
                <MenuItem href="/admin/product-management">Quản lý Sản phẩm</MenuItem>
                <MenuItem href="/admin/category-management">Quản lý Danh Mục</MenuItem>
                <MenuItem href="/admin/product-category-management">Quản lý Danh Mục Sản Phẩm</MenuItem>
            </div>

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Sửa Sản phẩm</h1>
                <form>
                    <input type="hidden" value={product.id} />

                    <Field label="Shoe ID" value={product.shoe_id} onChange={e => updateField('shoe_id', e.target.value)} />
                    <Field label="Product Name" value={product.name} onChange={e => updateField('name', e.target.value)} />
                    <Field label="Brand" value={product.brand} onChange={e => updateField('brand', e.target.value)} />
                    <Field label="Description" isTextarea value={product.description} onChange={e => updateField('description', e.target.value)} />
                    <Field label="Price" type="number" value={product.price} onChange={e => updateField('price', e.target.value)} />
                    <Field label="Currency" value={product.currency} onChange={e => updateField('currency', e.target.value)} />
                    <Field label="Quantity" type="number" value={product.quantity} onChange={e => updateField('quantity', e.target.value)} />
                    <Field label="Categories" value={product.categories} onChange={e => updateField('categories', e.target.value)} />
                    
                    <ImageField images={product.images} onChange={e => updateField('images', e.target.value)} />

                    <DynamicListField label="Colors" items={product.colors} onChange={(index, subField, value) => updateListField('colors', index, subField, value)} onAdd={() => addField('colors')} fields={[{ name: 'color', placeholder: 'Color' }, { name: 'hex', placeholder: 'Hex' }, { name: 'image', placeholder: 'Image URL' }]} />
                    <DynamicListField label="Sizes" items={product.sizes} onChange={(index, subField, value) => updateListField('sizes', index, subField, value)} onAdd={() => addField('sizes')} fields={[{ name: 'size', placeholder: 'Size' }, { name: 'euSize', placeholder: 'EU Size' }, { name: 'ukSize', placeholder: 'UK Size' }]} />
                    <DynamicListField label="Materials" items={product.materials} onChange={(index, subField, value) => updateListField('materials', index, subField, value)} onAdd={() => addField('materials')} fields={[{ name: 'material', placeholder: 'Material' }, { name: 'careInstructions', placeholder: 'Care Instructions' }]} />

                    <Field label="Average Rating" type="number" step="0.1" value={product.rating} onChange={e => updateField('rating', e.target.value)} />
                    <Field label="Number of Reviews" type="number" value={product.reviews} onChange={e => updateField('reviews', e.target.value)} />
                    
                    <button
                        type="button"
                        onClick={saveProduct}
                        disabled={saving}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px',
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
