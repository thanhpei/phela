import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '~/services/authServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        gender: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async () => {
        if (!formData.username || !formData.password || !formData.email || !formData.gender) {
            toast.error("Vui lòng điền đầy đủ tất cả các trường.");
            return;
        }

        if (!validatePassword(formData.password)) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự và gồm chữ hoa, chữ thường, số, ký tự đặc biệt.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không trùng khớp.");
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...payload } = formData;
            await registerCustomer(payload);
            toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");

            setTimeout(() => {
                navigate("/login-register");
            }, 3000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Không thể đăng ký, vui lòng thử lại sau!";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
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
            <div className="relative mb-4 w-80">
                <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="p-2 w-full rounded border pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {showPassword ? "Ẩn" : "Hiện"}
                </button>
            </div>
            <div className="relative mb-4 w-80">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm Password"
                    className="p-2 w-full rounded border pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {showConfirmPassword ? "Ẩn" : "Hiện"}
                </button>
            </div>
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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