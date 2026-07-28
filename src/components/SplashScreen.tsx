"use client";
import { useState } from "react";

export default function SplashScreen({ children }: any) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <div style={{
          backgroundColor: "#F4F1EA",
          backgroundImage: `
            radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(244,241,234,0.4) 70%),
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
          zIndex: 99999,
          overflow: "hidden"
        }}>
          
          {/* 🎬 CINEMATIC VIDEO LOGO WITH ON-ENDED EVENT */}
          <video
            src="/videos/amina-logo.mp4"
            autoPlay
            muted
            playsInline
            // ✨ Magic: Ye tabhi hatega jab video apna aakhiri frame play kar legi!
            onEnded={() => setLoading(false)}
            style={{
              width: "85%",
              maxWidth: "650px",
              height: "auto",
              objectFit: "contain",
              zIndex: 10,
              opacity: 0,
              animation: "logoVIPEntry 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards"
            }}
          />

          <style jsx>{`
            @keyframes logoVIPEntry {
              0% { opacity: 0; transform: scale(0.9) translateY(-10px); filter: blur(8px); }
              100% { opacity: 1; transform: scale(1) translateY(0px); filter: blur(0px); }
            }
          `}</style>
        </div>
      )}

      {/* Jab tak loading true hai, children hide rahenge. Khatam hote hi website dikhegi */}
      {!loading && children}
    </>
  );
}