'use server';
/**
 * @fileOverview A candidate shortlisting AI agent.
 *
 * - shortlistCandidates - A function that handles the candidate shortlisting process.
 * - ShortlistCandidatesInput - The input type for the shortlistCandidates function.
 * - ShortlistCandidatesOutput - The return type for the shortlistCandidates function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ShortlistCandidatesInputSchema, ShortlistCandidatesOutputSchema, ShortlistCandidatesInput, ShortlistCandidatesOutput } from '@/ai/schema-and-types';


export async function shortlistCandidates(input: ShortlistCandidatesInput): Promise<ShortlistCandidatesOutput> {
  return candidateShortlistingFlow(input);
}


const prompt = ai.definePrompt({
    name: 'candidateShortlistingPrompt',
    input: { schema: ShortlistCandidatesInputSchema },
    output: { schema: ShortlistCandidatesOutputSchema },
    prompt: `You are an expert HR manager responsible for shortlisting candidates for internships.
  
  Internship Details:
  - Role: {{{internship.title}}}
  - Required Skills: {{#each internship.requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  
  You will be provided with a list of student applicants. Your task is to:
  1.  Analyze each student's profile (skills, qualifications, experience).
  2.  Determine if they are a good fit for the internship based on the required skills and their overall profile.
  3.  Provide a "matchScore" from 0 to 100, where a higher score indicates a better fit.
  4.  Write a brief "reasoning" (1-2 sentences) explaining why the candidate is or is not a good fit.
  5.  Return a list of the top 5 candidates, sorted by their match score in descending order.
  
  Student Applicants:
  {{#each students}}
  - Name: {{{this.name}}}
    - Skills: {{#each this.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    - Qualifications: {{{this.qualifications}}}
    - Experience: {{{this.experience}}}
  {{/each}}`,
  });

const candidateShortlistingFlow = ai.defineFlow(
    {
        name: 'candidateShortlistingFlow',
        inputSchema: ShortlistCandidatesInputSchema,
        outputSchema: ShortlistCandidatesOutputSchema,
    },
    async (input) => {
        const { output } = await ai.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: await prompt.render({ input }),
            output: {
                format: 'json',
                schema: ShortlistCandidatesOutputSchema,
            },
        });
        return output ?? [];
    }
);
