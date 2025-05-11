import React, { useState, useEffect } from 'react';
import Header from '~/components/admin/Header';
import api from '~/config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '~/AuthContext';

interface Admin {
  employCode: string;
  fullname: string;
  username: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  branch: string;
}

interface Branch {
  branchCode: string;
  branchName: string;
}

const Staff = () => {
  const { user, loading: authLoading } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]); // State lưu danh sách chi nhánh
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [searchFullname, setSearchFullname] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      window.location.href = '/admin';
      return;
    }

    fetchAdmins();
    fetchBranches(); // Lấy danh sách chi nhánh
  }, [currentPage, searchUsername, searchFullname, filterRole, user, authLoading]);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/admin/getAll?page=${currentPage}&size=10&sortBy=username`;
      if (searchUsername || searchFullname || filterRole) {
        const params = new URLSearchParams();
        if (searchUsername) params.append('username', searchUsername);
        if (searchFullname) params.append('fullname', searchFullname);
        if (filterRole) params.append('role', filterRole);
        url = `/api/admin/search?${params.toString()}`;
      }
      const response = await api.get(url);
      console.log('API Response:', response.data);

      let adminsData: Admin[] = [];
      if (response.data.content) {
        adminsData = response.data.content.map((admin: any) => ({
          employCode: admin.employCode,
          fullname: admin.fullname,
          username: admin.username,
          gender: admin.gender,
          dob: admin.dob,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          status: admin.status,
          branch: admin.branch || 'Chưa sắp xếp',
        }));
        setTotalPages(response.data.totalPages);
      } else {
        adminsData = response.data.map((admin: any) => ({
          employCode: admin.employCode,
          fullname: admin.fullname,
          username: admin.username,
          gender: admin.gender,
          dob: admin.dob,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          status: admin.status,
          branch: admin.branch || 'Chưa sắp xếp',
        }));
        setTotalPages(1);
      }
      setAdmins(adminsData);
    } catch (error: any) {
      console.error('Error fetching admins:', error.response ? error.response.data : error.message);
      setError('Không thể tải danh sách nhân viên. Vui lòng thử lại.');
      toast.error('Lỗi tải danh sách nhân viên. Kiểm tra console để biết thêm chi tiết.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get('/api/admin/branch');
      console.log('Branches Response:', response.data);
      let branchesData: Branch[] = [];
      if (response.data.content) {
        branchesData = response.data.content.map((branch: any) => ({
          branchCode: branch.branchCode,
          branchName: branch.branchName,
        }));
      } else {
        // Nếu API trả về List
        branchesData = response.data.map((branch: any) => ({
          branchCode: branch.branchCode,
          branchName: branch.branchName,
        }));
      }
      setBranches(branchesData);
    } catch (error: any) {
      console.error('Error fetching branches:', error.response ? error.response.data : error.message);
      toast.error('Không thể tải danh sách chi nhánh. Vui lòng thử lại.');
    }
  };

  const handleUpdateRole = async (username: string, newRole: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn cập nhật vai trò?')) return;
    try {
      const response = await api.patch(`/api/admin/${username}/role`, null, {
        params: { newRole },
      });
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.username === username ? { ...admin, role: response.data.role } : admin
        )
      );
      toast.success('Cập nhật vai trò thành công!');
    } catch (error: any) {
      console.error('Error updating role:', error.response ? error.response.data : error.message);
      toast.error('Không thể cập nhật vai trò. Vui lòng thử lại.');
    }
  };

  const handleUpdateStatus = async (username: string, newStatus: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn cập nhật trạng thái?')) return;
    try {
      const response = await api.patch(`/api/admin/${username}/status`, null, {
        params: { newStatus },
      });
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.username === username ? { ...admin, status: response.data.status } : admin
        )
      );
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error: any) {
      console.error('Error updating status:', error.response ? error.response.data : error.message);
      toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleAssignBranch = async (username: string, branchCode: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn gán chi nhánh này?')) return;
    try {
      const response = await api.patch(`/api/admin/${username}/assign-branch`, null, {
        params: { branchCode },
      });
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.username === username ? { ...admin, branch: response.data.branch || 'Chưa sắp xếp' } : admin
        )
      );
      toast.success('Gán chi nhánh thành công!');
    } catch (error: any) {
      console.error('Error assigning branch:', error.response ? error.response.data : error.message);
      toast.error('Không thể gán chi nhánh. Vui lòng thử lại.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INACTIVE':
        return 'text-gray-500';
      case 'PENDING':
        return 'text-blue-300';
      case 'BLOCKED':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN'; // Thêm kiểm tra vai trò Admin

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Đang xác thực...</p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="mb-4 flex space-x-4">
          <div>
            <label className="mr-2 font-medium">Tìm theo username:</label>
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="border rounded p-2"
              placeholder="Nhập username..."
              disabled={loading}
            />
          </div>
          <div>
            <label className="mr-2 font-medium">Tìm theo tên:</label>
            <input
              type="text"
              value={searchFullname}
              onChange={(e) => setSearchFullname(e.target.value)}
              className="border rounded p-2"
              placeholder="Nhập tên..."
              disabled={loading}
            />
          </div>
          <div>
            <label className="mr-2 font-medium">Lọc theo vai trò:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border rounded p-2"
              disabled={loading}
            >
              <option value="">Tất cả</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="STAFF">Staff</option>
              <option value="DELIVERY_STAFF">Delivery Staff</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Đang tải danh sách nhân viên...</p>
        ) : admins.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 text-left">Mã NV</th>
                <th className="border border-gray-200 p-2 text-left">Họ tên</th>
                <th className="border border-gray-200 p-2 text-left">Username</th>
                <th className="border border-gray-200 p-2 text-left">Giới tính</th>
                <th className="border border-gray-200 p-2 text-left">Ngày sinh</th>
                <th className="border border-gray-200 p-2 text-left">Email</th>
                <th className="border border-gray-200 p-2 text-left">SĐT</th>
                <th className="border border-gray-200 p-2 text-left">Vai trò</th>
                <th className="border border-gray-200 p-2 text-left">Trạng thái</th>
                <th className="border border-gray-200 p-2 text-left">Chi nhánh</th>
                <th className="border border-gray-200 p-2 text-left"></th>
                <th className="border border-gray-200 p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.username} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">{admin.employCode}</td>
                  <td className="border border-gray-200 p-2">{admin.fullname}</td>
                  <td className="border border-gray-200 p-2">{admin.username}</td>
                  <td className="border border-gray-200 p-2">{admin.gender}</td>
                  <td className="border border-gray-200 p-2">{admin.dob}</td>
                  <td className="border border-gray-200 p-2">{admin.email}</td>
                  <td className="border border-gray-200 p-2">{admin.phone}</td>
                  <td className="border border-gray-200 p-2">{admin.role}</td>
                  <td className={`border border-gray-200 p-2 ${getStatusColor(admin.status)}`}>
                    {admin.status}
                  </td>
                  <td className="border border-gray-200 p-2">
                    <select
                      onChange={(e) => handleAssignBranch(admin.username, e.target.value)}
                      value={admin.branch === 'Chưa sắp xếp' ? '' : admin.branch}
                      className="border rounded p-1"
                      disabled={!(isSuperAdmin || isAdmin)} // Chỉ Super Admin hoặc Admin được gán
                    >
                      <option value="">Chưa sắp xếp</option>
                      {branches.map((branch) => (
                        <option key={branch.branchCode} value={branch.branchCode}>
                          {branch.branchName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-200 p-2 space-x-2">
                    <select
                      onChange={(e) => handleUpdateRole(admin.username, e.target.value)}
                      defaultValue={admin.role}
                      className="border rounded p-1"
                      disabled={!isSuperAdmin || admin.role === 'SUPER_ADMIN'}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="STAFF">Staff</option>
                      <option value="DELIVERY_STAFF">Delivery Staff</option>
                    </select>
                  </td>
                  <td className="border border-gray-200 p-2 space-x-2">
                    <select
                      onChange={(e) => handleUpdateStatus(admin.username, e.target.value)}
                      defaultValue={admin.status}
                      className="border rounded p-1"
                      disabled={!isSuperAdmin}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                      <option value="BLOCKED">Blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có nhân viên nào.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0 || loading}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Trước
            </button>
            <span>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1 || loading}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;