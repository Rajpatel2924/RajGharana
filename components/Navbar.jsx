"use client"

import React, { useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from "next/navigation";
import GooeyNav from "./GooeyNav";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { isSeller, router, getCartCount, wishlistItems, userAddresses, orders } = useAppContext();
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const menuRef = useRef(null);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [language, setLanguage] = useState('EN');
  const [openMenu, setOpenMenu] = useState(null);
  const cartCount = getCartCount();
  const selectedAddress = userAddresses.find(address => (address._id || address.pincode) === selectedAddressId) || userAddresses[0];
  const activeNavIndex = pathname === '/all-products' || pathname.startsWith('/product/')
    ? 1
    : pathname === '/my-orders'
      ? 4
      : 0;
  const desktopNavItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'shop', label: 'Shop', href: '/all-products' },
    { key: 'location', label: selectedAddress?.city || 'Location' },
    { key: 'language', label: language },
    { key: 'orders', label: `Returns & Orders${orders.length > 0 ? ` (${orders.length})` : ''}`, href: '/my-orders' },
  ];

  useEffect(() => {
    setSelectedAddressId(localStorage.getItem('rajgharana_delivery_address') || '');
    setLanguage(localStorage.getItem('rajgharana_language') || 'EN');
  }, []);

  useEffect(() => {
    if (!selectedAddressId && userAddresses.length > 0) {
      setSelectedAddressId(userAddresses[0]._id || userAddresses[0].pincode);
    }
  }, [selectedAddressId, userAddresses]);

  useEffect(() => {
    const closeMenu = event => {
      if (!menuRef.current?.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const chooseAddress = address => {
    const addressId = address._id || address.pincode;
    setSelectedAddressId(addressId);
    localStorage.setItem('rajgharana_delivery_address', addressId);
    setOpenMenu(null);
  };

  const chooseLanguage = nextLanguage => {
    setLanguage(nextLanguage);
    localStorage.setItem('rajgharana_language', nextLanguage);
    setOpenMenu(null);
  };

  const handleAnimatedNavSelect = item => {
    if (item.key === 'location') setOpenMenu(openMenu === 'location' ? null : 'location');
    else if (item.key === 'language') setOpenMenu(openMenu === 'language' ? null : 'language');
    else setOpenMenu(null);
  };

  return (
    <nav className="flex items-center justify-between border-b border-gray-300 px-6 py-3 text-gray-700 md:px-16 lg:px-32">
      <Image
        className="w-28 cursor-pointer md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="RajGharana logo"
      />

      <div className="flex flex-1 items-center gap-5 px-6 max-md:hidden">
        <div ref={menuRef} className="relative">
          <GooeyNav
            items={desktopNavItems}
            initialActiveIndex={activeNavIndex}
            onNavigate={router.push}
            onSelect={handleAnimatedNavSelect}
          />

          {openMenu === 'location' && (
            <div className="absolute left-24 top-full z-50 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Delivery location</p>
              {userAddresses.map(address => (
                <button
                  key={address._id || address.pincode}
                  onClick={() => chooseAddress(address)}
                  className="w-full rounded-md px-3 py-2 text-left transition hover:bg-orange-50"
                >
                  <span className="block text-sm font-medium">{address.fullName}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{address.area}, {address.city} - {address.pincode}</span>
                </button>
              ))}
              <button
                onClick={() => router.push('/add-address')}
                className="mt-1 w-full border-t border-slate-100 px-3 py-2 text-left text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                + Add a new address
              </button>
            </div>
          )}

          {openMenu === 'language' && (
            <div className="absolute left-52 top-full z-50 mt-3 w-44 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
              {[
                ['EN', 'English'],
                ['HI', 'Hindi'],
                ['GU', 'Gujarati'],
              ].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => chooseLanguage(code)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-orange-50 ${language === code ? 'font-semibold text-orange-600' : ''}`}
                >
                  {label}
                  <span className="text-xs text-slate-400">{code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-40 flex-1">
          <SearchBar />
        </div>
      </div>

      <ul className="hidden items-center gap-4 md:flex">
        <Link href="/wishlist" className="relative transition hover:opacity-70">
          <Image className="h-5 w-5" src={assets.heart_icon} alt="wishlist" />
          {wishlistItems.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs text-white">
              {wishlistItems.length}
            </span>
          )}
        </Link>
        <Link href="/cart" className="relative transition hover:opacity-70">
          <Image className="h-5 w-5" src={assets.cart_icon} alt="cart" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>
        {isSeller && (
          <button onClick={() => router.push('/seller')} className="rounded-full border border-orange-600 px-4 py-1.5 text-xs text-orange-600 transition hover:bg-orange-50">
            Seller
          </button>
        )}
        {isLoaded && isSignedIn && (
          <>
            <Link href="/account" className="rounded-full border border-orange-600 px-4 py-2 text-sm text-orange-600 transition hover:bg-orange-50">Account</Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        {isLoaded && !isSignedIn && (
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="flex items-center gap-2 text-sm transition hover:text-gray-900">
              <Image src={assets.user_icon} alt="user icon" className="h-4 w-4" />
              Sign in
            </Link>
            <Link href="/sign-up" className="rounded-full border border-orange-600 px-4 py-2 text-sm text-orange-600 transition hover:bg-orange-50">Sign up</Link>
          </div>
        )}
      </ul>

      <div className="flex items-center gap-3 md:hidden">
        <Link href="/my-orders" className="text-xs font-medium text-slate-600">Orders</Link>
        <Link href="/wishlist" className="relative">
          <Image className="h-5 w-5" src={assets.heart_icon} alt="wishlist" />
          {wishlistItems.length > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-xs text-white">{wishlistItems.length}</span>}
        </Link>
        <Link href="/cart" className="relative">
          <Image className="h-5 w-5" src={assets.cart_icon} alt="cart" />
          {cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-xs text-white">{cartCount}</span>}
        </Link>
        {isLoaded && isSignedIn && <UserButton afterSignOutUrl="/" />}
        {isLoaded && !isSignedIn && <Link href="/sign-in" className="text-xs">Sign in</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
