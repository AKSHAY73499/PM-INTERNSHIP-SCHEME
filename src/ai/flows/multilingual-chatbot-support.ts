
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'kn', 'hi']).describe('The language for the response.'),
  message: z.string().describe('The user\'s message.'),
});

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response in the specified language.'),
});

export async function multilingualChatbot(input: z.infer<typeof ChatbotInputSchema>): Promise<z.infer<typeof ChatbotOutputSchema>> {
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
      model: 'googleai/gemini-1.5-flash-preview',
      prompt: `You are a helpful assistant for an internship platform. Respond to the user's message in the specified language. Language: ${language}. Message: ${message}`,
      config: {
        temperature: 0.5,
      },
    });

    const responseText = llmResponse.text();

    return {
      response: responseText,
    };
  }
);
