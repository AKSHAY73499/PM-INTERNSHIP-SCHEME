
'use server';
/**
 * @fileOverview A flow for matching students with internships based on their profile.
 *
 * - matchInternships - A function that finds relevant internships.
 * - MatchInternshipsInput - The input type for the matchInternships function.
 * - MatchInternshipsOutput - The return type for the matchInternships function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const MatchInternshipsInputSchema = z.object({
  skills: z.array(z.string()).describe('The skills of the student.'),
  interests: z.array(z.string()).describe('The interests of the student.'),
  location: z.string().describe('The preferred location of the student.'),
});
export type MatchInternshipsInput = z.infer<typeof MatchInternshipsInputSchema>;

export const MatchInternshipsOutputSchema = z.array(
  z.object({
    companyName: z.string().describe('The name of the company.'),
    title: z.string().describe('The title of the internship.'),
    location: z.string().describe('The location of the internship.'),
    description: z.string().describe('A brief description of the internship.'),
    requiredSkills: z.array(z.string()).describe('A list of required skills for the internship.'),
    compensation: z.string().describe('The compensation for the internship.'),
  })
);
export type MatchInternshipsOutput = z.infer<typeof MatchInternshipsOutputSchema>;

export async function matchInternships(
  input: MatchInternshipsInput
): Promise<MatchInternshipsOutput> {
  return matchInternshipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'internshipMatchingPrompt',
  input: { schema: MatchInternshipsInputSchema },
  output: { schema: MatchInternshipsOutputSchema },
  prompt: `You are an AI matching engine for the PM Internship Scheme. Your primary goal is to find relevant internship opportunities for a student, but you MUST strictly adhere to the scheme's eligibility criteria.

ONLY suggest internships that would be appropriate for a candidate who meets the following profile:

**ELIGIBILITY CRITERIA (Candidate Profile):**
- Indian citizen.
- Age between 21–24 years.
- Minimum qualification: Class 10 / ITI / Polytechnic / Diploma / Graduate degree.
- Is NOT employed full-time or enrolled in a full-time academic programme.
- Is NOT from a premier institute (IITs, IIMs, NIDs, IISERs, NITs, NLUs, etc.).
- Does NOT hold higher/professional qualifications (MBA, PhD, CA, CS, MBBS, etc.).
- Is NOT enrolled in other govt apprenticeship schemes (like NAPS, NATS).
- Family income is NOT above ₹8 lakh/year.
- Parents/spouse are NOT permanent govt/PSU employees.

Based on these rules, analyze the student's profile below and provide a list of 5 diverse and relevant internship opportunities that a person meeting the above criteria would be eligible for.

**Student's Profile for Matching:**
- Skills: {{{skills}}}
- Interests: {{{interests}}}
- Preferred Location: {{{location}}}

For each internship, include the company name, title, location, a brief description, required skills, and compensation. Ensure the internships are from a variety of sectors and company sizes. Do not suggest internships that would require qualifications the candidate is not allowed to have (e.g., an internship asking for an MBA).`,
});

const matchInternshipsFlow = ai.defineFlow(
  {
    name: 'matchInternshipsFlow',
    inputSchema: MatchInternshipsInputSchema,
    outputSchema: MatchInternshipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
