import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useAuth } from "~/AuthContext";

const LoginAdmin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await login({ username, password }, 'customer');
            setError(''); // Clear error if login succeeds
            navigate('/');
        } catch (err) {
            setError('Quên tài khoản hoặc mật khẩu không đúng.');
            alert('Đăng nhập không thành công!');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-10 bg-white h-screen">
            <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
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
                className="w-64 p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg"
                onClick={handleLogin}
            >
                Login
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            <p className="mt-4">or use your account</p>
            <div className="flex gap-4 mt-2">
                <FaFacebookF className="text-blue-600 cursor-pointer" />
                <FaGoogle className="text-red-600 cursor-pointer" />
            </div>
        </div>
    );
};

export default LoginAdmin;