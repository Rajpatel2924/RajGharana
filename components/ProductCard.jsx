import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {

    const { currency, router, toggleWishlist, isInWishlist, getRatingBreakdown } = useAppContext()
    const isWishlisted = isInWishlist(product._id);
    const ratingData = getRatingBreakdown(product._id);

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        toggleWishlist(product._id);
    };

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
                {product.badge && (
                    <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                        {product.badge}
                    </span>
                )}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                    <Image
                        className="h-4 w-4"
                        src={isWishlisted ? assets.heart_icon : assets.heart_icon}
                        alt="heart_icon"
                        style={{ filter: isWishlisted ? 'invert(0.2) sepia(1) saturate(5) hue-rotate(0deg)' : 'none' }}
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>

            {/* Rating Section */}
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-semibold">{ratingData.averageRating}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(ratingData.averageRating)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500">({ratingData.totalReviews})</p>
            </div>

            <div className="flex items-end justify-between w-full mt-2">
                <div>
                    <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                    <p className="text-xs text-gray-400 line-through">{currency}{product.price}</p>
                </div>
                <button className=" max-sm:hidden px-3 py-1.5 text-white bg-orange-600 border-0 rounded-full text-xs hover:bg-orange-700 transition">
                    Add
                </button>
            </div>
        </div>
    )
}

export default ProductCard