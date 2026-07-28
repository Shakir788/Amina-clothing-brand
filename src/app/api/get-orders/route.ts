import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side client using ANON key or Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // 🔒 Server-side password check (Browser ise nahi dekh sakta)
    const expectedPassword = process.env.ADMIN_PASSWORD || "";
    
    if (!password || password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Pass: Fetch orders safely on the server
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}