import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';

// ✨ VIP Backend Client (Sirf is API ke liye) ✨
const backendClient = createClient({
  projectId: "sk9drqx3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, 
});

export async function POST(req: Request) {
  try {
    
    console.log("🔑 Token Check:", process.env.SANITY_API_TOKEN ? "key found ✅" : "key MISSING! ❌ Server restart!");

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({ success: false, message: 'Token Missing. Restart Server.' }, { status: 500 });
    }

    const body = await req.json();
    const { customerName, phone, city, address, cartItems, totalPrice } = body;

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      _type: 'order',
      orderNumber,
      customerName,
      phone,
      city,
      address,
      cartItems: cartItems.map((item: any) => ({
        _key: Math.random().toString(36).substring(7),
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalPrice,
      status: 'pending',
      orderDate: new Date().toISOString(),
    };

    // ✨ Naya backendClient use kar rahe hain create karne ke liye
    const result = await backendClient.create(newOrder);

    return NextResponse.json({ success: true, orderId: result._id, orderNumber });
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}