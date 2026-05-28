"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import ProductRatings from "@/components/ProductRatings";
import ReviewsList from "@/components/ReviewsList";
import ProductSpecifications from "@/components/ProductSpecifications";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart, toggleWishlist, isInWishlist, getRelatedProducts, currency } = useAppContext()

    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
        if (product) {
            setRelatedProducts(getRelatedProducts(id, 4));
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    if (!productData) return <Loading />

    const isWishlisted = isInWishlist(productData._id);

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-8 pb-16">
                {/* Product Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Image Gallery */}
                    <ImageGallery images={productData.image} productName={productData.name} />

                    {/* Product Details */}
                    <div className="flex flex-col">
                        {/* Badge */}
                        {productData.badge && (
                            <span className="inline-block w-fit px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded mb-3">
                                {productData.badge}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {productData.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Image
                                        key={i}
                                        className="h-4 w-4"
                                        src={i < Math.floor(productData.rating || 4.5) ? assets.star_icon : assets.star_dull_icon}
                                        alt="star_icon"
                                    />
                                ))}
                            </div>
                            <p className="font-semibold text-gray-700">{productData.rating || 4.5} out of 5</p>
                            <p className="text-gray-500 text-sm">({productData.ratings?.length || 0} reviews)</p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <p className="text-4xl font-bold text-gray-900">
                                {currency}{productData.offerPrice}
                            </p>
                            <p className="text-lg text-gray-500 line-through mt-1">
                                {currency}{productData.price}
                            </p>
                            <p className="text-lg font-semibold text-green-600 mt-2">
                                Save {currency}{(productData.price - productData.offerPrice).toFixed(2)} ({Math.round(((productData.price - productData.offerPrice) / productData.price) * 100)}%)
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {productData.description}
                        </p>

                        <hr className="mb-6" />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <button
                                onClick={() => addToCart(productData._id)}
                                className="flex-1 py-3 px-6 bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-semibold rounded-lg"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => { addToCart(productData._id); router.push('/cart') }}
                                className="flex-1 py-3 px-6 bg-orange-600 text-white hover:bg-orange-700 transition font-semibold rounded-lg"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => toggleWishlist(productData._id)}
                                className={`py-3 px-6 rounded-lg transition font-semibold border-2 ${
                                    isWishlisted
                                        ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                                        : 'border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600'
                                }`}
                            >
                                {isWishlisted ? '❤ Saved' : '🤍 Save'}
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Free Delivery:</strong> Order now and get it delivered in 2-3 days!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="mb-12">
                    <ProductSpecifications product={productData} />
                </div>

                {/* Ratings & Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <ProductRatings productId={productData._id} />
                    </div>
                </div>

                {/* Reviews List */}
                <div className="mb-12">
                    <ReviewsList productId={productData._id} />
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="flex flex-col items-center">
                        <div className="text-center mb-8">
                            <p className="text-3xl font-bold text-gray-800">Related <span className="text-orange-600">Products</span></p>
                            <div className="w-24 h-1 bg-orange-600 mt-2 mx-auto rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mb-8">
                            {relatedProducts.map((product) => <ProductCard key={product._id} product={product} />)}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
};

export default Product;