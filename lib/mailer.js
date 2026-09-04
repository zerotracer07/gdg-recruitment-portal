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
    html: template.body
      .replace(/#name/g, name ?? "")
      .replace(/#dept/g, dept ?? ""),
  });
}

/** Welcome email for brand-new accounts (signup verification greeting). */
export async function sendWelcomeEmail({ to, name }) {
  return sendMail({
    to,
    subject: "Welcome to GDG VITC Recruitment 2026!",
    html: `<p>Hi ${name ?? "there"},</p><p>Your account is ready — this email confirms <strong>${to}</strong> is verified on the GDG VITC recruitment portal.</p><p>Next step: pick up to two departments and submit your application.</p><p>— GDG VITC Recruitment Team</p>`,
  });
}

/** Confirmation email after application submission. */
export async function sendApplicationEmail({ to, name, departments }) {
  const list = (departments || []).map((d) => `<li>${d}</li>`).join("");
  return sendMail({
    to,
    subject: "Application received — GDG VITC",
    html: `<p>Hi ${name ?? "there"},</p><p>We received your application for:</p><ul>${list}</ul><p>Track your status anytime under My Applications. Good luck!</p><p>— GDG VITC Recruitment Team</p>`,
  });
}
