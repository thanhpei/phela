import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '~/components/admin/Header';
import Modal from '~/components/admin/Modal';
import { getAllBanners, createBanner, deleteBanner, updateBannerStatus } from '~/services/bannerService';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '~/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '~/assets/css/DeliveryAddress.css'


export enum BannerStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

interface Banner {
    bannerId: string;
    imageUrl: string;
    createdAt: string;
    status: BannerStatus;
}

const BannerManager = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [unauthorized, setUnauthorized] = useState<boolean>(false);

    useEffect(() => {

        if (authLoading) return;

        const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
        if (!user || !allowedRoles.includes(user.role)) {
            setUnauthorized(true);
            toast.error('Bạn không có quyền truy cập trang này', {
                onClose: () => navigate('/admin/dashboard')
            });
            return;
        }

        fetchBanners();
    }, [user, authLoading, navigate]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await getAllBanners();
            setBanners(data);
        } catch (error) {
            toast.error("Không thể tải danh sách banner.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewBannerFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCreateBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBannerFile) {
            toast.warn("Vui lòng chọn một file ảnh.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', newBannerFile);

        try {
            await createBanner(formData);
            toast.success("Thêm banner mới thành công!");
            closeModalAndReset();
            fetchBanners(); // Tải lại danh sách
        } catch (error) {
            toast.error("Thêm banner thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (bannerId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
            try {
                await deleteBanner(bannerId);
                toast.success("Xóa banner thành công!");
                fetchBanners();
            } catch (error) {
                toast.error("Xóa banner thất bại!");
            }
        }
    };

    const handleStatusChange = async (bannerId: string, newStatus: BannerStatus) => {
        try {
            await updateBannerStatus(bannerId, newStatus);
            toast.success("Cập nhật trạng thái thành công!");
            // Cập nhật lại state để giao diện thay đổi ngay lập tức
            setBanners(banners.map(b => b.bannerId === bannerId ? { ...b, status: newStatus } : b));
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };

    const closeModalAndReset = () => {
        setIsModalOpen(false);
        setNewBannerFile(null);
        setPreview(null);
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <FiLock className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Truy cập bị từ chối</h2>
                    <p className="text-gray-600 mb-6">
                        Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.
                    </p>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                        Quay lại trang Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    toastClassName="border border-gray-200 shadow-lg"
                    progressClassName="bg-amber-500"
                    closeButton={false}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40">
                    <Header />
                </div>
                <div className="container mx-auto mt-20 p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Quản lý banner</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary text-white font-bold py-2 px-4 rounded"
                        >
                            + Thêm banner mới
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map(banner => (
                            <div key={banner.bannerId} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={banner.imageUrl} alt="Banner" className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className={`h-4 w-4 rounded-full mr-2 ${banner.status === BannerStatus.ACTIVE ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <select
                                                value={banner.status}
                                                onChange={(e) => handleStatusChange(banner.bannerId, e.target.value as BannerStatus)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                                            >
                                                <option value={BannerStatus.ACTIVE}>Hoạt động</option>
                                                <option value={BannerStatus.INACTIVE}>Không hoạt động</option>
                                            </select>
                                        </div>
                                        <button onClick={() => handleDelete(banner.bannerId)} className="text-red-500 hover:text-red-700 font-semibold">Xóa</button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Ngày tạo: {new Date(banner.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModalAndReset} title="Thêm banner mới">
                <form onSubmit={handleCreateBanner}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bannerFile">
                            Chọn ảnh banner
                        </label>
                        <input
                            id="bannerFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    {preview && (
                        <div className="mb-4">
                            <p className="text-sm font-semibold mb-2">Xem trước:</p>
                            <img src={preview} alt="Xem trước banner" className="w-full rounded-md object-contain max-h-64" />
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                            {isSubmitting ? 'Đang tải lên...' : 'Lưu banner'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default BannerManager;