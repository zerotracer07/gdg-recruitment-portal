import nodemailer from "nodemailer";
import { statusEmailTemplates } from "@/constants";

const hasMailCreds = Boolean(process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD);

const transporter = hasMailCreds
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

export const isMailConfigured = () => hasMailCreds;

// Branded wrapper: GDG 4-color top bar + card + footer. Applied to all
// automated mails (status, welcome, confirmation) — not to custom admin mail.
const brand = (inner) => `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;background:#f1f5f9;padding:24px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr><td style="height:6px;font-size:0;background:#4285F4;"></td></tr>
      <tr><td style="height:3px;font-size:0;background:#EA4335;"></td></tr>
      <tr><td style="padding:8px 28px 0;font-size:18px;font-weight:bold;color:#0f172a;">GDG VITC <span style="font-weight:normal;color:#64748b;font-size:13px;">Recruitment 2026</span></td></tr>
      <tr><td style="padding:12px 28px 24px;color:#1f2937;font-size:14px;line-height:1.65;">${inner}</td></tr>
      <tr><td style="padding:14px 28px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.5;">GDG VITC · Recruitment Team<br/>This is an automated email — please do not reply. Need help? Visit the Support page on the portal.</td></tr>
    </table>
  </td></tr>
</table>`;

/** Generic best-effort sender. Resolves true if sent, false otherwise. Never throws. */
export async function sendMail({ to, subject, html }) {
  if (!transporter || !to || !subject || !html) {
    if (!transporter) {
      console.warn("Email not configured (EMAIL_USERNAME/EMAIL_PASSWORD missing), skipping email.");
    }
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Send email failed:", error?.message || error);
    return false;
  }
}

/**
 * Best-effort status-change email. Returns true if sent, false if skipped
 * (mail not configured) — never throws so status updates always succeed.
 */
export async function sendStatusEmail({ to, name, dept, status }) {
  const template = statusEmailTemplates[status];
  if (!template) return false;
  return sendMail({
    to,
    subject: template.subject.replace(/#dept/g, dept ?? ""),
    html: brand(
      template.body
        .replace(/#name/g, name ?? "")
        .replace(/#dept/g, dept ?? "")
    ),
  });
}

/** OTP verification code email (6 digits, 5-minute expiry). */
export async function sendOtpEmail({ to, otp }) {
  return sendMail({
    to,
    subject: "Your GDG VITC verification code",
    html: brand(
      `<p>Hi there,</p><p>Use this code to verify your email and finish creating your account. It expires in <strong>5 minutes</strong>:</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;margin:20px 0;">${otp}</p><p style="color:#64748b;font-size:13px;">Didn't request this? Ignore this email.</p>`
    ),
  });
}

/** Welcome email for brand-new accounts (signup verification greeting). */
export async function sendWelcomeEmail({ to, name }) {
  return sendMail({
    to,
    subject: "Welcome to GDG VITC Recruitment 2026!",
    html: brand(
      `<p>Hi ${name ?? "there"},</p><p>Your account is ready — this email confirms <strong>${to}</strong> is verified on the GDG VITC recruitment portal.</p><p><strong>Next step:</strong> pick up to two departments and submit your application before the deadline.</p>`
    ),
  });
}

/** Confirmation email after application submission. */
export async function sendApplicationEmail({ to, name, departments }) {
  const list = (departments || []).map((d) => `<li>${d}</li>`).join("");
  return sendMail({
    to,
    subject: "Application received — GDG VITC",
    html: brand(
      `<p>Hi ${name ?? "there"},</p><p>We received your application for:</p><ul>${list}</ul><p>Track your status anytime under <strong>My Applications</strong>. Good luck!</p>`
    ),
  });
}
