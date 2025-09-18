
'use server';
/**
 * @fileOverview Candidate shortlisting AI flow.
 *
 * - shortlistCandidates - A function that handles shortlisting candidates for an internship.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
    ShortlistCandidatesInputSchema,
    ShortlistCandidatesOutputSchema,
    type ShortlistCandidatesInput,
    type ShortlistCandidatesOutput,
    type ShortlistedCandidate
} from '@/ai/schema-and-types';


export async function shortlistCandidates(input: ShortlistCandidatesInput): Promise<ShortlistedCandidate[]> {
  const result = await shortlistCandidatesFlow(input);
  return result;
}

const shortlistCandidatesPrompt = ai.definePrompt(
  {
    name: 'shortlistCandidatesPrompt',
    input: { schema: ShortlistCandidatesInputSchema },
    output: { schema: ShortlistCandidatesOutputSchema },
    prompt: `You are an expert hiring manager. Your task is to shortlist the top 5 candidates for an internship based on their skills and qualifications.

Internship Details:
- Title: {{{internship.title}}}
- Required Skills: {{{internship.requiredSkills}}}

Analyze the following student profiles and select the best matches. For each shortlisted candidate, provide a match score (out of 100) and a brief reasoning for your choice.

Student Profiles:
{{#each students}}
- Name: {{{this.name}}}
- Skills: {{{this.skills}}}
- Qualifications: {{{this.qualifications}}}
- Experience: {{{this.experience}}}
{{/each}}

Return a JSON array of the top 5 candidates.`,
  }
);


const shortlistCandidatesFlow = ai.defineFlow(
  {
    name: 'shortlistCandidatesFlow',
    inputSchema: ShortlistCandidatesInputSchema,
    outputSchema: ShortlistCandidatesOutputSchema,
  },
  async (input) => {
    const { output } = await shortlistCandidatesPrompt(input);
    return output!;
  }
);
