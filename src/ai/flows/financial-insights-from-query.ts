'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing financial insights from user queries.
 *
 * The flow takes a user's financial query as input and returns a concise, actionable insight.
 * - financialInsightsFromQuery - A function that handles the financial query and returns insights.
 * - FinancialInsightsFromQueryInput - The input type for the financialInsightsFromQuery function.
 * - FinancialInsightsFromQueryOutput - The return type for the financialInsightsFromQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { userProfileData, portfolioData } from '@/lib/data';

const FinancialInsightsFromQueryInputSchema = z.object({
  query: z.string().describe("The user's financial query."),
});
export type FinancialInsightsFromQueryInput = z.infer<typeof FinancialInsightsFromQueryInputSchema>;

const FinancialInsightsFromQueryOutputSchema = z.object({
  insight: z.string().describe('A detailed but easy-to-understand explanation that answers the user\'s query, referencing their personal data to make it relevant.'),
});
export type FinancialInsightsFromQueryOutput = z.infer<typeof FinancialInsightsFromQueryOutputSchema>;

export async function financialInsightsFromQuery(input: FinancialInsightsFromQueryInput): Promise<FinancialInsightsFromQueryOutput> {
  return financialInsightsFromQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialInsightsFromQueryPrompt',
  input: {schema: FinancialInsightsFromQueryInputSchema},
  output: {schema: FinancialInsightsFromQueryOutputSchema},
  prompt: `You are a financial advisor providing detailed, educational, and personalized insights to users based on their financial queries. Your goal is to make complex financial topics easy to understand.

  Use the user's personal financial data to make your explanation as relevant and personalized as possible.

  User's Profile Data:
  ${JSON.stringify(userProfileData)}

  User's Portfolio Data:
  ${JSON.stringify(portfolioData)}

  User's Query:
  "{{{query}}}"

  Provide a clear, educational, and personalized financial insight based on the query. Break down complex concepts into simple terms. Use the user's data to illustrate your points with concrete examples.
  Be helpful and reassuring. Do not be conversational or mention you are an AI.`,
});

const financialInsightsFromQueryFlow = ai.defineFlow(
  {
    name: 'financialInsightsFromQueryFlow',
    inputSchema: FinancialInsightsFromQueryInputSchema,
    outputSchema: FinancialInsightsFromQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
