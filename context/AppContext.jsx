'use client'
import { addressDummyData, productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useMemo } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY || '₹'
    const formatPrice = (amount) => Number(amount || 0).toLocaleString('en-IN')
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [userAddresses, setUserAddresses] = useState([])

    // New state for Amazon-like features
    const [wishlistItems, setWishlistItems] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState({
        category: [],
        priceRange: [0, 500000],
        minRating: 0,
        badge: null
    })
    const [sortBy, setSortBy] = useState("relevance") // relevance, price-low, price-high, rating, newest

    const wishlistStorageKey = 'rajgharana_wishlist';
    const addressStorageKey = 'rajgharana_addresses';
    const sellerProductsStorageKey = 'rajgharana_seller_products';

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const newStorageWishlist = localStorage.getItem(wishlistStorageKey);
        const legacyWishlist = localStorage.getItem('quickcart_wishlist');
        const savedWishlist = newStorageWishlist || legacyWishlist;

        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));

                if (!newStorageWishlist && legacyWishlist) {
                    localStorage.setItem(wishlistStorageKey, legacyWishlist);
                    localStorage.removeItem('quickcart_wishlist');
                }
            } catch (e) {
                setWishlistItems([]);
            }
        }
    }, [])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlistItems));
    }, [wishlistItems, wishlistStorageKey])

    useEffect(() => {
        const savedAddresses = localStorage.getItem(addressStorageKey);

        if (savedAddresses) {
            try {
                const parsedAddresses = JSON.parse(savedAddresses);
                setUserAddresses(Array.isArray(parsedAddresses) ? parsedAddresses : addressDummyData);
                return;
            } catch (e) {
                setUserAddresses(addressDummyData);
                return;
            }
        }

        setUserAddresses(addressDummyData);
        localStorage.setItem(addressStorageKey, JSON.stringify(addressDummyData));
    }, [addressStorageKey])

    useEffect(() => {
        if (userAddresses.length > 0) {
            localStorage.setItem(addressStorageKey, JSON.stringify(userAddresses));
        }
    }, [userAddresses, addressStorageKey])

    const fetchProductData = async () => {
        const savedSellerProducts = localStorage.getItem(sellerProductsStorageKey);

        if (savedSellerProducts) {
            try {
                const parsedProducts = JSON.parse(savedSellerProducts);
                setProducts([
                    ...(Array.isArray(parsedProducts) ? parsedProducts : []),
                    ...productsDummyData
                ]);
                return;
            } catch (e) {
                setProducts(productsDummyData);
                return;
            }
        }

        setProducts(productsDummyData)
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addAddress = (address) => {
        const newAddress = {
            ...address,
            _id: `local_${Date.now()}`,
        };

        setUserAddresses(prev => [newAddress, ...prev]);
        return newAddress;
    }

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            _id: `seller_${Date.now()}`,
            userId: userData?._id || 'local_seller',
            rating: 0,
            ratings: [],
            bestseller: false,
            badge: 'New',
            date: Date.now(),
            __v: 0,
        };

        const savedSellerProducts = localStorage.getItem(sellerProductsStorageKey);
        let sellerProducts = [];

        if (savedSellerProducts) {
            try {
                const parsedProducts = JSON.parse(savedSellerProducts);
                sellerProducts = Array.isArray(parsedProducts) ? parsedProducts : [];
            } catch (e) {
                sellerProducts = [];
            }
        }

        localStorage.setItem(sellerProductsStorageKey, JSON.stringify([newProduct, ...sellerProducts]));
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
    }

    // Wishlist functions
    const toggleWishlist = (productId) => {
        setWishlistItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    }

    const isInWishlist = (productId) => {
        return wishlistItems.includes(productId);
    }

    const getWishlistProducts = () => {
        return products.filter(product => wishlistItems.includes(product._id));
    }

    // Search function
    const searchProducts = (query) => {
        return products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filter and sort products
    const getFilteredProducts = useMemo(() => {
        let filtered = products;

        // Apply search
        if (searchQuery) {
            filtered = searchProducts(searchQuery);
        }

        // Apply category filter
        if (filters.category.length > 0) {
            filtered = filtered.filter(product =>
                filters.category.includes(product.category)
            );
        }

        // Apply price range filter
        filtered = filtered.filter(product =>
            product.offerPrice >= filters.priceRange[0] &&
            product.offerPrice <= filters.priceRange[1]
        );

        // Apply rating filter
        if (filters.minRating > 0) {
            filtered = filtered.filter(product =>
                (product.rating || 4.5) >= filters.minRating
            );
        }

        if (filters.badge) {
            filtered = filtered.filter(product => product.badge === filters.badge);
        }

        // Apply sorting
        const sorted = [...filtered];
        switch (sortBy) {
            case "price-low":
                sorted.sort((a, b) => a.offerPrice - b.offerPrice);
                break;
            case "price-high":
                sorted.sort((a, b) => b.offerPrice - a.offerPrice);
                break;
            case "rating":
                sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
                break;
            case "newest":
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "relevance":
            default:
                // Keep original order or by popularity
                sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        }

        return sorted;
    }, [products, searchQuery, filters, sortBy])

    // Get related products (same category)
    const getRelatedProducts = (productId, limit = 4) => {
        const product = products.find(p => p._id === productId);
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p._id !== productId)
            .slice(0, limit);
    }

    // Get bestsellers
    const getBestsellers = (limit = 5) => {
        return products
            .filter(p => p.bestseller)
            .slice(0, limit);
    }

    // Get products by category
    const getProductsByCategory = (category, limit = 4) => {
        return products
            .filter(p => p.category === category)
            .slice(0, limit);
    }

    // Get unique categories
    const getCategories = () => {
        return [...new Set(products.map(p => p.category))];
    }

    // Get rating breakdown for a product
    const getRatingBreakdown = (productId) => {
        const product = products.find(p => p._id === productId);
        if (!product || !product.ratings) {
            return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, averageRating: 0, totalReviews: 0 };
        }

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        product.ratings.forEach(review => {
            const star = Math.floor(review.rating);
            if (breakdown.hasOwnProperty(star)) {
                breakdown[star]++;
            }
        });

        const total = product.ratings.length;
        const avgRating = total > 0
            ? (product.ratings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
            : 0;

        return {
            ...breakdown,
            averageRating: parseFloat(avgRating),
            totalReviews: total
        };
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
    }

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        currency, formatPrice, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        addProduct,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        userAddresses, addAddress,

        // New Amazon-like features
        wishlistItems, toggleWishlist, isInWishlist, getWishlistProducts,
        searchQuery, setSearchQuery, searchProducts,
        filters, setFilters,
        sortBy, setSortBy,
        getFilteredProducts,
        getRelatedProducts,
        getBestsellers,
        getProductsByCategory,
        getCategories,
        getRatingBreakdown
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
