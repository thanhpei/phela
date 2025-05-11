import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Tạo một instance của Axios
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Địa chỉ API của bạn
  timeout: 10000, // Thời gian chờ tối đa
  headers: {
    'Content-Type': 'application/json',
  },
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
      window.location.href = '/login';
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