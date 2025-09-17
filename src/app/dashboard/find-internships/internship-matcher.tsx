"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, MapPin } from "lucide-react";
import { matchInternships, MatchInternshipsOutput } from "@/ai/flows/internship-matching";
import InternshipCard from "./internship-card";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

// Add matchScore to the output schema
type InternshipWithScore = MatchInternshipsOutput[number] & { matchScore?: number };

const formSchema = z.object({
  skills: z.string().min(1, "Please enter at least one skill."),
  interests: z.string().min(1, "Please enter at least one interest."),
  location: z.string().min(1, "Please enter a location."),
});

type FormValues = z.infer<typeof formSchema>;

export default function InternshipMatcher() {
  const [profile] = useLocalStorage('user-profile', { skills: '', interests: '', locationPreference: '' });
  const [internships, setInternships] = useState<InternshipWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: profile.skills || "",
      interests: profile.interests || "",
      location: profile.locationPreference || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setInternships([]);
    try {
      const skillsArray = data.skills.split(",").map((s) => s.trim());
      const interestsArray = data.interests.split(",").map((i) => i.trim());

      let result = await matchInternships({
        skills: skillsArray,
        interests: interestsArray,
        location: data.location,
      });

      // Add a random match score for demonstration
      const resultWithScores = result.map(internship => ({
        ...internship,
        matchScore: Math.floor(Math.random() * (98 - 70 + 1)) + 70, // Random score between 70-98
      })).sort((a, b) => b.matchScore - a.matchScore); // Sort by score
      
      setInternships(resultWithScores);
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
          <CardDescription>Use your profile data or enter new search criteria.</CardDescription>
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
