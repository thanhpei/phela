import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '~/services/authServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        gender: '',
    });
    const [loading, setLoading] = useState(false);

    // Hàm kiểm tra mật khẩu
    const validatePassword = (password: string) => {
        // Yêu cầu: ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async () => {
        // --- VALIDATION PHÍA CLIENT ---
        if (!formData.username || !formData.password || !formData.email || !formData.gender) {
            toast.error("Vui lòng điền đầy đủ tất cả các trường.");
            return;
        }
        if (!validatePassword(formData.password)) {
            toast.warn("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
            return;
        }

        setLoading(true);
        try {
            await registerCustomer(formData);
            toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');

            // Chuyển hướng về trang đăng nhập sau khi thông báo thành công
            setTimeout(() => {
                navigate('/login-register');
            }, 3000);

        } catch (err: any) {
            // --- HIỂN THỊ LỖI CỤ THỂ TỪ BACKEND ---
            const errorMessage = err.response?.data?.message || 'Không thể đăng ký, vui lòng thử lại sau!';
            toast.error(errorMessage);
            console.error('Lỗi đăng ký:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-10 bg-yellow-50 text-black h-screen">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
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
            <select
                className="p-2 mb-4 w-80 rounded border"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
            </select>
            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-64 p-2 bg-black text-white rounded transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 drop-shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? "Đang xử lý..." : "Register"}
            </button>
        </div>
    );
};

export default Register;