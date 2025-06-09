import React, { useState, useEffect, useMemo } from 'react';
import Header from '~/components/admin/Header';
import api from '~/config/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '~/AuthContext'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

interface Order {
  orderId: string;
  orderCode: string;
  orderDate: string;
  finalAmount: number;
  status: OrderStatus;
  orderItems: any[];
}

const STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

const Order = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = '/admin';
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/order/status/${selectedStatus}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedStatus, user, authLoading]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!user?.username) {
      toast.error('Không thể xác thực người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await api.patch(`/api/order/${orderId}/status`, null, {
        params: { 
          status: newStatus,         
          username: user.username
        }
      });
      toast.success('Cập nhật trạng thái thành công!');
      setOrders(orders.filter(o => o.orderId !== orderId));
    } catch (error: any) {
      toast.error(`Lỗi: ${error.response?.data?.message || 'Không thể cập nhật'}`);
    }
  };

  const getAvailableActions = (currentStatus: OrderStatus): OrderStatus[] => {
    const role = user?.role;
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return ['CONFIRMED', 'DELIVERING', 'DELIVERED', 'CANCELLED'];
    }
    if (role === 'STAFF') {
      return ['CONFIRMED', 'DELIVERING'];
    }
    if (role === 'DELIVERY_STAFF') {
      return ['DELIVERED'];
    }
    return [];
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'PENDING': return 'bg-gray-200 text-gray-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'DELIVERING': return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aIsSingleItem = a.orderItems.length === 1;
      const bIsSingleItem = b.orderItems.length === 1;
      if (aIsSingleItem && !bIsSingleItem) return -1;
      if (!aIsSingleItem && bIsSingleItem) return 1;
      return 0;
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        </div>
        
        {/* Status Filter Tabs */}
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === status 
                  ? 'bg-[#d4a373] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4a373]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#d4a373]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mã đơn</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày đặt</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tổng tiền</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map(order => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.finalAmount.toLocaleString()} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-10">
                          <select
                            defaultValue={order.status}
                            onChange={(e) => handleUpdateStatus(order.orderId, e.target.value as OrderStatus)}
                            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-[#d4a373] focus:ring focus:ring-[#d4a373] focus:ring-opacity-50"
                          >
                            <option value={order.status} disabled>{order.status}</option>
                            {getAvailableActions(order.status).map(action => (
                              <option key={action} value={action}>{action}</option>
                            ))}
                          </select>
                          <Link 
                            to={`/admin/don-hang/${order.orderId}`}
                            className="text-[#d4a373] hover:text-[#b38a5a]"
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Order;