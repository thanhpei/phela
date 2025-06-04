import React from 'react'
import HeadOrder from '~/components/customer/HeadOrder'
import api from '~/config/axios';
import { useState } from "react";
const Payment = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <HeadOrder />
      </div>
      <div className="container mx-auto mt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>
        
      </div>
    </div>
  )
}

export default Payment
