import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function InstituteDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Institute Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your students and gain valuable insights.
        </p>
      </div>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Tracking</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p>Statistics on how many students got internships will be shown here.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Institute-wide insights (e.g., 40% of students lack Python skills) will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
