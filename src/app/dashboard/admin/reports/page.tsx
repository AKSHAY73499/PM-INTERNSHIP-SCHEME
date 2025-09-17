import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Fairness Reports</h1>
        <p className="text-muted-foreground">
          Monitor diversity and inclusion across the platform.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Diversity Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reports on rural, gender, and social category diversity will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
