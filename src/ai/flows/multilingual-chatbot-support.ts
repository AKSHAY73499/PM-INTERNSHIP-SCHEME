
'use server';
/**
 * @fileOverview A multilingual chatbot for user support.
 *
 * - multilingualChatbot - A function that handles chatbot conversations in multiple languages.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
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
  audioData: z.string().optional().describe('The base64 encoded audio data of the response.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

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
      prompt: `You are a helpful assistant for an internship platform. Respond to the user's message in the specified language. Language: ${language}. Message: ${message}`,
      config: {
        temperature: 0.5,
      },
    });

    const responseText = llmResponse.text;

    return {
      response: responseText,
    };
  }
);


export async function multilingualChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return multilingualChatbotFlow(input);
}
