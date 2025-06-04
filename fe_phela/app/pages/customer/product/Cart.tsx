import React, { useState, useEffect } from 'react';
import HeadOrder from '~/components/customer/HeadOrder';
import api from '~/config/axios';
import { useAuth } from '~/AuthContext';
import { Link } from 'react-router-dom';
import '~/assets/css/Cart.css';

interface Product {
  productId: string;
  productName: string;
  imageUrl: string;
  originalPrice: number;
}

interface CartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  amount: number;
  note: string;
  product?: Product;
}

interface Address {
  addressId: string;
  city: string;
  district: string;
  ward: string;
  recipientName: string;
  phone: string;
  detailedAddress: string;
  isDefault: boolean;
}

interface Branch {
  branchCode: string;
  branchName: string;
  city: string;
  district: string;
  address: string;
}

interface Promotion {
  promotionId: string;
  promotionCode: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  discountAmount?: number;
  minimumOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  status: string;
}

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [appliedPromotions, setAppliedPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProductDetails = async (productId: string): Promise<Product> => {
    try {
      const response = await api.get(`/api/product/get/${productId}`);
      return {
        productId: response.data.productId,
        productName: response.data.productName,
        imageUrl: response.data.imageUrl,
        originalPrice: response.data.originalPrice
      };
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      return {
        productId,
        productName: 'Sản phẩm không xác định',
        imageUrl: '/images/default-product.png',
        originalPrice: 0
      };
    }
  };

  const fetchAllProducts = async (items: CartItem[]): Promise<CartItem[]> => {
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await fetchProductDetails(item.productId);
        return {
          ...item,
          product,
          amount: item.amount || (product.originalPrice * item.quantity)
        };
      })
    );
    return itemsWithProducts;
  };

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (user && user.type === 'customer') {
        try {
          const customerId = user.customerId;

          const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
          const cartData = cartResponse.data;

          if (!cartData.cartId) {
            await api.post(`/api/customer/cart/create/${customerId}`);
            return fetchCartDetails();
          }

          const cartId = cartData.cartId;

          const [itemsResponse, branchResponse, promoResponse, addressResponse] = await Promise.all([
            api.get(`/api/customer/cart/${cartId}/items`),
            api.get('/api/branch'),
            api.get('/api/promotion/active'),
            api.get(`/api/address/customer/${customerId}`)
          ]);

          const itemsWithProducts = await fetchAllProducts(itemsResponse.data);

          setCartItems(itemsWithProducts);
          setTotalAmount(cartData.totalAmount || 0);
          setShippingFee(cartData.shippingFee || 0);
          setFinalAmount(cartData.finalAmount || 0);
          setAppliedPromotions(cartData.promotionCarts || []);

          setBranches(branchResponse.data);
          setSelectedBranch(cartData.branch?.branchCode || branchResponse.data[0]?.branchCode || '');

          setAddresses(addressResponse.data);
          setSelectedAddress(
            addressResponse.data.find((addr: Address) => addr.isDefault) ||
            addressResponse.data[0] ||
            null
          );

          setPromotions(promoResponse.data);

          setLoading(false);
        } catch (err) {
          console.error('Error fetching cart details:', err);
          setError('Không thể tải thông tin giỏ hàng. Vui lòng thử lại sau.');
          setLoading(false);
        }
      }
    };

    fetchCartDetails();
  }, [user]);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
      if (!itemToUpdate) throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      const productId = itemToUpdate.productId;

      const productItem = await fetchProductDetails(productId);

      const updateResponse = await api.post(`/api/customer/cart/${cartId}/items`, {
        productId: productId,
        quantity: newQuantity,
        amount: productItem.originalPrice * newQuantity,
        note: ''
      });

      if (updateResponse.status === 200) {
        const updatedCartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
        const updatedItemsResponse = await api.get(`/api/customer/cart/${cartId}/items`);
        const updatedItemsWithProducts = await fetchAllProducts(updatedItemsResponse.data);

        setCartItems(updatedItemsWithProducts);
        setTotalAmount(updatedCartResponse.data.totalAmount);
        setShippingFee(updatedCartResponse.data.shippingFee);
        setFinalAmount(updatedCartResponse.data.finalAmount);
        setAppliedPromotions(updatedCartResponse.data.promotionCarts || []);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        throw new Error(`Cập nhật thất bại: ${updateResponse.data?.message || 'Lỗi không xác định'}`);
      }
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      alert(`Có lỗi khi cập nhật số lượng sản phẩm: ${err.message || err}`);
    }
  };

  const updateBranch = async (branchCode: string) => {
    if (!branchCode) {
      alert('Vui lòng chọn một cơ sở cửa hàng');
      return;
    }
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const updateResponse = await api.patch(`/api/customer/cart/${cartId}/update-branch?branchCode=${branchCode}`);

      if (updateResponse.status === 200) {
        const updatedCartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
        setShippingFee(updatedCartResponse.data.shippingFee);
        setFinalAmount(updatedCartResponse.data.finalAmount);
        setAppliedPromotions(updatedCartResponse.data.promotionCarts || []);
        setSelectedBranch(branchCode);
      } else {
        throw new Error(`Cập nhật thất bại: ${updateResponse.data?.message || 'Lỗi không xác định'}`);
      }
    } catch (err: any) {
      console.error('Error updating branch:', err);
      alert(`Có lỗi khi thay đổi cơ sở cửa hàng: ${err.message || err}`);
    }
  };

  const applyPromotion = async (promotionCode: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const response = await api.post(`/api/customer/cart/${cartId}/apply-promotion`, { promotionCode });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể áp dụng mã khuyến mãi');
      }

      const updatedCartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);

      setTotalAmount(updatedCartResponse.data.totalAmount || 0);
      setShippingFee(updatedCartResponse.data.shippingFee || 0);
      setFinalAmount(updatedCartResponse.data.finalAmount || 0);
      setAppliedPromotions(updatedCartResponse.data.promotionCarts || []);

      if (promotionCode) {
        const appliedPromo = updatedCartResponse.data.promotionCarts.find((p: Promotion) => p.promotionCode === promotionCode);
        if (appliedPromo) {
          alert(`Áp dụng mã ${appliedPromo.promotionCode} thành công! Giảm: ${appliedPromo.discountAmount?.toLocaleString() || 0} VND`);
        }
      } else {
        alert('Đã xóa mã khuyến mãi');
      }
    } catch (err: any) {
      console.error('Error applying promotion:', err);
      alert(err.message || 'Không thể áp dụng mã khuyến mãi. Vui lòng thử lại.');
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const itemToRemove = cartItems.find(item => item.cartItemId === cartItemId);
      if (!itemToRemove) throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      const productId = itemToRemove.productId;

      await api.delete(`/api/customer/cart/${cartId}/items/${productId}`);

      const updatedCartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const updatedItemsResponse = await api.get(`/api/customer/cart/${cartId}/items`);
      const updatedItemsWithProducts = await fetchAllProducts(updatedItemsResponse.data);

      setCartItems(updatedItemsWithProducts);
      setTotalAmount(updatedCartResponse.data.totalAmount);
      setShippingFee(updatedCartResponse.data.shippingFee);
      setFinalAmount(updatedCartResponse.data.finalAmount);
      setAppliedPromotions(updatedCartResponse.data.promotionCarts || []);

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      console.error('Error removing item:', err);
      alert(`Có lỗi khi xóa sản phẩm khỏi giỏ hàng: ${err.message || err}`);
    }
  };

  const updateAddress = async (addressId: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      await api.patch(`/api/customer/cart/${cartId}/update-address?addressId=${addressId}`);

      const updatedCartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);

      setShippingFee(updatedCartResponse.data.shippingFee);
      setFinalAmount(updatedCartResponse.data.finalAmount);
      setAppliedPromotions(updatedCartResponse.data.promotionCarts || []);
      setSelectedAddress(addresses.find(addr => addr.addressId === addressId) || null);
    } catch (err: any) {
      console.error('Error updating address:', err);
      alert(`Có lỗi khi thay đổi địa chỉ giao hàng: ${err.message || err}`);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải giỏ hàng...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <HeadOrder />
      </div>
      <div className="container mx-auto mt-16 p-4 max-w-4xl">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">Giỏ hàng của bạn hiện đang trống</p>
            <Link
              to="/products"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-lg font-semibold mb-2">Cơ sở cửa hàng</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => updateBranch(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Chọn cơ sở</option>
                  {branches.map((branch) => (
                    <option key={branch.branchCode} value={branch.branchCode}>
                      {branch.address}, {branch.district}, {branch.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-lg font-semibold">Địa chỉ giao hàng</label>
                  <Link
                    to="/my-address"
                    className="px-3 py-1 bg-primary text-white rounded text-sm "
                  >
                    Thêm mới
                  </Link>
                </div>
                {addresses.length > 0 ? (
                  <select
                    value={selectedAddress?.addressId || ''}
                    onChange={(e) => updateAddress(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Chọn địa chỉ</option>
                    {addresses.map((addr) => (
                      <option key={addr.addressId} value={addr.addressId}>
                        {addr.recipientName} - {addr.detailedAddress}, {addr.ward}, {addr.district}, {addr.city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-500">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex items-center border-b pb-4">
                      <Link to={`/san-pham/${item.productId}`}>
                        <img
                          src={item.product?.imageUrl || '/images/default-product.png'}
                          alt={item.product?.productName}
                          className="w-20 h-20 object-cover rounded mr-4"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          to={`/san-pham/${item.productId}`}
                          className="font-semibold hover:text-primary"
                        >
                          {item.product?.productName || 'Sản phẩm không xác định'}
                        </Link>
                        <p className="text-gray-600">
                          {item.product?.originalPrice?.toLocaleString() || '0'} VND/SP
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium w-24 text-right">
                          {item.amount.toLocaleString()} VND
                        </p>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-red-500 hover:text-red-700"
                          title="Xóa sản phẩm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/*  mã khuyến mãi */}
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-lg font-semibold mb-2">Mã khuyến mãi</label>
                <div className="promos-container">
                  {promotions.length > 0 ? (
                    <>
                      {promotions.map((promo) => {
                        const isApplied = appliedPromotions.some(p => p.promotionId === promo.promotionId);
                        return (
                          <div
                            key={promo.promotionId}
                            className={`promo-card ${isApplied ? 'selected' : ''}`}
                            onClick={() => applyPromotion(promo.promotionCode)}
                          >
                            {isApplied && (
                              <div
                                className="promo-remove"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applyPromotion('');
                                }}
                              >
                                ×
                              </div>
                            )}
                            <div className="promo-code">{promo.promotionCode}</div>
                            <div className="promo-desc ">
                              Giảm {promo.discountValue}
                              {promo.discountType === 'PERCENTAGE' ? '%' : ' VND'}
                              {promo.maxDiscountAmount && promo.discountType === 'PERCENTAGE' && (
                                <>, tối đa {promo.maxDiscountAmount.toLocaleString()} VND</>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p className="text-gray-500">Không có mã khuyến mãi khả dụng</p>
                  )}
                </div>

                {appliedPromotions.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Mã đã áp dụng</h3>
                    <div className="space-y-2">
                      {appliedPromotions.map((promo) => (
                        <div key={promo.promotionId} className="flex justify-between items-center border-b pb-2">
                          <span>{promo.promotionCode} - {promo.description}</span>
                          <span className="text-green-600">-{promo.discountAmount?.toLocaleString() || 0} VND</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Tổng thanh toán</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{totalAmount.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{shippingFee.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá:</span>
                    <span>-{appliedPromotions.reduce((sum, promo) => sum + (promo.discountAmount || 0), 0).toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{finalAmount.toLocaleString()} VND</span>
                  </div>
                </div>
                <Link
                  to="/payment"
                  className="block mt-6 w-full py-3 bg-primary text-white text-center rounded-lg  transition-colors"
                >
                  Tiến hành thanh toán
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;