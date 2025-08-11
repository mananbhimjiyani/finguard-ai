'use server';
/**
 * @fileOverview This file implements the DetectAnomalousTransactions flow for the FinGuard app.
 *
 * - detectAnomalousTransactions - A function that detects anomalous financial transactions.
 * - DetectAnomalousTransactionsInput - The input type for the detectAnomalousTransactions function.
 * - DetectAnomalousTransactionsOutput - The return type for the detectAnomalousTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalousTransactionsInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe(
      'A string containing the transaction history of the user.  Include transaction details like date, amount, description.'
    ),
  recentTransaction: z
    .string()
    .describe('A string containing the most recent transaction details.'),
  userProfile: z
    .string()
    .describe(
      'A string containing the user profile information, including demographics, income, savings, and risk tolerance.'
    ),
});

export type DetectAnomalousTransactionsInput = z.infer<
  typeof DetectAnomalousTransactionsInputSchema
>;

const DetectAnomalousTransactionsOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the transaction is anomalous.'),
  explanation: z.string().describe('Explanation of why the transaction is anomalous.'),
});

export type DetectAnomalousTransactionsOutput = z.infer<
  typeof DetectAnomalousTransactionsOutputSchema
>;

export async function detectAnomalousTransactions(
  input: DetectAnomalousTransactionsInput
): Promise<DetectAnomalousTransactionsOutput> {
  return detectAnomalousTransactionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomalousTransactionsPrompt',
  input: {schema: DetectAnomalousTransactionsInputSchema},
  output: {schema: DetectAnomalousTransactionsOutputSchema},
  prompt: `You are an expert in fraud detection for financial transactions.

You are provided with the transaction history of a user, their recent transaction, and their user profile. You must determine if the recent transaction is anomalous given the user's history and profile.

Transaction History: {{{transactionHistory}}}
Recent Transaction: {{{recentTransaction}}}
User Profile: {{{userProfile}}}

Based on this information, determine if the recent transaction is anomalous. If it is, explain why.
Set isAnomalous to true if anomalous, otherwise, set it to false.
`,
});

const detectAnomalousTransactionsFlow = ai.defineFlow(
  {
    name: 'detectAnomalousTransactionsFlow',
    inputSchema: DetectAnomalousTransactionsInputSchema,
    outputSchema: DetectAnomalousTransactionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
