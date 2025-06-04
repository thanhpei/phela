import React, { useState, useEffect, useRef } from 'react';
import HeadOrder from '~/components/customer/HeadOrder';
import { Link } from "react-router-dom";
import api from '~/config/axios';
import '~/assets/css/DeliveryAddress.css'
import { useAuth } from '~/AuthContext';
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
    productId: string;
    productName: string;
    description: string;
    originalPrice: number;
    imageUrl: string;
    status: string;
}

interface Category {
    categoryCode: string;
    categoryName: string;
    products: Product[];
}

const Product = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement }>({});
    const { user } = useAuth();

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const [categoriesResponse] = await Promise.all([
                    api.get('/api/categories/getAll'),
                ]);
                
                const categoriesData = categoriesResponse.data.content;

                const categoriesWithProducts = await Promise.all(
                    categoriesData.map(async (category: { categoryCode: string; categoryName: string }) => {
                        const productsResponse = await api.get(`/api/product/category/${category.categoryCode}`);
                        return {
                            categoryCode: category.categoryCode,
                            categoryName: category.categoryName,
                            products: productsResponse.data
                        };
                    })
                );

                setCategories(categoriesWithProducts);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải danh mục sản phẩm');
                setLoading(false);
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    const scrollToCategory = (categoryCode: string) => {
        const element = categoryRefs.current[categoryCode];
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    const addToCart = async (productId: string) => {
        if (!user || user.type !== 'customer') {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        try {
            const productResponse = await api.get(`/api/product/get/${productId}`);
            const product = productResponse.data;

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-6 bg-red-100 rounded-lg">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded "
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <HeadOrder />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar danh mục */}
                    <aside className="lg:w-1/5 bg-white p-6 rounded-lg shadow-sm sticky top-24 h-fit">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">DANH MỤC</h3>
                        <nav>
                            <ul className="space-y-3">
                                {categories.map((category) => (
                                    <li key={category.categoryCode}>
                                        <button
                                            onClick={() => scrollToCategory(category.categoryCode)}
                                            className="flex items-center justify-between w-full p-2 text-gray-700 hover:text-primary rounded-md hover:bg-blue-50 transition-colors"
                                        >
                                            <span className="font-medium">{category.categoryName}</span>
                                            <FiChevronRight className="text-gray-400" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Danh sách sản phẩm */}
                    <div className="lg:w-4/5">
                        {categories.map((category) => (
                            <div
                                key={category.categoryCode}
                                ref={(el) => {
                                    if (el) categoryRefs.current[category.categoryCode] = el;
                                }}
                                className="mb-12 bg-white p-6 rounded-lg shadow-sm"
                            >
                                <h4 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                    {category.categoryName}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.products.map((product: Product) => (
                                        <div
                                            key={product.productId}
                                            className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <Link to={`/san-pham/${product.productId}`}>
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.productName}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                        }}
                                                    />
                                                </Link>
                                                {product.status === 'HOT' && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        HOT
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <Link
                                                    to={`/san-pham/${product.productId}`}
                                                    className="block font-semibold text-gray-800 hover:text-primary mb-2 transition-colors"
                                                >
                                                    {product.productName}
                                                </Link>
                                                <div className="text-primary font-bold mb-4">
                                                    {product.originalPrice.toLocaleString('vi-VN')}₫
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product.productId)}
                                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 transition-colors"
                                                >
                                                    <FiShoppingCart className="mr-2" />
                                                    Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;