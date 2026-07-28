"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

const GOLD = new THREE.Color("#c8a24c");

/* ── Flag/cloth wave shader ── */
const VERT = `
  uniform float uTime;
  uniform float uWave;
  varying vec2  vUv;
  varying float vWave;

  void main(){
    vUv = uv;

    vec3 pos = position;

    // Horizontal wave — X axis pe lahrata hai (jhande ki tarah)
    float wave = sin(uv.x * 6.28 - uTime * 1.8) * 0.5
               + sin(uv.x * 3.14 - uTime * 1.1) * 0.3;

    // Vertical secondary ripple
    float ripple = sin(uv.y * 4.0 + uTime * 0.9) * 0.15;

    // Hem pe zyada movement (bottom = uv.y near 0)
    float hem = pow(1.0 - uv.y, 1.6);

    // Side edges pe kam movement (dress center fixed)
    float side = sin(uv.x * 3.14159);

    float amp = uWave * hem * side;

    pos.z += (wave + ripple) * amp;
    pos.x += sin(uv.y * 3.14 - uTime * 0.7) * amp * 0.3;

    vWave = (wave + ripple) * hem;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform sampler2D uTex;
  uniform float     uTime;
  uniform float     uSweep;
  uniform float     uIntro;
  uniform vec3      uGold;
  varying vec2      vUv;
  varying float     vWave;

  float luma(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }

  void main(){
    vec4  tex  = texture2D(uTex, vUv);
    if (tex.a < 0.02) discard;

    vec3  col  = tex.rgb;

    // Gold shimmer sweep
    float band     = sin((vUv.x + vUv.y) * 3.14159 - uTime * 0.8);
          band     = smoothstep(0.5, 1.0, band);
    float goldMask = smoothstep(0.4, 0.85, luma(col));
    col += uGold * band * goldMask * uSweep;

    // Wave shading — light/shadow on folds
    col *= 1.0 + vWave * 0.35;

    gl_FragColor = vec4(col, tex.a * clamp(uIntro, 0.0, 1.0));
  }
`;

export default function HeroAssembly({
  initialMode = "animate",
}: {
  lang?: string;
  initialMode?: "animate" | "static";
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth  || window.innerWidth;
    let H = mount.clientHeight || window.innerHeight;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    /* Scene / Camera */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.5);
    camera.lookAt(0, 0, 0);

    /* Dust particles */
    const dustCount = 180;
    const dustGeo   = new THREE.BufferGeometry();
    const dpos      = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dpos[i*3]   = (Math.random()-0.5) * 10;
      dpos[i*3+1] = (Math.random()-0.5) * 8;
      dpos[i*3+2] = (Math.random()-0.5) * 4;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.025, transparent: true,
      opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    /* Dress mesh */
    const goldVec = new THREE.Vector3(GOLD.r, GOLD.g, GOLD.b);
    const uniforms = {
      uTex:   { value: null as THREE.Texture | null },
      uTime:  { value: 0 },
      uWave:  { value: 0.0 },   // wave amplitude — animates in
      uSweep: { value: 0.0 },   // gold shimmer
      uIntro: { value: 0.0 },   // fade in
      uGold:  { value: goldVec },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    });

    // Dress aspect ratio: 1080x1920 = 9:16
    // Screen mein: height = ~90vh worth, width proportional
    const dressH = 4.8;
    const dressW = dressH * (1080 / 1920);
    const geo    = new THREE.PlaneGeometry(dressW, dressH, 60, 80);
    const mesh   = new THREE.Mesh(geo, mat);
    mesh.position.set(0, -0.2, 0); // ✅ Thoda niche
    scene.add(mesh);

    /* Post processing */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.4, 0.6, 0.75);
    composer.addPass(bloom);

    /* Load texture */
    new THREE.TextureLoader().load("/images/hero/dress_full.png", tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTex.value = tex;

      /* GSAP animations */
      gsap.to(uniforms.uIntro, { value: 1, duration: 1.8, ease: "sine.inOut" });
      gsap.to(uniforms.uWave,  { value: 1.0, duration: 3.0, delay: 0.5, ease: "power2.inOut" });
      gsap.to(uniforms.uSweep, { value: 0.4, duration: 2.5, delay: 1.0, ease: "power2.inOut", yoyo: true, repeat: -1 });
      gsap.to(dustMat,         { opacity: 0.45, duration: 3.0, delay: 1.0, ease: "sine.inOut" });
      gsap.to(bloom,           { strength: 0.9, duration: 2.5, delay: 1.5, ease: "power2.inOut" });

      // Breathing: gentle sway
      gsap.to(mesh.rotation, {
        z: 0.025, duration: 4.0, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: 2.0,
      });
      gsap.to(mesh.position, {
        x: 0.12, duration: 5.5, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: 2.0,
      });
      gsap.to(camera.position, {
        x: 0.3, y: 0.1, duration: 12, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: 1.0,
      });
    });

    /* Render loop */
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();

      // Dust float up
      const p = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        p[i*3+1] += 0.002;
        if (p[i*3+1] > 4) p[i*3+1] = -4;
      }
      dustGeo.attributes.position.needsUpdate = true;

      composer.render();
      raf = requestAnimationFrame(animate);
    };
    animate();

    /* Resize */
    const onResize = () => {
      W = mount.clientWidth || window.innerWidth;
      H = mount.clientHeight || window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [initialMode]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}