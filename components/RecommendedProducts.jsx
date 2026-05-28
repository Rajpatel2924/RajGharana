'use client'
import { useState } from 'react';
import ProductCard from './ProductCard';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const RecommendedProducts = ({ products, title = "Recommended For You" }) => {
  const [scrollPos, setScrollPos] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById('products-carousel');
    if (container) {
      const scrollAmount = 300;
      const newPos = scrollPos + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({ left: newPos, behavior: 'smooth' });
      setScrollPos(newPos);
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>

      <div className="relative">
        {/* Carousel Container */}
        <div
          id="products-carousel"
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-56">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {products.length > 4 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition hidden md:flex items-center justify-center w-10 h-10 -ml-5"
            >
              <Image src={assets.arrow_icon} alt="left" width={16} height={16} className="rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition hidden md:flex items-center justify-center w-10 h-10 -mr-5"
            >
              <Image src={assets.arrow_icon} alt="right" width={16} height={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedProducts;