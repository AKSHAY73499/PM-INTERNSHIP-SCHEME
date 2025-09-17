"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Upload } from "lucide-react";

const formSchema = z.object({
  skills: z.string().min(1, "Please enter at least one skill."),
  qualifications: z.string().min(1, "Please enter your qualifications."),
  interests: z.string().min(1, "Please enter at least one interest."),
  experience: z.string().optional(),
  locationPreference: z.string().min(1, "Please enter your location preference."),
  resume: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const [profile, setProfile] = useLocalStorage('user-profile', {
    skills: '',
    qualifications: '',
    interests: '',
    experience: '',
    locationPreference: '',
  });

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: profile,
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, you'd handle file upload here.
    const { resume, ...profileData } = data;
    setProfile(profileData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Edit Your Information</CardTitle>
        <CardDescription>This information will be used to find matching internships.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., B.Tech in Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React, Python, Data Analysis" {...field} />
                  </FormControl>
                   <FormDescription>Comma-separated skills.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI, Healthcare, Fintech" {...field} />
                  </FormControl>
                   <FormDescription>Comma-separated interests.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="locationPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Preference</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bangalore, Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your past projects or work experience." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Resume</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} className="w-full" />
                        <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4"/>
                        </Button>
                    </div>
                  </FormControl>
                   <FormDescription>Upload your latest resume (PDF, DOCX).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
