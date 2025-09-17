import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Download region-wise statistics and reports.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Admin analytics and reporting tools will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
