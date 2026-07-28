"use client";
import { useEffect, useRef } from "react";

export default function HeroVideo({ onVideoEnd }: { onVideoEnd?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const calledRef = useRef(false); // double-fire prevent karo

  const triggerEnd = () => {
    if (calledRef.current) return;
    calledRef.current = true;
    onVideoEnd?.();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fallback: video duration pata chalne ke baad safety timer
    const onMeta = () => {
      const duration = video.duration;
      if (duration && isFinite(duration)) {
        // Duration ke baad 300ms extra buffer
        const timer = setTimeout(triggerEnd, (duration * 1000) + 300);
        return () => clearTimeout(timer);
      }
    };

    video.addEventListener("loadedmetadata", onMeta);
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505] flex justify-center items-center overflow-hidden">
      
      <video
        ref={videoRef}
        className="h-full w-auto max-w-full object-cover [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]"
        src="/videos/amina-hero-loop.mp4"
        autoPlay
        muted
        playsInline
        // ✅ loop HATA DIYA — warna onEnded kabhi fire nahi hota
        onEnded={triggerEnd}   // primary trigger
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,5,0.7)_100%)] pointer-events-none" />
      
    </div>
  );
}