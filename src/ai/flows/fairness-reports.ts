
'use server';
/**
 * @fileOverview A Genkit flow that generates a fairness report for the platform.
 *
 * - getFairnessReportData - A function that returns fairness report data.
 * - FairnessReportData - The type for the fairness report data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReportDataItemSchema = z.object({
    name: z.string(),
    value: z.number(),
    fill: z.string().describe('A hex color code for the chart fill, e.g., #FF5733'),
});

const FairnessReportDataSchema = z.object({
    geoDiversity: z.array(ReportDataItemSchema).describe('Geographical diversity data.'),
    socialCategory: z.array(ReportDataItemSchema).describe('Social category distribution data.'),
    genderDiversity: z.array(ReportDataItemSchema).describe('Gender diversity data.'),
});
export type FairnessReportData = z.infer<typeof FairnessReportDataSchema>;

const prompt = ai.definePrompt({
    name: 'fairnessReportPrompt',
    output: { schema: FairnessReportDataSchema },
    prompt: `Generate a sample fairness report for an internship platform. The report should include data for:
1. Geographical Diversity: Applicants from Tier 1, Tier 2, and Rural areas.
2. Social Category Distribution: Applicants from categories like General, OBC, SC, ST.
3. Gender Diversity: Male, Female, and Other.

For each data point, provide a name, a realistic value (number of applicants), and an appropriate hex color code for chart visualization.
Example for one item in geoDiversity: { name: 'Tier 1 Cities', value: 450, fill: '#0088FE' }
`,
});

const fairnessReportFlow = ai.defineFlow(
  {
    name: 'fairnessReportFlow',
    outputSchema: FairnessReportDataSchema,
  },
  async () => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: await prompt.render(),
    });
    
    if (!output) {
      throw new Error('Failed to generate fairness report data.');
    }
    return output;
  }
);

export async function getFairnessReportData(): Promise<FairnessReportData> {
    return fairnessReportFlow();
}
