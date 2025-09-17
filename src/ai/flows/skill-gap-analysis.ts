'use server';

/**
 * @fileOverview This file defines a Genkit flow for skill gap analysis.
 *
 * The flow takes a student's current skills and desired internship roles as input,
 * identifies skill gaps, and recommends online courses and certifications to bridge those gaps.
 *
 * @exports `skillGapAnalysis` - The main function to trigger the skill gap analysis flow.
 * @exports `SkillGapAnalysisInput` - The input type for the skillGapAnalysis function.
 * @exports `SkillGapAnalysisOutput` - The output type for the skillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillGapAnalysisInputSchema = z.object({
  studentSkills: z
    .string()
    .describe("A comma-separated list of the student's current skills."),
  desiredRoles: z
    .string()
    .describe(
      'A comma-separated list of the student\'s desired internship roles.'
    ),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  skillGaps: z
    .string()
    .describe('A comma-separated list of identified skill gaps.'),
  recommendedCourses: z
    .string()
    .describe(
      'A comma-separated list of recommended online courses and certifications to bridge the skill gaps.'
    ),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function skillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: SkillGapAnalysisInputSchema},
  output: {schema: SkillGapAnalysisOutputSchema},
  prompt: `You are a career advisor specializing in identifying skill gaps and recommending relevant online courses and certifications.

  Analyze the student's current skills and desired internship roles to identify skill gaps and provide personalized recommendations for online courses and certifications.

  Student's Current Skills: {{{studentSkills}}}
  Desired Internship Roles: {{{desiredRoles}}}

  Skill Gaps: A comma-separated list of the identified skill gaps.
  Recommended Courses: A comma-separated list of recommended online courses and certifications to bridge the skill gaps.
  `,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

