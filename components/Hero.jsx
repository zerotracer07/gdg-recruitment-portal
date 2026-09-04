"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Users, Rocket } from "lucide-react";
import { reviews } from "@/constants";

export default function Hero() {
  const stats = [
    { icon: Layers, value: String(reviews.length), label: "Departments" },
    { icon: Users, value: "2", label: "Max applications" },
    { icon: Rocket, value: "2026", label: "Recruitment" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Applications open · pick up to 2 departments
        </p>
        <h1 className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Recruitment 2026
        </h1>
        <p className="mt-3 text-lg font-medium">Ready to make your mark?</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Join GDG VITC departments and work on real-world projects — apps,
          websites, games, AI, events and more. Your journey starts here.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/departments"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
          >
            Browse departments
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex w-full items-center justify-center rounded-lg border bg-background px-6 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent sm:w-auto"
          >
            Sign in to apply
          </Link>
        </div>
        <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-card px-2 py-4 shadow-sm"
            >
              <s.icon className="mx-auto h-4 w-4 text-muted-foreground" />
              <dt className="order-2 mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </dt>
              <dd className="text-2xl font-extrabold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
