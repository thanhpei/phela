import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useAuth } from "~/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '~/config/axios';

const LoginCustomer = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Vui lòng nhập tài khoản và mật khẩu.");
            return;
        }
        setLoading(true);

        try {
            // Bước 1: Đăng nhập để lấy token
            await login({ username, password }, 'customer');
            toast.success(`Chào mừng ${username}! Đang lấy vị trí của bạn...`);

            // Bước 2: Lấy và cập nhật vị trí
            updateLocation();

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng!';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const updateLocation = () => {
        if (!navigator.geolocation) {
            toast.warn('Trình duyệt không hỗ trợ định vị. Bỏ qua bước cập nhật vị trí.');
            navigate('/');
            setLoading(false);
            return;
        }

        const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 };

        navigator.geolocation.getCurrentPosition(
            // Success callback
            async (position) => {
                try {
                    await api.patch(`/api/customer/updateLocation/${username}`, {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    toast.success('Vị trí đã được cập nhật!');
                } catch (locationUpdateError) {
                    console.error('Failed to update location:', locationUpdateError);
                    toast.error('Không thể cập nhật vị trí. Bỏ qua bước này.');
                } finally {
                    navigate('/'); // Chuyển hướng dù cập nhật vị trí thành công hay không
                    setLoading(false);
                }
            },
            // Error callback
            (error) => {
                console.error('Geolocation error:', error);
                const message =
                    error.code === error.PERMISSION_DENIED ? "Bạn đã từ chối quyền truy cập vị trí." :
                        error.code === error.POSITION_UNAVAILABLE ? "Thông tin vị trí không khả dụng." :
                            "Yêu cầu lấy vị trí đã hết thời gian.";
                toast.warn(`${message} Bỏ qua bước cập nhật vị trí.`);
                navigate('/'); // Vẫn cho phép đăng nhập và chuyển hướng
                setLoading(false);
},
            options
        );
    };

    return (
        <div className="flex flex-col justify-center items-center p-10 bg-white h-screen">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <h2 className="text-3xl font-bold mb-6">Login</h2>
            <input
                type="text"
                placeholder="Username"
                className="p-2 mb-4 w-80 rounded border"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="p-2 mb-4 w-80 rounded border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between w-80 mb-4">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <a href="#" className="text-sm text-gray-500">
                    Forgot password?
                </a>
            </div>
            <button
                className="w-64 p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg disabled:bg-gray-400"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Đang xử lý..." : "Login"}
            </button>
        </div>
    );
};

export default LoginCustomer;