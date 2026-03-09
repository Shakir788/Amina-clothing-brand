"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ 5.8 Seconds tak loading chalegi (3.8 + 2 extra)
    setTimeout(() => {
      setLoading(false);
    }, 5800);
  }, []);

  if (loading) {
    return (
      <div style={{
        // ✨ THEME: Moroccan Geometric Pattern + Spotlight
        backgroundColor: "#F4F1EA",
        backgroundImage: `
          radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(244,241,234,0.2) 70%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23d4a373' fill-opacity='0.12'%3E%3Cpath d='M40 0l3.9 12.1L56 8.2l-3.9 12.1L64 24.2l-12.1 3.9L60 40l-12.1 3.9L56 56l-12.1-3.9L40 64l-3.9-12.1L24 56l3.9-12.1L16 40l12.1-3.9L24 24.2l12.1 3.9L40 0z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}>
        {/* 👗 Logo */}
        <img
          src="/logo-512.png"
          alt="AMINA Logo"
          style={{
            width: "350px",
            maxWidth: "75%",
            position: "relative",
            zIndex: 10,
            opacity: 0,
            animation: "logoVIPEntry 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards"
          }}
        />
        
        {/* ✨ Line & Subheading Container */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "-145px", 
          zIndex: 20
        }}>
            
            {/* Golden Expanding Line */}
            <div style={{
                height: "1px",
                background: "#D4A373",
                opacity: 0,
                animation: "lineVIPExpand 1.2s ease-in-out forwards",
                animationDelay: '1s'
            }}></div>

            {/* Subheading - FRENCH VERSION ✨ */}
            <p style={{
                marginTop: '18px',
                color: "#8C6239", 
                fontFamily: 'serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                textAlign: 'center',
                maxWidth: '85%',
                fontWeight: 400,
                opacity: 0,
                lineHeight: '1.6',
                animation: "subheadingVIPFade 1.2s ease-out forwards",
                animationDelay: '1.8s'
            }}>
              Découvrez l'élégance des caftans et robes marocains modernes
            </p>
        </div>

        <style jsx>{`
          @keyframes logoVIPEntry {
            0% { opacity: 0; transform: scale(0.88) translateY(-10px); filter: blur(8px); }
            100% { opacity: 1; transform: scale(1) translateY(0px); filter: blur(0px); }
          }
          @keyframes lineVIPExpand {
            0% { width: 0px; opacity: 0; }
            100% { width: 160px; opacity: 0.8; }
          }
          @keyframes subheadingVIPFade {
            0% { opacity: 0; transform: translateY(8px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0px); filter: blur(0px); }
          }
        `}</style>
      </div>
    );
  }

  return children;
}