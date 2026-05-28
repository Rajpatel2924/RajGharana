'use client'

import { useState } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';
import axios from 'axios';

const RazorpayButton = ({ amount, email, phone, name, onPaymentSuccess, onPaymentFailure }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const isConfigured = Boolean(razorpayKeyId);
  const amountInPaise = Math.round(Number(amount || 0) * 100);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment script not loaded yet. Please try again in a moment.');
      return;
    }

    if (scriptError) {
      toast.error('Unable to load Razorpay checkout. Please check your network.');
      return;
    }

    if (!isConfigured) {
      toast.error('Razorpay is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local.');
      return;
    }

    if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
      toast.error('Minimum payment amount is ₹1.');
      return;
    }

    setLoading(true);
    try {
      const { data: orderData } = await axios.post('/api/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
        },
      });

      const orderId = orderData.order_id || orderData.id;

      if (!orderId) {
        throw new Error('Payment order was not created. Please try again.');
      }

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RajGharana',
        description: 'Purchase from RajGharana',
        order_id: orderId,
        prefill: {
          name: name || '',
          email: email || '',
          contact: phone || '',
        },
        theme: {
          color: '#F97316', // Orange color matching your brand
        },
        handler: async (response) => {
          setLoading(true);
          try {
            const { data: verifyData } = await axios.post(
              '/api/verify-payment',
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
              const message = verifyData?.details || verifyData?.error || 'Payment verification failed';
              toast.error(message);
              if (onPaymentFailure) {
                onPaymentFailure(message);
              }
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification error');
            if (onPaymentFailure) {
              onPaymentFailure(error.message);
            }
          } finally {
            setLoading(false);
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
      razorpay.on('payment.failed', (response) => {
        const message = response?.error?.description || response?.error?.reason || 'Payment failed';
        toast.error(message);
        setLoading(false);
        if (onPaymentFailure) {
          onPaymentFailure(message);
        }
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      const message = error?.response?.data?.error || error?.message || 'Failed to initiate payment';
      toast.error(message);
      if (onPaymentFailure) {
        onPaymentFailure(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || amountInPaise < 100 || !scriptLoaded || scriptError || !isConfigured;

  return (
    <div className="space-y-2">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setScriptError(true)}
      />
      <button
        onClick={handlePayment}
        disabled={isDisabled}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 active:scale-95'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Processing...
          </span>
        ) : scriptError ? (
          'Unable to load payment gateway'
        ) : !scriptLoaded ? (
          'Loading payment gateway...'
        ) : !isConfigured ? (
          'Razorpay not configured'
        ) : (
          `Pay ₹${amount?.toFixed(2) || '0'} with Razorpay`
        )}
      </button>
      {!isConfigured && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          Razorpay is not configured. Copy <span className="font-semibold">.env.local.example</span> to <span className="font-semibold">.env.local</span> and add your test or live keys.
        </p>
      )}
    </div>
  );
};

export default RazorpayButton;
