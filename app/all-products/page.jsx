'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {

    const { getFilteredProducts, sortBy, setSortBy } = useAppContext();
    const filteredProducts = getFilteredProducts;

    return (
        <>
            <Navbar />
            <div className="flex flex-col lg:flex-row px-6 md:px-16 lg:px-32 py-8 gap-8">
                {/* Filters Sidebar */}
                <ProductFilters />

                {/* Products Section */}
                <div className="flex-1">
                    {/* Sorting and Results Info */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <p className="text-2xl font-semibold text-gray-800">All Products</p>
                            <p className="text-sm text-gray-500 mt-1">Showing {filteredProducts.length} results</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <label className="text-sm text-gray-600 mr-2">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                            >
                                <option value="relevance">Relevance</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <p className="text-gray-500 text-lg">No products found matching your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
