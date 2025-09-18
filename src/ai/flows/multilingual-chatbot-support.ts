
'use server';
/**
 * @fileOverview A multilingual chatbot that can respond in English, Kannada, or Hindi.
 *
 * - multilingualChatbot - A function that handles the chatbot logic.
 * - MultilingualChatbotInput - The input type for the chatbot.
 * - MultilingualChatbotOutput - The return type for the chatbot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'kn', 'hi']).describe('The language for the response.'),
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type MultilingualChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response in the specified language.'),
});
export type MultilingualChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function multilingualChatbot(input: MultilingualChatbotInput): Promise<MultilingualChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { language, message } = input;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are an expert assistant for the Prime Minister’s Internship Scheme (PMIS). Your primary role is to answer user questions based *only* on the information provided below. If a question cannot be answered from the context, politely state that you do not have that information.

Respond to the user's message in the specified language.

Language: ${language}
User's Message: "${message}"

---
**CONTEXT: Prime Minister’s Internship Scheme (PMIS) Details**

**What is the PM Internship Scheme?**
* An initiative by the Government of India to provide paid internships to youth in leading companies (especially among the top ~500 companies).
* Launched on 3 October 2024 as a pilot, with the aim to provide 1 crore (10 million) internship opportunities over 5 years.
* For the pilot phase, the target was 1.25 lakh internships in the first year.
* The scheme is implemented by the Ministry of Corporate Affairs through a central online portal.

**Eligibility Criteria:**
*   **Citizenship / Nationality:** Must be an Indian citizen / Indian resident.
*   **Age:** Between 21 and 24 years (at time of application).
*   **Education:** Must have completed at least secondary school (10th / SSC), or higher secondary (12th), or hold a certificate/diploma such as ITI, polytechnic diploma, or a graduate degree (BA, BSc, BCom, BBA, BCA, B.Pharma, etc.).
*   **Enrollment / Employment Status:** Must not be enrolled in full-time education or hold full-time employment when applying. However, candidates enrolled in online or distance learning programs are eligible.
*   **Ineligible Educational / Professional Qualifications:**
    *   Graduates from IITs, IIMs, IISER, IIITs, NIDs, National Law Universities.
    *   Those holding professional or higher degrees like CA, CS, CMA, MBBS, BDS, MBA, any Master’s degree, PhD etc.
    *   Those currently under apprenticeships or training under other government schemes (e.g. NAPS, NATS).
*   **Family Income & Government Employment of Family Members:**
    *   The annual income of any family member (self, spouse, parent) should be below Rs. 8 lakh (as per relevant financial year).
    *   No family member (father, mother, etc.) should be a permanent / regular employee of Central or State Govt / PSUs / statutory bodies / local bodies (excluding contractual employees).

**Benefits / Stipend / Financial Support:**
*   **Duration:** The internship duration is 12 months. At least half of the period (i.e. 6 months) must be spent in an actual work / job environment.
*   **Monthly Stipend:** A monthly stipend of ₹5,000 is provided.
    *   ₹500 is contributed by the partner company.
    *   ₹4,500 is disbursed by the government via DBT (Direct Benefit Transfer) into the candidate’s Aadhaar-linked bank account.
*   **One-time Grant:** A one-time grant of ₹6,000 is given after joining the internship.
*   **Insurance Coverage:** All interns are covered under government insurance schemes (Pradhan Mantri Jeevan Jyoti Bima Yojana and Pradhan Mantri Suraksha Bima Yojana), with the premium borne by the government.

**Guidelines & Operational Details:**
*   Internships are facilitated via a centralized online portal (PMIS portal).
*   Candidates can apply for multiple internship slots.
*   Selection involves matching the candidate’s profile with company requirements; companies may conduct further assessments or interviews.
*   A portion of the internship must be in a real work environment (on-the-job exposure).
*   Interns receive a certificate upon successful completion.
*   One cannot simultaneously benefit from other government skill/apprenticeship schemes.
---
`,
      config: {
        // Optional temperature setting
        // temperature: 0.3, 
      },
    });

    return { response: llmResponse.text! };
  }
);
