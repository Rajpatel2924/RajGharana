'use client';

import React from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Link from "next/link";

const Account = () => {
  const { userData, router } = useAppContext();

  if (!userData) {
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
      <main className="min-h-screen px-6 md:px-16 lg:px-32 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-sm border rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-4">My Account</h1>

          <section className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="rounded-xl border p-5">
              <h2 className="text-lg font-medium mb-2">Profile</h2>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium mb-3">{userData.name}</p>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium mb-3">{userData.email}</p>
            </div>
            <div className="rounded-xl border p-5">
              <h2 className="text-lg font-medium mb-2">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push('/my-orders')}
                  className="w-full text-left rounded-lg border border-orange-600 bg-orange-50 px-4 py-3 text-orange-700 hover:bg-orange-100"
                >
                  View My Orders
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/add-address')}
                  className="w-full text-left rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 hover:bg-slate-100"
                >
                  Manage Addresses
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-5">
            <h2 className="text-lg font-medium mb-4">Account Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Orders</p>
                <p className="mt-2 text-2xl font-semibold">View</p>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Addresses</p>
                <p className="mt-2 text-2xl font-semibold">Manage</p>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Support</p>
                <Link href="/" className="mt-2 block text-orange-600 hover:underline">
                  Contact us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Account;
