import React from 'react'
import Header from '~/components/admin/Header'

const NewsManager = () => {
  return (
    <div>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <Header />
        </div>
        <div className="container mx-auto mt-16 p-4">
            <h1 className="text-2xl font-bold mb-4">Quản lý tin tức</h1>
            {/* Nội dung quản lý tin tức sẽ được thêm vào đây */}
        </div>
    </div>
  )
}

export default NewsManager
