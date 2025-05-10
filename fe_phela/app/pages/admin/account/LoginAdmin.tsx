import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useAuth } from "~/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await login({ username, password }, 'admin');
            setError('');
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Quên tài khoản hoặc mật khẩu không đúng!');
            alert('Đăng nhập không thành công!');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-10 bg-white h-screen">
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
                className="w-64 p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg"
            >
                Login
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <p className="mt-4">or use your account</p>

            <div className="flex gap-4 mt-2">
                <FaFacebookF />
                <FaGoogle />
            </div>
        </div>
    );
};

export default Login;
