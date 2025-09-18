
'use server';
/**
 * @fileOverview A flow for shortlisting candidates for an internship.
 *
 * - shortlistCandidates - A function that handles the candidate shortlisting process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  ShortlistCandidatesInputSchema,
  ShortlistCandidatesOutputSchema,
  ShortlistCandidatesInput,
  ShortlistCandidatesOutput,
} from '@/ai/schema-and-types';

export async function shortlistCandidates(
  input: ShortlistCandidatesInput
): Promise<ShortlistCandidatesOutput> {
  return shortlistCandidatesFlow(input);
}

const shortlistCandidatesFlow = ai.defineFlow(
  {
    name: 'shortlistCandidatesFlow',
    inputSchema: ShortlistCandidatesInputSchema,
    outputSchema: ShortlistCandidatesOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `You are an expert hiring manager. Your task is to shortlist the top 5 candidates for an internship based on their profiles and the internship requirements.

Internship Requirements:
- Title: ${input.internship.title}
- Required Skills: ${input.internship.requiredSkills.join(', ')}

Student Profiles:
${input.students.map(s => `- ${s.name}: Skills - ${s.skills.join(', ')}; Qualifications - ${s.qualifications}; Experience - ${s.experience || 'N/A'}`).join('\n')}

Instructions:
1. Analyze each student's profile against the internship requirements.
2. Determine a "matchScore" (0-100) for each student.
3. Provide a brief "reasoning" for why each student is a good or bad fit.
4. Return a JSON array of the top 5 students, sorted by matchScore in descending order.
5. The output should only contain the JSON array. Do not include any other text or explanations.`,
        output: { schema: ShortlistCandidatesOutputSchema },
    });
    return output!;
  }
);
