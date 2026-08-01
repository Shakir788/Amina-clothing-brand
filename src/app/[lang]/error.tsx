'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 🔍 Log error for debugging
    console.error("Ad Traffic Client Error caught:", error);

    // 🚀 Instagram / Mobile Browser safeguard:
    // Agar client-side exception aayi, toh user ko roke bina 1 second mein auto-reload kar do
    // Taki ad se aane wale customer ko error na dikhe, seedha website chale!
    const timer = setTimeout(() => {
      window.location.reload();
    }, 800);

    return () => clearTimeout(timer);
  }, [error]);

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
      color: "#F4F1EA",
      fontFamily: "serif"
    }}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2 style={{ fontSize: "28px", letterSpacing: "0.2em", color: "#D4A373", marginBottom: "12px" }}>AMINA</h2>
        <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#888", marginBottom: "24px" }}>
          Preparing your experience...
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 28px",
            background: "#D4A373",
            color: "#000",
            border: "none",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Enter Boutique
        </button>
      </div>
    </div>
  );
}