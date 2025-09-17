import ProfileForm from "./profile-form";

export default function MyProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
        <p className="text-muted-foreground">
          Keep your profile updated for the best internship matches.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
