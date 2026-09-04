"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import Footer from "@/components/Footer";
import PopupComp from "@/components/PopupComp";
import { authClient } from "@/lib/auth-client";

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavBar />
      {mounted && !isPending && !user && (
        <PopupComp
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          PopupData={{
            header: "Recruitment Notice",
            description: "Welcome to the recruitment portal.",
            message: [
              "Sign in with your email address to begin your application.",
              "You can apply to up to two departments.",
            ],
          }}
        />
      )}
      <Hero />
      <HomeSections />
      <Footer />
    </main>
  );
};

export default Home;
