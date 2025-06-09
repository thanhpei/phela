import api from '~/config/axios'; 

export enum BannerStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

// Lấy tất cả banner cho trang admin
export const getAllBanners = async () => {
    const response = await api.get('/api/admin/banners');
    return response.data;
};

// Tạo banner mới
export const createBanner = async (formData: FormData) => {
    const response = await api.post('/api/admin/banners', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Cập nhật trạng thái banner
export const updateBannerStatus = async (bannerId: string, status: BannerStatus) => {
    const response = await api.patch(`/api/admin/banners/${bannerId}/status`, null, {
        params: { status }
    });
    return response.data;
};

// Xóa banner
export const deleteBanner = async (bannerId: string) => {
    const response = await api.delete(`/api/admin/banners/${bannerId}`);
    return response.data;
};

// Customer API
export const getLatestActiveBanners = async () => {
    const response = await api.get('/api/banners/latest');
    return response.data;
};