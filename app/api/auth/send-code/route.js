import { NextResponse } from "next/server";
import { issueCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const issued = await issueCode(email);
    if (!issued.ok) {
      return NextResponse.json(
        { message: issued.message, retryAfterMs: issued.retryAfterMs || 0 },
        { status: 429 }
      );
    }

    const sent = await sendOtpEmail({ to: email, otp: issued.otp });
    if (!sent) {
      return NextResponse.json(
        { message: "Could not send the code. Email service is unavailable — try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send-code error:", error);
    return NextResponse.json({ message: "Could not send the code." }, { status: 500 });
  }
}
