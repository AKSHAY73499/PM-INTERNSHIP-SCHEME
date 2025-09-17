import ProfileForm from "./profile-form";
import { Separator } from "@/components/ui/separator";

export default function MyProfilePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
        <p className="text-muted-foreground">
          Keep your profile updated for the best internship matches.
        </p>
      </header>
      <Separator />
      <ProfileForm />
    </div>
  );
}
