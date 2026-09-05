import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendApplicationEmail } from "@/lib/mailer";
import { isAllowedEmail, ALLOWED_EMAIL_DOMAINS } from "@/constants";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    // Production: applications require a VIT email (covers Google OAuth too).
    if (!isAllowedEmail(userEmail)) {
      return new Response(
        JSON.stringify({
          message: `Applications require a VIT email (${ALLOWED_EMAIL_DOMAINS.join(" or ")}).`,
        }),
        { status: 403 }
      );
    }

    const deadline = process.env.APPLICATION_DEADLINE
      ? new Date(process.env.APPLICATION_DEADLINE)
      : new Date("2026-09-30T23:59:59+05:30");
    if (new Date() > deadline)
      return new Response(
        JSON.stringify({
          message: "The submission deadline has passed"
        }),
        { status: 403 }
      );
                  

    const db = await connect();
    const data = await req.json();

    const { Department, Questions, ...formFields } = data;

    const regNoRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    if (formFields.RegistrationNumber && !regNoRegex.test(formFields.RegistrationNumber)) {
      return new Response(
        JSON.stringify({
          message: "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)",
        }),
        { status: 400 }
      );
    }

    const collection = db.collection("formData");

    const existingSubmissions = await collection.where("Email", "==", userEmail).get();

    const alreadySubmittedDept = existingSubmissions.docs.some(
      (doc) => doc.data()?.Department === Department
    );

    if (alreadySubmittedDept) {
      return new Response(
        JSON.stringify({
          message: `You have already submitted an application for ${Department}`,
        }),
        { status: 400 }
      );
    }

    if (existingSubmissions.size >= 2) {
      return new Response(
        JSON.stringify({
          message: "Remember that you can only submit upto 2 unique applications",
        }),
        { status: 400 }
      );
    }

    await collection.add({
      ...formFields,
      Department,
      Questions,
      Email: userEmail,
      status: "applied",
      statusNote: "",
      shortlisted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fire-and-forget confirmation (never blocks the response).
    sendApplicationEmail({
      to: userEmail,
      name: formFields.Name,
      departments: [Department],
    }).catch((e) => console.error("Application email failed:", e?.message || e));

    return new Response(
      JSON.stringify({
        message: "Form submitted successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(JSON.stringify({ message: "Error submitting form" }), {
      status: 500,
    });
  }
}
