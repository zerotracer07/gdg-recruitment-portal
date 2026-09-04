import nodemailer from "nodemailer";
import { reviews } from "@/constants";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function POST(req) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "admin") {
        return new Response(
            JSON.stringify({ error: "Admin access required" }),
            { status: 403 }
        );
    }

    const { recipients, payloadData } = await req.json();

    if (!recipients || recipients.length === 0) {
        return new Response(
            JSON.stringify({ error: "No recipients provided" }),
            { status: 400 }
        );
    }

    if (!payloadData?.subject || !payloadData?.body) {
        return new Response(
            JSON.stringify({ error: "Subject and body are required" }),
            { status: 400 }
        );
    }

    try {
        for (const recipient of recipients) {
            const depart = recipient.Department;
            const dept = reviews.find((item) => item.name === depart);
            if (!dept) {
                console.warn(`Unknown department: ${depart}, skipping recipient ${recipient.Email}`);
                continue;
            }

            const deptName = dept.name;

            let generalTemp = `
                <div>
                    ${payloadData.body}
                </div>
                `;

            generalTemp = generalTemp.replace(/#name/g, recipient.Name ?? "");
            generalTemp = generalTemp.replace(/#dept/g, deptName);

            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: recipient.Email,
                subject: payloadData.subject,
                html: generalTemp,
            };

            await transporter.sendMail(mailOptions);
        }

        return new Response(
            JSON.stringify({ message: "Emails sent successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Send email error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to send emails" }),
            { status: 500 }
        );
    }
}
