import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "../globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "../../components/cart/CartSidebar";
import AIChatBot from "@/components/AIChatBot";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script"; // ✅ Meta Pixel ke liye

// Fonts setup
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "AMINA | Luxury Moroccan Fashion",
  description: "Discover the elegance of modern Moroccan Kaftans and Dresses.",
  manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <ClerkProvider>
      <html lang={params.lang} dir={params.lang === "ar" ? "rtl" : "ltr"}>
        <body
          className={`${inter.variable} ${playfair.variable} ${amiri.variable} font-sans bg-amina-sand text-amina-black antialiased`}
        >
          {/* ✅ META PIXEL START */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1564519168131622');
              fbq('track', 'PageView');
            `}
          </Script>
          {/* ✅ META PIXEL END */}

          <CartProvider>
            <Header lang={params.lang} dict={dict.header} />

            {children}

            <Footer lang={params.lang} />

            <CartSidebar />
            <AIChatBot />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
