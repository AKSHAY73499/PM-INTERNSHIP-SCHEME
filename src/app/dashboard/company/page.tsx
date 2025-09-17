import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Company Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your internships and find the best talent.
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Company Analytics</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p>Analytics on applicant diversity and skill distribution will be shown here.</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>Feedback System</CardTitle>
        </CardHeader>
        <CardContent>
            <p>A section to rate interns after their internship completion will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
