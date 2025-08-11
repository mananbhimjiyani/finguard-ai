'use server';
/**
 * @fileOverview This file defines the GenerateFinancialProjectionVideo flow, which uses a video generation model
 * to create a short video visualizing a user's financial growth towards their retirement goal.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { MediaPart } from 'genkit';
import { userProfileData } from '@/lib/data';

const GenerateFinancialProjectionVideoInputSchema = z.object({});
export type GenerateFinancialProjectionVideoInput = z.infer<typeof GenerateFinancialProjectionVideoInputSchema>;

const GenerateFinancialProjectionVideoOutputSchema = z.object({
  videoDataUri: z.string().optional(),
  error: z.string().optional(),
});
export type GenerateFinancialProjectionVideoOutput = z.infer<typeof GenerateFinancialProjectionVideoOutputSchema>;


export async function generateFinancialProjectionVideo(input: GenerateFinancialProjectionVideoInput): Promise<GenerateFinancialProjectionVideoOutput> {
  return generateFinancialProjectionVideoFlow(input);
}

const generateFinancialProjectionVideoFlow = ai.defineFlow(
  {
    name: 'generateFinancialProjectionVideoFlow',
    inputSchema: GenerateFinancialProjectionVideoInputSchema,
    outputSchema: GenerateFinancialProjectionVideoOutputSchema,
  },
  async () => {
    try {
      // Construct a prompt based on user's financial data
      const prompt = `A cinematic animation visualizing financial growth. Start with a small sapling representing current savings of $${userProfileData.currentSavings.toLocaleString()}. Show the sapling growing into a large, strong tree, symbolizing the growth towards a retirement goal of $${userProfileData.retirementGoal.toLocaleString()}. The background should show a dynamic stock market graph with upward trends and fluctuations, representing market variations. The video should end with a beautiful, peaceful home, representing the achievement of the financial goal.`;
      
      let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: prompt,
        config: {
          durationSeconds: 8,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        throw new Error('Video generation operation failed to start.');
      }

      // Poll for completion
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
      }

      if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
      }
      
      const videoPart = operation.output?.message?.content.find((p): p is MediaPart => !!(p as MediaPart).media?.url);

      if (!videoPart || !videoPart.media?.url) {
        throw new Error('No video content was returned from the generation service.');
      }

      // The URL from Veo is temporary and needs to be fetched.
      // We will fetch it and convert to a data URI to send to the client.
      const fetch = (await import('node-fetch')).default;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable not set.');
      }
      const videoUrl = `${videoPart.media.url}&key=${apiKey}`;

      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video file. Status: ${response.statusText}`);
      }
      
      const videoBuffer = await response.buffer();
      const contentType = response.headers.get('content-type') || 'video/mp4';
      const videoDataUri = `data:${contentType};base64,${videoBuffer.toString('base64')}`;

      return { videoDataUri };

    } catch (error: any) {
        console.error('An error occurred during video generation flow:', error);
        return { error: error.message || 'An unexpected error occurred.' };
    }
  }
);
