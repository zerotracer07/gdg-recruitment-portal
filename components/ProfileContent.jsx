"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import InitialAvatar from "@/components/InitialAvatar";
import { authClient } from "@/lib/auth-client";
import { APPLICATION_STATUSES } from "@/constants";
import { LogOut, ArrowRight } from "lucide-react";

const TIMELINE = ["applied", "under_review", "interview"];

function StatusTimeline({ status }) {
  const current = status || "applied";
  const decided = current === "accepted" || current === "rejected";
  const accepted = current === "accepted";
  const currentIdx = decided ? 3 : Math.max(0, TIMELINE.indexOf(current));
  const steps = [
    ...TIMELINE.map((v) => APPLICATION_STATUSES.find((s) => s.value === v)),
    decided
      ? { value: current, label: accepted ? "Selected" : "Not selected", color: accepted ? "#16a34a" : "#dc2626" }
      : { value: "result", label: "Result", color: "#94a3b8" },
  ];

  return (
    <div className="mt-3" aria-label={`Application progress: ${steps[currentIdx]?.label}`}>
      <div className="flex items-center">
        {steps.map((s, i) => {
          const done = i < currentIdx || (decided && i <= currentIdx);
          const isCurrent = i === currentIdx;
          return (
            <div key={s.value + i} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                    isCurrent ? "ring-2 ring-offset-2" : ""
                  }`}
                  style={{
                    borderColor: s.color,
                    backgroundColor: done ? s.color : "transparent",
                    color: done ? "#fff" : s.color,
                    ["--tw-ring-color"]: s.color,
                  }}
                >
                  {done ? "✓" : ""}
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className="mx-1 mb-5 h-0.5 flex-1 rounded"
                  style={{ backgroundColor: i < currentIdx ? s.color : "#e2e8f0" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [apps, setApps] = useState(null);

  useEffect(() => setMounted(true), []);

  const user = session?.user;

  useEffect(() => {
    if (!mounted || isPending || !user?.email) return;
    let live = true;
    fetch(`/api/get-submissions?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((d) => {
        if (live) setApps(d.data ?? []);
      })
      .catch(() => {
        if (live) setApps([]);
      });
    return () => {
      live = false;
    };
  }, [mounted, isPending, user?.email]);

  if (!mounted || isPending) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <div className="mx-auto max-w-2xl p-8 text-center">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <div className="mx-auto max-w-md px-4 py-10">
          <section className="rounded-2xl border bg-card p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold">Sign in required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to view your profile and applications.
            </p>
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Sign In
            </button>
          </section>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <section className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/gdg.svg" alt="GDG VITC" className="hidden h-12 w-12 sm:block" />
          <InitialAvatar name={user.name} email={user.email} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold">{user.name || "Candidate"}</h1>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            {user.role === "admin" && (
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                ADMIN
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.push("/auth/signout")}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">
              My Applications {apps ? `(${apps.length}/2)` : ""}
            </h2>
            {apps && apps.length < 2 && (
              <Link
                href="/departments"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                Apply <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {apps === null && (
              <div className="space-y-3" aria-label="Loading applications">
                {[0, 1].map((i) => (
                  <div key={i} className="rounded-xl border p-4">
                    <div className="skeleton h-4 w-1/3 rounded" />
                    <div className="skeleton mt-2 h-3 w-1/2 rounded" />
                    <div className="mt-3 flex items-center gap-2">
                      {[0, 1, 2, 3].map((d) => (
                        <span key={d} className="skeleton h-5 w-5 rounded-full" />
                      ))}
                      <span className="skeleton h-2 flex-1 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {apps !== null && apps.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm font-semibold">No applications yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick up to two departments and apply in minutes.
                </p>
                <Link
                  href="/departments"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Browse departments <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
            {(apps ?? []).map((a) => {
              const meta = APPLICATION_STATUSES.find((s) => s.value === (a.status || "applied"));
              return (
                <div
                  key={a.id || a._id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{a.Department}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied{a.createdAt ? ` · ${new Date(a.createdAt).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                      style={{ backgroundColor: meta?.color || "#64748b" }}
                    >
                      {meta?.label || "Applied"}
                    </span>
                  </div>
                  <StatusTimeline status={a.status} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
