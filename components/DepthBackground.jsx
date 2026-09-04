"use client";

import React, { useEffect, useRef } from "react";

// 3D-feel background: particles with real depth projection (size/alpha/speed
// scale with z), slow forward drift, mouse parallax, twinkle, and faint links
// between near particles. GDG palette. Skipped on reduced-motion.
const COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#0F9D58"];

export default function DepthBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    // Cap DPR: fullscreen canvas at DPR 2 = 4x pixels every frame. 1.5 is
    // visually identical for soft particles at a fraction of the fill cost.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let dark = document.documentElement.classList.contains("dark");
    const mouse = { x: 0.5, y: 0.5, active: false };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const count = Math.max(
      30,
      Math.min(isCoarse ? 45 : 90, Math.floor((w * h) / 22000))
    );

    const spawn = (far = false) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: far ? 0.9 + Math.random() * 0.1 : Math.random(),
      r: 0.8 + Math.random() * 2.2,
      speed: 0.0006 + Math.random() * 0.0022,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.4 + Math.random() * 0.6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });

    let parts = Array.from({ length: count }, () => spawn());

    const onMove = (e) => {
      mouse.x = e.clientX / w;
      mouse.y = e.clientY / h;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const themeObs = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onVis = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    let last = performance.now();
    let tick = 0;
    const FOV = 0.55; // depth projection strength

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min(50, now - last);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);

      const px = mouse.active ? (mouse.x - 0.5) * 2 : 0;
      const py = mouse.active ? (mouse.y - 0.5) * 2 : 0;
      const baseAlpha = dark ? 0.75 : 0.5;

      const projected = [];
      for (const p of parts) {
        // drift toward viewer, respawn far away
        p.z -= p.speed * dt;
        if (p.z <= 0.02) Object.assign(p, spawn(true));

        const s = FOV / (FOV + p.z); // near = bigger
        const depthDim = 1 - p.z * 0.75;
        const tw = 0.55 + 0.45 * Math.sin(t * p.twinkle + p.phase);
        const alpha = baseAlpha * depthDim * tw;

        // parallax: far particles barely move, near ones shift most
        const ox = px * 46 * (1 - p.z);
        const oy = py * 46 * (1 - p.z);
        const x = (p.x + ox + w) % w;
        const y = (p.y + oy + h) % h;
        const r = Math.max(0.4, p.r * s);

        projected.push({ x, y, s, alpha, color: p.color, r });

        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // faint links between near, close particles (every 2nd frame; halves
      // the O(n^2) cost, invisible at low alpha). Skipped on touch devices.
      tick += 1;
      if (!isCoarse && tick % 2 === 0) {
        ctx.lineWidth = 1;
        const linkDist = 130;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        if (a.s < 0.62) continue;
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          if (b.s < 0.62) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            ctx.globalAlpha =
              (1 - Math.sqrt(d2) / linkDist) * 0.14 * (dark ? 1.4 : 1);
            ctx.strokeStyle = "#888888";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame((now) => {
      last = now;
      raf = requestAnimationFrame(frame);
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
