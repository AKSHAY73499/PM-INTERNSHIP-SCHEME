
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, MapPin, DollarSign, TrendingUp, Bookmark } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Internship = {
  companyName: string;
  title: string;
  location: string;
  description: string;
  requiredSkills: string[];
  compensation: string;
  matchScore?: number;
};

const APPLY_THRESHOLD = 70;

export default function InternshipCard({ internship }: { internship: Internship }) {
  const { toast } = useToast();
  const [applications, setApplications] = useLocalStorage<any[]>('tracked-applications', []);
  
  const canApply = internship.matchScore && internship.matchScore >= APPLY_THRESHOLD;

  const handleApplication = () => {
    const isAlreadyTracked = applications.some(app => app.title === internship.title && app.companyName === internship.companyName);

    if (isAlreadyTracked) {
        toast({
            title: "Already Tracked",
            description: "You are already tracking or have applied for this internship.",
            variant: "default"
        });
        return;
    }
    
    const newStatus = canApply ? 'Applied' : 'Interested';

    const newApplication = {
        ...internship,
        status: newStatus,
        appliedDate: new Date().toISOString(),
    }
    setApplications([...applications, newApplication]);
    
    if(canApply) {
        toast({
          title: "Application Submitted",
          description: `Your application for "${internship.title}" has been sent to ${internship.companyName}. It is now pending company review.`,
        });
    } else {
        toast({
          title: "Internship Tracked",
          description: `"${internship.title}" has been added to your tracked applications with 'Interested' status.`,
        });
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
            <Image 
                src={`https://picsum.photos/seed/${internship.companyName.replace(/\s/g, '')}/50/50`} 
                alt={`${internship.companyName} logo`} 
                width={50} height={50}
                className="rounded-lg border"
                data-ai-hint="logo abstract"
            />
            <div className="flex-1">
                <CardTitle className="font-headline text-lg">{internship.title}</CardTitle>
                <CardDescription>{internship.companyName}</CardDescription>
            </div>
             {internship.matchScore && (
                <Badge variant={internship.matchScore > 80 ? 'default' : 'secondary'} className="flex gap-1 items-center">
                    <TrendingUp className="h-3 w-3" />
                    {internship.matchScore}%
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground">{internship.description}</p>
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{internship.location}</span>
            </div>
            <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{internship.compensation}</span>
            </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {internship.requiredSkills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleApplication} className="w-full">
          {canApply ? (
            <>
              <Send className="mr-2 h-4 w-4" /> Apply Now
            </>
          ) : (
             <>
              <Bookmark className="mr-2 h-4 w-4" /> Track Application
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
