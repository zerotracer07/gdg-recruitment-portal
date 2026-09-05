"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Users, Rocket } from "lucide-react";
import { reviews } from "@/constants";
import { authClient } from "@/lib/auth-client";
import BlurFade from "@/components/magicui/blur-fade";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import CountUp from "@/components/CountUp";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { data: session, isPending } = authClient.useSession();
  const user = mounted && !isPending ? session?.user : undefined;
  const signedIn = Boolean(user);

  const stats = [
    { icon: Layers, value: reviews.length, label: "Departments", count: true },
    { icon: Users, value: 2, label: "Max applications", count: true },
    { icon: Rocket, value: "2026", label: "Recruitment", count: false },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent"
      />
      {/* Aurora mesh behind hero (purple-blue-cyan) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-140px] h-[480px] w-[860px] max-w-none -translate-x-1/2 opacity-90 blur-3xl"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(66,133,244,0.30), rgba(155,114,242,0.26), rgba(52,168,83,0.20), rgba(66,133,244,0.30))",
        }}
      />
      {/* Orbiting accents around the title */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        <span className="orbit-ring orbit-a">
          <i />
        </span>
        <span className="orbit-ring orbit-b">
          <i />
        </span>
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
        <BlurFade delay={0}>
          <AnimatedGradientText className="animate-float-soft shadow-[0_0_24px_-6px_hsl(var(--primary)/0.4)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              Applications open · pick up to 2 departments
            </span>
          </AnimatedGradientText>
        </BlurFade>
        <BlurFade delay={0.1}>
          <h1 className="font-display mt-4 bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            Recruitment{" "}
            <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72F2] to-[#EA4335] bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(123,97,255,0.35)]">
              2026
            </span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="font-display mt-3 text-lg font-medium tracking-tight">
            Twelve departments.{" "}
            <span className="font-serif-accent bg-gradient-to-r from-[#4285F4] to-[#34A853] bg-clip-text text-[1.35em] italic text-transparent">
              One community.
            </span>
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Apply to the teams where you will learn fastest — then ship real
            apps, sites, games, models, and events alongside them.
          </p>
        </BlurFade>
        <BlurFade delay={0.26}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/departments"
              className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#7B61FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-6px_rgba(66,133,244,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-6px_rgba(66,133,244,0.65)] sm:w-auto"
            >
              Browse departments
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {signedIn ? (
              <Link
                href="/profile"
                className="inline-flex w-full items-center justify-center rounded-xl border bg-card/70 px-6 py-3 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-accent sm:w-auto"
              >
                My applications
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex w-full items-center justify-center rounded-xl border bg-card/70 px-6 py-3 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-accent sm:w-auto"
              >
                Sign in to apply
              </Link>
            )}
          </div>
        </BlurFade>
        <BlurFade delay={0.34}>
          <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group rounded-2xl border bg-card/70 px-2 py-4 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.5)]"
              >
                <s.icon className="mx-auto h-4 w-4 text-muted-foreground transition duration-300 group-hover:rotate-12 group-hover:scale-125 group-hover:text-primary" />
                <dt className="order-2 mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="font-display text-2xl font-bold tabular-nums tracking-tight">
                  {s.count ? <CountUp to={Number(s.value)} /> : s.value}
                </dd>
              </div>
            ))}
          </dl>
        </BlurFade>
      </div>
    </section>
  );
}
