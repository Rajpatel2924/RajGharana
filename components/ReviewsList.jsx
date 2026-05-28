'use client'
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const ReviewsList = ({ productId }) => {
  const { products } = useAppContext();
  const product = products.find(p => p._id === productId);

  if (!product?.ratings || product.ratings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Customer Reviews</h3>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm">
          Write a Review
        </button>
      </div>

      <div className="space-y-4">
        {product.ratings.map((review, index) => (
          <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Image
                        key={i}
                        src={i < Math.floor(review.rating) ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        width={14}
                        height={14}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{review.rating}.0</span>
                </div>
                <p className="text-xs text-gray-500">{review.author}</p>
              </div>
              {review.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                  ✓ Verified Purchase
                </span>
              )}
            </div>

            {/* Review Title and Body (if available) */}
            <p className="text-gray-700 text-sm leading-relaxed mt-2">{review.comment}</p>

            {/* Helpful Actions */}
            <div className="flex items-center gap-6 mt-3">
              <button className="text-xs text-gray-500 hover:text-gray-700 transition">
                👍 Helpful
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700 transition">
                👎 Not Helpful
              </button>
            </div>
          </div>
        ))}
      </div>

      {product.ratings.length > 5 && (
        <button className="w-full mt-6 py-2 text-orange-600 hover:text-orange-700 transition font-medium text-sm border border-orange-600 rounded-lg hover:bg-orange-50">
          View All Reviews
        </button>
      )}
    </div>
  );
};

export default ReviewsList;