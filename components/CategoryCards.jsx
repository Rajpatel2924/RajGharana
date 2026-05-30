'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { useMemo } from 'react';
import CircularGallery from './CircularGallery';

const categoryMeta = {
  Earphone: { label: 'Wireless audio', image: assets.apple_earphone_image },
  Headphone: { label: 'Studio picks', image: assets.bose_headphone_image },
  Smartphone: { label: 'Latest devices', image: assets.samsung_s23phone_image },
  Accessories: { label: 'Smart add-ons', image: assets.playstation_image },
  Camera: { label: 'Capture gear', image: assets.cannon_camera_image },
  Laptop: { label: 'Work essentials', image: assets.macbook_image },
};

const CategoryCards = () => {
  const { getCategories, setFilters, router } = useAppContext();
  const categories = getCategories();
  const categoryKey = categories.join('|');
  const galleryItems = useMemo(() => categoryKey.split('|').filter(Boolean).map(category => ({
    category,
    image: (categoryMeta[category]?.image || assets.box_icon).src,
    text: category,
  })), [categoryKey]);

  const handleCategoryClick = (category) => {
    setFilters({
      category: [category],
      priceRange: [0, 500000],
      minRating: 0,
      badge: null,
    });
    router.push('/all-products');
  };

  return (
    <section className="py-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Curated departments</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Shop by Category</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Drag, scroll, or tap a category to browse polished picks for sound, work, gaming, and everyday tech.
          </p>
        </div>
        <button
          onClick={() => router.push('/all-products')}
          className="w-fit text-sm font-medium text-slate-500 transition hover:text-orange-600"
        >
          View all products
        </button>
      </div>

      <div className="relative h-[330px] overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 via-white to-orange-50/40 shadow-sm md:h-[390px]">
        <CircularGallery
          items={galleryItems}
          bend={2.3}
          textColor="#0f172a"
          borderRadius={0.08}
          scrollSpeed={2}
          scrollEase={0.065}
          onSelect={handleCategoryClick}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center">
          <span className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
            Drag to explore. Tap the centered card to shop.
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Shop by category">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
          >
            {categoryMeta[category]?.label || category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
