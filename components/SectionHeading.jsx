import React from "react";
import { cn } from "@/lib/utils";

// Consistent section header: eyebrow + display heading. Used across home.
export default function SectionHeading({ eyebrow, title, className = "", align = "left" }) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
