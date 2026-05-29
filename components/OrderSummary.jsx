import { userDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import RazorpayButton from "./RazorpayButton";
import toast from "react-hot-toast";

const paymentOptions = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay by cash or UPI when your order arrives.",
  },
  {
    id: "upi",
    title: "UPI",
    description: "Pay using Google Pay, PhonePe, Paytm, or any UPI app.",
    method: { upi: true },
  },
  {
    id: "card",
    title: "Credit or Debit Card",
    description: "Visa, Mastercard, RuPay, and other major cards.",
    method: { card: true },
  },
  {
    id: "netbanking",
    title: "Net Banking",
    description: "Pay directly from your bank account.",
    method: { netbanking: true },
  },
  {
    id: "wallet",
    title: "Wallets",
    description: "Use supported mobile wallets through Razorpay.",
    method: { wallet: true },
  },
  {
    id: "emi",
    title: "EMI",
    description: "Check available EMI plans during payment.",
    method: { emi: true },
  },
  {
    id: "paylater",
    title: "Pay Later",
    description: "Use supported pay-later providers if eligible.",
    method: { paylater: true },
  },
];

const OrderSummary = () => {

  const { currency, formatPrice, router, getCartCount, getCartAmount, setCartItems, userAddresses } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const selectedPaymentOption = paymentOptions.find(option => option.id === paymentMethod) || paymentOptions[0];

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address.');
      return;
    }

    if (getCartCount() === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    try {
      // Here you can save the order to your database
      // For now, we'll just redirect to order confirmation
      toast.success('Order placed successfully!');
      setCartItems({});
      router.push('/order-placed');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePaymentSuccess = async () => {
    await placeOrder();
  }

  const handlePaymentFailure = (error) => {
    toast.error(`Payment failed: ${error}`);
  }

  const getTotalAmount = () => {
    const subtotal = getCartAmount();
    const tax = Math.floor(subtotal * 0.02);
    return subtotal + tax;
  }

  const razorpayConfigured = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  useEffect(() => {
    if (!selectedAddress && userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0]);
    }
  }, [selectedAddress, userAddresses])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : userAddresses.length > 0 ? "Select Address" : "Add a Shipping Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address) => (
                  <li
                    key={address._id || `${address.phoneNumber}-${address.pincode}`}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            {paymentOptions.map(option => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 border bg-white px-4 py-3 text-sm transition ${
                  paymentMethod === option.id
                    ? "border-orange-500 ring-1 ring-orange-500/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={() => setPaymentMethod(option.id)}
                  className="mt-1 accent-orange-600"
                />
                <span>
                  <span className="block font-medium text-gray-800">{option.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{formatPrice(getCartAmount())}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{formatPrice(Math.floor(getCartAmount() * 0.02))}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{formatPrice(getTotalAmount())}</p>
          </div>
        </div>
      </div>

      {!selectedAddress ? (
        <button disabled className="w-full bg-gray-400 text-white py-3 mt-5 cursor-not-allowed font-medium">
          Select Address to Continue
        </button>
      ) : getCartCount() === 0 ? (
        <button disabled className="w-full bg-gray-400 text-white py-3 mt-5 cursor-not-allowed font-medium">
          Add Items to Cart
        </button>
      ) : selectedPaymentOption.id === "cod" ? (
        <button
          disabled={isProcessing}
          onClick={placeOrder}
          className={`w-full py-3 mt-5 font-medium text-white ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}`}
        >
          {isProcessing ? "Placing Order..." : "Place Order"}
        </button>
      ) : (
        <div className="space-y-3">
          {!razorpayConfigured && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Online payments are not configured for this app. Add Razorpay keys to <span className="font-semibold">.env.local</span>, or choose Cash on Delivery.
            </div>
          )}
          <RazorpayButton
            amount={getTotalAmount()}
            email={selectedAddress.email || userDummyData.email}
            phone={selectedAddress.phoneNumber || userDummyData.phone}
            name={selectedAddress.fullName || userDummyData.name}
            paymentMethodConfig={selectedPaymentOption.method}
            buttonLabel={`Pay ${currency}${formatPrice(getTotalAmount())} with ${selectedPaymentOption.title}`}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
          />
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
