import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const isAuthError = (error) => {
  return (
    error?.statusCode === 401 ||
    error?.error?.statusCode === 401 ||
    (error?.error?.code === "BAD_REQUEST_ERROR" &&
      /auth|key|credential/i.test(error?.error?.description || ""))
  );
};

export async function POST(req) {
  const razorpay = getRazorpayClient();

  if (!razorpay) {
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 500 }
    );
  }

  try {
    const { amount, currency = "INR", receipt, notes } = await req.json();
    const amountInPaise = Number(amount);

    if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be an integer of at least 100 paise" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json(
      {
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);

    if (isAuthError(error)) {
      return NextResponse.json(
        { error: "Razorpay authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
