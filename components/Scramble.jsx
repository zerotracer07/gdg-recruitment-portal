"use client";

import React, { useRef } from "react";

// SmoothUI-style scramble: department name dissolves into glyphs on hover,
// then resolves left to right. Mouse-only, reduced-motion aware.
const GLYPHS = "!<>-_\\/[]{}=+*^?#@&%";

export default function Scramble({ text, className = "" }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onEnter = () => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    cancelAnimationFrame(frame.current);
    const original = text;
    let iter = 0;
    const tick = () => {
      el.textContent = original
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (i < iter) return original[i];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      if (iter < original.length) {
        iter += 1 / 2;
        frame.current = requestAnimationFrame(tick);
      }
    };
    tick();
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.textContent = text;
  };

  return (
    <span ref={ref} onMouseEnter={onEnter} onMouseLeave={onLeave} className={className}>
      {text}
    </span>
  );
}
