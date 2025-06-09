import React, { useState, useEffect, useCallback } from 'react';
import HeadOrder from '~/components/customer/HeadOrder';
import api from '~/config/axios';
import { useAuth } from '~/AuthContext';
import { Link } from 'react-router-dom';
import '~/assets/css/Cart.css';

// --- Giữ nguyên các Interface ---
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
  const [distance, setDistance] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [appliedPromotions, setAppliedPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promotionLoading, setPromotionLoading] = useState<string | null>(null);

  // --- Các hàm fetch dữ liệu sản phẩm (không đổi) ---
  const fetchProductDetails = async (productId: string): Promise<Product> => {
    try {
      const response = await api.get(`/api/product/get/${productId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      return {
        productId,
        productName: 'Sản phẩm không xác định',
        imageUrl: '/images/default-product.png',
        originalPrice: 0,
      };
    }
  };

  const fetchAllProducts = async (items: CartItem[]): Promise<CartItem[]> => {
    return Promise.all(
      items.map(async (item) => {
        const product = await fetchProductDetails(item.productId);
        return { ...item, product };
      }),
    );
  };

  // REFACTORED: Tạo hàm cập nhật state giỏ hàng tập trung để tránh lặp code và lỗi bất đồng bộ
  const updateFullCartState = useCallback(async (customerId: string) => {
    try {
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartData = cartResponse.data;

      const itemsWithProducts = await fetchAllProducts(cartData.cartItems || []);

      setCartItems(itemsWithProducts);
      setTotalAmount(cartData.totalAmount || 0);
      setShippingFee(cartData.shippingFee || 0);
      setFinalAmount(cartData.finalAmount || 0);
      setAppliedPromotions(cartData.promotionCarts || []);
      setDistance(cartData.distance || 0); // MODIFIED: Cập nhật state khoảng cách

      // Gửi sự kiện để các component khác (như header) có thể cập nhật
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Error updating full cart state:", err);
      setError("Không thể cập nhật thông tin giỏ hàng.");
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (user && user.type === 'customer') {
        setLoading(true);
        try {
          const customerId = user.customerId;
          let cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
          let cartData = cartResponse.data;

          if (!cartData || !cartData.cartId) {
            cartResponse = await api.post(`/api/customer/cart/create/${customerId}`);
            cartData = cartResponse.data;
          }

          await updateFullCartState(customerId);

          const [branchResponse, promoResponse, addressResponse] = await Promise.all([
            api.get('/api/branch'),
            api.get('/api/promotion/active'),
            api.get(`/api/address/customer/${customerId}`),
          ]);

          setBranches(branchResponse.data);
          setSelectedBranch(cartData.branch?.branchCode || '');

          setAddresses(addressResponse.data);
          const defaultAddress = addressResponse.data.find((addr: Address) => addr.isDefault) || addressResponse.data[0] || null;
          setSelectedAddress(defaultAddress);

          setPromotions(promoResponse.data);

        } catch (err) {
          console.error('Error fetching initial cart details:', err);
          setError('Không thể tải thông tin giỏ hàng. Vui lòng thử lại sau.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [user, updateFullCartState]);


  // REFACTORED: Sử dụng hàm updateFullCartState để code gọn hơn
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
      if (!itemToUpdate) return;

      if (newQuantity === 0) {
        await removeItem(cartItemId);
        return;
      }

      await api.post(`/api/customer/cart/${cartId}/items`, {
        productId: itemToUpdate.productId,
        quantity: newQuantity,
      });

      await updateFullCartState(customerId);

    } catch (err: any) {
      console.error('Error updating quantity:', err);
      alert(`Có lỗi khi cập nhật số lượng sản phẩm: ${err.response?.data?.message || err.message}`);
    }
  };

  // REFACTORED: Sử dụng hàm updateFullCartState
  const updateBranch = async (branchCode: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      await api.patch(`/api/customer/cart/${cartId}/update-branch?branchCode=${branchCode}`);
      setSelectedBranch(branchCode);
      await updateFullCartState(customerId);
    } catch (err: any) {
      console.error('Error updating branch:', err);
      alert(`Có lỗi khi thay đổi cơ sở cửa hàng: ${err.response?.data?.message || err.message}`);
    }
  };

  // REFACTORED: Sử dụng hàm updateFullCartState
  const updateAddress = async (addressId: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      await api.patch(`/api/customer/cart/${cartId}/update-address?addressId=${addressId}`);
      setSelectedAddress(addresses.find(addr => addr.addressId === addressId) || null);
      await updateFullCartState(customerId);

    } catch (err: any) {
      console.error('Error updating address:', err);
      alert(`Có lỗi khi thay đổi địa chỉ giao hàng: ${err.response?.data?.message || err.message}`);
    }
  };




  const removeItem = async (cartItemId: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const itemToRemove = cartItems.find(item => item.cartItemId === cartItemId);
      if (!itemToRemove) return;

      await api.delete(`/api/customer/cart/${cartId}/items/${itemToRemove.productId}`);
      await updateFullCartState(customerId);

    } catch (err: any) {
      console.error('Error removing item:', err);
      alert(`Có lỗi khi xóa sản phẩm: ${err.response?.data?.message || err.message}`);
    }
  };



  // MODIFIED: Hàm chỉ để áp dụng mã
  const applyPromotion = async (promotionCode: string) => {
    if (!user || user.type !== 'customer') return;
    if (promotionLoading) return; // Ngăn chặn nhiều yêu cầu cùng lúc

    setPromotionLoading(promotionCode);
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const response = await api.post(`/api/customer/cart/${cartId}/apply-promotion`, { promotionCode });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      await updateFullCartState(customerId);
      const appliedPromo = response.data.data.promotionCarts.find((p: Promotion) => p.promotionCode === promotionCode);
      if (appliedPromo) {
        alert(`Áp dụng mã ${appliedPromo.promotionCode} thành công! Giảm: ${appliedPromo.discountAmount?.toLocaleString() || 0} VND`);
      }
    } catch (err: any) {
      console.error('Error applying promotion:', err);

      if (err.response && err.response.data && err.response.data.message) {

        alert(err.response.data.message);
      } else {
        alert('Không thể áp dụng mã khuyến mãi do có lỗi xảy ra.');
      }

    } finally {
      setPromotionLoading(null);
    }
  };

  const removePromotion = async (promotionId: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;


      await api.delete(`/api/customer/cart/${cartId}/promotions/${promotionId}`);
      await updateFullCartState(customerId);

      alert('Đã xóa mã khuyến mãi.');
    } catch (err: any) {
      console.error('Error removing promotion:', err);
      alert(err.response?.data?.message || 'Không thể xóa mã khuyến mãi.');
    }
  };

  const updateNote = async (cartItemId: string, type: 'đường' | 'đá', value: string) => {
    if (!user || user.type !== 'customer') return;

    try {
      const customerId = user.customerId;
      const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
      const cartId = cartResponse.data.cartId;

      const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
      if (!itemToUpdate) return;

      // Parse existing note
      let sugarLevel = '100% đường';
      let iceLevel = '100% đá';

      if (itemToUpdate.note) {
        const parts = itemToUpdate.note.split(', ');
        parts.forEach(part => {
          if (part.includes('đường')) sugarLevel = part;
          if (part.includes('đá')) iceLevel = part;
        });
      }

      // Update the relevant part
      if (type === 'đường') {
        sugarLevel = `${value}% đường`;
      } else {
        iceLevel = `${value}% đá`;
      }

      const newNote = `${sugarLevel}, ${iceLevel}`;

      await api.post(`/api/customer/cart/${cartId}/items`, {
        productId: itemToUpdate.productId,
        quantity: itemToUpdate.quantity,
        note: newNote
      });

      await updateFullCartState(customerId);
    } catch (err: any) {
      console.error('Error updating note:', err);
      alert(`Có lỗi khi cập nhật ghi chú: ${err.response?.data?.message || err.message}`);
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
            <Link to="/san-pham" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
            <div className="space-y-6">
              {/* --- Giữ nguyên các khối chọn Cơ sở và Địa chỉ --- */}
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-lg font-semibold mb-2">Cơ sở cửa hàng</label>
                <select value={selectedBranch} onChange={(e) => updateBranch(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary">
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
                  <Link to="/my-address" className="px-3 py-1 bg-primary text-white rounded text-sm ">
                    Thêm mới
                  </Link>
                </div>
                {addresses.length > 0 ? (
                  <select value={selectedAddress?.addressId || ''} onChange={(e) => updateAddress(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary">
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

              {/* --- Giữ nguyên khối Sản phẩm --- */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex items-center border-b pb-4">
                      <Link to={`/san-pham/${item.productId}`}>
                        <img src={item.product?.imageUrl || '/images/default-product.png'} alt={item.product?.productName} className="w-20 h-20 object-cover rounded mr-4" />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/san-pham/${item.productId}`} className="font-semibold hover:text-primary">
                          {item.product?.productName || 'Sản phẩm không xác định'}
                        </Link>
                        <p className="text-gray-600">{item.product?.originalPrice?.toLocaleString() || '0'} VND/SP</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Đường:</span>
                            <select
                              value={item.note.includes('50% đường') ? '50' : item.note.includes('70% đường') ? '70' : '100'}
                              onChange={(e) => updateNote(item.cartItemId, 'đường', e.target.value)}
                              className="text-sm p-1 border rounded"
                            >
                              <option value="50">50%</option>
                              <option value="70">70%</option>
                              <option value="100">100%</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Đá:</span>
                            <select
                              value={item.note.includes('50% đá') ? '50' : item.note.includes('70% đá') ? '70' : '100'}
                              onChange={(e) => updateNote(item.cartItemId, 'đá', e.target.value)}
                              className="text-sm p-1 border rounded"
                            >
                              <option value="50">50%</option>
                              <option value="70">70%</option>
                              <option value="100">100%</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                        <p className="font-medium w-24 text-right">{item.amount.toLocaleString()} VND</p>
                        <button onClick={() => removeItem(item.cartItemId)} className="text-red-500 hover:text-red-700" title="Xóa sản phẩm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODIFIED: Khối mã khuyến mãi đã được sửa logic */}
              <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-lg font-semibold mb-2">Mã khuyến mãi</label>
                <div className="promos-container">
                  {promotions.length > 0 ? (
                    promotions.map((promo) => {
                      const isApplied = appliedPromotions.some(p => p.promotionId === promo.promotionId);
                      return (
                        <div key={promo.promotionId} className={`promo-card ${isApplied ? 'selected' : ''}`} onClick={() => !isApplied && applyPromotion(promo.promotionCode)}>
                          {isApplied && (
                            <div className="promo-remove" onClick={(e) => {
                              e.stopPropagation();
                              removePromotion(promo.promotionId); // Gọi hàm xóa đúng
                            }}>
                              ×
                            </div>
                          )}
                          <div className="promo-name">{promo.name}</div>
                          <div className="promo-desc ">
                            Giảm {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : ' VND'}
                            {promo.maxDiscountAmount && promo.discountType === 'PERCENTAGE' && (<>, tối đa {promo.maxDiscountAmount.toLocaleString()} VND</>)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">Không có mã khuyến mãi khả dụng</p>
                  )}
                </div>
              </div>

              {/* MODIFIED: Khối tổng thanh toán đã thêm khoảng cách */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Tổng thanh toán</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{totalAmount.toLocaleString()} VND</span>
                  </div>
                  {/* NEW: Hiển thị khoảng cách */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Khoảng cách giao hàng (ước tính):</span>
                    <span>{distance > 0 ? `${distance.toFixed(2)} km` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{shippingFee.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá:</span>
                    <span className="text-green-600">-{appliedPromotions.reduce((sum, promo) => sum + (promo.discountAmount || 0), 0).toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{finalAmount.toLocaleString()} VND</span>
                  </div>
                </div>
                <Link to="/payment" className="block mt-6 w-full py-3 bg-primary text-white text-center rounded-lg  transition-colors">
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