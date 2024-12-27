// OtpModal.js
import React, { useState } from 'react';

const OtpModal = ({ visible, onClose, email, username, password, phone, address }) => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:8088/api/v1/auth/verifyOtp', {
                method: 'POST',
                body: JSON.stringify({ email, otp, username, password, phone, address }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (data.success) {
                alert('User registered successfully!');
                onClose();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Enter OTP</h2>
                {message && <div className="alert alert-danger">{message}</div>}
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Confirm OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpModal;