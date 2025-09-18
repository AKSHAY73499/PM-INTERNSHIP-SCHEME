
'use server';
/**
 * @fileOverview A flow for matching students to internships.
 *
 * - matchInternships - A function that handles the internship matching process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  MatchInternshipsInputSchema,
  MatchInternshipsOutputSchema,
  MatchInternshipsInput,
  MatchInternshipsOutput,
} from '@/ai/schema-and-types';
import { internshipData } from '@/lib/data';


const internshipMatchingPrompt = ai.definePrompt({
    name: 'internshipMatchingPrompt',
    input: { schema: z.object({ ...MatchInternshipsInputSchema.shape, internships: z.any() }) },
    output: { schema: MatchInternshipsOutputSchema },
    prompt: `You are an expert career counselor. Your task is to find the most relevant internships for a student based on their profile.

Student Profile:
- Skills: {{{skills}}}
- Interests: {{{interests}}}
- Preferred Location: {{{location}}}

Available Internships:
{{{json internships}}}

Instructions:
1.  Analyze the student's profile and the list of available internships.
2.  Identify the top 5 most suitable internships.
3.  Consider skills, interests, and location preferences for matching. A student preferring 'Bangalore' might also be open to 'Bengaluru'. 'Remote' is a valid location.
4.  Return a JSON array of the matched internships. The output should only contain the JSON array. Do not include any other text or explanations.
`,
});


export async function matchInternships(
  input: MatchInternshipsInput
): Promise<MatchInternshipsOutput> {
  const { output } = await internshipMatchingPrompt({
    ...input,
    internships: internshipData,
  });
  return output || [];
}
