import React from 'react'
import Header from '~/components/customer/Header'
import Footer from '~/components/customer/Footer'

const AboutUs = () => {
  return (
    <div className="bg-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="bg-gray-200 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold uppercase text-white">VỀ PHÊ LA</h1>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="container mx-auto py-16 px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-xl font-medium mb-4">"Nốt Hương Đặc Sản"</h2>
          <p className="text-gray-700 mb-6">
            Phê La luôn trân quý, nâng niu những giá trị Nguyên Bản ở mỗi vùng đất mà chúng tôi đi qua, nơi tâm 
            hồn được đồng điệu với thiên nhiên, với nỗi vất vả nhọc nhằn của người nông dân; cảm nhận được hết 
            thấy những tầng hương ẩn sâu trong từng nguyên liệu.
          </p>
          <p className="text-gray-700">
            Một chặng đường dài đang chờ phía trước, Phê La đã sẵn sàng viết tiếp câu chuyện Nốt Hương Đặc 
            Sản - Nguyên Bản - Thủ Công đầy cảm hứng và càng tự hào hơn khi được mang sứ mệnh: "Đánh thức 
            những nốt hương đặc sản của nông sản Việt Nam".
          </p>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://phela.vn/wp-content/uploads/2021/07/HH_3783-600x400.jpg" 
            alt="Phê La Coffee Cups" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 text-center">
            <div>
              <div className="text-amber-500 flex justify-center mb-4">
                <img src="https://phela.vn/wp-content/uploads/2021/09/eyes.png" alt="Tầm nhìn" />
              </div>
              <h3 className="text-xl font-medium mb-4">Tầm nhìn</h3>
              <p className="text-gray-700">
                Mang nguồn nông sản cao cấp của Việt Nam tiếp cận gần hơn với mọi 
                người và vươn ra thế giới.
              </p>
            </div>
            <div>
              <div className="text-amber-500 flex justify-center mb-4">
                <img src="https://phela.vn/wp-content/uploads/2021/09/Dm.png" alt="Sứ mệnh" />
              </div>
              <h3 className="text-xl font-medium mb-4">Sứ mệnh</h3>
              <p className="text-gray-700">
                Đồng hành cùng người nông dân trong quá trình sản xuất và phát 
                triển bền vững nguồn nguyên liệu đặc sản.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Core Values */}
      <div className="container mx-auto py-16 px-4 md:px-8">
        <h2 className="text-2xl font-bold text-center mb-16">Giá trị cốt lõi</h2>
        
        <div className="space-y-24">
          {/* Value 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-4">Thủ công</h3>
              <p className="text-gray-700">
                Tại Phê La, sự tâm huyết, tỉ mỉ và tinh tế được thể hiện qua từng sản phẩm. Những là trà ô long được thu hoạch và sơ chế thủ công, kết hợp cùng việc nghiên cứu và sáng tạo, Phê La đã cho nên những sản phẩm mang hương vị nguyên bản và chân thật nhất.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/487395699_1069435881873471_7281936279347654638_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFxXtuY6cCCYl2UfVlf94D6Ml-UROElG2UyX5RE4SUbZb9r3fIigOP8yVGhXBtCjYu59zmlduj9goNgJBLH4kFg&_nc_ohc=bNW8i6nhn3UQ7kNvwGWcsnK&_nc_oc=AdmLAhlVlqatriFT1UiswAS7l_ewni9gsPJlPleBv-eHxYpH-5OIqd2F1k6uJ9rqDe0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=t7rs6SZFe1L8YlAiLc2WQw&oh=00_AfLVMakwuCcp2cpG7dUIeSl0yvM5ckc-TvdFZIkWi_QbMg&oe=6826ECD6" 
                alt="Thủ công tại Phê La" 
                className="w-1/2 rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          {/* Value 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-4">Quan tâm</h3>
              <p className="text-gray-700">
                Trải nghiệm của từng khách hàng là tiêu chí hàng đầu của Phê La. Đó cũng là lý do mọi dịch vụ, sản phẩm của Phê La luôn xoay quanh yếu tố con người. Phê La tin rằng, khách hàng – hay rộng hơn là cộng đồng sẽ luôn sát cánh cùng thương hiệu và lan tỏa những giá trị tốt đẹp đến xã hội.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://phela.vn/wp-content/uploads/2023/04/326386567_2808509185946106_3255994807608296453_n.jpg" 
                alt="Quan tâm tại Phê La" 
                className="w-1/2 rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          {/* Value 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-4">Cảm hứng</h3>
              <p className="text-gray-700">
                Mỗi sản phẩm, chiến dịch của Phê La đều được xây dựng dựa theo những người cảm hứng mà đã đi bên đi trong cuộc sống. Với Phê La, đó là nơi lưu giữ của những điều mới mẻ và kết nối những tâm hồn đồng điệu nhưng vẫn mang cá tính riêng biệt.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src="https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/485587472_1059418006208592_885223586838346058_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEyX9nwtcOIoGogQf3jBpZLHtmA2UHK9Lke2YDZQcr0udQfuFgA07LgfpWhEd3RO6qZygT2cfqpx_r5SqYl-v0L&_nc_ohc=OWVOmv8lf6EQ7kNvwHhEYLk&_nc_oc=Adnc0iyemMa4FRZ82cKrxU6mX-LKrRoyHzXSu-waD9cH3Vo7jLLVyCTl33iImpweJW0&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=hpTOzK0Lu66zZDn8ms1W-w&oh=00_AfKIQlBTZaCtLyVvUospNNqnv8VUhbcreQlIcBZ7nySUoQ&oe=6826DEAE" className="w-1/2 rounded-lg shadow-lg" alt="Cảm hứng tại Phê La" />
            </div>
          </div>
          
          {/* Value 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-4">Trách nhiệm</h3>
              <p className="text-gray-700">
                Phê La mong muốn tạo ra điều mà được ở Làng đã cảm thụ lại cảm cùng người nông dân và để cao sự phát triển bền vững của nguồn nguyên liệu. Điều chúng tôi tin rằng đây sẽ là bước đệm vững chắc giúp Phê La ghi thêu rõng nét đặc sản của người Việt tới cộng đồng và vươn ra thế giới.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/484878749_1057107966439596_9210423278686840686_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGRKs3Cg2HW9tC2jzZJ1CEDbV-SVo0RQlltX5JWjRFCWSejgAvC_5uRsoK1adBHgRHFv2Y0BbctIwqiiDILQgzq&_nc_ohc=IH2AeDTrc34Q7kNvwE0sLWJ&_nc_oc=Adk1QmpLfTSpCTyQTp85ChKCT93W2CxIT3IGEf8KB4A_9KQaGzzEx7dQ5lJ5jn8NLzA&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=nxXO9zvSNFlTWWs2F8LjZQ&oh=00_AfIYyGNMoJgVDnP9aQh5bI4zS-kMdTkAy7KKPVT-qarX6A&oe=6826F4AA" className="w-1/2 rounded-lg shadow-lg" alt="Trách nhiệm tại Phê La" />

            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Thành tựu nổi bật và đáng tự hào</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
            <div>
              <div className="text-amber-500 flex justify-center mb-4">
                <img src="https://phela.vn/wp-content/uploads/2021/09/eyes.png" alt="" />
              </div>
              <h3 className="text-2xl font-bold mb-2">210.000+</h3>
              <p className="text-gray-700">
                sản phẩm được bán ra trên thị trường trong vòng 5 tháng kinh doanh trong tình hình dịch bệnh căng thẳng
              </p>
            </div>
            <div>
              <div className="text-amber-500 flex justify-center mb-4">
                <img src="https://phela.vn/wp-content/uploads/2021/09/ezgif-7-dec41cab7982.png" alt="" />
              </div>
              <h3 className="text-2xl font-bold mb-2">5836</h3>
              <p className="text-gray-700">
                lần được nhắc đến trên Facebook và Instagram trong vòng 4 tháng (từ 15/03/2021 đến 15/07/2021) (theo Sprout Social)
              </p>
            </div>
            <div>
              <div className="text-amber-500 flex justify-center mb-4">
                <img src="https://phela.vn/wp-content/uploads/2021/09/Dm.png" alt="" />
              </div>
              <h3 className="text-2xl font-bold mb-2">98%</h3>
              <p className="text-gray-700">
                khách hàng hài lòng về chất lượng sản phẩm và dịch vụ của Phê La (theo đánh giá trên Beamin và Shopee Fresh)
              </p>
            </div>
          </div>
          
          {/* Timeline */}
          <h3 className="text-xl font-medium text-center mb-8">Những dấu ấn trong hành trình của chúng tôi</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-amber-200"></div>
            
            {/* Timeline Events */}
            <div className="space-y-12">
              {/* Event 1 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow p-4">
                    <span className="text-amber-600 font-semibold">8/2020</span>
                    <h4 className="text-lg font-medium mt-2 mb-2">Phê La và những bước đi đầu tiên</h4>
                    <p className="text-gray-700">
                      Thương hiệu Phê La được đăng ký bảo hộ độc quyền tại Việt Nam
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-4 border-amber-200"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0"></div>
              </div>
              
              {/* Event 2 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-8"></div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-4 border-amber-200"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
                  <div className="bg-white rounded-lg shadow p-4">
                    <span className="text-amber-600 font-semibold">9/3/2021</span>
                    <h4 className="text-lg font-medium mt-2 mb-2">Ra mắt thị trường</h4>
                    <p className="text-gray-700">
                      Phê La chính thức xuất hiện trên thị trường với cửa hàng đầu tiên tại Phạm Ngọc Thạch
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Event 3 */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow p-4">
                    <span className="text-amber-600 font-semibold">15/3/2021</span>
                    <h4 className="text-lg font-medium mt-2 mb-2">Phủ sóng các kênh bán hàng online</h4>
                    <p className="text-gray-700">
                      Lần lượt xuất hiện trên các ứng dụng giao hàng hàng đầu là Baemin và Shopee Fresh
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-4 border-amber-200"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default AboutUs