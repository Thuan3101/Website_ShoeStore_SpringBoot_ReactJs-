import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Định nghĩa thẻ <MenuItem> để chứa các liên kết
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

const AdminDashboard = () => {
    // Dữ liệu cho biểu đồ doanh thu
    const revenueData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
        datasets: [
            {
                label: 'Doanh thu',
                data: [300, 500, 200, 400, 600],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    // Dữ liệu cho biểu đồ thống kê đặt hàng
    const orderData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                data: [15, 30, 10, 25, 35],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: '#6c757d',
                },
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: '#6c757d',
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', background: '#f4f4f4', height: '100vh' }}>
            {/* Menu bên trái */}
            <div style={{ width: '250px', padding: '20px', background: '#343a40', color: '#fff', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.2)' }}>
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

            {/* Nội dung chính */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Bảng Điều Khiển Quản Trị</h1>

                {/* Gom gọn hai biểu đồ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    {/* Biểu Đồ Doanh Thu */}
                    <div style={{ flex: '1', marginRight: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h2 style={{ color: '#495057' }}>Biểu Đồ Doanh Thu</h2>
                        <Bar data={revenueData} options={options} />
                    </div>

                    {/* Biểu Đồ Thống Kê Đặt Hàng */}
                    <div style={{ flex: '1', marginLeft: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h2 style={{ color: '#495057' }}>Thống Kê Đặt Hàng</h2>
                        <Bar data={orderData} options={options} />
                    </div>
                </div>

                {/* Bảng Quản Lý Đơn Hàng */}
                <div style={{ marginTop: '30px' }}>
                    <h2 style={{ color: '#495057' }}>Bảng Quản Lý Đơn Hàng</h2>
                    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '8px 8px 0 0' }}>ID Đơn Hàng</th>
                                    <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Tên Khách Hàng</th>
                                    <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Trạng Thái</th>
                                    <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '0 8px 0 0' }}>Tổng Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>001</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>Nguyễn Văn A</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>Đang xử lý</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>500,000 VNĐ</td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>002</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>Trần Thị B</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>Đã giao</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>750,000 VNĐ</td>
                                </tr>
                                {/* Thêm các hàng khác nếu cần */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

// Thêm CSS để làm cho dashboard responsive
const styles = `
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    @media (max-width: 768px) {
        /* Chuyển đổi menu thành dạng dọc cho thiết bị di động */
        .menu {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: auto;
        }

        /* Thay đổi kích thước biểu đồ */
        .chart {
            width: 100%;
            height: auto;
        }

        /* Bảng quản lý đơn hàng */
        table {
            font-size: 14px; /* Giảm kích thước font cho bảng */
        }
    }

    @media (max-width: 480px) {
        /* Đối với màn hình nhỏ hơn, giảm padding */
        .menu {
            padding: 10px;
        }

        h2 {
            font-size: 18px;
        }

        /* Nút và các trường trong form có thể cần thay đổi kích thước cho phù hợp */
    }
`;

// Thêm CSS vào DOM
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
