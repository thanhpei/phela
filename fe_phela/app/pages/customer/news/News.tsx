import React from 'react'
import Header from '~/components/customer/Header'

const News = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-2xl font-bold mb-4">News</h1>
        <p className="text-gray-700">Stay tuned for the latest updates and news.</p>
      
      </div>
    </div>
  )
}

export default News
