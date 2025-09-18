
'use server';
/**
 * @fileoverview A multilingual chatbot that can respond in English, Kannada, or Hindi.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { textToSpeech, TextToSpeechInput } from './text-to-speech';

const ChatbotInputSchema = z.object({
  language: z.enum(['en', 'kn', 'hi']).describe('The language for the response.'),
  message: z.string().describe('The user\'s message.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
  audioUrl: z.string().optional().describe('The URL for the text-to-speech audio of the response.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

const languageMap = {
    en: 'English',
    kn: 'Kannada',
    hi: 'Hindi',
};

export async function multilingualChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'multilingualChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { language, message } = input;
    const languageName = languageMap[language];

    const prompt = ai.definePrompt({
        name: 'chatbotPrompt',
        prompt: `You are a helpful assistant for the InternCompass platform. Respond to the following user message in ${languageName}. Keep your response concise. User message: "${message}"`,
    });

    const { text } = await ai.generate({
      prompt: `You are a helpful assistant for the InternCompass platform. Respond to the following user message in ${languageName}. Keep your response concise. User message: "${message}"`,
    });

    try {
      const { audioUrl } = await textToSpeech({ text: text });
      return { response: text, audioUrl };
    } catch (error: any) {
        console.error("Text-to-speech failed:", error.message);
        // If TTS fails (e.g., due to quota), return response without audio.
        return { response: text };
    }
  }
);
