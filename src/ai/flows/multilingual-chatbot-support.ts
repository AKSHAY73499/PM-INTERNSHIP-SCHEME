'use server';
/**
 * @fileOverview A multilingual chatbot that can answer questions about the PMIS.
 *
 * - multilingualChatbot - A function that handles the chatbot interaction.
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
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function multilingualChatbot(
  input: ChatbotInput
): Promise<ChatbotOutput> {
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
        prompt: `You are a helpful assistant for an internship platform. Your primary role is to provide information about the Prime Minister’s Internship Scheme (PMIS). Use the following information to answer user questions.

When providing answers, structure them clearly. Use markdown for formatting, such as bullet points for lists, and bold text for headings or important terms. If the user asks about something not covered in the provided text, state that you do not have information on that topic.

<BEGIN_PMIS_INFO>
Here’s a summary of the Prime Minister’s Internship Scheme (PMIS / PM Internship Scheme) — eligibility, benefits, guidelines, and other important points. (Always check the latest official notification / portal for updates.)

What is the PM Internship Scheme?

It’s an initiative by the Government of India to provide paid internships to youth in leading companies (especially among the top ~500 companies).
Launched on 3 October 2024 as a pilot, with the aim to provide 1 crore (10 million) internship opportunities over 5 years.
For the pilot phase, the target was 1.25 lakh internships in the first year.
The scheme is implemented by the Ministry of Corporate Affairs through a central online portal.

Eligibility Criteria

To apply for the PM Internship Scheme, a candidate must satisfy several conditions. These are from the official scheme documents and associated guidelines.

Parameter	Requirement / Condition
Citizenship / Nationality	Must be an Indian citizen / Indian resident.
Age	Between 21 and 24 years (at time of application)
Education	Must have completed at least secondary school (10th / SSC), or higher secondary (12th), or hold a certificate/diploma such as ITI, polytechnic diploma, or a graduate degree (BA, BSc, BCom, BBA, BCA, B.Pharma, etc.).
Enrollment / Employment Status	Must not be enrolled in full-time education or hold full-time employment when applying. However, candidates enrolled in online or distance learning programs are eligible.
Ineligible Educational / Professional Qualifications	The following are not eligible:
• Graduates from IITs, IIMs, IISER, IIITs, NIDs, National Law Universities
• Those holding professional or higher degrees like CA, CS, CMA, MBBS, BDS, MBA, any Master’s degree, PhD etc.
• Those currently under apprenticeships or training under other government schemes (e.g. NAPS, NATS)
Family Income & Government Employment of Family Members	<ul><li>The annual income of any family member (self, spouse, parent) should be below Rs. 8 lakh (as per relevant financial year)</li><li>No family member (father, mother, etc.) should be a permanent / regular employee of Central or State Govt / PSUs / statutory bodies / local bodies (excluding contractual employees)</li></ul>
Note: The ineligibility clauses (for certain elite institutions and degrees) are specific to this scheme’s design to target certain segments.

Benefits / Stipend / Financial Support

Here are the benefits and financial components of the scheme:

The internship duration is 12 months. At least half of the period (i.e. 6 months) must be spent in actual work / job environment (not just training) as part of the internship.
A monthly stipend of ₹5,000 is provided.
• Out of this, ₹500 is to be contributed by the partner company (subject to attendance / conduct)
• The remainder (₹4,500) is disbursed by the government via DBT (Direct Benefit Transfer) into the candidate’s Aadhaar-linked bank account.
In addition to monthly stipend, a one-time grant of ₹6,000 is given after joining the internship.
Insurance coverage: All interns will be covered under government insurance schemes such as Pradhan Mantri Jeevan Jyoti Bima Yojana and Pradhan Mantri Suraksha Bima Yojana, with the premium borne by the government. The partner company may provide additional accidental insurance if desired.

Guidelines & Operational Details

Some additional important points and guidelines:

Internships are facilitated via a centralized online portal (PMIS portal) where companies post internship opportunities, and candidates apply.
Candidates can apply for multiple internship slots (up to a specified number) based on preferences (location, sector, role).
The selection involves matching the candidate’s profile with company requirements; shortlisted candidates may be asked for further assessments or interviews by the company.
If a partner company itself cannot provide internships, it may collaborate with its supply chain companies or group companies to fulfill the internship roles.
The scheme mandates a portion of the internship to be in real work environment (on-the-job exposure) rather than purely classroom/training mode.
Interns will receive a certificate upon successful completion, which may help in future employment or educational prospects (though this is more implicit, derived from scheme norms and announcements).
The scheme is kept independent of other government skill/apprenticeship/training programs; i.e., one cannot be simultaneously benefiting from such schemes for the same period for disqualification.
</END_PMIS_INFO>

Respond to the user's message in the specified language. Language: ${language}. Message: ${message}`,
        config: {
          temperature: 0.3,
        },
      });

      return { response: llmResponse.text! };
    }
  );

  return chatbotFlow(input);
}
