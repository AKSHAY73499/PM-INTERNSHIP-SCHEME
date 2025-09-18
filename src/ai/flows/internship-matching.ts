'use server';
/**
 * @fileOverview An AI flow that matches students with internships based on their profile.
 *
 * - matchInternships - A function that finds and returns suitable internships.
 * - MatchInternshipsInput - The input type for the matchInternships function.
 * - MatchInternshipsOutput - The return type for the matchInternships function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { internshipData } from '@/lib/data';

export const MatchInternshipsInputSchema = z.object({
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  location: z.string(),
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

const prompt = ai.definePrompt({
  name: 'internshipMatchingPrompt',
  input: { schema: MatchInternshipsInputSchema },
  output: { schema: MatchInternshipsOutputSchema },
  prompt: `You are an expert career counselor. Your task is to match a student with the most suitable internships from the provided list.

Student Profile:
- Skills: {{{skills}}}
- Interests: {{{interests}}}
- Preferred Location: {{{location}}}

Available Internships:
${JSON.stringify(internshipData, null, 2)}

Based on the student's profile, find the top 5-8 most relevant internships from the list. Consider skill alignment, interest match, and location preference. For location, "Remote" is a valid match for any location preference.
Return only the internships that are a good match. Do not invent new internships.
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
      prompt: await prompt.render({ input }),
    });

    if (!output) {
      throw new Error('Failed to generate internship matches.');
    }
    return output;
  }
);


export async function matchInternships(input: MatchInternshipsInput): Promise<MatchInternshipsOutput> {
  return internshipMatchingFlow(input);
}
