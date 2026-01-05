import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "../globals.css"; 
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "../../components/cart/CartSidebar"; 
import AIChatBot from "@/components/AIChatBot"; 
import Header from "@/components/layout/Header"; 
import { getDictionary } from "@/lib/getDictionary"; // 👈 New Import for Translations

// Fonts setup
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "AMINA | Luxury Moroccan Fashion",
  description: "Discover the elegance of modern Moroccan Kaftans and Dresses.",
};

export default async function RootLayout({ // 👈 'async' zaroori hai data fetch ke liye
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  
  // 1. Language ke hisab se Dictionary load karo
  const dict = await getDictionary(params.lang);

  return (
    // 'dir' add kiya taaki Arabic me text right-to-left ho jaye
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${playfair.variable} ${amiri.variable} font-sans bg-amina-sand text-amina-black antialiased`}>
        <CartProvider>
          
          {/* 👇 AB HUM 'dict' BHI PASS KAR RAHE HAIN */}
          <Header lang={params.lang} dict={dict.header} /> 
          
          {children}
          
          <CartSidebar />
          <AIChatBot />
        </CartProvider>
      </body>
    </html>
  );
}