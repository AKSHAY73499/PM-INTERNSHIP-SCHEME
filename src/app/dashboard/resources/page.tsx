
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Award, Briefcase, FileText } from "lucide-react";
import Link from "next/link";

const resources = [
    {
        title: "The Ultimate Resume Building Guide for Interns",
        description: "Learn how to craft a resume that stands out to recruiters and lands you your dream internship.",
        icon: FileText,
        href: "https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume"
    },
    {
        title: "Ace Your Interview: Top 10 Preparation Tips",
        description: "From common questions to body language, we cover everything you need to know to impress in your interviews.",
        icon: Award,
        href: "https://www.indeed.com/career-advice/interviewing/interview-tips-for-internships"
    },
    {
        title: "How to Network Effectively at Career Fairs",
        description: "Discover strategies to make meaningful connections and leave a lasting impression on potential employers.",
        icon: Briefcase,
        href: "https://careers.northeastern.edu/blog/how-to-network-at-a-career-fair/"
    },
    {
        title: "Understanding Skill Gaps and How to Bridge Them",
        description: "A deep dive into identifying the skills you need and finding the right courses to get you there.",
        icon: BookOpen,
        href: "https://www.coursera.org/articles/skill-gap"
    }
]

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Student Resources</h1>
        <p className="text-muted-foreground">
          Helpful articles and guides for your entire internship journey.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((resource, index) => (
            <Link href={resource.href} key={index} className="no-underline" target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-start gap-4">
                        <resource.icon className="h-8 w-8 text-accent"/>
                        <div>
                            <CardTitle className="font-headline text-lg">{resource.title}</CardTitle>
                            <CardDescription className="mt-2">{resource.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
