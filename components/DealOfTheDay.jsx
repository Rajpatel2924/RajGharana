'use client'
import { useAppContext } from '@/context/AppContext';
import ProductCard from './ProductCard';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const DealOfTheDay = () => {
  const { products, router } = useAppContext();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Simulate countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get products with deals
  const dealsProducts = products.filter(p => p.badge === 'Deal').slice(0, 4);

  if (dealsProducts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 py-8 px-6 md:px-16 lg:px-32 rounded-lg mb-12">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Deal of the Day</h2>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <span className="text-sm font-semibold text-gray-700">Ends in:</span>
            <div className="flex gap-1 font-bold text-orange-600">
              <span className="bg-orange-100 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-gray-400">:</span>
              <span className="bg-orange-100 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-gray-400">:</span>
              <span className="bg-orange-100 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dealsProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/all-products?filter=deal')}
        className="w-full mt-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
      >
        View All Deals
      </button>
    </div>
  );
};

export default DealOfTheDay;