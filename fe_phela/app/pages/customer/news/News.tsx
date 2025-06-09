import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '~/components/customer/Header';
import Footer from '~/components/customer/Footer';
import { getPublicNews } from '~/services/newsService';

// Định nghĩa kiểu dữ liệu
interface NewsArticle {
  newsId: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
}

const News = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getPublicNews();
        setNewsList(data);
      } catch (error) {
        toast.error("Không thể tải tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-center mb-12">Tin Tức & Sự Kiện</h1>
        
        {/* Lưới hiển thị tin tức */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((article) => (
            <div key={article.newsId} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <Link to={`/tin-tuc/${article.newsId}`}>
                <img 
                  src={article.thumbnailUrl || 'https://via.placeholder.com/400x250'} 
                  alt={article.title} 
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="p-6">
                <Link to={`/tin-tuc/${article.newsId}`}>
                  <h2 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default News;