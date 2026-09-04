"use client";

import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const DeptHero = ({ dept, setPhotoQs, photoQs, isLoading, setIsLoading }) => {
  useEffect(() => {
    setIsLoading?.(false);
  }, [setIsLoading]);

  if (!dept) return null;

  const showToggle =
    dept.name === "Photography" && typeof setPhotoQs === "function";

  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.08] via-transparent to-transparent"
      />
      <div className="relative mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Department
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {!photoQs ? dept.name : "Video Editing"}
        </h1>
        {dept.body && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {dept.body}
          </p>
        )}
        {showToggle && (
          <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
            <Switch checked={!!photoQs} onCheckedChange={() => setPhotoQs(!photoQs)} />
            Switch to Video Editing?
          </label>
        )}
      </div>
    </section>
  );
};

export default DeptHero;
