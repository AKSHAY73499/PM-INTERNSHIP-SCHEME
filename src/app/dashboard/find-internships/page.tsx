import InternshipMatcher from "./internship-matcher";

export default function FindInternshipsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Find Your Perfect Internship</h1>
        <p className="text-muted-foreground">
          Use our AI-powered tool to discover opportunities tailored to you.
        </p>
      </div>
      <InternshipMatcher />
    </div>
  );
}
