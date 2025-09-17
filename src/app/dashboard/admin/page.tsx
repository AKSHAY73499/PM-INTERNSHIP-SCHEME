import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overall monitoring and platform management.
        </p>
      </div>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Monitoring</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p>Key platform metrics for student registrations and company postings will be shown here.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
        </CardHeader>
        <CardContent>
            <p>A section to handle issues raised by students/companies.</p>
        </CardContent>
      </Card>
    </div>
  );
}
