'use client'
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

const CategoryCards = () => {
  const { getCategories, setFilters, router } = useAppContext();
  const categories = getCategories();

  const categoryColors = {
    'Earphone': 'from-purple-500 to-purple-600',
    'Headphone': 'from-blue-500 to-blue-600',
    'Smartphone': 'from-green-500 to-green-600',
    'Laptop': 'from-orange-500 to-orange-600',
    'Camera': 'from-red-500 to-red-600',
    'Accessories': 'from-indigo-500 to-indigo-600'
  };

  const handleCategoryClick = (category) => {
    setFilters({
      category: [category],
      priceRange: [0, 500000],
      minRating: 0
    });
    router.push('/all-products');
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`rounded-lg py-6 px-4 text-white font-semibold transition-all hover:shadow-lg active:scale-95 bg-gradient-to-br ${
              categoryColors[category] || 'from-gray-500 to-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">
              {category === 'Earphone' && '🎧'}
              {category === 'Headphone' && '🎵'}
              {category === 'Smartphone' && '📱'}
              {category === 'Laptop' && '💻'}
              {category === 'Camera' && '📷'}
              {category === 'Accessories' && '🎮'}
            </div>
            <p className="text-sm">{category}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;