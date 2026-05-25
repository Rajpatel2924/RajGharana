import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing RAZORPAY_KEY_SECRET environment variable");
      return NextResponse.json(
        {
          error: "Payment service not configured",
          details: "Please set RAZORPAY_KEY_SECRET in .env.local",
        },
        { status: 500 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification details" },
        { status: 400 }
      );
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isPaymentVerified = generated_signature === razorpay_signature;

    if (isPaymentVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "Payment verified successfully",
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json(
      { error: "Payment verification failed", details: error.message },
      { status: 500 }
    );
  }
}
