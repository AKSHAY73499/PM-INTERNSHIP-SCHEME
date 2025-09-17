
'use server';
/**
 * @fileOverview An internship matching AI flow.
 *
 * - matchInternships - A function that handles the internship matching process.
 * - MatchInternshipsInput - The input type for the matchInternships function.
 * - MatchInternshipsOutput - The return type for the matchInternships function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getInternships } from '@/services/internshipService';

const MatchInternshipsInputSchema = z.object({
  skills: z.array(z.string()).describe('The skills of the student.'),
  interests: z.array(z.string()).describe('The interests of the student.'),
  location: z.string().describe('The preferred location of the student.'),
});
export type MatchInternshipsInput = z.infer<typeof MatchInternshipsInputSchema>;

const MatchInternshipsOutputSchema = z.array(
  z.object({
    companyName: z.string().describe("The name of the company."),
    title: z.string().describe("The title of the internship."),
    location: z.string().describe("The location of the internship."),
    description: z.string().describe("A brief description of the internship."),
    requiredSkills: z.array(z.string()).describe("The skills required for the internship."),
    compensation: z.string().describe("The compensation for the internship."),
  })
);
export type MatchInternshipsOutput = z.infer<typeof MatchInternshipsOutputSchema>;


const internshipFinder = ai.defineTool(
  {
    name: 'internshipFinder',
    description: 'Finds internships based on location.',
    inputSchema: z.object({
      location: z.string(),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    return await getInternships(input.location);
  }
);

const prompt = ai.definePrompt({
  name: 'internshipMatchingPrompt',
  tools: [internshipFinder],
  input: { schema: MatchInternshipsInputSchema },
  output: { schema: MatchInternshipsOutputSchema },
  prompt: `You are an expert career counselor. Your task is to match a student to suitable internships based on their skills, interests, and location.

You have access to a tool 'internshipFinder' that can fetch available internships for a given location.

Here is the student's profile:
- Skills: {{{skills}}}
- Interests: {{{interests}}}
- Location: {{{location}}}

Use the internshipFinder tool to get internships for the student's preferred location. Then, from that list, select the top 5 most relevant internships for the student based on how well their skills and interests align with the internship requirements.

Return the list of matched internships. Do not make up internships. Only use the ones provided by the tool.`,
});

const internshipMatchingFlow = ai.defineFlow(
  {
    name: 'internshipMatchingFlow',
    inputSchema: MatchInternshipsInputSchema,
    outputSchema: MatchInternshipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function matchInternships(input: MatchInternshipsInput): Promise<MatchInternshipsOutput> {
    return await internshipMatchingFlow(input);
}
