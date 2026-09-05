import { createHash, randomInt } from "crypto";
import { connect } from "@/lib/db";

const CODE_TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 30 * 1000;
const MAX_ATTEMPTS = 3;

const pepper = () => process.env.BETTER_AUTH_SECRET || "dev-pepper";

const hash = (email, otp) =>
  createHash("sha256")
    .update(`${email.toLowerCase().trim()}|${otp}|${pepper()}`)
    .digest("hex");

/**
 * Issue a new 6-digit code. Enforces a 30s resend cooldown.
 * Returns { ok, retryAfterMs } or { ok:false, message }.
 */
export async function issueCode(rawEmail) {
  const email = rawEmail.toLowerCase().trim();
  const db = await connect();
  const col = db.collection("otpCodes");

  const existing = await col.where("email", "==", email).get();
  const now = Date.now();
  for (const doc of existing.docs) {
    const created = new Date(doc.data().createdAt?.toDate?.() || doc.data().createdAt).getTime();
    if (!Number.isNaN(created) && now - created < RESEND_MS) {
      return { ok: false, retryAfterMs: RESEND_MS - (now - created), message: "Please wait before requesting a new code." };
    }
    await doc.ref.delete();
  }

  const otp = String(randomInt(100000, 1000000));
  await col.add({
    email,
    hash: hash(email, otp),
    attempts: 0,
    createdAt: new Date(),
    expiresAt: new Date(now + CODE_TTL_MS),
  });
  return { ok: true, otp };
}

/**
 * Verify a code. Consumes it on success; locks after MAX_ATTEMPTS.
 * Returns { ok:true } or { ok:false, message }.
 */
export async function checkCode(rawEmail, rawOtp) {
  const email = rawEmail.toLowerCase().trim();
  const otp = String(rawOtp || "").trim();
  const db = await connect();
  const col = db.collection("otpCodes");

  const snap = await col.where("email", "==", email).get();
  if (snap.empty) {
    return { ok: false, message: "No code found. Request a new one." };
  }
  const doc = snap.docs[0];
  const data = doc.data();
  const now = Date.now();
  const expires = new Date(data.expiresAt?.toDate?.() || data.expiresAt).getTime();

  if (!Number.isNaN(expires) && now > expires) {
    await doc.ref.delete();
    return { ok: false, message: "Code expired. Request a new one." };
  }
  if ((data.attempts || 0) >= MAX_ATTEMPTS) {
    await doc.ref.delete();
    return { ok: false, message: "Too many attempts. Request a new code." };
  }
  if (data.hash !== hash(email, otp)) {
    await doc.ref.update({ attempts: (data.attempts || 0) + 1 });
    return { ok: false, message: "Invalid code. Check and try again." };
  }
  await doc.ref.delete();
  return { ok: true };
}
