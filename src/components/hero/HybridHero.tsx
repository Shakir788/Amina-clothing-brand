"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

export default function HybridHero() {
  const [stage, setStage] = useState<'video' | 'interactive'>('video');
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Transition logic: Video 8 second ka hai, toh 7.5s pe switch kar denge
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('interactive');
    }, 7500); 
    return () => clearTimeout(timer);
  }, []);

  // Yahan Three.js ka interaction code wahi rahega jo pehle tha, 
  // bas ab ye tabhi trigger hoga jab stage 'interactive' hoga.
  useEffect(() => {
    if (stage !== 'interactive') return;
    
    // [Yahan tumhara wahi Three.js + GSAP interaction code aayega]
    // Isko 'interactive' mode mein initialize karo taaki dress breath kare.
    
    console.log("Dress is now breathing/floating interactively.");
  }, [stage]);

  return (
    <main className="relative w-full h-screen bg-black">
      
      {/* 1. VIDEO LAYER */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ${stage === 'video' ? 'opacity-100' : 'opacity-0'}`}>
        <video
          className="w-full h-full object-cover"
          src="/videos/amina-hero-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* 2. INTERACTIVE DRESS LAYER */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ${stage === 'interactive' ? 'opacity-100' : 'opacity-0'}`}>
        <div ref={mountRef} className="absolute inset-0" />
      </div>

      {/* Branding always on top */}
      <div className="absolute bottom-[10%] inset-x-0 text-center z-50">
        <h1 className="text-white text-5xl font-serif">Amina</h1>
      </div>
    </main>
  );
}