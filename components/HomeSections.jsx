"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Rocket, Trophy, Users } from "lucide-react";
import { reviews, technicalCards, nonTechnicalCards } from "@/constants";
import Marquee from "@/components/magicui/marquee";
import { MagicCard } from "@/components/magicui/magic-card";
import BlurFade from "@/components/magicui/blur-fade";
import CountUp from "@/components/CountUp";

const perks = [
  {
    icon: Code2,
    title: "Skill-first sessions",
    text: "Short, practical sessions on Android, web, ML, cloud, and design — taught by the leads.",
  },
  {
    icon: Rocket,
    title: "Ship real work",
    text: "Contribute to live apps, sites, and games that actual students use.",
  },
  {
    icon: Trophy,
    title: "Compete together",
    text: "Coding contests, game jams, and hackathons with teammates beside you.",
  },
  {
    icon: Users,
    title: "People and exposure",
    text: "Meet sponsors, sibling communities, and Google developer programs — plus the swag.",
  },
];

function DeptCard({ title, description, image, color, formLink }) {
  return (
    <MagicCard
      gradientColor={color}
      gradientOpacity={0.25}
      className="border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />
      <span className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}1a` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-7 w-7" loading="lazy" />
        </span>
        <span>
          <strong className="whitespace-pre-line text-[15px] leading-snug">
            {title}
          </strong>
          <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </span>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Apply
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </span>
      <Link
        href={formLink}
        aria-label={`Apply to ${title.replace(/\n/g, " ")}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="sr-only">Apply to {title.replace(/\n/g, " ")}</span>
      </Link>
    </MagicCard>
  );
}

function DeptTicker() {
  return (
    <div
      aria-hidden="true"
      className="border-y bg-card/60 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <Marquee pauseOnHover className="[--duration:32s]">
        {reviews.map((d) => (
          <span
            key={d.id}
            className="mx-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: d.tone }}
            />
            {d.name}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default function HomeSections() {
  const leadCount = reviews.flatMap((r) => r.leads ?? []).length;

  return (
    <>
      <DeptTicker />

      {/* About GDG VITC */}
      <section className="border-t">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-[1.2fr_1fr] sm:py-20">
          <BlurFade inView>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                About GDG VITC
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Google Developer Groups on Campus, VIT Chennai
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                GDG VITC brings VIT Chennai students together to learn technology
                by shipping it — practical sessions, team projects, hackathons,
                and events across {reviews.length} departments guided by{" "}
                {leadCount} student leads.
              </p>
              <Link
                href="/departments"
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent"
              >
                Explore departments <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </BlurFade>
          <dl className="grid grid-cols-2 gap-3 self-center">
            {[
              { value: reviews.length, label: "Departments", count: true },
              { value: leadCount, label: "Student leads", count: true },
              { value: "2", label: "Applications max", count: false },
              { value: "2026", label: "Recruitment", count: false },
            ].map((s, i) => (
              <BlurFade key={s.label} inView delay={0.08 * i}>
                <div className="rounded-2xl border bg-card p-5 text-center shadow-sm">
                  <dd className="text-3xl font-extrabold">
                    {s.count ? <CountUp to={Number(s.value)} /> : s.value}
                  </dd>
                  <dt className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </dt>
                </div>
              </BlurFade>
            ))}
          </dl>
        </div>
      </section>

      {/* Departments showcase */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <BlurFade inView>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Find your crew
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Technical departments
                </h2>
              </div>
              <Link
                href="/departments"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </BlurFade>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {technicalCards.map((c, i) => (
              <BlurFade key={c.title} inView delay={0.05 * (i % 4)}>
                <DeptCard {...c} />
              </BlurFade>
            ))}
          </div>

          <BlurFade inView>
            <h2 className="mt-12 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Community & creative
            </h2>
          </BlurFade>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {nonTechnicalCards.map((c, i) => (
              <BlurFade key={c.title} inView delay={0.05 * (i % 4)}>
                <DeptCard {...c} />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <BlurFade inView>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Why join
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Proof over promises
            </h2>
          </BlurFade>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <BlurFade key={p.title} inView delay={0.06 * i}>
                <div className="h-full rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <p.icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="mt-3 text-[15px] font-bold">{p.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* CTA banner */}
          <BlurFade inView>
            <div className="relative mt-10 overflow-hidden rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-xl sm:px-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl"
              />
              <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">
                Applications are open
              </h2>
              <p className="relative mx-auto mt-2 max-w-md text-sm opacity-90">
                Pick up to two departments and submit your application in minutes.
              </p>
              <div className="relative mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/departments"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                >
                  Start your application <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </>
  );
}
