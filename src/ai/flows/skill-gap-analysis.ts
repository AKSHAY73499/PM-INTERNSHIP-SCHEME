'use server';
/**
 * @fileOverview A skill gap analysis AI agent.
 *
 * - skillGapAnalysis - A function that handles the skill gap analysis process.
 * - SkillGapAnalysisInput - The input type for the skillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the skillGapAnalysis function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { SkillGapAnalysisInputSchema, SkillGapAnalysisOutputSchema, SkillGapAnalysisInput, SkillGapAnalysisOutput } from '@/ai/schema-and-types';


export async function skillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
    return skillGapAnalysisFlow(input);
}

const skillGapAnalysisPrompt = ai.definePrompt({
    name: 'skillGapAnalysisPrompt',
    input: { schema: SkillGapAnalysisInputSchema },
    output: { schema: SkillGapAnalysisOutputSchema },
    prompt: `You are an expert career development coach.
  
  A student has provided their current skills and the roles they are interested in. Your task is to:
  1.  Analyze the gap between the student's current skills and the skills typically required for their desired roles.
  2.  Identify the key missing skills (the "skillGaps").
  3.  Recommend a list of online courses or certifications that can help bridge these gaps. For each course, suggest a popular platform in parentheses, e.g., "Advanced Python (Coursera)".
  4.  The output for skillGaps and recommendedCourses should be a single comma-separated string for each.
  
  Student's Current Skills: {{{studentSkills}}}
  Desired Internship Roles: {{{desiredRoles}}}
  
  Return a JSON object with two keys: "skillGaps" and "recommendedCourses". Do not include any other text or explanations.`,
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
            prompt: await skillGapAnalysisPrompt.render({ input }),
            output: {
                format: 'json',
                schema: SkillGapAnalysisOutputSchema,
            },
        });
        return output!;
    }
);
