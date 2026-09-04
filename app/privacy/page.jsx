import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Privacy Policy | Recruitment Portal",
  description: "How GDG VITC collects, uses, and protects your application data.",
};

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Policy" updated="September 2026">
      <p>
        GDG VITC (Google Developer Groups on Campus, VIT Chennai) runs this recruitment
        portal to collect and review membership applications. This policy explains what we
        collect and how we use it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account data: name and email address (VIT email required).</li>
        <li>Application data: registration number, phone, year of study, department choices, and your answers to screening questions.</li>
        <li>Decision data: application status, reviewer notes, and timestamps.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To review applications and communicate decisions (shortlist, interview, selection).</li>
        <li>To send recruitment emails you trigger by applying or that admins send about your status.</li>
        <li>To produce aggregate statistics (e.g. applications per department).</li>
      </ul>
      <h2>Who can see it</h2>
      <ul>
        <li>Club admins and department leads reviewing applications.</li>
        <li>Your own submissions are visible only to you and admins — never to other applicants.</li>
        <li>We do not sell your data or share it with third parties except our infrastructure providers (hosting, database, email delivery).</li>
      </ul>
      <h2>Data retention & your rights</h2>
      <p>
        Application data is kept for the recruitment cycle and a reasonable period afterwards
        for records. You may request a copy, correction, or deletion of your data by contacting
        the recruitment team through the support page.
      </p>
      <h2>Cookies</h2>
      <p>
        We use strictly necessary cookies only — to keep you signed in and remember your
        session. There is no advertising or cross-site tracking.
      </p>
    </InfoPage>
  );
}
