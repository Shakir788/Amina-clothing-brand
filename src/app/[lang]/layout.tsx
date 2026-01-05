import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "../globals.css"; 
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "../../components/cart/CartSidebar"; 
import AIChatBot from "@/components/AIChatBot"; 
import Header from "@/components/layout/Header"; // 👈 Path check kar lena

// Fonts setup
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "AMINA | Luxury Moroccan Fashion",
  description: "Discover the elegance of modern Moroccan Kaftans and Dresses.",
};

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body className={`${inter.variable} ${playfair.variable} ${amiri.variable} font-sans bg-amina-sand text-amina-black antialiased`}>
        <CartProvider>
          
          {/* 👇 YAHAN CHANGE KIYA HAI: 'lang' pass kiya hai */}
          <Header lang={params.lang} /> 
          
          {children}
          
          <CartSidebar />
          <AIChatBot />
        </CartProvider>
      </body>
    </html>
  );
}