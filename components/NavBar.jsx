"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "./UserButton";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const links = [
    { href: "/departments", label: "Departments" },
    ...(mounted && user && isAdmin
      ? [{ href: "/admin", label: "Admin Panel" }]
      : []),
  ];

  // Stable placeholder until mounted to avoid hydration mismatch
  const authArea =
    !mounted || isPending ? (
      <span className="text-sm text-muted-foreground">Loading...</span>
    ) : !user ? (
      <Link
        href="/auth/signin"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90"
      >
        Sign In
      </Link>
    ) : (
      <UserButton user={user} />
    );

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-background transition-shadow ${
        scrolled ? "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/gdg.svg"
            alt="GDG VITC"
            className="h-8 w-8 transition-transform group-hover:scale-105"
          />
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight">
              Recruitment Portal
            </span>
            <span className="block text-[11px] font-medium text-muted-foreground">
              GDG VITC · 2026
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            href="/departments"
            className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition hover:bg-accent"
          >
            <span className="relative flex h-1.5 w-1.5" aria-label="Applications open">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            <span className={pathname === "/departments" ? "text-foreground" : "text-muted-foreground"}>
              Departments
            </span>
            {pathname === "/departments" && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[#4285F4] to-[#7B61FF] shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
            )}
          </Link>
          {links
            .filter((l) => l.href !== "/departments")
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative rounded-lg px-3 py-2 font-medium transition hover:bg-accent"
              >
                <span className={pathname === l.href ? "text-foreground" : "text-muted-foreground"}>
                  {l.label}
                </span>
                {pathname === l.href && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[#4285F4] to-[#7B61FF] shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
                )}
              </Link>
            ))}
          <span className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            {authArea}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <span>{authArea}</span>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border p-2 transition hover:bg-accent"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t bg-background px-4 py-3 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-accent ${
                pathname === l.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default NavBar;
