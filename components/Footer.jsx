"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/gdg.svg" alt="GDG VITC" className="h-9 w-9" />
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight">
                Recruitment Portal
              </span>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Google Developer Groups on Campus · VIT Chennai
              </span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            Twelve departments. One community. Zero spectators.
          </p>
        </div>
        <nav aria-label="Explore">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground transition hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/departments" className="text-muted-foreground transition hover:text-foreground">
                Departments
              </Link>
            </li>
            <li>
              <Link href="/auth/signin" className="text-muted-foreground transition hover:text-foreground">
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Apply">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Apply
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/departments" className="text-muted-foreground transition hover:text-foreground">
                Pick departments
              </Link>
            </li>
            <li>
              <Link href="/auth/signin" className="text-muted-foreground transition hover:text-foreground">
                Create account
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-muted-foreground transition hover:text-foreground">
                My applications
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Legal and help">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Legal & Help
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/support" className="text-muted-foreground transition hover:text-foreground">
                Support & FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-muted-foreground transition hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground transition hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/guidelines" className="text-muted-foreground transition hover:text-foreground">
                Community Guidelines
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>GDG VITC · Recruitment Portal {year}</p>
          <div className="flex items-center gap-1.5" aria-label="Built with">
            {["Next.js", "Firebase", "Better-Auth"].map((t) => (
              <span
                key={t}
                className="rounded-full border bg-card px-2.5 py-1 text-[10px] font-semibold transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <p>Built by students, for students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
