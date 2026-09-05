import { NextResponse } from "next/server";
import { checkCode } from "@/lib/otp";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, otp } = await req.json().catch(() => ({}));
    if (!email || !otp) {
      return NextResponse.json({ message: "Email and code are required." }, { status: 400 });
    }
    const result = await checkCode(email, otp);
    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify-code error:", error);
    return NextResponse.json({ message: "Verification failed." }, { status: 500 });
  }
}
