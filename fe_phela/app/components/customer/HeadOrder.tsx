import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png";
import "~/assets/css/head_order.css"
import { useAuth } from '~/AuthContext';
import { RiAccountCircleLine } from "react-icons/ri";

const HeadOrder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-order">
      <div className="navbar-logo">
        <Link to="/"><img src={logo} alt="Phê La" /></Link>
      </div>
      <div className="navbar-links ml-7 relative">
        {user ? (
          <div className="user-menu group">
            <div className="flex items-center cursor-pointer">
              <RiAccountCircleLine className='text-white mr-1 text-2xl' />
              <span className="mr-2 uppercase">{user.username}</span>
            </div>
            <div className="dropdown-menu group-hover:visible group-hover:opacity-100">
              <Link
                to="/profileCustomer"
                className="dropdown-item uppercase no-underline"
              >
                Thông tin cá nhân
              </Link>
              <button
                onClick={handleLogout}
                className="dropdown-item uppercase w-full text-left"
              >
                Đăng xuất
              </button>
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