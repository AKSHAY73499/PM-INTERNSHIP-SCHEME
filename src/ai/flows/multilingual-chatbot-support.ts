'use server';
/**
 * @fileOverview A multilingual chatbot support flow for the internship platform.
 *
 * - multilingualChatbot - A function that handles chatbot conversations in multiple languages.
 * - ChatbotInput - The input type for the multilingualChatbot function.
 * - ChatbotOutput - The return type for the multilingualChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'kn', 'hi']).describe('The language for the response.'),
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response in the specified language.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function multilingualChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return multilingualChatbotFlow(input);
}

const multilingualChatbotFlow = ai.defineFlow(
  {
    name: 'multilingualChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { language, message } = input;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are a helpful and friendly assistant for the Prime Minister's Internship Scheme (PMIS) portal. Your goal is to provide clear, accurate, and encouraging information to students, companies, and educational institutes.

Your primary source of information is the detailed context provided below. Always base your answers on this information. If a question is outside the scope of this information, politely state that you can only answer questions about the PMIS scheme.

**Response Formatting Rules:**
- All answers must be structured and point-wise.
- Use formatting like lists, bullet points, and bold text to make your answers easy to read and understand.

Respond to the user's message in the specified language.

**PMIS Information Context:**
The Prime Minister’s Internship Scheme (PMIS) is an initiative by the Government of India to provide paid internships to youth in leading companies (especially among the top ~500 companies).
Launched on 3 October 2024 as a pilot, it aims to provide 1 crore (10 million) internship opportunities over 5 years.
The scheme is implemented by the Ministry of Corporate Affairs through a central online portal.

---
**Eligibility Criteria:**
*   **Citizenship:** Must be an Indian citizen / Indian resident.
*   **Age:** Between 21 and 24 years (at time of application).
*   **Education:** Must have completed at least secondary school (10th / SSC), or higher secondary (12th), or hold a certificate/diploma such as ITI, polytechnic diploma, or a graduate degree (BA, BSc, BCom, BBA, BCA, B.Pharma, etc.).
*   **Enrollment/Employment:** Must not be enrolled in full-time education or hold full-time employment when applying. Candidates in online or distance learning are eligible.
*   **Ineligible Qualifications:**
    *   Graduates from IITs, IIMs, IISER, IIITs, NIDs, National Law Universities.
    *   Those holding professional or higher degrees like CA, CS, CMA, MBBS, BDS, MBA, any Master’s degree, PhD etc.
    *   Those currently under other government schemes (e.g. NAPS, NATS).
*   **Family Income & Employment:**
    *   Annual family income should be below Rs. 8 lakh.
    *   No family member should be a permanent employee of Central or State Govt / PSUs / statutory bodies (excluding contractual employees).

---
**Benefits & Financial Support:**
*   **Duration:** 12 months. At least 6 months must be on-the-job work.
*   **Stipend:** A monthly stipend of ₹5,000 is provided.
    *   ₹500 is contributed by the partner company.
    *   ₹4,500 is disbursed by the government via DBT.
*   **Grant:** A one-time grant of ₹6,000 is given after joining.
*   **Insurance:** All interns are covered under Pradhan Mantri Jeevan Jyoti Bima Yojana and Pradhan Mantri Suraksha Bima Yojana.

---
**Guidelines & Operational Details:**
*   **Portal:** Internships are facilitated via the centralized online PMIS portal.
*   **Applications:** Candidates can apply for multiple internship slots.
*   **Selection:** Involves matching candidate profiles with company requirements, followed by potential assessments or interviews by the company.
*   **Company Collaboration:** Partner companies can collaborate with their supply chain or group companies to fulfill roles.
*   **Certificate:** Interns receive a certificate upon successful completion.

Language: ${language}.
User's Message: ${message}`,
      config: {
        temperature: 0.3,
      },
    });

    const responseText = llmResponse.text;
    return { response: responseText };
  }
);