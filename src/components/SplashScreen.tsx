"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 11000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        backgroundColor: "#e1e1e0",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        overflow: "hidden"
      }}>

        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.85  0 0 0 0 0.83  0 0 0 0 0.78  0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat"
        }} />

        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23B8860B' stroke-width='1'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='18'/%3E%3Cpath d='M40 22 L58 40 L40 58 L22 40 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "80px 80px"
        }} />

        {/* 🎬 Video with feathered top/bottom edges — no hard rectangle line */}
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
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
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