import { betterAuth } from "better-auth";
import { firestoreAdapter } from "better-auth-firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const appOptions = { projectId: firebaseProjectId };
if (firebaseClientEmail && firebasePrivateKey) {
  appOptions.credential = cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(appOptions);
const firestore = getFirestore(app);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  // Accept requests from the configured production URL (fixes "Invalid origin"
  // when BETTER_AUTH_URL differs from localhost).
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(Boolean),
  database: firestoreAdapter({
    firestore,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (reduces re-login and session creation writes)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
    updateAge: 60 * 60 * 24, // 1 day (prevent frequent session writes)
  },
  emailAndPassword: {
    enabled: true,
  },
  // NOTE (testing): VIT email-domain restriction removed. Re-add the
  // hooks.before check with ALLOWED_EMAIL_DOMAINS to re-enable.
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Welcome email for brand-new accounts (email signup + first Google login).
      // Fire-and-forget so auth responses are never delayed by SMTP.
      try {
        const user = ctx.context?.newSession?.user;
        if (user?.email) {
          const ageMs = Date.now() - new Date(user.createdAt || 0).getTime();
          if (!Number.isNaN(ageMs) && ageMs < 10 * 60 * 1000) {
            const { sendWelcomeEmail } = await import("@/lib/mailer");
            sendWelcomeEmail({ to: user.email, name: user.name }).catch((e) =>
              console.error("Welcome email failed:", e?.message || e)
            );
          }
        }
      } catch (e) {
        console.error("Welcome hook failed:", e?.message || e);
      }
    }),
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(), // This must be the last plugin in the array
  ],
});