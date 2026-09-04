"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Rocket, Trophy, Users } from "lucide-react";
import { reviews, technicalCards, nonTechnicalCards } from "@/constants";

const perks = [
  {
    icon: Code2,
    title: "Hands-on workshops",
    text: "Learn by building — Android, web, ML, cloud and design sessions run by the leads themselves.",
  },
  {
    icon: Rocket,
    title: "Real projects",
    text: "Ship production apps, sites and games used by thousands of students on campus.",
  },
  {
    icon: Trophy,
    title: "Hackathons & contests",
    text: "Compete in CP contests, game jams and national hackathons with a team behind you.",
  },
  {
    icon: Users,
    title: "Community & network",
    text: "Events, sponsors and sister communities — plus Google developer resources and swag.",
  },
];

function DeptCard({ title, description, image, color, formLink }) {
  return (
    <Link
      href={formLink}
      className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function HomeSections() {
  const leadCount = reviews.flatMap((r) => r.leads ?? []).length;

  return (
    <>
      {/* About GDG VITC */}
      <section className="border-t">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-[1.2fr_1fr] sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              About GDG VITC
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Google Developer Groups on Campus, VIT Chennai
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              GDG VITC is a student-run developer community powered by Google
              developers technologies. We run workshops, build real products,
              compete in hackathons, and help members grow from curious
              beginners to confident builders — across {reviews.length}{" "}
              departments led by {leadCount} student leads.
            </p>
            <Link
              href="/departments"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-accent"
            >
              Explore departments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-3 self-center">
            {[
              { value: String(reviews.length), label: "Departments" },
              { value: String(leadCount), label: "Student leads" },
              { value: "2", label: "Applications max" },
              { value: "2026", label: "Recruitment" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border bg-card p-5 text-center shadow-sm"
              >
                <dd className="text-3xl font-extrabold">{s.value}</dd>
                <dt className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Departments showcase */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {technicalCards.map((c) => (
              <DeptCard key={c.title} {...c} />
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Community & creative
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {nonTechnicalCards.map((c) => (
              <DeptCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Why join
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            More than a club on your resume
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <p.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold">{p.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
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
        </div>
      </section>
    </>
  );
}
