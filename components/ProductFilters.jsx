'use client'
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const ProductFilters = () => {
  const { filters, setFilters, getCategories, products } = useAppContext();
  const [showFilters, setShowFilters] = useState(true);
  const categories = getCategories();

  const minPrice = 0;
  const maxPrice = 5000;

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: type === 'min'
        ? [Math.max(value, minPrice), prev.priceRange[1]]
        : [prev.priceRange[0], Math.min(value, maxPrice)]
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: [],
      priceRange: [minPrice, maxPrice],
      minRating: 0
    });
  };

  const hasActiveFilters = filters.category.length > 0 ||
                          filters.priceRange[0] > minPrice ||
                          filters.priceRange[1] < maxPrice ||
                          filters.minRating > 0;

  return (
    <div className="w-64 max-md:w-full max-md:mb-6">
      <div className="flex items-center justify-between mb-4 max-md:mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden text-orange-600"
        >
          {showFilters ? '−' : '+'}
        </button>
      </div>

      {showFilters && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 accent-orange-600"
                  />
                  <span className="text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Min: ${filters.priceRange[0]}
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded accent-orange-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Max: ${filters.priceRange[1]}
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded accent-orange-600"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Rating</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 accent-orange-600"
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Image
                        key={i}
                        className="w-3 h-3"
                        src={i < rating ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                      />
                    ))}
                    <span className="text-xs text-gray-600">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;