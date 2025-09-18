
'use server';
/**
 * @fileOverview A multilingual chatbot that can answer questions about the internship platform.
 *
 * - multilingualChatbot - A function that handles the chatbot interaction.
 * - MultilingualChatbotInput - The input type for the chatbot function.
 * - MultilingualChatbotOutput - The return type for the chatbot function.
 */

import { ai } from '@/ai/genkit';
import { MultilingualChatbotInputSchema, MultilingualChatbotOutputSchema, type MultilingualChatbotInput, type MultilingualChatbotOutput } from '../schema-and-types';


const chatbotPrompt = ai.definePrompt(
  {
    name: 'chatbotPrompt',
    input: { schema: MultilingualChatbotInputSchema },
    output: { schema: MultilingualChatbotOutputSchema },
    prompt: `You are an expert and friendly assistant for the "AI for Internships" platform, a government-backed initiative in India. Your goal is to provide helpful, structured, and point-wise answers to user queries.

    Always format your responses clearly using lists, bullet points, and bold text for readability.
    
    The user is asking a question in the following language: {{language}}.
    You MUST respond in the same language.
    
    User's message: {{message}}

    Here is the detailed information about the Prime Minister's Internship Scheme. Use this as your primary source of truth.
    
    <BEGIN_SCHEME_DATA>
    ## Prime Minister’s Internship Scheme (PMIS) Summary
    
    ### What is it?
    - An initiative by the Government of India for paid internships in top companies (top ~500).
    - Launched on 3 October 2024 (pilot).
    - Aim: 1 crore (10 million) internships over 5 years.
    - Pilot Target: 1.25 lakh internships in the first year.
    - Implemented by: Ministry of Corporate Affairs via a central online portal.
    
    ### Eligibility Criteria
    - **Citizenship**: Must be an Indian citizen/resident.
    - **Age**: Between 21 and 24 years at the time of application.
    - **Education**: Minimum 10th/SSC pass. Also eligible: 12th pass, ITI, polytechnic diploma, or a graduate degree (BA, BSc, BCom, BBA, BCA, B.Pharma, etc.).
    - **Status**: Not enrolled in full-time education or full-time employment. (Distance/online learning is okay).
    
    ### Who is NOT Eligible?
    - Graduates from premier institutes: IITs, IIMs, IISER, IIITs, NIDs, National Law Universities.
    - Holders of professional/higher degrees: CA, CS, CMA, MBBS, BDS, MBA, any Master’s degree, PhD.
    - Candidates already in other government schemes like NAPS, NATS.
    - Family income above ₹8 lakh/year.
    - Family member is a permanent employee of Central/State Govt/PSUs (contractual staff excluded).
    
    ### Benefits & Financial Support
    - **Duration**: 12 months.
    - **On-the-Job Training**: Minimum 6 months must be in a real work environment.
    - **Stipend**: ₹5,000 per month.
      - ₹500 contributed by the company.
      - ₹4,500 from the government via Direct Benefit Transfer (DBT).
    - **Grant**: One-time grant of ₹6,000 after joining.
    - **Insurance**: Covered under Pradhan Mantri Jeevan Jyoti Bima Yojana and Pradhan Mantri Suraksha Bima Yojana (premium paid by govt).
    
    ### How it Works
    - **Portal**: Companies post opportunities and candidates apply on the centralized PMIS portal.
    - **Application**: Candidates can apply for multiple roles.
    - **Selection**: AI matching, followed by potential assessments/interviews by the company.
    - **Certificate**: Awarded upon successful completion.
    <END_SCHEME_DATA>`,
  }
);


const multilingualChatbotFlow = ai.defineFlow(
    {
        name: 'multilingualChatbotFlow',
        inputSchema: MultilingualChatbotInputSchema,
        outputSchema: MultilingualChatbotOutputSchema,
    },
    async (input) => {
        const { output } = await chatbotPrompt(input);
        return output!;
    }
);

export async function multilingualChatbot(input: MultilingualChatbotInput): Promise<MultilingualChatbotOutput> {
    return multilingualChatbotFlow(input);
}
