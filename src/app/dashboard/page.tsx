import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Lightbulb, Search, Target, Award, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Welcome, Student!</h1>
        <p className="text-muted-foreground">Here's your career journey at a glance.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/find-internships">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommended Internships</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Based on your profile</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/skill-analysis">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills to Develop</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">To match your desired roles</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/my-applications">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Track their status now</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/my-profile">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">Complete it for better matches</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
              <Link href="/dashboard/find-internships">
                 <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer h-full">
                  <Search className="h-6 w-6 text-primary mb-2"/>
                  <h3 className="font-semibold">Find Internships</h3>
                  <p className="text-sm text-muted-foreground">Search and filter opportunities.</p>
                </div>
              </Link>
             <Link href="/dashboard/my-profile">
                <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer h-full">
                  <Target className="h-6 w-6 text-primary mb-2"/>
                  <h3 className="font-semibold">Update Your Profile</h3>
                  <p className="text-sm text-muted-foreground">Keep your info current.</p>
                </div>
             </Link>
             <Link href="/dashboard/skill-analysis">
                <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer h-full">
                  <Lightbulb className="h-6 w-6 text-primary mb-2"/>
                  <h3 className="font-semibold">Analyze Skill Gaps</h3>
                  <p className="text-sm text-muted-foreground">Find areas to improve.</p>
                </div>
             </Link>
             <Link href="/dashboard/my-applications">
                <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer h-full">
                  <Briefcase className="h-6 w-6 text-primary mb-2"/>
                  <h3 className="font-semibold">Track Applications</h3>
                  <p className="text-sm text-muted-foreground">Monitor your progress.</p>
                </div>
             </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Resources</CardTitle>
            <CardDescription>Helpful articles and guides for your internship journey.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <BookOpen className="h-5 w-5 text-accent"/>
                <span className="text-sm font-medium">Resume Building Guide</span>
            </Link>
             <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Award className="h-5 w-5 text-accent"/>
                <span className="text-sm font-medium">Interview Preparation Tips</span>
            </Link>
             <Button variant="outline" className="mt-4">View All Resources</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
