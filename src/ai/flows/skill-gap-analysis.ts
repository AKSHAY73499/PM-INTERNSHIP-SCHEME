
'use server';
/**
 * @fileOverview A flow for analyzing skill gaps for a student.
 *
 * - skillGapAnalysis - A function that handles the skill gap analysis process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  SkillGapAnalysisInputSchema,
  SkillGapAnalysisOutputSchema,
  SkillGapAnalysisInput,
  SkillGapAnalysisOutput,
} from '@/ai/schema-and-types';


export async function skillGapAnalysis(
  input: SkillGapAnalysisInput
): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `You are an expert career coach. Analyze the student's current skills and their desired internship roles to identify skill gaps and recommend relevant courses.

Student's Current Skills: ${input.studentSkills}
Desired Internship Roles: ${input.desiredRoles}

Instructions:
1. Identify the key skills required for the desired roles that the student is missing.
2. Recommend a list of 3-5 specific online courses or certifications to bridge these gaps. For each course, suggest a popular platform in parentheses, e.g., "Advanced React (Coursera)".
3. Format the output as a JSON object with two keys: "skillGaps" (a comma-separated string of missing skills) and "recommendedCourses" (a comma-separated string of course recommendations).
4. The output should only contain the JSON object. Do not include any other text or explanations.`,
        output: { schema: SkillGapAnalysisOutputSchema },
    });

    return output!;
  }
);
