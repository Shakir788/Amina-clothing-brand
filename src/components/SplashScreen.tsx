"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  // states for smooth cross-fade previously implemented
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // ⏳ 3 seconds baad Fade Out start karo
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); 

    // ⏳ 4 seconds baad component ko remove karo
    const mountTimer = setTimeout(() => {
      setIsMounted(false);
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(mountTimer);
    };
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 🌐 MAIN WEBSITE CONTENT (Pre-loads behind overlay) */}
      {children}

      {/* ✨ THE PERFECTED SPLASH SCREEN OVERLAY */}
      <div 
        className={`fixed inset-0 z-[99999] w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] 
        transition-opacity duration-1000 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        
        {/* 🖼️ BOUTIQUE INTERIOR IMAGE (LOW OPACITY PNG) */}
        <div className="absolute inset-0 z-1 opacity-[0.15]">  {/* 👈 Opacity fixed to 0.15 */}
          <Image
            src="/images/hero/boutique_interior.png" // 👈 Image path updated to PNG
            alt="Amina Interior Background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* 🌟 LOGO & TAGLINE FLEX CONTAINER */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* 👑 CRISP GOLD LOGO */}
          <div 
            className="w-[55%] max-w-[320px] aspect-square mb-6"
            style={{
              opacity: 0, // 👈 Starts invisible to prevent flashing
              animation: "luxuryReveal 2s cubic-bezier(0.23, 1, 0.32, 1) forwards" // Starts immediately
            }}
          >
            <Image
              src="/images/amina-splash.png" 
              alt="Amina Luxury Logo"
              fill
              priority 
              className="object-contain"
            />
          </div>

          {/* 🏷️ THE LOVELY TAGLINE */}
          <p 
            className="text-[#C8A870] text-[11px] md:text-xs font-serif tracking-[0.6em] uppercase"
            style={{
              opacity: 0,
              animation: "taglineFadeUp 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards",
              animationDelay: "0.8s" // 👈 Logo ke thodi der baad ayega sequential flow mein
            }}
          >
            Timeless Moroccan Elegance
          </p>

        </div>

        {/* ✨ ANIMATION KEYFRAMES */}
        <style jsx>{`
          @keyframes luxuryReveal {
            0% { opacity: 0; transform: scale(0.85); filter: blur(12px); }
            40% { opacity: 1; filter: blur(0px); } /* Logo comes in quickly */
            100% { opacity: 1; transform: scale(1); filter: blur(0px); }
          }

          @keyframes taglineFadeUp {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}