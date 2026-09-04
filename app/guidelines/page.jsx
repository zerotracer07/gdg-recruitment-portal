import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Community Guidelines | Recruitment Portal",
  description: "How we expect members and applicants of GDG VITC to behave.",
};

export default function GuidelinesPage() {
  return (
    <InfoPage eyebrow="Legal" title="Community Guidelines" updated="September 2026">
      <p>
        GDG VITC is an open, welcoming developer community. These guidelines apply to
        applicants, members, events, and all community spaces.
      </p>
      <h2>Be respectful</h2>
      <ul>
        <li>No harassment, discrimination, or hate speech — on any ground.</li>
        <li>Give constructive feedback; assume good intent.</li>
        <li>Respect reviewers&apos; time: write your own answers, keep them honest and concise.</li>
      </ul>
      <h2>Be collaborative</h2>
      <ul>
        <li>Help fellow applicants and members learn — we grow together.</li>
        <li>Credit others&apos; work. Do not submit plagiarised content or code.</li>
        <li>Follow event rules and instructions from organisers and volunteers.</li>
      </ul>
      <h2>Reporting</h2>
      <p>
        If you experience or witness behaviour violating these guidelines, reach out through
        the support page. Reports are handled confidentially, and violations may lead to
        application rejection or removal from the community.
      </p>
    </InfoPage>
  );
}
