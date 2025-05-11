import React from 'react'
import Header from '~/components/customer/Header'
import Footer from '~/components/customer/Footer'

const Clause = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Image */}
        <div className="w-full">
          <img
            src="https://phela.vn/wp-content/uploads/2022/05/hi.jpg"
            alt="Thành viên Phê La"
            className="w-full h-72 object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-lg font-bold mb-6 uppercase">
            ĐIỀU KHOẢN VÀ ĐIỀU KIỆN SỬ DỤNG CHƯƠNG TRÌNH THÀNH VIÊN PHÊ LA
          </h1>
          <p className='italic text-gray-500 py-2'>23-05-2022</p>
          <p>VUI LÒNG ĐỌC KỸ NHỮNG ĐIỀU KHOẢN & ĐIỀU KIỆN SỬ DỤNG NÀY. BẰNG CÁCH TRUY CẬP HAY THAM GIA VÀO CHƯƠNG TRÌNH THÀNH VIÊN PHÊ LA, BẠN ĐỒNG Ý BỊ RÀNG BUỘC BỞI NHỮNG ĐIỀU KHOẢN & ĐIỀU KIỆN SỬ DỤNG NÀY VÀ TẤT CẢ CÁC ĐIỀU KHOẢN ĐƯỢC KẾT HỢP BẰNG VIỆC THAM CHIẾU. NẾU BẠN KHÔNG ĐỒNG Ý VỚI NHỮNG ĐIỀU KHOẢN & ĐIỀU KIỆN SỬ DỤNG NÀY, VUI LÒNG KHÔNG THAM GIA VÀO CHƯƠNG TRÌNH THÀNH VIÊN PHÊ LA KỂ TỪ BÂY GIỜ.</p>
          <h3 className='py-3 font-semibold'>1. THÔNG TIN CHUNG</h3>
          <div className="space-y-4 text-gray-700">
                <p>
                  Các Điều khoản & Điều kiện sử dụng này được áp dụng đối với việc bạn truy cập và tham gia vào chương
                  trình Thành viên Phê La do Công ty Cổ Phần Phê La thực hiện. Các Điều khoản & Điều kiện sử dụng này
                  không làm thay đổi theo bất cứ cách nào các điều khoản hoặc điều kiện của bất cứ thỏa thuận nào khác mà
                  bạn có thể giao kết với Phê La về các sản phẩm và dịch vụ khác.
                </p>
                
                <p>
                  Phê La cũng có quyền thay đổi, chính sửa và hoặc loại bỏ chương trình Thành viên Phê La tại bất cứ thời
                  điểm nào.
                </p>
                
                <p>
                  Bất cứ thay đổi hoặc sửa đổi... sẽ có hiệu lực ngay khi được đăng tải tại trang chủ hoặc/và trang Fanpage
                  chính thức của Phê La tại <a href="www.phela.vn" className='text-blue-400'>www.phela.vn</a> và <a href="www.facebook.com/phelaxinchao" className='text-blue-400'>www.facebook.com/phelaxinchao</a>. Bạn có thể khước từ bất cứ
                  quyền nào mà bạn có thể có để nhận được thông báo cụ thể về những thay đổi hoặc sửa đổi đó.
                </p>
                
                <p>
                  Sự tham gia của bạn vào chương trình Thành viên Phê La chính là việc xác nhận sự chấp nhận của bạn về
                  các Điều khoản & Điều kiện sử dụng này và bất cứ thay đổi hoặc sửa đổi nào. Do vậy, bạn phải thường
                  xuyên kiểm tra và xem các Điều khoản & Điều kiện sử dụng, các chính sách áp dụng để có thể hiểu rõ các
                  điều khoản và điều kiện áp dụng cho chương trình Thành viên Phê La. Nếu bạn không đồng ý các Điều
                  khoản & Điều kiện sử dụng này, bạn phải chấm dứt việc tham gia vào chương trình Thành viên Phê La.
                </p>
                
                <p>
                  Chương trình Thành viên Phê La dành cho việc sử dụng cá nhân. Việc sử dụng cho mục đích thương mại
                  dưới mọi hình thức được xem như bị cấm. Chương trình này không nhằm tới và cũng không được dự liệu
                  cho việc sử dụng bởi bất cứ người nào dưới 18 tuổi.
                </p>
                
                <p>
                  Chương trình Thành viên Phê La là một cách thức thể hiện sự nỗ lực của Phê La để tri ân và cảm ơn khách
                  hàng trung thành ủng hộ hoạt động kinh doanh, và mua các sản phẩm Phê La. Các thành viên của Phê La
                  có thể nhận được và tích lũy điểm mà có thể được sử dụng để hưởng các lợi ích của chương trình Thành
                  viên Phê La, còn được biết đến như là "Ưu Đãi", tại các cửa hàng Phê La tại Việt Nam.
                </p>
              </div>
              <h3 className='py-3 font-semibold'>2. CÁCH THỨC THAM GIA VÀO CHƯƠNG TRÌNH THÀNH VIÊN PHÊ LA</h3>
              <div  className="space-y-4 text-gray-700">
                <p>Bạn có thể tham gia vào chương trình Thành viên Phê La và bắt đầu tích lũy điểm theo 3 bước sau:</p>
                <p><span className='font-semibold'>Bước 1:</span> Tải ứng dụng Phê La tại đường link</p>
                <p>iOS: <a href="https://apps.apple.com/vn/app/ph%C3%AA-la/id1660169055?l=vi" className='text-blue-800'>https://apps.apple.com/vn/app/ph%C3%AA-la/id1660169055?l=vi</a></p>
                <p>Android: <a href="https://play.google.com/store/apps/details?id=vn.phela.mobileapp" className='text-blue-800'>https://play.google.com/store/apps/details?id=vn.phela.mobileapp</a></p>
                <p><span className='font-semibold'>Bước 2:</span> Đăng ký thành viên trực tiếp trên ứng dụng bằng số điện thoại và email cá nhân. Tài khoản thành viên sẽ được kích hoạt ngay tại thời điểm đăng ký</p>
                <p><span className='font-semibold'>Bước 3:</span> Đăng nhập và bắt đầu sử dụng. Bạn có thể kiểm tra hạng thành viên, số điểm tích lũy được trực tiếp trên ứng dụng</p>
              </div>
              <h3 className='py-3 font-semibold'>3. CHÍNH SÁCH TÍCH LŨY ĐIỂM</h3>
              
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Clause
