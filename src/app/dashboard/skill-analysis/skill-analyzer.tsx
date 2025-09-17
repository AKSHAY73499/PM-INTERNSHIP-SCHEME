"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lightbulb, GraduationCap } from "lucide-react";
import { skillGapAnalysis, SkillGapAnalysisOutput } from "@/ai/flows/skill-gap-analysis";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  studentSkills: z.string().min(1, "Please enter at least one skill."),
  desiredRoles: z.string().min(1, "Please enter at least one desired role."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SkillAnalyzer() {
  const [analysis, setAnalysis] = useState<SkillGapAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [profile] = useLocalStorage('user-profile', { skills: '', interests: '', experience: '' });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentSkills: profile.skills || "",
      desiredRoles: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await skillGapAnalysis(data);
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to analyze skills:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not perform skill analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skillGapsList = analysis?.skillGaps.split(',').map(s => s.trim()).filter(s => s);
  const coursesList = analysis?.recommendedCourses.split(',').map(c => c.trim()).filter(c => c);


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analyze Your Skills</CardTitle>
          <CardDescription>Enter your current skills and roles you're interested in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Current Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript, Project Management" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredRoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Internship Roles</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Frontend Developer, Product Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Analyzing your profile...</p>
        </div>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold font-headline">
                <Lightbulb className="text-accent" />
                Identified Skill Gaps
              </h3>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {skillGapsList?.map((gap, index) => (
                  <li key={`gap-${index}`}>{gap}</li>
                ))}
              </ul>
            </div>
            <Separator/>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold font-headline">
                <GraduationCap className="text-accent" />
                Recommended Courses & Certifications
              </h3>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {coursesList?.map((course, index) => (
                  <li key={`course-${index}`}>{course}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
