import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllNews, deleteNews } from '~/services/newsService';
import Header from '~/components/admin/Header';
import Modal from '~/components/admin/Modal';
import NewsForm from '~/components/admin/NewsForm';

interface News {
  newsId: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  createdAt: string;
}

const NewsManager = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNewsList(data);
    } catch (error) {
      toast.error('Không thể tải danh sách tin tức!');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalForCreate = () => {
    setEditingNewsId(null); 
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (newsId: string) => {
    setEditingNewsId(newsId);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNewsId(null);
  };
  
  const handleFormSuccess = () => {
    handleCloseModal();
    fetchNews(); 
  };

  const handleDelete = async (newsId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await deleteNews(newsId);
        toast.success('Xóa bài viết thành công!');
        fetchNews(); // Tải lại danh sách
      } catch (error) {
        toast.error('Xóa bài viết thất bại!');
      }
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <div>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40">
          <Header />
        </div>
        <div className="container mx-auto mt-20 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Quản lý tin tức</h1>
            <button
              onClick={handleOpenModalForCreate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              + Thêm bài viết mới
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((news) => (
                  <tr key={news.newsId}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <img src={news.thumbnailUrl || 'https://via.placeholder.com/100'} alt={news.title} className="w-24 h-16 object-cover rounded" />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap font-bold">{news.title}</p>
                      <p className="text-gray-600 whitespace-no-wrap">{news.summary}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(news.createdAt).toLocaleDateString('vi-VN')}</p>

                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleOpenModalForEdit(news.newsId)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(news.newsId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Phần Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNewsId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
      >
        <NewsForm
          newsId={editingNewsId}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </>
  );
};

export default NewsManager;