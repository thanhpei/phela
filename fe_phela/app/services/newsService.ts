
import api from '~/config/axios';

// Lấy danh sách tất cả tin tức
export const getAllNews = async () => {
  const response = await api.get('/api/admin/news');
  return response.data;
};

// Lấy chi tiết một tin tức
export const getNewsById = async (newsId: string) => {
  const response = await api.get(`/api/admin/news/${newsId}`);
  return response.data;
};

// Tạo tin tức mới 
export const createNews = async (formData: FormData) => {
  const response = await api.post('/api/admin/news', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Cập nhật tin tức 
export const updateNews = async (newsId: string, formData: FormData) => {
  const response = await api.put(`/api/admin/news/${newsId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Xóa tin tức
export const deleteNews = async (newsId: string) => {
  const response = await api.delete(`/api/admin/news/${newsId}`);
  return response.data;
};

// === CUSTOMER API  ===

// Lấy danh sách tin tức cho khách hàng
export const getPublicNews = async () => {
  // Dùng endpoint public, không cần token
  const response = await api.get('/api/news');
  return response.data;
};

// Lấy chi tiết một tin tức cho khách hàng
export const getPublicNewsById = async (newsId: string) => {
  const response = await api.get(`/api/news/${newsId}`);
  return response.data;
};