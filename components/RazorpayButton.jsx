'use client'

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const RazorpayButton = ({ amount, email, phone, name, onPaymentSuccess, onPaymentFailure }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create order on backend
      const { data: orderData } = await axios.post('/api/razorpay/create-order', {
        amount,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
        },
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RajGharana',
        description: 'Purchase from RajGharana',
        order_id: orderData.id,
        prefill: {
          name: name || '',
          email: email || '',
          contact: phone || '',
        },
        theme: {
          color: '#F97316', // Orange color matching your brand
        },
        handler: async (response) => {
          try {
            // Step 2: Verify payment on backend
            const { data: verifyData } = await axios.post(
              '/api/razorpay/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyData.success) {
              toast.success('Payment successful!');
              if (onPaymentSuccess) {
                onPaymentSuccess(verifyData);
              }
            } else {
              toast.error('Payment verification failed');
              if (onPaymentFailure) {
                onPaymentFailure('Verification failed');
              }
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification error');
            if (onPaymentFailure) {
              onPaymentFailure(error.message);
            }
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setLoading(false);
            if (onPaymentFailure) {
              onPaymentFailure('Payment cancelled');
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      if (onPaymentFailure) {
        onPaymentFailure(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !amount || amount <= 0}
      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
        loading || !amount || amount <= 0
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-orange-600 hover:bg-orange-700 active:scale-95'
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>
          Processing...
        </span>
      ) : (
        `Pay ₹${amount?.toFixed(2) || '0'} with Razorpay`
      )}
    </button>
  );
};

export default RazorpayButton;
