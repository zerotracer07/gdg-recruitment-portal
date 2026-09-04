import InfoPage from "@/components/InfoPage";
import Link from "next/link";

export const metadata = {
  title: "Support & FAQ | Recruitment Portal",
  description: "Help with applying to GDG VITC.",
};

const FAQS = [
  {
    q: "How do I apply?",
    a: "Sign in, go to Departments, pick up to two departments, and fill the application form. Your answers auto-save as a draft.",
  },
  {
    q: "Which email should I use?",
    a: "Your VIT email (vitstudent.ac.in or vit.ac.in). Other emails cannot sign up or apply.",
  },
  {
    q: "How many departments can I apply to?",
    a: "A maximum of two unique departments per recruitment cycle.",
  },
  {
    q: "How do I know my application status?",
    a: "Visit My Applications from the account menu. Admins update statuses (Applied → Under Review → Interview → Accepted/Rejected) and you are emailed on every change.",
  },
  {
    q: "I didn't get an email. What now?",
    a: "Check spam first. Status updates come from our Gmail sender — if nothing arrived within a day of a status change, contact us below.",
  },
  {
    q: "Can I edit my application after submitting?",
    a: "Submitted applications are locked for review. If you made a serious error, contact the recruitment team.",
  },
];

export default function SupportPage() {
  return (
    <InfoPage eyebrow="Help Center" title="Support & FAQ" updated="September 2026">
      <div className="!space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="rounded-xl border bg-background p-4 [&_p]:mt-2 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-foreground"
          >
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <h2>Still stuck?</h2>
      <p>
        Reach the recruitment team via your department leads, or{" "}
        <Link href="/departments" className="font-semibold text-primary">
          browse departments
        </Link>{" "}
        to find the right point of contact.
      </p>
    </InfoPage>
  );
}
