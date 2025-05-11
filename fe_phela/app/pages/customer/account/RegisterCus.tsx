import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '~/services/authServices';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        gender: '',
        latitude: undefined,
        longitude: undefined,
      });
      const [error, setError] = useState('');
    
      const handleRegister = async () => {
        try {
          await registerCustomer(formData);
          console.log('Khách hàng đăng ký thành công');
          alert('Đăng ký thành công! Vui lòng xác nhận tài khoản qua email.');
          navigate('/login-register');
        } catch (err) {
          setError('Không thể đăng ký, vui lòng thử lại sau!');
          console.error('Lỗi đăng ký:', err);
        }
      };
    return (
        <div className="flex flex-col justify-center items-center p-10 bg-yellow-50 text-black h-screen">
            <h2 className="text-3xl font-bold mb-6">Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="p-2 mb-4 w-80 rounded border"
            />
            <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="p-2 mb-4 w-80 rounded border"
            />
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="p-2 mb-4 w-80 rounded border"
            />
            <select className="p-2 mb-4 w-80 rounded border"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
            </select>
            <button onClick={handleRegister} className="w-64 p-2 bg-black text-white rounded transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg">
                Register
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default Register;