// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import { loginAdmin, loginCustomer, logout } from '~/services/authServices';
import { getAdminProfile, getCustomerProfile } from '~/services/userServices';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  username: string;
  role: string;
  type: 'admin' | 'customer';
  token?: string; // Thêm token nếu cần
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }, type: 'admin' | 'customer') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      // Có thể thêm logic gọi API để xác thực token nếu cần
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập
  const login = async (credentials: { username: string; password: string }, type: 'admin' | 'customer') => {
    try {
      setLoading(true);
      let response;
      if (type === 'admin') {
        response = await loginAdmin(credentials);
      } else {
        response = await loginCustomer(credentials);
      }
      const { token, username, role } = response.data;
      const userData: User = { username, role, type, token };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw new Error(`${type === 'admin' ? 'Admin' : 'Customer'} login failed`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    logout();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};