'use server';
/**
 * @fileOverview This file defines the GenerateRetirementVisionVideo flow, which uses a video generation model to create a short video based on a user's description of their ideal retirement.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import { MediaPart } from 'genkit/media';

const GenerateRetirementVisionVideoInputSchema = z.object({
  prompt: z
    .string()
    .describe('A user-provided description of their ideal retirement vision.'),
});
export type GenerateRetirementVisionVideoInput = z.infer<
  typeof GenerateRetirementVisionVideoInputSchema
>;

const GenerateRetirementVisionVideoOutputSchema = z.object({
  videoUrl: z
    .string()
    .describe('The data URI of the generated video.'),
});
export type GenerateRetirementVisionVideoOutput = z.infer<
  typeof GenerateRetirementVisionVideoOutputSchema
>;

async function downloadAndEncode(video: MediaPart): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  const videoUrl = `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(videoUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:video/mp4;base64,${base64}`;
}

// This is the exported server action that the client will call.
export async function generateRetirementVisionVideo(input: GenerateRetirementVisionVideoInput): Promise<GenerateRetirementVisionVideoOutput> {
  return generateRetirementVisionVideoFlow(input);
}

const generateRetirementVisionVideoFlow = ai.defineFlow(
  {
    name: 'generateRetirementVisionVideoFlow',
    inputSchema: GenerateRetirementVisionVideoInputSchema,
    outputSchema: GenerateRetirementVisionVideoOutputSchema,
  },
  async ({ prompt }) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: `Generate a cinematic, hopeful, and inspiring video representing this retirement dream: ${prompt}`,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
      // Wait for 5 seconds before checking the operation status again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video in the operation result');
    }

    const videoDataUri = await downloadAndEncode(video);

    return { videoUrl: videoDataUri };
  }
);
