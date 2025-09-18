
'use server';
/**
 * @fileOverview A multilingual chatbot that can respond in English, Kannada, or Hindi.
 *
 * - multilingualChatbot - The main function that handles the chatbot logic.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'kn', 'hi']).describe('The language for the response.'),
  message: z.string().describe('The user\'s message.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function multilingualChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
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
      prompt: `You are a helpful assistant for an internship platform. Respond to the user's message in the specified language. Language: ${language}. Message: ${message}`,
      config: {
        // Add any model-specific configuration here
      },
    });

    return {
      response: llmResponse.text,
    };
  }
);
