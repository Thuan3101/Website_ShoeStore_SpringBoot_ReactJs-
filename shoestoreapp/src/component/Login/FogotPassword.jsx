import React, { useState } from 'react';
import axios from "axios";
import "../css/register.css";
import MenuBar from '../index/menuBar';
import Footer from '../index/Footer';

const ForgotPassword = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Enter username/email, Step 2: Enter OTP, Step 3: Reset password
    const [username, setUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState(''); // For live password validation

    const validatePassword = (password, username) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/; // At least 6 characters, 1 letter, 1 number

        if (password.length < 6) {
            return "Mật khẩu phải có ít nhất 6 kí tự, một chữ hoa hoặc một chữ thường, một chữ số!";
        }
        if (password.toLowerCase() === username.toLowerCase()) {
            return "Mật khẩu không được trùng với tên tài khoản.";
        }
        if (!passwordRegex.test(password)) {
            return "Mật khẩu phải có ít nhất 6 kí tự, một chữ hoa hoặc một chữ thường, một chữ số!";
        }
        return null; // Valid password
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post("http://localhost:8088/api/v1/auth/forgot-password", { identifier: username });
            const { message, email } = response.data;
            setSuccessMessage(`${message}  ${email}`);
            setStep(2);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post("http://localhost:8088/api/v1/auth/verify-otp-reset", {
                identifier: username,
                otp: otp,
            });
            setSuccessMessage(response.data.message);
            setStep(3);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Mã OTP không hợp lệ. Vui lòng thử lại.");
            setOtp('');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const validationError = validatePassword(newPassword, username);
        if (validationError) {
            setLoading(false);
            setErrorMessage(validationError);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8088/api/v1/auth/reset-password", {
                identifier: username,
                newPassword: newPassword
            });
            setSuccessMessage(response.data.message);
            setStep(1);
            window.location.href = "/login";
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Không thể đặt lại mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        const validationError = validatePassword(password, username);
        setPasswordError(validationError);
    };

    return (
        <div>
            <MenuBar />
            <div style={{ height: '100px' }}></div>
            <div className="register-container">
                <h1>Quên mật khẩu</h1>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {step === 1 && (
                    <form onSubmit={handleForgotPassword} className="register-form">
                        <div>
                            <label>Username hoặc Email:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-register" type="submit" disabled={loading || !username}>
                            {loading ? 'Đang gửi...' : 'Gửi OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="register-form">
                        <div>
                            <label>Nhập mã OTP:</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-register" type="submit" disabled={loading || !otp}>
                            {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="register-form">
                        <div>
                            <label>Nhập mật khẩu mới:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                            {passwordError && <p style={{ color: 'red', fontSize: '12px' }}>{passwordError}</p>}
                        </div>
                        <button className="btn-register" type="submit" disabled={loading || !!passwordError}>
                            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
