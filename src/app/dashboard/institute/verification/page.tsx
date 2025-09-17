import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstituteVerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Document Verification</h1>
        <p className="text-muted-foreground">
          Approve student certificates and academic records.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A list of students awaiting document verification will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
