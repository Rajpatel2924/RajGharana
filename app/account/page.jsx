'use client';

import {
  SignInButton,
  SignOutButton,
  useClerk,
  useUser,
} from '@clerk/nextjs';
import { orderDummyData, addressDummyData } from '@/assets/assets';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openUserProfile } = useClerk();
  const { userAddresses } = useAppContext();
  const [showCommunicationPreferences, setShowCommunicationPreferences] = useState(false);
  const [communicationPreferences, setCommunicationPreferences] = useState({
    orderUpdates: true,
    offers: false,
    recommendations: true,
    smsAlerts: false,
  });
  const recentOrders = orderDummyData.slice(0, 3);
  const defaultAddress = userAddresses[0] || addressDummyData[0];
  const displayName = user?.fullName || user?.firstName || 'Customer';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || 'No email available';

  useEffect(() => {
    const savedPreferences = localStorage.getItem('rajgharana_communication_preferences');

    if (!savedPreferences) return;

    try {
      setCommunicationPreferences({
        ...communicationPreferences,
        ...JSON.parse(savedPreferences),
      });
    } catch (e) {
      localStorage.removeItem('rajgharana_communication_preferences');
    }
  }, []);

  const updateCommunicationPreference = (key) => {
    setCommunicationPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('rajgharana_communication_preferences', JSON.stringify(next));
      return next;
    });
  };

  const saveCommunicationPreferences = () => {
    localStorage.setItem('rajgharana_communication_preferences', JSON.stringify(communicationPreferences));
    toast.success('Communication preferences saved.');
    setShowCommunicationPreferences(false);
  };

  const openAccountProfile = () => {
    openUserProfile();
  };

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <div className="px-6 md:px-16 lg:px-32 py-8">
          {isSignedIn && (
            <div className="space-y-8">
              <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Account dashboard</p>
                    <h1 className="mt-3 text-4xl font-semibold text-slate-900">Hello, {displayName}</h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600">
                      Manage your orders, shipping addresses, payment methods, and account settings—all from one place.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/my-orders" className="rounded-full bg-orange-600 px-5 py-3 text-sm font-medium text-white hover:bg-orange-700">
                      Your Orders
                    </Link>
                    <Link href="/add-address" className="rounded-full border border-orange-600 bg-white px-5 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50">
                      Addresses
                    </Link>
                    <SignOutButton>
                      <button className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        Sign out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </section>

              <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
                <aside className="space-y-6">
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Account details</h2>
                    <div className="mt-6 space-y-4 text-sm text-slate-600">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Name</p>
                        <p className="font-medium text-slate-900">{displayName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Email</p>
                        <p className="font-medium text-slate-900">{userEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Joined</p>
                        <p className="font-medium text-slate-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
                    <div className="mt-6 flex flex-col gap-3 text-sm">
                      <Link href="/my-orders" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 hover:bg-slate-100">
                        Orders & returns
                      </Link>
                      <Link href="/add-address" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 hover:bg-slate-100">
                        Manage addresses
                      </Link>
                      <button onClick={openAccountProfile} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-800 hover:bg-slate-100">
                        Account settings
                      </button>
                      <Link href="/contact" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-800 hover:bg-slate-100">
                        Customer service
                      </Link>
                    </div>
                  </div>
                </aside>

                <section className="space-y-6">
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">At a glance</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-3xl bg-slate-50 p-5 text-sm">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Recent orders</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{orderDummyData.length}</p>
                        <p className="mt-2 text-sm text-slate-500">orders placed</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5 text-sm">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Saved addresses</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{addressDummyData.length}</p>
                        <p className="mt-2 text-sm text-slate-500">delivery addresses</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5 text-sm">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Saved cards</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">0</p>
                        <p className="mt-2 text-sm text-slate-500">payment methods</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5 text-sm">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Support tickets</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">0</p>
                        <p className="mt-2 text-sm text-slate-500">help requests</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
                        <p className="mt-2 text-sm text-slate-500">Your latest three orders are shown here.</p>
                      </div>
                      <Link href="/my-orders" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                        View all
                      </Link>
                    </div>
                    <div className="mt-6 space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="text-sm text-slate-500">Order ID: {order._id}</p>
                              <p className="mt-2 text-base font-semibold text-slate-900">{order.items.map((item) => item.product.name).join(', ')}</p>
                              <p className="mt-1 text-sm text-slate-600">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1 text-right">
                              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Status</p>
                              <p className="font-semibold text-slate-900">{order.status}</p>
                              <p className="text-sm text-slate-600">${order.amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                      <h2 className="text-lg font-semibold text-slate-900">Default shipping address</h2>
                      <div className="mt-5 space-y-3 text-sm text-slate-600">
                        <p className="font-medium text-slate-900">{defaultAddress.fullName}</p>
                        <p>{defaultAddress.area}</p>
                        <p>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
                        <p>{defaultAddress.phoneNumber}</p>
                      </div>
                      <Link href="/add-address" className="mt-5 inline-flex rounded-full border border-orange-600 bg-white px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50">
                        Edit address
                      </Link>
                    </div>
                    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                      <h2 className="text-lg font-semibold text-slate-900">Payment methods</h2>
                      <p className="mt-4 text-sm text-slate-600">No saved payment methods yet. Add a card or use Razorpay at checkout for easier purchases.</p>
                      <Link href="/cart" className="mt-5 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-medium text-white hover:bg-orange-700">
                        Add payment method
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Account settings</h2>
                    <div className="mt-5 grid gap-3 text-sm">
                      <button onClick={openAccountProfile} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-800 hover:bg-slate-100">
                        Manage personal information
                      </button>
                      <button onClick={openAccountProfile} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-800 hover:bg-slate-100">
                        Change password
                      </button>
                      <button
                        onClick={() => setShowCommunicationPreferences(prev => !prev)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-800 hover:bg-slate-100"
                      >
                        Communication preferences
                      </button>
                    </div>
                    {showCommunicationPreferences && (
                      <div className="mt-5 rounded-3xl border border-orange-100 bg-orange-50/40 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">Communication preferences</h3>
                            <p className="mt-1 text-sm text-slate-600">Choose which updates RajGharana can send you.</p>
                          </div>
                          <button
                            onClick={() => setShowCommunicationPreferences(false)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            Close
                          </button>
                        </div>
                        <div className="mt-5 grid gap-3">
                          {[
                            ['orderUpdates', 'Order and delivery updates', 'Important messages about purchases and returns.'],
                            ['offers', 'Deals and promotional offers', 'Sale alerts, coupons, and limited-time offers.'],
                            ['recommendations', 'Product recommendations', 'Personalized product suggestions based on shopping activity.'],
                            ['smsAlerts', 'SMS alerts', 'Short delivery and account updates on your phone.'],
                          ].map(([key, title, description]) => (
                            <label key={key} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                              <span>
                                <span className="block text-sm font-medium text-slate-900">{title}</span>
                                <span className="mt-1 block text-xs text-slate-500">{description}</span>
                              </span>
                              <input
                                type="checkbox"
                                checked={communicationPreferences[key]}
                                onChange={() => updateCommunicationPreference(key)}
                                className="h-5 w-5 accent-orange-600"
                              />
                            </label>
                          ))}
                        </div>
                        <button
                          onClick={saveCommunicationPreferences}
                          className="mt-5 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
                        >
                          Save preferences
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {!isSignedIn && (
            <div className="rounded-3xl bg-white border border-slate-200 p-10 shadow-sm">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Member sign in</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">Sign in to view your account</h2>
                <p className="mt-3 text-sm text-slate-600">
                  Sign in to access your orders, addresses, payment methods, and saved preferences.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <SignInButton>
                    <button className="rounded-full bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700">
                      Sign in
                    </button>
                  </SignInButton>
                  <Link href="/sign-up" className="rounded-full border border-orange-600 bg-white px-6 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50">
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
