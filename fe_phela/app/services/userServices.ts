import api from '../config/axios';

// Interface cho dữ liệu Customer
interface Customer {
  id: string;
  username: string;
  email: string;
  gender: string;
}

// Interface cho dữ liệu Admin
interface Admin {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  dob: string; // Chuỗi định dạng "dd/MM/yyyy"
}

// Lấy thông tin Customer
export const getCustomerProfile = async (username: string) => {
  try {
    const response = await api.get(`api/customer/${username}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch customer profile');
  }
};

export const updateCustomerProfile = async (username: string, data: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await api.put(`/api/customer/${username}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update customer profile');
  }
};

// Lấy thông tin Admin
export const getAdminProfile = async (username: string) => {
  try {
    const response = await api.get(`api/admin/${username}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch admin profile');
  }
};

// Cập nhật thông tin Admin
export const updateAdminProfile = async (username: string, data: Partial<Admin>) => {
  try {
    const response = await api.put(`api/admin/${username}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update admin profile');
  }
};