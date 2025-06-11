import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import HeadOrder from '~/components/customer/HeadOrder';
import api from '~/config/axios';
import { useAuth } from '~/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '~/assets/css/ProductDetail.css';

interface Product {
    productId: string;
    productName: string;
    description: string;
    originalPrice: number;
    imageUrl: string;
    status: string;
}

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/api/product/get/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
                console.error(err);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const addToCart = async () => {
        if (!user || user.type !== 'customer') {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', {
                onClick: () => navigate('/login')
            });
            return;
        }

        if (!product) return;

        try {
            const customerId = user.customerId;
            const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
            const cartId = cartResponse.data.cartId;

            if (cartId) {
                const cartItemDTO = {
                    productId: product.productId,
                    quantity: 1,
                    amount: product.originalPrice * 1,
                    note: ''
                };
                await api.post(`/api/customer/cart/${cartId}/items`, cartItemDTO);
                window.dispatchEvent(new Event('cartUpdated'));
                toast.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <HeadOrder />
            </div>
            <div className='max-w-4xl mx-auto px-4 py-12 mt-16'>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                        <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="w-full rounded-lg shadow-md"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.productName}</h1>
                        <div className="text-primary font-bold text-xl mb-6">
                            {product.originalPrice.toLocaleString()} VND
                        </div>
                        <div className="flex gap-4">
                            <button className="add-to-cart-btn transition-colors" onClick={addToCart}>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-4xl mx-auto px-4 py-12 mt-5'>
                <h2 className="text-xl font-bold mb-2 uppercase text-center text-neutral-600 underline">Chi tiết sản phẩm</h2>
                <p className="text-gray-600">{product.description}</p>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ProductDetail;