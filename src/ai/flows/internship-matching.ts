'use server';

/**
 * @fileOverview AI-powered tool that matches students to suitable internships based on their skills, interests, and location.
 *
 * - matchInternships - A function that handles the internship matching process.
 * - MatchInternshipsInput - The input type for the matchInternships function.
 * - MatchInternshipsOutput - The return type for the matchInternships function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchInternshipsInputSchema = z.object({
  skills: z.array(z.string()).describe('List of skills possessed by the student.'),
  interests: z.array(z.string()).describe('List of interests of the student.'),
  location: z.string().describe('The preferred location for the internship.'),
});
export type MatchInternshipsInput = z.infer<typeof MatchInternshipsInputSchema>;

const InternshipSchema = z.object({
  companyName: z.string().describe('The name of the company offering the internship.'),
  title: z.string().describe('The title of the internship position.'),
  location: z.string().describe('The location of the internship.'),
  description: z.string().describe('A brief description of the internship.'),
  requiredSkills: z.array(z.string()).describe('List of skills required for the internship.'),
  compensation: z.string().describe('The compensation offered for the internship.'),
});

const MatchInternshipsOutputSchema = z.array(InternshipSchema).describe('A list of internship opportunities that match the student profile.');
export type MatchInternshipsOutput = z.infer<typeof MatchInternshipsOutputSchema>;

export async function matchInternships(input: MatchInternshipsInput): Promise<MatchInternshipsOutput> {
  return matchInternshipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchInternshipsPrompt',
  input: {schema: MatchInternshipsInputSchema},
  output: {schema: MatchInternshipsOutputSchema},
  prompt: `You are an AI-powered tool that matches students to suitable internships based on their skills, interests, and location.

  Given the following student profile, generate a list of internship opportunities that are most relevant to their skills, interests, and location.

  Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Location: {{{location}}}

  Return a JSON array of internships.  Each internship should include companyName, title, location, description, requiredSkills (as a JSON array), and compensation.
  Make sure the JSON is valid.
  `,
});

const matchInternshipsFlow = ai.defineFlow(
  {
    name: 'matchInternshipsFlow',
    inputSchema: MatchInternshipsInputSchema,
    outputSchema: MatchInternshipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
