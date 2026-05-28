'use client'
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';

const categoryMeta = {
  Earphone: {
    label: 'Wireless audio',
    badge: 'From Rs 999',
    image: assets.apple_earphone_image,
    accent: 'text-violet-700',
    surface: 'from-violet-50 via-white to-fuchsia-50',
    glow: 'bg-violet-200/60',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M6.5 13.2V10a5.5 5.5 0 0 1 11 0v3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5.8 12.5h1.1c.9 0 1.6.7 1.6 1.6v1.8c0 .9-.7 1.6-1.6 1.6H5.8a1.8 1.8 0 0 1-1.8-1.8v-1.4c0-1 .8-1.8 1.8-1.8Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M17.1 12.5h1.1c1 0 1.8.8 1.8 1.8v1.4c0 1-.8 1.8-1.8 1.8h-1.1c-.9 0-1.6-.7-1.6-1.6v-1.8c0-.9.7-1.6 1.6-1.6Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  Headphone: {
    label: 'Studio picks',
    badge: 'Noise cancelling',
    image: assets.bose_headphone_image,
    accent: 'text-sky-700',
    surface: 'from-sky-50 via-white to-blue-50',
    glow: 'bg-sky-200/60',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4.8 13.8V10a7.2 7.2 0 0 1 14.4 0v3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 13h1.2c.9 0 1.6.7 1.6 1.6v2.8c0 .9-.7 1.6-1.6 1.6H6c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16.8 13H18c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1.2c-.9 0-1.6-.7-1.6-1.6v-2.8c0-.9.7-1.6 1.6-1.6Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  Smartphone: {
    label: 'Latest devices',
    badge: 'Top rated',
    image: assets.samsung_s23phone_image,
    accent: 'text-emerald-700',
    surface: 'from-emerald-50 via-white to-teal-50',
    glow: 'bg-emerald-200/60',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="2.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 6h4M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  Accessories: {
    label: 'Smart add-ons',
    badge: 'Gaming gear',
    image: assets.playstation_image,
    accent: 'text-indigo-700',
    surface: 'from-indigo-50 via-white to-slate-50',
    glow: 'bg-indigo-200/60',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M8.5 14.5h7M12 11v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7.1 7.8h9.8c2 0 3.6 1.6 3.6 3.6v3.3c0 1.9-1.6 3.5-3.5 3.5-.9 0-1.7-.3-2.3-.9l-.8-.8h-3.8l-.8.8c-.6.6-1.4.9-2.3.9-1.9 0-3.5-1.6-3.5-3.5v-3.3c0-2 1.6-3.6 3.6-3.6Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  Camera: {
    label: 'Capture gear',
    badge: 'Creator picks',
    image: assets.cannon_camera_image,
    accent: 'text-rose-700',
    surface: 'from-rose-50 via-white to-red-50',
    glow: 'bg-rose-200/60',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M8.8 7.5 10.2 5h3.6l1.4 2.5H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2h2.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  Laptop: {
    label: 'Work essentials',
    badge: 'Power deals',
    image: assets.macbook_image,
    accent: 'text-orange-700',
    surface: 'from-orange-50 via-white to-amber-50',
    glow: 'bg-orange-200/60',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M6 6.5h12v8.8H6V6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 17.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
};

const CategoryCards = () => {
  const { getCategories, setFilters, router } = useAppContext();
  const categories = getCategories();

  const handleCategoryClick = (category) => {
    setFilters({
      category: [category],
      priceRange: [0, 500000],
      minRating: 0
    });
    router.push('/all-products');
  };

  return (
    <section className="py-10">
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Curated departments</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Shop by Category</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Discover the essentials with polished picks for sound, work, gaming, and everyday tech.
          </p>
        </div>
        <button
          onClick={() => router.push('/all-products')}
          className="w-fit text-sm font-medium text-slate-500 transition hover:text-orange-600"
        >
          View all products
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {categories.map((category, index) => {
          const meta = categoryMeta[category] || {
            label: 'Explore products',
            badge: 'New arrivals',
            image: assets.box_icon,
            accent: 'text-slate-700',
            surface: 'from-slate-50 via-white to-gray-50',
            glow: 'bg-slate-200/60',
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                <path d="M5 7h14M7 12h10M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ),
          };

          return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            style={{ animationDelay: `${index * 70}ms` }}
            className={`animate-category-card group relative min-h-52 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br ${meta.surface} p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/80 active:translate-y-0`}
          >
            <span className={`absolute -right-8 top-8 h-28 w-28 rounded-full ${meta.glow} blur-3xl transition duration-500 group-hover:scale-125`} />
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900/80 via-orange-500 to-slate-900/80 opacity-70" />

            <div className="relative flex items-start justify-between gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white/85 ring-1 ring-black/5 shadow-sm ${meta.accent}`}>
                {meta.icon}
              </div>
              <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 shadow-sm">
                {meta.badge}
              </span>
            </div>

            <div className="relative mt-5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-950">{category}</p>
                <p className="mt-1 text-sm text-slate-500">{meta.label}</p>
                <span className="mt-5 inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 transition group-hover:text-orange-600">
                  Explore
                  <svg className="ml-2 h-3.5 w-3.5 transition group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="relative h-24 w-24 shrink-0 transition duration-500 group-hover:-translate-y-1 group-hover:scale-110">
                <Image
                  src={meta.image}
                  alt={`${category} category`}
                  fill
                  sizes="96px"
                  className="object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryCards;
