"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin } from "lucide-react";
import { matchInternships, MatchInternshipsOutput } from "@/ai/flows/internship-matching";
import InternshipCard from "./internship-card";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

const formSchema = z.object({
  skills: z.string().min(1, "Please enter at least one skill."),
  interests: z.string().min(1, "Please enter at least one interest."),
  location: z.string().min(1, "Please enter a location."),
  prioritizeRural: z.boolean().default(false),
  socialCategory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function InternshipMatcher() {
  const [profile] = useLocalStorage('user-profile', { skills: '', interests: '', experience: '' });
  const [internships, setInternships] = useState<MatchInternshipsOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: profile.skills || "",
      interests: profile.interests || "",
      location: "",
      prioritizeRural: false,
      socialCategory: "none",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setInternships([]);
    try {
      const skillsArray = data.skills.split(",").map((s) => s.trim());
      const interestsArray = data.interests.split(",").map((i) => i.trim());

      const result = await matchInternships({
        skills: skillsArray,
        interests: interestsArray,
        location: data.location,
      });

      // Client-side filtering for fairness
      let filteredResult = result;
      if (data.prioritizeRural) {
        // This is a placeholder for real rural area filtering logic
        toast({ title: "Note", description: "Rural area prioritization is a demo feature." });
      }
      
      setInternships(filteredResult);
    } catch (error) {
      console.error("Failed to match internships:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch internship matches. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use a reverse geocoding service.
          // For now, we'll ask the user to confirm.
          toast({
            title: "Location Found",
            description: "Please enter your city name in the location field.",
          });
        },
        () => {
          toast({
            variant: "destructive",
            title: "Geolocation Error",
            description: "Unable to retrieve your location.",
          });
        }
      );
    } else {
        toast({
            variant: "destructive",
            title: "Unsupported",
            description: "Geolocation is not supported by your browser.",
        });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Internship Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Python, Data Analysis" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated skills from your profile.
                      </FormDescription>
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
                      <FormDescription>
                        Comma-separated interests.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Location</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="e.g., Bangalore, Remote" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleGeoLocation}>
                        <MapPin className="mr-2 h-4 w-4" /> Use my location
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h3 className="mb-4 text-lg font-medium font-headline">Fairness Filters</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="socialCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Category</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Prefer not to say</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="obc">OBC</SelectItem>
                              <SelectItem value="sc">SC</SelectItem>
                              <SelectItem value="st">ST</SelectItem>
                            </SelectContent>
                          </Select>
                        <FormDescription>Optional: To promote inclusive opportunities.</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prioritizeRural"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Prioritize Rural Areas</FormLabel>
                          <FormDescription>
                            Show internships in non-metropolitan locations.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Internships
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Finding the best matches for you...</p>
        </div>
      )}

      {internships.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {internships.map((internship, index) => (
            <InternshipCard key={`${internship.companyName}-${index}`} internship={internship} />
          ))}
        </div>
      )}

      {!isLoading && internships.length === 0 && (
         <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Your internship matches will appear here.</p>
         </div>
      )}
    </div>
  );
}
