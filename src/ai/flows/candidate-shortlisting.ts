'use server';
/**
 * @fileOverview An AI flow for shortlisting student candidates for an internship.
 *
 * - shortlistCandidates - A function that takes internship and student data and returns a ranked list of candidates.
 * - ShortlistCandidatesInput - The input type for the shortlistCandidates function.
 * - ShortlistCandidatesOutput - The return type for the shortlistCandidates function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  skills: z.array(z.string()),
  experience: z.string().optional(),
  qualifications: z.string(),
});

const InternshipSchema = z.object({
  title: z.string(),
  requiredSkills: z.array(z.string()),
});

export const ShortlistCandidatesInputSchema = z.object({
  students: z.array(StudentSchema),
  internship: InternshipSchema,
});
export type ShortlistCandidatesInput = z.infer<typeof ShortlistCandidatesInputSchema>;

const CandidateSchema = z.object({
  name: z.string(),
  skills: z.array(z.string()),
  experience: z.string().optional(),
  qualifications: z.string(),
  matchScore: z.number().describe('The match score from 0-100 for the candidate.'),
  reasoning: z.string().describe('A brief reasoning for why the candidate is a good match.'),
});

export const ShortlistCandidatesOutputSchema = z.array(CandidateSchema);
export type ShortlistCandidatesOutput = z.infer<typeof ShortlistCandidatesOutputSchema>;

const prompt = ai.definePrompt({
  name: 'candidateShortlistingPrompt',
  input: { schema: ShortlistCandidatesInputSchema },
  output: { schema: ShortlistCandidatesOutputSchema },
  prompt: `You are an expert hiring manager.
You are tasked with shortlisting the top 5 candidates for an internship based on their skills, experience, and qualifications.

Internship Role: {{{internship.title}}}
Required Skills: {{{internship.requiredSkills}}}

Available Candidates:
{{#each students}}
- Name: {{name}}
  Skills: {{skills}}
  Experience: {{experience}}
  Qualifications: {{qualifications}}
{{/each}}

Please provide a ranked list of the top 5 candidates who are the best fit for this role. For each candidate, provide their name, skills, qualifications, experience, a match score (0-100), and a brief reasoning for your recommendation. The match score should be based on how well their skills align with the required skills, their qualifications, and their experience.
`,
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
      config: {
        temperature: 0.2, // Lower temperature for more deterministic output
      },
    });

    if (!output) {
      throw new Error('Failed to generate candidate shortlist.');
    }

    // Sort candidates by match score in descending order
    return output.sort((a: any, b: any) => b.matchScore - a.matchScore);
  }
);


export async function shortlistCandidates(input: ShortlistCandidatesInput): Promise<ShortlistCandidatesOutput> {
  return candidateShortlistingFlow(input);
}
