'use client';

import { assets } from "@/assets/assets";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const formatOrderDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const getOrderTimeline = (order) => {
    const fallbackDate = order.date || Date.now();
    const fallbackTimeline = [
        { status: 'Order Placed', description: 'We have received your order.', date: fallbackDate },
        { status: 'Packed', description: 'Your item is being prepared for dispatch.', date: fallbackDate + 24 * 60 * 60 * 1000 },
        { status: 'Shipped', description: 'Your package has left the fulfillment center.', date: fallbackDate + 2 * 24 * 60 * 60 * 1000 },
        { status: 'Out for Delivery', description: 'Your package is on the way.', date: fallbackDate + 3 * 24 * 60 * 60 * 1000 },
        { status: 'Delivered', description: 'Package delivered to your address.', date: fallbackDate + 4 * 24 * 60 * 60 * 1000 },
    ];

    return Array.isArray(order.timeline) && order.timeline.length > 0 ? order.timeline : fallbackTimeline;
};

const getCurrentStatus = (order) => {
    const now = Date.now();
    const timeline = getOrderTimeline(order);
    const completedSteps = timeline.filter(step => step.completed || now >= step.date);

    return completedSteps.at(-1)?.status || timeline[0]?.status || order.status || 'Order Placed';
};

const MyOrders = () => {

    const { currency, formatPrice, orders, router } = useAppContext();

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 px-6 py-8 md:px-16 lg:px-32">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-orange-600">Orders and returns</p>
                            <h1 className="mt-3 text-3xl font-semibold text-slate-950">My Orders</h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Track every order from checkout to delivery.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/all-products')}
                            className="w-fit rounded-full bg-orange-600 px-5 py-3 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            Continue shopping
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <Image className="mx-auto h-16 w-16 object-contain" src={assets.box_icon} alt="No orders" />
                            <h2 className="mt-5 text-xl font-semibold text-slate-950">No orders yet</h2>
                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                                Orders placed from checkout will appear here with status, payment, address, and delivery tracking.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 space-y-5">
                            {orders.map((order) => {
                                const timeline = getOrderTimeline(order);
                                const currentStatus = getCurrentStatus(order);
                                const deliveryStep = timeline[timeline.length - 1];
                                const itemSummary = order.items
                                    .map((item) => `${item.product.name} x ${item.quantity}`)
                                    .join(', ');

                                return (
                                    <article key={order._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex gap-4">
                                                <Image
                                                    className="h-16 w-16 rounded-2xl bg-slate-100 p-3 object-contain"
                                                    src={assets.box_icon}
                                                    alt="Order package"
                                                />
                                                <div>
                                                    <p className="text-sm text-slate-500">Order ID: {order._id}</p>
                                                    <h2 className="mt-2 max-w-2xl text-lg font-semibold text-slate-950">{itemSummary}</h2>
                                                    <p className="mt-1 text-sm text-slate-600">Placed on {formatOrderDate(order.date)}</p>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm lg:min-w-64">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-slate-500">Status</span>
                                                    <span className="font-semibold text-slate-950">{currentStatus}</span>
                                                </div>
                                                <div className="mt-2 flex justify-between gap-4">
                                                    <span className="text-slate-500">Total</span>
                                                    <span className="font-semibold text-slate-950">{currency}{formatPrice(order.amount)}</span>
                                                </div>
                                                <div className="mt-2 flex justify-between gap-4">
                                                    <span className="text-slate-500">Payment</span>
                                                    <span className="font-medium text-slate-800">{order.paymentStatus || 'Pending'}</span>
                                                </div>
                                                <div className="mt-2 flex justify-between gap-4">
                                                    <span className="text-slate-500">Method</span>
                                                    <span className="font-medium text-slate-800">{order.paymentMethod || 'Cash on Delivery'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.25fr]">
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
                                                <h3 className="font-semibold text-slate-950">Delivery address</h3>
                                                <div className="mt-3 space-y-1 text-slate-600">
                                                    <p className="font-medium text-slate-900">{order.address?.fullName}</p>
                                                    <p>{order.address?.area}</p>
                                                    <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                                                    <p>{order.address?.phoneNumber}</p>
                                                </div>
                                                <p className="mt-4 text-sm font-medium text-orange-700">
                                                    Expected delivery by {formatOrderDate(deliveryStep.date)}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                                <h3 className="text-sm font-semibold text-slate-950">Package tracking</h3>
                                                <div className="mt-5 grid gap-4 sm:grid-cols-5">
                                                    {timeline.map((step, index) => {
                                                        const isCompleted = step.completed || Date.now() >= step.date;
                                                        const isActive = step.status === currentStatus;

                                                        return (
                                                            <div key={`${order._id}-${step.status}`} className="relative">
                                                                {index < timeline.length - 1 && (
                                                                    <div className={`absolute left-4 top-4 hidden h-0.5 w-full sm:block ${isCompleted ? 'bg-orange-500' : 'bg-slate-200'}`} />
                                                                )}
                                                                <div className="relative z-10 flex gap-3 sm:block">
                                                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                                                        isCompleted
                                                                            ? 'border-orange-600 bg-orange-600 text-white'
                                                                            : isActive
                                                                                ? 'border-orange-600 bg-white text-orange-600'
                                                                                : 'border-slate-300 bg-white text-slate-400'
                                                                    }`}>
                                                                        {index + 1}
                                                                    </span>
                                                                    <div className="sm:mt-3">
                                                                        <p className="text-sm font-semibold text-slate-900">{step.status}</p>
                                                                        <p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>
                                                                        <p className="mt-1 text-xs font-medium text-slate-500">{formatOrderDate(step.date)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MyOrders;
