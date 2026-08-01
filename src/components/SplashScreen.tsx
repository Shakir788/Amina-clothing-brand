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
        `}</style>
      </div>
    );
  }

  return children;
}