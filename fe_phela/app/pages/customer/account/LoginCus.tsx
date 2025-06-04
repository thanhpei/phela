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
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      // Đăng nhập trước
      await login({ username, password }, 'customer');

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      // Lấy vị trí của khách hàng
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              console.log('Getting location:', { latitude, longitude });

              await api.patch(`/api/customer/updateLocation/${username}`, {
                latitude,
                longitude
              });

              toast.success('Vị trí đã được cập nhật thành công!');
              console.log('Location updated successfully:', { latitude, longitude });
            } catch (locationUpdateError) {
              console.error('Failed to update location:', locationUpdateError);
              toast.error('Không thể cập nhật vị trí');
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                toast.error("Người dùng từ chối cấp quyền truy cập vị trí");
                break;
              case error.POSITION_UNAVAILABLE:
                toast.error("Thông tin vị trí không khả dụng");
                break;
              case error.TIMEOUT:
                toast.error("Yêu cầu lấy vị trí đã hết thời gian");
                break;
              default:
                toast.error("Lỗi không xác định khi lấy vị trí");
                break;
            }
          },
          options
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        toast.warning('Trình duyệt không hỗ trợ định vị');
      }

      navigate('/');
      toast.success('Đăng nhập thành công!');
    } catch (err) {
      setError('Tài khoản hoặc mật khẩu không đúng.');
      toast.error('Đăng nhập không thành công!');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-10 bg-white h-screen">
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
        className="w-64 p-2 bg-yellow-50 text-black rounded hover:bg-yellow-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg"
        onClick={handleLogin}
      >
        Login
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LoginCustomer;