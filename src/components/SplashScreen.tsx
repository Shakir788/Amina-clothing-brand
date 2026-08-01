"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛡️ Safety fallback timer (11 seconds taaki agar onEnded miss ho toh bhi deadlock na ho)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 11000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        backgroundColor: "#050505",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        overflow: "hidden"
      }}>

        {/* ✨ Ambient golden glow behind video */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, rgba(212,175,55,0.10) 0%, transparent 65%)",
          zIndex: 5
        }} />

        {/* ✨ Twinkling sparkles filling empty space */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          overflow: "hidden"
        }}>
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "3px",
                height: "3px",
                background: "rgba(212,175,55,0.7)",
                borderRadius: "50%",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* 🎬 FULL SCREEN CINEMATIC VIDEO LOGO */}
        <video
          src="/videos/amina-logo.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setLoading(false)}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            objectFit: "contain",
            zIndex: 10,
            opacity: 0,
            animation: "logoVIPEntry 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards"
          }}
        />

        <style jsx>{`
          @keyframes logoVIPEntry {
            0% { opacity: 0; filter: blur(8px); }
            100% { opacity: 1; filter: blur(0px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
        `}</style>
      </div>
    );
  }

  return children;
}