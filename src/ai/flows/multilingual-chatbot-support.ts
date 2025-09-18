
'use server';
/**
 * @fileOverview A multilingual chatbot that can respond in English, Kannada, or Hindi.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'kn', 'hi']).describe('The language for the response.'),
  message: z.string().describe('The user\'s message.'),
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
      model: 'googleai/gemini-pro',
      prompt: `You are a helpful assistant for an internship platform. Respond to the user's message in the specified language. Language: ${language}. Message: ${message}`,
      config: {
        // Optional: Add any model-specific configuration here
      },
    });

    const responseText = llmResponse.text;

    return {
      response: responseText,
    };
  }
);
