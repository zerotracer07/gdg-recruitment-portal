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
              <p className="text-sm text-muted-foreground">Loading applications...</p>
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
                  className="flex items-center justify-between gap-3 rounded-xl border p-4"
                >
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
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
