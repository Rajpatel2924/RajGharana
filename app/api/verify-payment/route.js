import crypto from "crypto";
import { NextResponse } from "next/server";

const signaturesMatch = (generatedSignature, receivedSignature) => {
  const generated = Buffer.from(generatedSignature, "hex");
  const received = Buffer.from(receivedSignature, "hex");

  return generated.length === received.length && crypto.timingSafeEqual(generated, received);
};

export async function POST(req) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 500 }
    );
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification details" },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!signaturesMatch(generatedSignature, razorpay_signature)) {
      return NextResponse.json(
        { success: false, error: "Payment signature mismatch" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
