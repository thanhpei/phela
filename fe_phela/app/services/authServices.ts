import { route } from '@react-router/dev/routes';
import api from '../config/axios';

// Interface cho dữ liệu đăng nhập
interface LoginCredentials {
    username: string;
    password: string;
  }
  
  // Interface cho dữ liệu đăng ký Customer (dựa trên CustomerCreateDTO)
  interface CustomerRegisterData {
    username: string;
    password: string;
    email: string;
    gender: string;
    latitude?: number; // Có thể không bắt buộc nếu backend cho phép null
    longitude?: number; // Có thể không bắt buộc nếu backend cho phép null
  }
  
  // Interface cho dữ liệu đăng ký Admin (dựa trên AdminCreateDTO)
  interface AdminRegisterData {
    fullname: string;
    username: string;
    password: string;
    dob: string; // Chuỗi định dạng "dd/MM/yyyy" theo DTO
    email: string;
    phone: string;
    gender: string;
  }

// Đăng nhập cho Admin
export const loginAdmin = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('auth/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error('Admin login failed');
  }
};

// Đăng nhập cho Customer
export const loginCustomer = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('auth/customer/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error('Customer login failed');
  }
};
// Đăng ký cho Admin
export const registerAdmin = async (data: AdminRegisterData) => {
    try {
        const response = await api.post('/auth/admin/register', data);
        // localStorage.setItem('token', response.data.token); // Lưu token
        return response.data;
    } catch (error) {
        throw new Error('Admin registration failed');
    }
};

// Đăng ký cho Customer
export const registerCustomer = async (data: CustomerRegisterData) => {
    try {
      const response = await api.post('auth/customer/register', data);
      // localStorage.setItem('token', response.data.token); // Lưu token
      return response.data;
    } catch (error) {
      throw new Error('Customer registration failed');
    }
};


// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};