// src/components/PaymentSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <CheckCircle size={80} className="text-green-600 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
      <p className="text-lg text-green-800 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>

      <Link
        to="/myorders"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition-all"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default PaymentSuccess;
