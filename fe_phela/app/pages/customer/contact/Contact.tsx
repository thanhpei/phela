import React, { useState } from 'react'
import Header from '~/components/customer/Header'
import Footer from '~/components/customer/Footer'
import imgContact from '~/assets/images/contact.png'
import { AiFillEnvironment } from "react-icons/ai";
import { GiRotaryPhone } from "react-icons/gi";
import { IoMailSharp } from "react-icons/io5";
import api from '~/config/axios';

interface FormData {
  fullName: string; 
  email: string;
  content: string;
}

interface ContactResponse {
  contactId: string; 
  fullName: string;
  email: string;
  content: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (submitMessage) setSubmitMessage('');
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      setSubmitError('Vui lòng nhập họ và tên');
      return;
    }
    
    if (!formData.email.trim()) {
      setSubmitError('Vui lòng nhập email');
      return;
    }
    
    if (!formData.content.trim()) {
      setSubmitError('Vui lòng nhập nội dung tin nhắn');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');

    try {

      const response = await api.post<ContactResponse>('/api/contacts', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        content: formData.content.trim()
      });

      if (response.data) {
 
        setFormData({ fullName: '', email: '', content: '' });
        setSubmitMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
          setSubmitMessage('');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi gửi tin nhắn';
        setSubmitError(`Lỗi: ${errorMessage}`);
      } else if (error.request) {
        setSubmitError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } else {
        setSubmitError('Có lỗi không mong muốn xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>
      {/* Banner */}
      <div className="relative w-full h-72 mt-14">
        <img
          src={imgContact}
          alt="Phong cách khác biệt"
          className="w-full h-72 object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold uppercase text-white text-center drop-shadow-lg">
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className='text-3xl font-bold'>Phê La - Nốt Hương Đặc Sản</h1>
        <div className='my-4 relative flex mt-16'>
          <div>
            <AiFillEnvironment className='text-5xl'/>
          </div>
          <div className='px-4'>
            <p className='font-medium'>Địa chỉ:</p>
            <p>Trụ sở chính: 289 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh</p>
            <p>Chi nhánh Đà Lạt: 7 Nguyễn Chí Thanh, phường 1, Thành phố Đà Lạt, tỉnh Lâm Đồng</p>
            <p>Chi nhánh Hà Nội: Lô 04-9A Khu công nghiệp Vĩnh Hoàng, phường Hoàng Văn Thụ, quận Hoàng Mai, Hà Nội</p>
          </div>
        </div>
        <div className='my-4 relative flex mt-5'>
          <div>
            <GiRotaryPhone className='text-5xl'/>
          </div>
          <div className='px-4'>
            <p className='font-medium'>Hotline:</p>
            <p>1900 3013</p>
          </div>
        </div>
         <div className='my-4 relative flex mt-5'>
          <div>
            <IoMailSharp className='text-5xl'/>
          </div>
          <div className='px-4'>
            <p className='font-medium'>Email:</p>
            <p>info@phela.vn</p>
          </div>
        </div>

        {/* Form Liên Hệ */}
        <div className='mt-20 max-w-4xl mx-auto p-8 rounded-lg shadow-sm'>
          <h2 className='text-2xl font-bold mb-2'>Liên hệ</h2>
          <p className='text-gray-600 mb-6'>
            Vui lòng điền đầy đủ thông tin theo yêu cầu để chúng tôi có thể hỗ trợ quý khách tốt nhất.
          </p>
          
          {/* Success Message */}
          {submitMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {submitMessage}
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor="fullName" className='block text-sm font-medium text-gray-700 mb-2'>
                Họ và tên*
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>

            <div>
              <label htmlFor="content" className='block text-sm font-medium text-gray-700 mb-2'>
                Nội dung*
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                required
                disabled={isSubmitting}
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed'
                placeholder="Nhập nội dung tin nhắn của bạn..."
              />
            </div>

            <div className='pt-4'>
              <button
                type="submit"
                disabled={isSubmitting}
                className='w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100'
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact