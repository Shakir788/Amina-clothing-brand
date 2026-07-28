"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ Exact 10 seconds timer matching your logo video length
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

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
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            objectFit: "cover",
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