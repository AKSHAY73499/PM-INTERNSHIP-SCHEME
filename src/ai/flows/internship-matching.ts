
'use server';

/**
 * @fileOverview A file containing the AI flow for matching internships to students.
 *
 * - matchInternships: The main function to call to get internship matches.
 * - MatchInternshipsInput: The Zod schema for the input of the matching function.
 * - MatchInternshipsOutput: The Zod schema for the output of the matching function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getInternships } from '@/services/internshipService';

export const MatchInternshipsInputSchema = z.object({
  skills: z.array(z.string()).describe('The skills of the student.'),
  interests: z.array(z.string()).describe('The interests of the student.'),
  location: z.string().describe('The preferred location of the student.'),
});
export type MatchInternshipsInput = z.infer<typeof MatchInternshipsInputSchema>;

const InternshipSchema = z.object({
    companyName: z.string(),
    title: z.string(),
    location: z.string(),
    description: z.string(),
    requiredSkills: z.array(z.string()),
    compensation: z.string(),
});

export const MatchInternshipsOutputSchema = z.array(InternshipSchema);
export type MatchInternshipsOutput = z.infer<typeof MatchInternshipsOutputSchema>;


const internshipMatchingPrompt = ai.definePrompt(
  {
    name: 'internshipMatcher',
    input: {
        schema: z.object({
            studentProfile: MatchInternshipsInputSchema,
            internships: z.array(InternshipSchema)
        })
    },
    output: { schema: MatchInternshipsOutputSchema },
    prompt: `You are an expert career counselor. Your task is to match a student with relevant internships from a provided list based on their profile.

Student Profile:
- Skills: {{{studentProfile.skills}}}
- Interests: {{{studentProfile.interests}}}
- Location Preference: {{{studentProfile.location}}}

Internship List:
{{{json internships}}}

Analyze the list and return a new list containing only the internships that are a good match for the student. Prioritize internships that align with the student's skills, interests, and location. Location matching can be flexible (e.g., "Remote" matches everything).`,
  },
);

const internshipMatchingFlow = ai.defineFlow(
  {
    name: 'internshipMatchingFlow',
    inputSchema: MatchInternshipsInputSchema,
    outputSchema: MatchInternshipsOutputSchema,
  },
  async (studentProfile) => {
    const allInternships = await getInternships();

    const { output } = await internshipMatchingPrompt({
        studentProfile,
        internships: allInternships,
    });

    return output || [];
  }
);


export async function matchInternships(input: MatchInternshipsInput): Promise<MatchInternshipsOutput> {
    return await internshipMatchingFlow(input);
}
