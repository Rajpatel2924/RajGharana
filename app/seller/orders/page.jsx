'use client';

import { assets } from "@/assets/assets";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const formatOrderDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const getCurrentStatus = (order) => {
    const timeline = Array.isArray(order.timeline) ? order.timeline : [];
    const completedSteps = timeline.filter(step => step.completed || Date.now() >= step.date);

    return completedSteps.at(-1)?.status || order.status || 'Order Placed';
};

const Orders = () => {

    const { currency, formatPrice, orders } = useAppContext();

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            <div className="md:p-10 p-4 space-y-5">
                <div>
                    <h2 className="text-lg font-medium">Orders</h2>
                    <p className="mt-1 text-sm text-gray-500">All checkout orders placed by customers.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="max-w-4xl rounded-md border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                        No customer orders yet.
                    </div>
                ) : (
                    <div className="max-w-5xl rounded-md bg-white">
                        {orders.map((order) => (
                            <div key={order._id} className="flex flex-col gap-5 border-t border-gray-300 p-5 md:flex-row md:justify-between">
                                <div className="flex flex-1 gap-5 md:max-w-96">
                                    <Image
                                        className="h-16 w-16 rounded-lg bg-gray-100 p-3 object-contain"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-2">
                                        <span className="font-medium">
                                            {order.items.map((item) => `${item.product.name} x ${item.quantity}`).join(", ")}
                                        </span>
                                        <span>Items : {order.items.length}</span>
                                        <span className="text-gray-500">Order ID: {order._id}</span>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-medium">{order.address?.fullName}</span>
                                        <br />
                                        <span>{order.address?.area}</span>
                                        <br />
                                        <span>{`${order.address?.city}, ${order.address?.state}`}</span>
                                        <br />
                                        <span>{order.address?.phoneNumber}</span>
                                    </p>
                                </div>
                                <p className="font-medium my-auto">{currency}{formatPrice(order.amount)}</p>
                                <div>
                                    <p className="flex flex-col gap-1">
                                        <span>Status : {getCurrentStatus(order)}</span>
                                        <span>Method : {order.paymentMethod || 'Cash on Delivery'}</span>
                                        <span>Date : {formatOrderDate(order.date)}</span>
                                        <span>Payment : {order.paymentStatus || 'Pending'}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
