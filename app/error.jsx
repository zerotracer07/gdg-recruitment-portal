"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 p-8 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/gdg.svg" alt="GDG VITC" className="h-14 w-14 opacity-90" />
      <p className="text-6xl font-extrabold tracking-tight text-muted-foreground/40">500</p>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        {error?.message || "An unexpected error occurred. Your work is safe — try again."}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => reset?.()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/support"
          className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
        >
          Get help
        </Link>
      </div>
    </main>
  );
}
