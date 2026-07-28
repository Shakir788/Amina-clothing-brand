import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const stockData = await req.json();

    // Database ki 'inventory' table me insert karo
    const { error } = await supabase
      .from("inventory")
      .insert([
        {
          name: stockData.name,
          qty: Number(stockData.qty),
          cost: stockData.cost ? Number(stockData.cost) : null,
          sell: stockData.sell ? Number(stockData.sell) : null,
          date: stockData.date,
          notes: stockData.notes,
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