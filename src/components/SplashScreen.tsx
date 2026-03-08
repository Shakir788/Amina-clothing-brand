"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);

  if (loading) {
    return (
      <div style={{
        background:"#f4f1ea",
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
      }}>
        <img
          src="/logo-512.png"
          style={{
            width:"120px",
            animation:"fade 1s ease-in-out"
          }}
        />
        <style jsx>{`
          @keyframes fade {
            from {opacity:0; transform:scale(0.9)}
            to {opacity:1; transform:scale(1)}
          }
        `}</style>
      </div>
    );
  }

  return children;
}