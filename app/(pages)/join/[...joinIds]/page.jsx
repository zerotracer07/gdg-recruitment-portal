"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { reviews } from "@/constants/index";

import NavBar from "@/components/NavBar";
import FormComp from "@/components/FormComp";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";

const JoinDepartmentPage = ({ params }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const joinIds = params?.joinIds ?? [];

  if (!joinIds.length) {
    notFound();
  }

  if (!mounted || isPending) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <div className="mx-auto max-w-xl p-8 text-center">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  const valid = joinIds.every((id) => reviews.some((dept) => dept.id === id));

  if (!valid) {
    notFound();
  }

  const departments = reviews.filter((dept) => joinIds.includes(dept.id));
  const user = session?.user;

  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 py-8">
        {user ? (
          <FormComp dept1={departments[0]} dept2={departments[1]} />
        ) : (
          <section className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold">Authentication Required</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in to access the application form.
            </p>
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Sign In
            </button>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default JoinDepartmentPage;
