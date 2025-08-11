'use server';
/**
 * @fileOverview This file defines the AssessPortfolioRisk flow, which analyzes a user's investment portfolio and provides an assessment of its risk level.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioRiskInputSchema = z.object({
  portfolioData: z.string().describe("A JSON string representing the user's portfolio data, including holdings and allocations."),
});

export type PortfolioRiskInput = z.infer<typeof PortfolioRiskInputSchema>;

const PortfolioRiskOutputSchema = z.object({
  riskLevel: z.string().describe('The assessed risk level of the portfolio (e.g., Conservative, Moderate, Aggressive).'),
  analysis: z.string().describe('A brief analysis of the portfolio risk, explaining the reasoning behind the assessment.'),
});

export type PortfolioRiskOutput = z.infer<typeof PortfolioRiskOutputSchema>;

export async function assessPortfolioRisk(input: PortfolioRiskInput): Promise<PortfolioRiskOutput> {
  return assessPortfolioRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessPortfolioRiskPrompt',
  input: {schema: PortfolioRiskInputSchema},
  output: {schema: PortfolioRiskOutputSchema},
  prompt: `You are a financial risk analyst. Based on the user's portfolio data, assess its risk level and provide a brief analysis.

Portfolio Data:
{{{portfolioData}}}

Analyze the asset allocation (stocks, bonds, real estate, etc.) to determine the overall risk profile. A higher allocation to stocks and volatile assets suggests higher risk, while a portfolio with significant bonds and cash is lower risk.

Provide a clear risk level (e.g., Low, Low-to-Moderate, Moderate, Moderate-to-High, High) and a concise explanation for your assessment.`,
});

const assessPortfolioRiskFlow = ai.defineFlow(
  {
    name: 'assessPortfolioRiskFlow',
    inputSchema: PortfolioRiskInputSchema,
    outputSchema: PortfolioRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
