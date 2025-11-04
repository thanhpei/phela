import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Get API base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://phela-backend.onrender.com';

// Thêm dòng debug này để kiểm tra
console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All env vars:', import.meta.env);

// Tạo một instance của Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Thời gian chờ tối đa
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies and credentials
});

// Interceptor để gắn token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // Nếu lỗi 401 (Unauthorized), đăng xuất và chuyển hướng về trang đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Determine redirect based on current role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.type === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/customer/login';
      }
    }

    if (error.response?.status === 403) {
      // Handle forbidden access
      console.warn('Access forbidden. User may not have required role.');
      // Could show a toast notification here
    }

    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi (tuỳ chọn)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

export default api;