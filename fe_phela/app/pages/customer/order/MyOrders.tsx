import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeadOrder from '~/components/customer/HeadOrder';
import api from '~/config/axios';
import { useAuth } from '~/AuthContext';

// --- Định nghĩa kiểu dữ liệu cho một đơn hàng trong danh sách ---
interface OrderSummary {
    orderId: string;
    orderCode: string;
    orderDate: string;
    finalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'AWAITING_PAYMENT' | 'COMPLETED' | 'FAILED';
    paymentMethod: 'COD' | 'BANK_TRANSFER';
}

// --- Component Lịch sử Đơn hàng ---
const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && user.type === 'customer') {
                try {
                    const response = await api.get(`/api/order/customer/${user.customerId}`);
                    setOrders(response.data);
                } catch (err: any) {
                    console.error("Lỗi khi tải lịch sử đơn hàng:", err);
                    setError(err.response?.data?.message || "Không thể tải được lịch sử đơn hàng.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    // Helper để lấy màu và chữ cho từng trạng thái
    const getStatusStyle = (status: OrderSummary['status']) => {
        switch (status) {
            case 'DELIVERED':
                return { text: 'Đã giao', className: 'bg-green-100 text-green-800' };
            case 'CANCELLED':
                return { text: 'Đã hủy', className: 'bg-red-100 text-red-800' };
            case 'DELIVERING':
                return { text: 'Đang giao', className: 'bg-yellow-100 text-yellow-800' };
            case 'CONFIRMED':
                return { text: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' };
            case 'PENDING':
            default:
                return { text: 'Chờ xác nhận', className: 'bg-gray-100 text-gray-800' };
        }
    };

    const getPaymentStatusStyle = (status: OrderSummary['paymentStatus']) => {
        switch (status) {
            case 'COMPLETED':
                return { text: 'Đã thanh toán', className: 'bg-green-100 text-green-800' };
            case 'AWAITING_PAYMENT':
                return { text: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-800' };
            case 'FAILED':
                return { text: 'Thanh toán thất bại', className: 'bg-red-100 text-red-800' };
            case 'PENDING':
            default:
                return { text: 'Chờ xử lý', className: 'bg-gray-100 text-gray-800' };
        }
    };

    // --- Giao diện Render ---
    if (loading) {
        return <div className="text-center py-20">Đang tải lịch sử đơn hàng...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40">
                <HeadOrder />
            </div>
            <div className="container mx-auto mt-20 p-4 max-w-5xl">
                <h1 className="text-3xl font-bold mb-6">Lịch sử đơn hàng</h1>

                {orders.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn Hàng</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Đặt</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Tiền</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Đơn</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Thanh Toán</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Hành động</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => {
                                    const statusStyle = getStatusStyle(order.status);
                                    const paymentStatusStyle = getPaymentStatusStyle(order.paymentStatus);
                                    return (
                                        <tr key={order.orderId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderCode}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.finalAmount.toLocaleString()} VND</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle.className}`}>
                                                    {statusStyle.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusStyle.className}`}>
                                                    {paymentStatusStyle.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/my-orders/${order.orderId}`} className="text-primary hover:text-primary-dark">
                                                    Xem chi tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                        <Link to="/products" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                            Bắt đầu mua sắm
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;