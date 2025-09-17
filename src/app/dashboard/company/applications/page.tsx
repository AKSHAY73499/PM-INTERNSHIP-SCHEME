import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanyApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Received Applications</h1>
        <p className="text-muted-foreground">
          View AI-shortlisted candidates and manage your hiring process.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Shortlist Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A sorted list of student applications with match percentages will be shown here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
