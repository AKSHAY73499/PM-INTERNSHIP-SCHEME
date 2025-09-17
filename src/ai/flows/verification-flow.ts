
'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-assisted verification.
 * It simulates checking company credentials, internship postings, and student documents.
 * In a real-world scenario, this flow would integrate with external APIs and tools.
 *
 * @exports `runVerification` - The main function to trigger a verification process.
 * @exports `VerificationInput` - The input type for the runVerification function.
 * @exports `VerificationOutput` - The output type for the runVerification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schemas for Company Verification
const CompanyDetailsSchema = z.object({
  pan: z.string().describe("Company's PAN number."),
  gst: z.string().describe("Company's GST number."),
  cin: z.string().describe("Company's CIN number."),
  description: z.string().optional().describe("Company's self-description or past internship texts."),
});

// Schemas for Internship Posting Review
const PostingDetailsSchema = z.object({
  title: z.string().describe("Internship title."),
  description: z.string().describe("Internship description."),
  requiredSkills: z.array(z.string()).optional().describe("List of required skills."),
  stipend: z.string().optional().describe("Stipend if mentioned (e.g., '₹5,000/month')."),
  duration: z.string().optional().describe("Internship duration."),
  location: z.string().optional().describe("Internship location."),
});

// Schemas for Student Document Verification
const StudentDocumentSchema = z.object({
    documentType: z.enum(['degree_certificate', 'id_card']),
    fileDataUri: z.string().describe("The document as a data URI."),
});

// Main Input Schema
const VerificationInputSchema = z.object({
  verificationType: z.enum(['company', 'internship', 'student']),
  companyDetails: CompanyDetailsSchema.optional(),
  postingDetails: PostingDetailsSchema.optional(),
  studentDocuments: z.array(StudentDocumentSchema).optional(),
});
export type VerificationInput = z.infer<typeof VerificationInputSchema>;

// Main Output Schema
const VerificationOutputSchema = z.object({
  isApproved: z.boolean().describe("True if auto-approved, False if flagged for manual review."),
  confidenceScore: z.number().min(0).max(100).describe("The AI's confidence in the verification (0-100)."),
  reason: z.string().describe("The reason for flagging or the basis of approval."),
});
export type VerificationOutput = z.infer<typeof VerificationOutputSchema>;

export async function runVerification(input: VerificationInput): Promise<VerificationOutput> {
  // In a real application, you would call the Genkit flow.
  // For this mock, we are returning a simulated result based on the input.
  if (input.verificationType === 'company') {
      return {
          isApproved: false,
          confidenceScore: 65,
          reason: "GST number does not seem to match records from the MCA21 database. Potential discrepancy found."
      };
  }
   if (input.verificationType === 'internship') {
      return {
          isApproved: false,
          confidenceScore: 70,
          reason: "The internship posting is missing key details such as the duration. The stipend also appears to be below the industry average for this type of role."
      };
  }
  // Default response for other types
  return {
    isApproved: true,
    confidenceScore: 95,
    reason: 'All checks passed.',
  };
}

const verificationPrompt = ai.definePrompt({
  name: 'verificationPrompt',
  input: { schema: VerificationInputSchema },
  output: { schema: VerificationOutputSchema },
  prompt: `You are an AI verification agent for a government internship portal. Your task is to analyze submitted data and determine if it meets the platform's standards.

  Verification Type: {{{verificationType}}}

  {{#if companyDetails}}
  **Company to Verify:**
  - PAN: {{{companyDetails.pan}}}
  - GST: {{{companyDetails.gst}}}
  - CIN: {{{companyDetails.cin}}}
  - Description: {{{companyDetails.description}}}
  **Instructions:** Check for credential validity (mock check), scan description for suspicious keywords (like "data entry only", "registration fee"), and calculate a trust score. If the score is below 80, flag for review.
  {{/if}}

  {{#if postingDetails}}
  **Internship to Review:**
  - Title: {{{postingDetails.title}}}
  - Description: {{{postingDetails.description}}}
  - Stipend: {{{postingDetails.stipend}}}
  - Duration: {{{postingDetails.duration}}}
  **Instructions:** Check for consistency between title and description, ensure the stipend is fair (mock check), and verify all key details are present. Flag if incomplete or inconsistent.
  {{/if}}

  {{#if studentDocuments}}
  **Student Documents to Verify:**
  {{#each studentDocuments}}
  - Type: {{{documentType}}}
  {{/each}}
  **Instructions:** Use OCR to extract text from documents (mock OCR) and compare it against user-entered data. Check for signs of forgery (mock check). Flag if confidence is low.
  {{/if}}

  Based on your analysis, decide if the submission can be auto-approved or needs manual review. Provide a confidence score and a clear reason for your decision.
  `,
});

const verificationFlow = ai.defineFlow(
  {
    name: 'verificationFlow',
    inputSchema: VerificationInputSchema,
    outputSchema: VerificationOutputSchema,
  },
  async (input) => {
    // This is where you would integrate with tools like:
    // - A service to call the real MCA21 database API.
    // - An OCR tool to extract text from images.
    // - A document forgery detection model.

    const { output } = await verificationPrompt(input);
    return output!;
  }
);
