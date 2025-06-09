import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeadOrder from '~/components/customer/HeadOrder';
import api from '~/config/axios';
import { useAuth } from '~/AuthContext';

// --- Định nghĩa các kiểu dữ liệu ---
// CẬP NHẬT: Thêm imageUrl vào interface Product
interface Product {
    productId: string;
    productName: string;
    originalPrice: number;
    imageUrl: string;
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    amount: number;
    note: string;
    product?: Product;
}

interface Address {
    recipientName: string;
    phone: string;
    detailedAddress: string;
    ward: string;
    district: string;
    city: string;
}

interface Order {
    orderId: string;
    orderCode: string;
    totalAmount: number;
    shippingFee: number;
    totalDiscount: number;
    finalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    paymentStatus: 'PENDING' | 'AWAITING_PAYMENT' | 'COMPLETED' | 'FAILED';
    orderDate: string;
    address: Address;
    orderItems: OrderItem[];
}

const OrderDetail = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // CẬP NHẬT: Hoàn thiện thông tin trả về khi có lỗi
    const fetchProductDetails = async (productId: string): Promise<Product> => {
        try {
            const response = await api.get(`/api/product/get/${productId}`);
            return response.data;
        } catch (err) {
            console.error(`Lỗi khi tải sản phẩm ${productId}:`, err);
            return {
                productId,
                productName: 'Sản phẩm không xác định',
                originalPrice: 0,
                imageUrl: '/path/to/default-image.png' // Thêm ảnh mặc định
            };
        }
    };

    // Phần useEffect và logic khác giữ nguyên
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId || !user) {
                setError("Thiếu thông tin để tải đơn hàng.");
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/api/order/${orderId}`);
                let orderData: Order = response.data;

                const itemsWithProducts = await Promise.all(
                    orderData.orderItems.map(async (item) => {
                        const product = await fetchProductDetails(item.productId);
                        return { ...item, product };
                    })
                );
                orderData.orderItems = itemsWithProducts;

                setOrder(orderData);
            } catch (err: any) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err);
                setError(err.response?.data?.message || "Không thể tải được chi tiết đơn hàng.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, user]);

    // Các hàm helper và phần render chính giữ nguyên
    const getStatusText = (status: Order['status']) => {
        const statuses = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            DELIVERING: 'Đang giao hàng',
            DELIVERED: 'Đã giao hàng',
            CANCELLED: 'Đã hủy'
        };
        return statuses[status] || status;
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

        try {
            await api.delete(`/api/order/${orderId}/cancel`);
            alert('Đơn hàng đã được hủy thành công');
            // Refresh the order details
            const response = await api.get(`/api/order/${orderId}`);
            setOrder(response.data);
        } catch (err: any) {
            console.error('Error cancelling order:', err);
            alert(err.response?.data?.message || 'Không thể hủy đơn hàng');
        }
    };

    if (loading) return <div className="text-center py-20">Đang tải chi tiết đơn hàng...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!order) return <div className="text-center py-20">Không tìm thấy thông tin đơn hàng.</div>;

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <HeadOrder />
            </div>
            <div className="container mx-auto mt-20 p-4 max-w-4xl bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Chi tiết đơn hàng #{order.orderCode}</h1>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : (order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800')}`}>
                        {getStatusText(order.status)}
                    </span>
                </div>

                {/* Các khối thông tin chung, địa chỉ, tổng kết giữ nguyên */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông tin chung</h2>
                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <p><strong>Ngày đặt hàng:</strong> {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</p>
                        <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus.replace('_', ' ')}</p>
                    </div>

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.paymentMethod === 'COD' && (
                        <div className="mt-4">
                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Hủy đơn hàng
                            </button>
                        </div>
                    )}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Địa chỉ giao hàng</h2>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Người nhận:</strong> {order.address.recipientName}</p>
                                <p><strong>Điện thoại:</strong> {order.address.phone}</p>
                                <p><strong>Địa chỉ:</strong> {`${order.address.detailedAddress}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tổng kết</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span>Tổng tiền hàng:</span> <span>{order.totalAmount.toLocaleString()} VND</span></div>
                                <div className="flex justify-between"><span>Phí vận chuyển:</span> <span>{order.shippingFee.toLocaleString()} VND</span></div>
                                {order.totalDiscount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá:</span> <span>-{order.totalDiscount.toLocaleString()} VND</span></div>}
                                <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t mt-2"><span>Thành tiền:</span> <span>{order.finalAmount.toLocaleString()} VND</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CẬP NHẬT: Khối hiển thị danh sách sản phẩm */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Danh sách sản phẩm</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            // highlight-start
                            <div key={index} className="flex items-center text-sm border-b pb-4 last:border-b-0">
                                <img
                                    src={item.product?.imageUrl || '/images/default-product.png'}
                                    alt={item.product?.productName}
                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-base">{item.product?.productName || 'Sản phẩm'}</p>
                                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                    {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-base">{item.amount.toLocaleString()} VND</p>
                                </div>
                            </div>
                            // highlight-end
                        ))}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link to="/my-orders" className="text-primary hover:underline">
                        ← Quay lại Lịch sử đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;