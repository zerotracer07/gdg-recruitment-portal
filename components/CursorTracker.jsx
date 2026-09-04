"use client";

import React, { useEffect, useRef } from "react";

// GDG-color custom cursor: white core dot (difference blend => visible on any
// background) + conic-gradient ring in Google colors that slowly rotates and
// expands over interactive elements. Fine-pointer devices only; the native
// cursor is hidden via CSS only while this is active.
export default function CursorTracker() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;

    const restore = () => {
      document.body.classList.add("custom-cursor-active");
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hide = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      restore();
      const interactive = e.target?.closest?.(
        "a, button, input, select, textarea, label, [role='button']"
      );
      ring.classList.toggle("cursor-hover", Boolean(interactive));
    };

    const loop = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      ring.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onDown = () => ring.classList.add("cursor-press");
    const onUp = () => ring.classList.remove("cursor-press");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseenter", restore);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", restore);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseenter", restore);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", restore);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
