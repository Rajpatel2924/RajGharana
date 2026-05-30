"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from "next/navigation";
import GooeyNav from "./GooeyNav";
import SearchBar from "./SearchBar";

const primaryNavItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/all-products" },
];

const Navbar = () => {
  const { isSeller, router, getCartCount, wishlistItems } = useAppContext();
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const cartCount = getCartCount();
  const activeNavIndex = pathname === "/all-products" || pathname.startsWith("/product/") ? 1 : 0;

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="RajGharana logo"
      />

      {/* Desktop Categories & Search */}
      <div className="flex items-center gap-6 lg:gap-8 max-md:hidden flex-1 px-6">
        <GooeyNav
          items={primaryNavItems}
          initialActiveIndex={activeNavIndex}
          onNavigate={router.push}
        />
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>

      {/* Right Side Icons & Auth */}
      <ul className="hidden md:flex items-center gap-4 ml-4">
        {/* Wishlist */}
        <Link href="/wishlist" className="relative hover:opacity-70 transition">
          <Image className="w-5 h-5" src={assets.heart_icon} alt="wishlist" />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link href="/cart" className="relative hover:opacity-70 transition">
          <Image className="w-5 h-5" src={assets.cart_icon} alt="cart" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border border-orange-600 px-4 py-1.5 rounded-full text-orange-600 hover:bg-orange-50 transition"
          >
            Seller
          </button>
        )}

        {isLoaded && isSignedIn && (
          <>
            <Link href="/account" className="rounded-full border border-orange-600 px-4 py-2 text-orange-600 hover:bg-orange-50 transition text-sm">
              Account
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        {isLoaded && !isSignedIn && (
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="flex items-center gap-2 hover:text-gray-900 transition text-sm">
              <Image src={assets.user_icon} alt="user icon" className="w-4 h-4" />
              Sign in
            </Link>
            <Link href="/sign-up" className="rounded-full border border-orange-600 px-4 py-2 text-orange-600 hover:bg-orange-50 transition text-sm">
              Sign up
            </Link>
          </div>
        )}
      </ul>

      {/* Mobile View */}
      <div className="flex items-center md:hidden gap-3">
        {/* Mobile Wishlist */}
        <Link href="/wishlist" className="relative">
          <Image className="w-5 h-5" src={assets.heart_icon} alt="wishlist" />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Mobile Cart */}
        <Link href="/cart" className="relative">
          <Image className="w-5 h-5" src={assets.cart_icon} alt="cart" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {cartCount}
            </span>
          )}
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-3 py-1.5 rounded-full">Seller</button>}

        {isLoaded && isSignedIn && (
          <>
            <Link href="/account" className="rounded-full border border-orange-600 px-3 py-2 text-xs text-orange-600 hover:bg-orange-50 transition">
              Account
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        {isLoaded && !isSignedIn && (
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="flex items-center gap-1 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" className="w-4 h-4" />
              <span className="text-xs">Sign in</span>
            </Link>
            <Link href="/sign-up" className="rounded-full border border-orange-600 px-3 py-1.5 text-xs text-orange-600 hover:bg-orange-50 transition">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
