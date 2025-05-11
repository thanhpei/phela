import React, { useState, useEffect } from 'react';
import Header from '~/components/admin/Header';
import api from '~/config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '~/AuthContext';

// Định nghĩa interface cho thông tin admin
interface Admin {
  employCode: string;
  fullname: string;
  username: string;
  gender: string;
  dob: string; // Định dạng từ backend: yyyy-MM-dd
  email: string;
  phone: string;
  role: string;
  status: string;
  branch: string;
}

const ProfileAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để lưu thông tin chỉnh sửa
  const [formData, setFormData] = useState({
    fullname: '',
    dob: '',
    email: '',
    phone: '',
    gender: '',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      window.location.href = '/admin';
      return;
    }

    fetchAdmin();
  }, [user, authLoading]);

  const fetchAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/admin/${user?.username}`);
      console.log('Admin Response:', response.data);
      const adminData: Admin = {
        employCode: response.data.employCode,
        fullname: response.data.fullname,
        username: response.data.username,
        gender: response.data.gender,
        dob: response.data.dob, // Định dạng yyyy-MM-dd
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role,
        status: response.data.status,
        branch: response.data.branch || 'Chưa sắp xếp',
      };
      setAdmin(adminData);
      // Khởi tạo formData với dữ liệu từ admin
      setFormData({
        fullname: adminData.fullname,
        dob: adminData.dob,
        email: adminData.email,
        phone: adminData.phone,
        gender: adminData.gender,
      });
    } catch (error: any) {
      console.error('Error fetching admin:', error.response ? error.response.data : error.message);
      setError('Không thể tải thông tin tài khoản. Vui lòng thử lại.');
      toast.error('Lỗi tải thông tin tài khoản. Kiểm tra console để biết thêm chi tiết.');
    } finally {
      setLoading(false);
    }
  };

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
      const updateData = {
        fullname: formData.fullname,
        username: admin?.username, // Username không thay đổi
        password: null, // Không cập nhật mật khẩu
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        branch: admin?.branch === 'Chưa sắp xếp' ? null : admin?.branch, // Giữ nguyên branch
      };

      const response = await api.put(`/api/admin/${admin?.username}`, updateData);
      console.log('Update Response:', response.data);

      // Cập nhật lại admin với dữ liệu mới
      setAdmin((prev) => ({
        ...prev!,
        fullname: response.data.fullname,
        dob: response.data.dob,
        email: response.data.email,
        phone: response.data.phone,
        gender: response.data.gender,
      }));
      toast.success('Cập nhật thông tin tài khoản thành công!');
    } catch (error: any) {
      console.error('Error updating admin:', error.response ? error.response.data : error.message);
      if (error.response?.status === 400) {
        setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      } else if (error.response?.status === 403) {
        setError('Bạn không có quyền cập nhật thông tin này.');
      } else {
        setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
      }
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

  if (!admin) {
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
                <label className="block text-sm font-medium text-gray-700">Mã nhân viên</label>
                <input
                  type="text"
                  value={admin.employCode}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={admin.username}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
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
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
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
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <input
                  type="text"
                  value={admin.role}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <input
                  type="text"
                  value={admin.status}
                  className="mt-1 block w-full border rounded p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chi nhánh</label>
                <input
                  type="text"
                  value={admin.branch}
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
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;