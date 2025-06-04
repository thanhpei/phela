import React from 'react';
import Header from '~/components/customer/Header';
import Footer from '~/components/customer/Footer';

const DifferentStyle = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>

      <main className="flex-grow mt-14">
        {/* Hero Image */}
        <div className="w-full">
          <img
            src="https://phela.vn/wp-content/uploads/2021/08/DSC09515.jpg"
            alt="Phong cách khác biệt"
            className="w-full h-72 object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-xl font-bold mb-6 uppercase">
            PHONG CÁCH KHÁC BIỆT
          </h1>

          <div className=" text-gray-500 mb-8 italic">
            26-08-2021
          </div>

          <div className="prose max-w-none text-justify pb-4">
            <p className="text-md">
              Đi theo concept Cắm Trại - phong cách khác biệt so với các thương hiệu khác trên thị trường, Phê La đã tạo ra ấn tượng mạnh mẽ cho khách hàng nhờ những chất riêng và thiết kế độc đáo của mình.
            </p>
          </div>
          <div >
            <img src="https://phela.vn/wp-content/uploads/2021/08/phong-cach-camping-1.jpg" alt="Cắm trại" />
            <span className='py-3 text-gray-500 italic items-center text-center'>Tông màu trầm ấm mang đến cảm giác thoải mái, gần gũi</span>
          </div>
          <div className="prose max-w-none text-justify py-4">
            <p className="text-md">
              Trong mỗi góc nhỏ tại Phê La đều có sự xuất hiện của ghế dù và bàn xếp, kết hợp với tone màu nâu trầm ấm làm chủ đạo, Phê La mong muốn sẽ mang lại không gian thưởng thức thoải mái, gần gũi và mộc mạc nhất cho khách hàng. Cũng chính bởi sự nguyên sơ này, khách hàng như được hoà mình vào thiên nhiên để tâm tình, thủ thỉ vài ba câu chuyện nhỏ bên những cốc trà, và bỏ lại những suy nghĩ mệt mỏi, xô bồ của cuộc sống.
            </p>
          </div>
          <div>
            <img src="https://phela.vn/wp-content/uploads/2021/08/phong-cach-camping-2.jpg" alt="Cắm trại" />
            <span className='py-3 text-gray-500 italic items-center text-center'>Tông màu trầm ấm mang đến cảm giác thoải mái, gần gũi</span>
          </div>
          <div className="prose max-w-none text-justify pt-4">
            <p className="text-md">
              Có thể nói, đây là phong cách khác biệt độc đáo của Phê La khi hướng mình tới một concept không gian hoàn toàn mới. Đây không phải là nơi phù hợp để bạn làm việc hay nghiên cứu, mà là nơi bạn được là chính mình, được giải toả áp lực, được thư giãn và được ‘chill’. Cùng khám phá một không gian mới mẻ và đầy thú vị.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DifferentStyle;