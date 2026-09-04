import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function InfoPage({ eyebrow, title, updated, children }) {
  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/gdg.svg" alt="GDG VITC" className="h-10 w-10" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          </div>
        </div>
        {updated && (
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {updated}</p>
        )}
        <div className="prose-sm mt-6 space-y-4 rounded-2xl border bg-card p-6 text-sm leading-relaxed shadow-sm sm:p-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:pt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}
