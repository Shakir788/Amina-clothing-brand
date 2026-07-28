"use client";
import { useState, useEffect } from 'react';
import HeroAssembly from './HeroAssembly';
import HeroVideo from './HeroVideo';
import HeroUI from './HeroUI';

export default function HeroWrapper({ lang }: { lang: string }) {
  const [stage, setStage] = useState<'video' | 'interactive'>('video');
  const [assemblyVisible, setAssemblyVisible] = useState(false);

  const handleVideoEnd = () => {
    setStage('interactive');
    setTimeout(() => setAssemblyVisible(true), 50);
  };

  return (
    // ✅ overflow-hidden hata diya — gradient niche jaane dega
    <main className="relative w-full h-screen bg-[#050505]">
      
      {/* LAYER 1: Video */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-[2000ms] ease-in-out ${
        stage === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <HeroVideo onVideoEnd={handleVideoEnd} />
      </div>

      {/* LAYER 2: 3D Assembly */}
      {assemblyVisible && (
        <div className="absolute inset-0 z-20 animate-fadeIn">
          <HeroAssembly lang={lang} initialMode="static" />
        </div>
      )}

      {/* LAYER 3: UI */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <HeroUI lang={lang} />
      </div>

      {/* ✅ NAYA — Bottom gradient: black → cream, next section se blend */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: '220px',
          background: 'linear-gradient(to bottom, transparent 0%, #050505 60%, #F9F7F2 100%)',
        }}
      />

    </main>
  );
}