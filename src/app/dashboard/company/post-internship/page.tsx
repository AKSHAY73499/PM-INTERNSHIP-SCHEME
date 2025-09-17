import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PostInternshipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Post a New Internship</h1>
        <p className="text-muted-foreground">
          Fill out the details below to reach thousands of students.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
          <CardDescription>Provide information about the role and requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Internship Role / Title</Label>
              <Input id="role" placeholder="e.g., Software Development Intern" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input id="skills" placeholder="e.g., React, Node.js, Python" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., Mumbai, Remote" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="capacity">Internship Capacity</Label>
              <Input id="capacity" type="number" placeholder="e.g., 5" />
            </div>
            <Button>Post Internship</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
