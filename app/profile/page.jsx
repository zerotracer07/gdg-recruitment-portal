import ProfileContent from "@/components/ProfileContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile | Recruitment Portal",
  description: "View your profile and application history.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
