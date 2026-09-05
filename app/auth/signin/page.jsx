"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import DWASFWLoader from "@/components/GDGLoader";
import BlurFade from "@/components/magicui/blur-fade";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // OTP-gated signup: details -> code -> verified account
  const [otpStep, setOtpStep] = useState("details"); // "details" | "code"
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [expiresAt, setExpiresAt] = useState(0);
  const [nowTick, setNowTick] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && session?.user && !isPending) {
      router.push("/");
    }
  }, [session, isPending, router, mounted]);

  // Countdown tickers for OTP expiry + resend cooldown
  useEffect(() => {
    if (mode !== "signup" || otpStep !== "code") return;
    const t = setInterval(() => {
      setNowTick(Date.now());
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [mode, otpStep]);

  const resetOtp = () => {
    setOtpStep("details");
    setOtp("");
    setResendIn(0);
    setExpiresAt(0);
  };

  if (!mounted || isPending) {
    return <DWASFWLoader />;
  }

  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (res?.error) {
        toast.error(res.error.message || "Google sign-in failed. Check GOOGLE_CLIENT_ID/SECRET in .env.local.");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Google sign-in failed. Is Google OAuth configured?");
    } finally {
      setGoogleLoading(false);
    }
  };

  const sendCode = async () => {
    if (!name) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!email) {
      toast.error("Please enter your email address.");
      return false;
    }
    setOtpSending(true);
    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      if (res?.error) {
        toast.error(res.error.message || "Could not send code. Check the email address.");
        return false;
      }
      setOtpStep("code");
      setOtp("");
      setExpiresAt(Date.now() + 5 * 60 * 1000);
      setResendIn(30);
      toast.success("Verification code sent! Check your inbox (and spam).");
      return true;
    } catch (err) {
      console.error("OTP send error:", err);
      toast.error("Could not send code. Please try again.");
      return false;
    } finally {
      setOtpSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // NOTE (testing): VIT email-domain check removed. Any email works.

    // Signup is gated behind email OTP verification
    if (mode === "signup" && otpStep === "details") {
      await sendCode();
      return;
    }

    if (mode === "signup") {
      if (otp.trim().length !== 6) {
        toast.error("Enter the 6-digit verification code.");
        return;
      }
      setSubmitting(true);
      try {
        const check = await authClient.emailOtp.checkVerificationOtp({
          email,
          type: "email-verification",
          otp: otp.trim(),
        });
        if (check?.error) {
          toast.error(check.error.message || "Invalid or expired code.");
          return;
        }
        const res = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/",
        });
        if (res?.error) {
          toast.error(res.error.message || "Failed to create account.");
        } else {
          toast.success("Email verified — account created!");
          router.push("/");
        }
      } catch (err) {
        console.error("Signup error:", err);
        toast.error("Verification failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (res?.error) {
        toast.error(res.error.message || "Invalid credentials.");
      } else {
        toast.success("Signed in successfully!");
        router.push("/");
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-primary/[0.06] via-background to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Recruitment 2026</h1>
        <p className="text-sm text-muted-foreground">Candidate Portal</p>
      </div>

      <Card>
        <BlurFade>
        <CardHeader>
          <CardTitle>{mode === "signin" ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in to start your application."
              : otpStep === "code"
                ? "Enter the code to verify your email."
                : "Create an account to apply (max 2 departments)."}
            <span className="mt-1 block text-xs">
              Testing mode: any email works (VIT restriction off).
            </span>
          </CardDescription>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant={mode === "signin" ? "default" : "outline"}
              size="sm"
              onClick={() => { setMode("signin"); resetOtp(); }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "outline"}
              size="sm"
              onClick={() => { setMode("signup"); resetOtp(); }}
            >
              Create Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="mb-4 w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c0 1.1-.7 2.7-2.1 3.8l-.1.1 3 2.4.2.1c1.9-1.8 3-4.4 3-7.6z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.1 2.4-.1.1C3.9 21.3 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3-2.4-.1.1C.7 8.9 0 10.4 0 12s.7 3.1 2 4.8l3.2-2.4z" />
              <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.7 0 3.9 2.7 2 6.6l3.2 2.5c1-2.9 3.7-4.4 6.8-4.4z" />
            </svg>
            {googleLoading ? "Connecting..." : "Sign in with Google"}
          </Button>
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or with email
            <span className="h-px flex-1 bg-border" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && otpStep === "details" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            {(mode === "signin" || otpStep === "details") && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={mode === "signup" && otpStep === "code"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={mode === "signup" && otpStep === "code"}
                  />
                </div>
              </>
            )}
            {mode === "signup" && otpStep === "code" && (
              <div className="space-y-3 rounded-xl border bg-background p-4">
                <p className="text-sm">
                  Code sent to <strong>{email}</strong>.{" "}
                  <button
                    type="button"
                    onClick={resetOtp}
                    className="font-semibold text-primary underline"
                  >
                    Wrong email?
                  </button>
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="otp">6-digit verification code</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    className="text-center text-2xl font-bold tracking-[0.5em]"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {expiresAt > nowTick
                    ? `Expires in ${Math.floor((expiresAt - nowTick) / 60000)}:${String(Math.floor(((expiresAt - nowTick) % 60000) / 1000)).padStart(2, "0")}`
                    : "Code expired — request a new one."}{" "}
                  <button
                    type="button"
                    disabled={otpSending || resendIn > 0}
                    onClick={sendCode}
                    className="font-semibold text-primary underline disabled:text-muted-foreground disabled:no-underline"
                  >
                    {otpSending ? "Sending..." : resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </p>
              </div>
            )}
            <Button
              type="submit"
              disabled={submitting || otpSending}
              className="w-full"
            >
              {mode === "signin"
                ? submitting ? "Signing in..." : "Sign In"
                : otpStep === "details"
                  ? otpSending ? "Sending code..." : "Send verification code"
                  : submitting ? "Verifying..." : "Verify & Create Account"}
            </Button>
          </form>
        </CardContent>
        </BlurFade>
      </Card>
    </main>
    </div>
  );
}
