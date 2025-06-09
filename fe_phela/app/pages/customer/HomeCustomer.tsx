import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getLatestActiveBanners } from '~/services/bannerService';
import Header from '~/components/customer/Header'
import Footer from '~/components/customer/Footer'
import home from '~/assets/images/home.jpg';
import '~/assets/css/DeliveryAddress.css';
import ChatWidget from '~/components/customer/ChatWidget';


interface Banner {
    bannerId: string;
    imageUrl: string;
}

const Home = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data: Banner[] = await getLatestActiveBanners();
                setBanners(data.filter(banner => banner.imageUrl)); 
            } catch (error) {
                console.error("Failed to fetch banners:", error);
                toast.error('Không thể tải banner.');
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const handlePrev = () => {
        setCurrentBannerIndex((prevIndex) => 
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentBannerIndex((prevIndex) => 
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    };


    const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : null;

    return (
        <div>
            <Header />
            <ChatWidget />
            {/* Phần Banner */}
            <div className="relative w-full h-screen bg-black">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-white">Đang tải banner...</div>
                ) : currentBanner ? (
                    <div
                        key={currentBanner.bannerId} 
                        className="w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out hover:brightness-75"
                        style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
                    >
                      
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-white">
                        Không có banner để hiển thị.
                    </div>
                )}
                
                {/* Nút điều hướng chỉ hiển thị khi có nhiều hơn 1 banner */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-3 z-10 hover:bg-opacity-60 transition-all"
                            aria-label="Previous Banner"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-3 z-10 hover:bg-opacity-60 transition-all"
                            aria-label="Next Banner"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                )}
            </div>
            
            {/* Phần nội dung */}
            <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 flex-1">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">PHÊ LA VÀ NHỮNG ĐIỀU KHÁC BIỆT</h2>
                    <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">CÂU CHUYỆN THƯƠNG HIỆU</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Nốt Hương Đặc Sản - Phê La luôn trân quý, nâng niu những giá trị Nguyên Bản ở mỗi vùng đất mà chúng tôi đi qua, nơi tâm hồn được đồng điệu với thiên nhiên, với nỗi vất vả nhọc nhằn của người nông dân; cảm nhận được hết thảy những tầng hương ẩn sâu trong từng nguyên liệu.
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <img 
                            src={home} 
                            alt="Phê La" 
                            className="rounded-lg shadow-md w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">NGUYÊN LIỆU ĐẶC SẢN</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Trà Ô Long đặc sản tại Phê La còn được ươm trồng với phương pháp chăm bón hữu cơ, hoàn toàn với trứng gà, đậu nành và thu hái thủ công để có được những búp trà tươi và non nhất, tạo nên điểm khác biệt mạnh mẽ so với các thương hiệu khác.
                        </p>
                    </div>
                </div>
                
                <div className="text-center">
                    <Link 
                        to="/ve-chung-toi" 
                        className="inline-block bg-primary text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Xem thêm
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;