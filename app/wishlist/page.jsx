'use client'
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/assets/assets';

const WishlistPage = () => {
  const { getWishlistProducts, addToCart, toggleWishlist, currency, formatPrice, router } = useAppContext();
  const wishlistProducts = getWishlistProducts();

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8 min-h-screen">
        <div className="mb-8">
          <p className="text-3xl font-semibold text-gray-800">My Wishlist</p>
          <p className="text-gray-500 mt-2">{wishlistProducts.length} items saved</p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div key={product._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="relative bg-gray-100 h-48 flex items-center justify-center cursor-pointer group">
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                    onClick={() => router.push('/product/' + product._id)}
                  />
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4">
                  <p className="font-semibold text-gray-800 line-clamp-2 text-sm mb-1">{product.name}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold">{product.rating}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Image
                          key={i}
                          src={i < Math.floor(product.rating) ? assets.star_icon : assets.star_dull_icon}
                          alt="star"
                          width={12}
                          height={12}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-lg font-bold text-gray-900">{currency}{formatPrice(product.offerPrice)}</p>
                    <p className="text-xs text-gray-400 line-through">{currency}{formatPrice(product.price)}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Save {currency}{formatPrice(product.price - product.offerPrice)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product._id);
                      router.push('/cart');
                    }}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image src={assets.heart_icon} alt="empty wishlist" width={64} height={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
            <Link href="/all-products" className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
