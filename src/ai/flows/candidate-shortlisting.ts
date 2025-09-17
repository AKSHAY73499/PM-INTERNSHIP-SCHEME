
'use server';

/**
 * @fileOverview AI-powered tool that shortlists student candidates for an internship.
 *
 * - shortlistCandidates - A function that handles the candidate shortlisting process.
 * - ShortlistCandidatesInput - The input type for the shortlistCandidates function.
 * - ShortlistCandidatesOutput - The return type for the shortlistCandidates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentProfileSchema = z.object({
  name: z.string().describe("The student's full name."),
  skills: z.array(z.string()).describe("A list of the student's skills."),
  qualifications: z.string().describe("The student's qualifications (e.g., degree, university)."),
  experience: z.string().optional().describe("A summary of the student's relevant experience."),
});

const InternshipDetailsSchema = z.object({
  title: z.string().describe("The title of the internship."),
  requiredSkills: z.array(z.string()).describe("A list of skills required for the internship."),
});

const ShortlistCandidatesInputSchema = z.object({
  internship: InternshipDetailsSchema,
  students: z.array(StudentProfileSchema).describe("A list of student profiles to evaluate."),
});
export type ShortlistCandidatesInput = z.infer<typeof ShortlistCandidatesInputSchema>;


const ShortlistedCandidateSchema = z.object({
    name: z.string().describe("The student's name."),
    matchScore: z.number().min(0).max(100).describe("The AI-calculated match score percentage (0-100)."),
    reasoning: z.string().describe("A brief explanation for why the candidate is a good match."),
    skills: z.array(z.string()).describe("The student's skills."),
    qualifications: z.string().describe("The student's qualifications."),
    experience: z.string().optional().describe("A summary of the student's experience."),
});

const ShortlistCandidatesOutputSchema = z.array(ShortlistedCandidateSchema).describe("A sorted list of shortlisted candidates, from highest to lowest match score.");
export type ShortlistCandidatesOutput = z.infer<typeof ShortlistCandidatesOutputSchema>;

export async function shortlistCandidates(input: ShortlistCandidatesInput): Promise<ShortlistCandidatesOutput> {
  return shortlistCandidatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shortlistCandidatesPrompt',
  input: {schema: ShortlistCandidatesInputSchema},
  output: {schema: ShortlistCandidatesOutputSchema},
  prompt: `You are an expert HR recruitment AI for a government internship portal. Your task is to analyze a list of student applicants and shortlist the best candidates for a specific internship.

  Internship Role: {{{internship.title}}}
  Required Skills: {{#each internship.requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Here are the student profiles:
  {{#each students}}
  - Name: {{{name}}}, Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}, Qualifications: {{{qualifications}}}, Experience: {{{experience}}}
  {{/each}}

  Analyze each student's profile against the internship requirements. Calculate a "matchScore" from 0 to 100 based on how well their skills, qualifications, and experience align with the role. Provide a brief "reasoning" for your score.

  Return a JSON array of the shortlisted candidates, sorted in descending order by their matchScore. For each candidate, include their name, skills, qualifications, experience, the calculated matchScore, and your reasoning.
  `,
});

const shortlistCandidatesFlow = ai.defineFlow(
  {
    name: 'shortlistCandidatesFlow',
    inputSchema: ShortlistCandidatesInputSchema,
    outputSchema: ShortlistCandidatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
