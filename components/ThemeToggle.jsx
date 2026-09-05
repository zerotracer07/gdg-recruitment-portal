"use client";

import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Cycles light → dark → system. Icon morphs with a spring tap.
const ORDER = ["light", "dark", "system"];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = ORDER.includes(theme) ? theme : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : MonitorSmartphone;

  return (
    <motion.span whileTap={{ scale: 0.85 }} className="inline-flex">
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        onClick={() => setTheme(next)}
        aria-label={`Theme: ${current}. Switch to ${next}.`}
        title={`Theme: ${current} → ${next}`}
      >
        <span key={current} className="inline-flex animate-[theme-pop_0.3s_ease]">
          <Icon className="h-[1rem] w-[1rem]" />
        </span>
        <span className="sr-only">Toggle theme (current: {current})</span>
      </Button>
    </motion.span>
  );
}
