'use client'
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, products, router } = useAppContext();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      router.push('/all-products');
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push('/product/' + productId);
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative flex items-center bg-gray-100 rounded-md">
        <Image
          className="h-4 w-4 ml-3 text-gray-400"
          src={assets.search_icon}
          alt="search"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          className="flex-1 px-3 py-2 bg-gray-100 outline-none text-sm"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-50">
          {suggestions.map((product) => (
            <div
              key={product._id}
              onClick={() => handleSuggestionClick(product._id)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm"
            >
              <p className="font-medium text-gray-800 truncate">{product.name}</p>
              <p className="text-gray-500 text-xs truncate">{product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;