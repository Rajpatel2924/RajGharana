'use client'
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const ProductRatings = ({ productId }) => {
  const { getRatingBreakdown } = useAppContext();
  const ratingData = getRatingBreakdown(productId);
  const { averageRating, totalReviews } = ratingData;

  if (totalReviews === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Ratings & Reviews</h3>

      {/* Overall Rating */}
      <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
          <div className="flex items-center gap-1 justify-center mt-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Image
                key={i}
                src={i < Math.floor(averageRating) ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                width={16}
                height={16}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{totalReviews} reviews</p>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = ratingData[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600 w-8">{stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-semibold text-green-700">{Math.round((ratingData[5] / totalReviews) * 100)}%</p>
          <p className="text-xs text-green-600">5 Stars</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-700">{Math.round(((ratingData[4] + ratingData[3]) / totalReviews) * 100)}%</p>
          <p className="text-xs text-blue-600">3-4 Stars</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm font-semibold text-red-700">{Math.round(((ratingData[2] + ratingData[1]) / totalReviews) * 100)}%</p>
          <p className="text-xs text-red-600">1-2 Stars</p>
        </div>
      </div>
    </div>
  );
};

export default ProductRatings;