import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useAuth } from "~/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
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
            await login({ username, password }, 'admin');
            toast.success('Đăng nhập thành công!');
            setTimeout(() => navigate('/admin/dashboard'), 1500);
        } catch (err: any) {
            // Sử dụng thông báo lỗi cụ thể từ API
            const errorMessage = err.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
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
                <a href="#" className="text-sm text-gray-500">
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

            <div className="flex gap-4 mt-2">
                <FaFacebookF />
                <FaGoogle />
            </div>
        </div>
    );
};

export default Login;