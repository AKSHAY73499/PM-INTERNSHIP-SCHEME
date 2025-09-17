
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { postInternship } from "@/services/companyService";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Role is required"),
  requiredSkills: z.string().min(1, "Skills are required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

export default function PostInternshipPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      requiredSkills: "",
      location: "",
      capacity: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // The schema for requiredSkills in the AI flow expects an array.
      const internshipData = {
          ...values,
          requiredSkills: values.requiredSkills.split(',').map(skill => skill.trim())
      };
      await postInternship(internshipData);
      toast({
        title: "Internship Posted!",
        description: "Your new internship is now live for students to apply.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post internship. Please try again.",
      });
    } finally {
        setIsLoading(false);
    }
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internship Role / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Development Intern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React, Node.js, Python" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai, Remote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internship Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Internship
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
