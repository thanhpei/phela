import React, { useState, useEffect } from 'react';
import Header from '~/components/admin/Header';
import { useParams } from 'react-router-dom';
import api from '~/config/axios';


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


interface CustomerInfo {
    username: string;
    email: string;
    gender: string;
}


const OrderDetailReport = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<CustomerInfo | null>(null);
    const [loading, setLoading] = useState(true);

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
                imageUrl: '/images/default-product.png' 
            };
        }
    };

    useEffect(() => {
        if (!orderId) return;
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // SỬA LỖI: Lấy ra `.data` từ mỗi response
                const [orderRes, customerRes] = await Promise.all([
                    api.get(`/api/order/${orderId}`),
                    api.get(`/api/order/${orderId}/customer`)
                ]);

                let orderData: Order = orderRes.data;
                
                // SỬA LỖI: Gắn thông tin sản phẩm vào một biến mới
                const itemsWithProducts = await Promise.all(
                    orderData.orderItems.map(async (item) => {
                        const product = await fetchProductDetails(item.productId);
                        return { ...item, product };
                    })
                );
                
                // Cập nhật lại orderData với danh sách sản phẩm đầy đủ
                orderData.orderItems = itemsWithProducts;

                setOrder(orderData);
                setCustomer(customerRes.data);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [orderId]);

    const getPaymentMethodText = (method: string) => {
        return method === 'COD' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán (VNPAY)';
    };
    
    const getStatusText = (status: string) => {
        const statuses = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            DELIVERING: 'Đang giao hàng',
            DELIVERED: 'Đã giao hàng',
            CANCELLED: 'Đã hủy'
        };
        return statuses[status as keyof typeof statuses] || status;
    };


    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="p-6 text-center text-red-500">
                Không tìm thấy đơn hàng.
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Chi tiết đơn hàng #{order.orderCode}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {getStatusText(order.status)}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột chính: Danh sách sản phẩm và tổng tiền */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Danh sách sản phẩm
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-start border-b pb-4 last:border-b-0">
                                        <img 
                                            src={item.product?.imageUrl || '/images/default-product.png'} 
                                            alt={item.product?.productName}
                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.product?.productName}</h3>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{item.amount.toLocaleString()} VND</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Tổng kết đơn hàng */}
                            <div className="mt-6 pt-4 border-t space-y-2">
                                <div className="flex justify-between"><span className="text-gray-600">Tổng tiền hàng:</span><span className="font-medium">{order.totalAmount.toLocaleString()} VND</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển:</span><span className="font-medium">{order.shippingFee.toLocaleString()} VND</span></div>
                                {order.totalDiscount > 0 && (<div className="flex justify-between text-green-600"><span>Giảm giá:</span><span>-{order.totalDiscount.toLocaleString()} VND</span></div>)}
                                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t"><span className="text-gray-800">Thành tiền:</span><span className="text-primary">{order.finalAmount.toLocaleString()} VND</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Cột phụ: Thông tin khách hàng và giao hàng */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Thông tin khách hàng
                            </h2>
                            {customer ? (
                                <div className="space-y-2 text-sm">
                                    <p><strong className="font-medium text-gray-600">Tên:</strong> {customer.username}</p>
                                    <p><strong className="font-medium text-gray-600">Email:</strong> {customer.email}</p>
                                    <p><strong className="font-medium text-gray-600">Giới tính:</strong> {customer.gender}</p>
                                </div>
                            ) : <p className="text-sm text-gray-500">Không có thông tin khách hàng.</p>}
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Thông tin giao hàng
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p><strong className="font-medium text-gray-600">Người nhận:</strong> {order.address.recipientName}</p>
                                <p><strong className="font-medium text-gray-600">SĐT Giao hàng:</strong> {order.address.phone}</p>
                                <p><strong className="font-medium text-gray-600">Địa chỉ:</strong> {`${order.address.detailedAddress}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}</p>
                            </div>
                        </div>
                         <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Thông tin thanh toán
                            </h2>
                             <div className="space-y-2 text-sm">
                                <p><strong className="font-medium text-gray-600">Phương thức:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
                                 <p><strong className="font-medium text-gray-600">Trạng thái:</strong> {order.paymentStatus.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailReport;