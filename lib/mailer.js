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

/**
 * Best-effort status-change email. Returns true if sent, false if skipped
 * (mail not configured) — never throws so status updates always succeed.
 */
export async function sendStatusEmail({ to, name, dept, status }) {
  if (!transporter) {
    console.warn("Email not configured (EMAIL_USERNAME/EMAIL_PASSWORD missing), skipping status email.");
    return false;
  }
  const template = statusEmailTemplates[status];
  if (!template) return false;
  try {
    const html = template.body
      .replace(/#name/g, name ?? "")
      .replace(/#dept/g, dept ?? "");
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: template.subject.replace(/#dept/g, dept ?? ""),
      html,
    });
    return true;
  } catch (error) {
    console.error("Status email failed:", error?.message || error);
    return false;
  }
}
