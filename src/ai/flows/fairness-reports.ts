'use server';
/**
 * @fileOverview A fairness report generation AI agent.
 *
 * - getFairnessReportData - A function that generates fairness report data.
 * - FairnessReportData - The return type for the getFairnessReportData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { FairnessReportDataSchema, FairnessReportData } from '@/ai/schema-and-types';
import { getCompanyStudents, getCompanyInternships } from '@/services/companyService'; // Using company service to get a wide array of students

export async function getFairnessReportData(): Promise<FairnessReportData> {
  return fairnessReportFlow();
}

const fairnessReportFlow = ai.defineFlow(
  {
    name: 'fairnessReportFlow',
    outputSchema: FairnessReportDataSchema,
  },
  async () => {
    // In a real-world scenario, you'd fetch this data from your database.
    // Here, we'll use our mock service to get a diverse set of student data.
    const students = await getCompanyStudents();

    // The AI will perform the aggregation. We just need to pass it the raw data.
    const studentDataForAI = students.map(s => ({
      location: s.location,
      gender: s.gender,
      socialCategory: s.socialCategory,
    }));
    
    const prompt = `
      You are a data analyst specializing in diversity and inclusion metrics.
      Based on the following list of student applicants, generate a JSON object
      that summarizes the diversity distribution.

      The output must be a JSON object with three keys:
      1.  "geoDiversity": An array of objects, where each object has "name" (e.g., 'Urban', 'Rural'), "value" (count of students), and "fill" (a unique hex color code, e.g., '#8884d8'). Categorize locations like 'Mumbai', 'Delhi', 'Bangalore' as 'Urban', and others as 'Rural'.
      2.  "socialCategory": An array of objects, where each object has "name" (the social category, e.g., 'General', 'OBC') and "value" (count of students).
      3.  "genderDiversity": An array of objects, where each object has "name" (the gender), "value" (the count), and "fill" (a unique hex color code).

      Student Data:
      ${JSON.stringify(studentDataForAI, null, 2)}
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: prompt,
      output: {
        format: 'json',
        schema: FairnessReportDataSchema
      },
    });

    if (!output) {
      throw new Error("Failed to generate fairness report data from AI.");
    }
    return output;
  }
);
