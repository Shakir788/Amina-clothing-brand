import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "../globals.css"; 
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "../../components/cart/CartSidebar"; 
import AIChatBot from "@/components/AIChatBot"; 
import Header from "@/components/layout/Header"; 
// 👇 1. YAHAN FOOTER IMPORT KIYA
import Footer from "@/components/layout/Footer"; 
import { getDictionary } from "@/lib/getDictionary"; 
import { ClerkProvider } from '@clerk/nextjs'

// Fonts setup (NO CHANGE)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "AMINA | Luxury Moroccan Fashion",
  description: "Discover the elegance of modern Moroccan Kaftans and Dresses.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  
  const dict = await getDictionary(params.lang);

  return (
    <ClerkProvider>
      <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
        <body className={`${inter.variable} ${playfair.variable} ${amiri.variable} font-sans bg-amina-sand text-amina-black antialiased`}>
          <CartProvider>
            
            <Header lang={params.lang} dict={dict.header} /> 
            
            {children}
            
            {/* 👇 2. YAHAN FOOTER LAGA DIYA (Cart aur ChatBot se pehle) */}
            <Footer lang={params.lang} />

            <CartSidebar />
            <AIChatBot />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}