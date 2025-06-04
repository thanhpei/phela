import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '~/assets/images/logo.png';
import '~/assets/css/head_order.css';
import { useAuth } from '~/AuthContext';
import { RiAccountCircleLine } from 'react-icons/ri';
import { FaShoppingCart } from 'react-icons/fa';
import api from '~/config/axios';

const HeadOrder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (user && user.type === 'customer') {
        try {
          const customerId = user.customerId;
          const cartResponse = await api.get(`/api/customer/cart/getCustomer/${customerId}`);
          const fetchedCartId = cartResponse.data.cartId;
          setCartId(fetchedCartId);

          if (fetchedCartId) {
            const countResponse = await api.get(`/api/customer/cart/${fetchedCartId}/item-count`);
            const itemCount = countResponse.data;
            setCartCount(itemCount);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          console.error('Error fetching cart details:', error);
          setCartCount(0);
          setCartId(null);
        }
      } else if (user === null) {
        setCartCount(0);
        setCartId(null);
      } else {
        setCartCount(0);
        setCartId(null);
      }
    };

    fetchCartDetails();

    const handleCartUpdated = () => fetchCartDetails();
    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-order">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Phê La" />
        </Link>
      </div>
      <div className="navbar-links ml-7 relative flex items-center">
        {user ? (
          <div className="flex items-center space-x-16">
            {user.type === 'customer' && (
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-white text-2xl cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            )}
            <div className="user-menu group">
              <div className="flex items-center cursor-pointer">
                <RiAccountCircleLine className="text-white mr-1 text-2xl" />
                <span className="mr-2 uppercase">{user.username}</span>
              </div>
              <div className="dropdown-menu group-hover:visible group-hover:opacity-100">
                {user.type === 'customer' && (
                  <>
                    <Link to="/profileCustomer" className="dropdown-item uppercase no-underline">
                      Thông tin cá nhân
                    </Link>
                    <Link to="/my-address" className="dropdown-item uppercase no-underline">
                      Quản lý địa chỉ
                    </Link>
                    <Link to="/my-orders" className="dropdown-item uppercase no-underline">
                      Đơn hàng của tôi
                    </Link>
                  </>
                )}
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item uppercase w-full text-left"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login-register" className="btn-login">
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeadOrder;