'use server';
/**
 * @fileOverview An internship matching AI agent.
 *
 * - matchInternships - A function that handles the internship matching process.
 * - MatchInternshipsInput - The input type for the matchInternships function.
 * - MatchInternshipsOutput - The return type for the matchInternships function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { internshipData } from '@/lib/data';
import { MatchInternshipsInputSchema, MatchInternshipsOutputSchema, MatchInternshipsInput, MatchInternshipsOutput } from '@/ai/schema-and-types';


const internshipMatchingPrompt = ai.definePrompt({
  name: 'internshipMatchingPrompt',
  input: {
    schema: z.object({
        skills: z.array(z.string()),
        interests: z.array(z.string()),
        location: z.string(),
        internships: MatchInternshipsOutputSchema, // Array of all available internships
    }),
  },
  output: { schema: MatchInternshipsOutputSchema },
  prompt: `You are an expert career counselor. Your task is to find the most relevant internships for a student based on their profile.

Student Profile:
- Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Preferred Location: {{{location}}}

Available Internships:
{{#each internships}}
- Company: {{{this.companyName}}}
  - Title: {{{this.title}}}
  - Location: {{{this.location}}}
  - Description: {{{this.description}}}
  - Required Skills: {{#each this.requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Compensation: {{{this.compensation}}}
{{/each}}

Instructions:
1.  Analyze the student's profile and the list of available internships.
2.  Identify the top 5 most suitable internships.
3.  Consider skills, interests, and location preferences for matching. A student preferring 'Bangalore' might also be open to 'Bengaluru'. 'Remote' is a valid location.
4.  Return a JSON array of the matched internships. The output should only contain the JSON array. Do not include any other text or explanations.
`,
});

const internshipMatchingFlow = ai.defineFlow(
  {
    name: 'internshipMatchingFlow',
    inputSchema: MatchInternshipsInputSchema,
    outputSchema: MatchInternshipsOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: await internshipMatchingPrompt.render({
            input: { ...input, internships: internshipData },
        }),
        output: {
            format: 'json',
            schema: MatchInternshipsOutputSchema,
        },
    });

    return output ?? [];
  }
);


export async function matchInternships(input: MatchInternshipsInput): Promise<MatchInternshipsOutput> {
  return internshipMatchingFlow(input);
}
