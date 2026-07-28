import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✨ FIX: Service Role Key ki jagah wahi standard ANON Key use kar rahe hain jo perfectly kaam karti hai!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: orderData.customer_name,
          phone: orderData.phone,
          product: orderData.product,
          color: orderData.color,
          size: orderData.size,
          city: orderData.city,
          price: orderData.price,
          status: orderData.status,
        }
      ]);

    if (error) {
      console.error("Supabase Save Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}