import React, { useState, useEffect } from 'react';
import Header from '~/components/customer/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '~/AuthContext';

// Định nghĩa interface cho thông tin khách hàng (dựa trên Customer.java và AuthContext.tsx)
interface Customer {
  username: string;
  email: string;
  gender: string;
  pointUse: number;
  orderCancelTimes: number;
}

const ProfileCustomer = () => {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để lưu thông tin chỉnh sửa
  const [formData, setFormData] = useState({
    email: '',
    gender: '',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.type !== 'customer') {
      window.location.href = '/'; // Chuyển hướng nếu không phải khách hàng
      return;
    }

    // Khởi tạo thông tin khách hàng từ user trong AuthContext
    const customerData: Customer = {
      username: user.username,
      email: user.email,
      gender: user.gender,
      pointUse: (user as any).pointUse || 0.0, 
      orderCancelTimes: (user as any).orderCancelTimes || 0, 
    };
    setCustomer(customerData);
    // Đảm bảo formData được khởi tạo với giá trị từ customer
    setFormData({
      email: customerData.email,
      gender: customerData.gender,
    });
  }, [user, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData: Partial<Customer> = {
        email: formData.email,
        gender: formData.gender,
      };

      // Sử dụng updateUserProfile từ AuthContext để cập nhật thông tin
      await updateUserProfile(updateData);

      // Cập nhật customer state với dữ liệu mới
      setCustomer((prev) => ({
        ...prev!,
        email: updateData.email!,
        gender: updateData.gender!,
      }));
      toast.success('Cập nhật thông tin tài khoản thành công!');
    } catch (error: any) {
      console.error('Error updating customer:', error.message);
      setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
      toast.error('Lỗi cập nhật thông tin. Kiểm tra console để biết thêm chi tiết.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <p>Không tìm thấy thông tin tài khoản.</p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={customer.username}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                >
                  <option value="" disabled>Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Điểm sử dụng</label>
                <input
                  type="text"
                  value={customer.pointUse}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số lần hủy đơn</label>
                <input
                  type="text"
                  value={customer.orderCancelTimes}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
              </button>
            </div>
          </form>

          {/* Placeholder cho quản lý địa chỉ */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Quản lý địa chỉ giao hàng</h2>
            <p className="text-gray-600">Chức năng này sẽ được triển khai sau để thêm nhiều địa chỉ giao hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomer;