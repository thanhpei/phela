import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useAuth } from "~/AuthContext"; //
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '~/config/axios';

const LoginAdmin = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); //
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot password states for Admin
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resetStage, setResetStage] = useState<'email' | 'otp' | 'success'>('email');

    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Vui lòng nhập tài khoản và mật khẩu.");
            return;
        }
        
        setLoading(true);
        try {
            await login({ username, password }, 'admin'); //
            toast.success('Đăng nhập thành công!');
            setTimeout(() => navigate('/admin/dashboard'), 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!forgotPasswordEmail) {
            toast.error("Vui lòng nhập email của bạn.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/admin/forgot-password/send-otp', { email: forgotPasswordEmail });
            toast.success("Mã OTP đã được gửi đến email quản trị viên của bạn.");
            setResetStage('otp'); // Move to OTP stage
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Gửi OTP thất bại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword || !confirmNewPassword) {
            toast.error("Vui lòng nhập đủ thông tin.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/admin/forgot-password/reset', {
                email: forgotPasswordEmail,
                otp,
                newPassword
            });
            toast.success("Mật khẩu quản trị viên của bạn đã được đặt lại thành công.");
            setResetStage('success'); // Move to success stage
            setTimeout(() => {
                handleCloseForgotPassword();
            }, 3000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Đặt lại mật khẩu thất bại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setResetStage('email'); // Reset stage for next time
    };

    return (
        <div className="flex flex-col justify-center items-center p-10 bg-white h-screen">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <h2 className="text-3xl font-bold mb-6">Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 mb-4 w-80 rounded border"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 mb-4 w-80 rounded border"
            />

            <div className="flex justify-between w-80 mb-4">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <a href="#" className="text-sm text-gray-500" onClick={() => { setShowForgotPassword(true); setResetStage('email'); }}>
                    Forgot password?
                </a>
            </div>

            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-64 p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg disabled:bg-gray-400"
            >
                {loading ? 'Đang đăng nhập...' : 'Login'}
            </button>

            <p className="mt-4">or use your account</p>

            {/* Forgot Password Section for Admin */}
            {showForgotPassword && (
                <div className="fixed inset-0 flex justify-start items-center bg-gray-600 bg-opacity-50"> {/* Thay đổi justify-center thành justify-start */}
                    <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 h-full flex flex-col justify-center items-center"> {/* Thêm w-1/2 và h-full */}
                        {resetStage === 'email' && (
                            <>
                                <h3 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu (Admin)</h3>
                                <p className="mb-4 text-center">Vui lòng nhập email của bạn để nhận mã OTP.</p>
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="p-2 mb-4 w-full rounded border max-w-sm" 
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                />
                                <button
                                    className="w-full p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 disabled:bg-gray-400 mb-2 max-w-sm"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                >
                                    {loading ? "Đang gửi..." : "Gửi mã OTP"}
                                </button>
                                <button
                                    className="w-full p-2 bg-gray-200 text-black rounded hover:bg-gray-300 max-w-sm"
                                    onClick={handleCloseForgotPassword}
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                            </>
                        )}

                        {resetStage === 'otp' && (
                            <>
                                <h3 className="text-2xl font-bold mb-4 text-center">Xác nhận OTP và Đặt lại mật khẩu (Admin)</h3>
                                <p className="mb-4 text-center">Mã OTP đã được gửi đến email của bạn. Vui lòng nhập mã OTP và mật khẩu mới.</p>
                                <input
                                    type="text"
                                    placeholder="Mã OTP"
                                    className="p-2 mb-4 w-full rounded border max-w-sm"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    className="p-2 mb-4 w-full rounded border max-w-sm"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="p-2 mb-4 w-full rounded border max-w-sm"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                                <button
                                    className="w-full p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 disabled:bg-gray-400 mb-2 max-w-sm"
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                >
                                    {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                                </button>
                                <button
                                    className="w-full p-2 bg-gray-200 text-black rounded hover:bg-gray-300 max-w-sm"
                                    onClick={handleCloseForgotPassword}
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                            </>
                        )}

                        {resetStage === 'success' && (
                            <>
                                <h3 className="text-2xl font-bold mb-4 text-center text-green-600">Thành công!</h3>
                                <p className="mb-4 text-center">Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đóng cửa sổ này.</p>
                                <button
                                    className="w-full p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 max-w-sm"
                                    onClick={handleCloseForgotPassword}
                                >
                                    Đóng
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginAdmin;