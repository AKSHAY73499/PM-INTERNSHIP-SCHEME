import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstituteStudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Student List</h1>
        <p className="text-muted-foreground">
          See all your institute's students and their application statuses.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A list of students from your institute with their details and application statuses will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
