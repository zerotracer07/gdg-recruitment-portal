import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Terms of Service | Recruitment Portal",
  description: "Rules for using the GDG VITC recruitment portal.",
};

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terms of Service" updated="September 2026">
      <p>
        By creating an account or submitting an application on this portal, you agree to
        these terms.
      </p>
      <h2>Eligibility</h2>
      <ul>
        <li>You must be a VIT student with a valid VIT email address.</li>
        <li>You may submit at most 2 department applications per recruitment cycle.</li>
        <li>One account per person. Duplicate or fake accounts may be removed.</li>
      </ul>
      <h2>Your submissions</h2>
      <ul>
        <li>Provide accurate information. Plagiarised or false applications may be rejected.</li>
        <li>Submitting an application does not guarantee selection — all decisions by the recruitment team are final.</li>
        <li>Application content you submit may be reviewed by club admins and department leads.</li>
      </ul>
      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to access other applicants&apos; data or admin functions.</li>
        <li>Do not abuse the platform (spam, automated submissions, security probing).</li>
        <li>Accounts violating these terms may be suspended.</li>
      </ul>
      <h2>Availability</h2>
      <p>
        This is a student-run service provided as-is. We may pause it for maintenance or close
        applications after the published deadline.
      </p>
    </InfoPage>
  );
}
