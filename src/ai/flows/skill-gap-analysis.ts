'use server';
/**
 * @fileOverview An AI flow that analyzes a student's skill gap for desired roles.
 *
 * - skillGapAnalysis - A function that performs the analysis and returns gaps and recommendations.
 * - SkillGapAnalysisInput - The input type for the skillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the skillGapAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SkillGapAnalysisInputSchema = z.object({
  studentSkills: z.string().describe("The student's current skills, comma-separated."),
  desiredRoles: z.string().describe("The internship roles the student is interested in, comma-separated."),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

export const SkillGapAnalysisOutputSchema = z.object({
  skillGaps: z.string().describe("A comma-separated list of skills the student is missing for the desired roles."),
  recommendedCourses: z.string().describe("A comma-separated list of recommended courses or certifications to bridge the skill gaps."),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: { schema: SkillGapAnalysisInputSchema },
  output: { schema: SkillGapAnalysisOutputSchema },
  prompt: `You are an AI career advisor. Analyze the skill gap for a student based on their current skills and desired internship roles.

Student's Skills: {{{studentSkills}}}
Desired Roles: {{{desiredRoles}}}

Identify the key skills missing for the desired roles and recommend a list of 3-5 specific courses or certifications to bridge these gaps.
Provide the output as a comma-separated list for skillGaps and recommendedCourses. For courses, you can suggest a platform in parenthesis, e.g., 'Machine Learning (Coursera)'.
`,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: await prompt.render({ input }),
    });
    if (!output) {
      throw new Error('Failed to generate skill gap analysis.');
    }
    return output;
  }
);


export async function skillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}
