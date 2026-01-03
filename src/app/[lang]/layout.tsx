import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// 👇 YE 2 LINE ADD KARNI HAIN
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "AMINA | Modern Clothing Brand",
  description: "Premium fashion collection.",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const direction = params.lang === 'ar' ? 'rtl' : 'ltr';
  const langClass = params.lang === 'ar' ? amiri.variable : `${inter.variable} ${playfair.variable}`;

  return (
    <html lang={params.lang} dir={direction}>
      <body className={`${langClass} font-sans min-h-screen flex flex-col bg-amina-sand text-amina-black`}>
        {/* 👇 YAHAN CART PROVIDER START HOGA */}
        <CartProvider>
          <Header lang={params.lang} />
          
          {/* Cart Sidebar yahan rahega taki har page pe dikhe */}
          <CartSidebar />
          
          <main className="flex-grow">
            {children}
          </main>
          <Footer lang={params.lang} />
        </CartProvider>
        {/* 👆 YAHAN END HOGA */}
      </body>
    </html>
  );
}