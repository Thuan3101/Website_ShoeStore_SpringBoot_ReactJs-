import React from 'react';
import '../css/VoucherList.css';

const VoucherList = () => {
    return (
        <div>
            <VoucherItem
                title="Voucher 10% OFF"
                expiry="Valid until: 31/12/2022"
                imgSrc="https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/1874933.png?v=1726557076783"
            />
            <VoucherItem
                title="Voucher miễn phí giao hàng"
                expiry="Valid until: 31/12/2022"
                imgSrc="https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/1874933.png?v=1726557076783"
            />
            <VoucherItem
                title="Voucher mua 2 giảm 20%"
                expiry="Valid until: 31/12/2022"
                imgSrc="https://cdn.glitch.global/5fa4c5db-b24c-4bd9-92e6-d01df3df2b91/1874933.png?v=1726557076783"
            />
            <VoucherDetails />
        </div>
    );
};

const VoucherItem = ({ title, expiry, imgSrc }) => (
    <div className="container-voucher">
        <div className="iconvoucher">
            <img src={imgSrc} className="icon-voucher" alt="voucher" />
        </div>
        <div className="textvoucher">
            <h3>{title}</h3>
            <p>{expiry}</p>
        </div>
        <div>
            <button className="btn-voucher">Nhận</button>
        </div>
    </div>
);

const VoucherDetails = () => (
    <div className="details-voucher">
        <p>
            Thời gian áp dụng các mã khuyến mãi 100K1609KM2309KM và 70K1609KM2309KM và 40K1609KM2309KM
            từ 11g15 ngày 16/09/2024 đến 23h59 ngày 23/09/2024 KHÔNG ÁP DỤNG chung với chương trình giảm
            giá và quà tặng.
            <span style={{ color: '#e62e2e' }}> Chỉ áp dụng khi mua online.</span>
        </p>
    </div>
);

export default VoucherList;
