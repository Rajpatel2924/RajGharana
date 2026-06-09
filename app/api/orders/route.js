import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseKey =
    serviceRoleKey && serviceRoleKey !== "your_supabase_service_role_key"
      ? serviceRoleKey
      : anonKey;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

const fromSupabaseOrder = (order) => ({
  _id: order.order_id || `order_${order.id}`,
  userId: order.user_id,
  items: order.items,
  amount: order.amount,
  address: order.address,
  status: order.status,
  paymentMethod: order.payment_method,
  paymentStatus: order.payment_status,
  date: order.date || (order.created_at ? new Date(order.created_at).getTime() : Date.now()),
  timeline: order.timeline,
});

export async function GET() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data.map(fromSupabaseOrder) });
}

export async function POST(req) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 500 }
    );
  }

  try {
    const order = await req.json();

    if (!order?._id || !Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json(
        { error: "Order must include an id and at least one item" },
        { status: 400 }
      );
    }

  const payload = {
      order_id: order._id,
      user_id: order.userId,
      items: order.items,
      amount: order.amount,
      address: order.address,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      created_at: new Date(order.date || Date.now()).toISOString(),
      timeline: order.timeline,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { order: fromSupabaseOrder(data) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}
