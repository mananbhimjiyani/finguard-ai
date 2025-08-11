'use server';

/**
 * @fileOverview This file defines the RiskAssessmentAnalysis flow, which analyzes user risk assessment data and provides a description of their risk profile and its impact on investment strategy.
 *
 * @module src/ai/flows/risk-assessment-analysis
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskAssessmentInputSchema = z.object({
  riskToleranceScore: z.number().describe('The user\'s risk tolerance score from the risk assessment.'),
  investmentHorizon: z.string().describe('The user\'s investment horizon (e.g., short-term, long-term).'),
  financialGoals: z.string().describe('The user\'s stated financial goals (e.g., retirement, buying a house).'),
});

export type RiskAssessmentInput = z.infer<typeof RiskAssessmentInputSchema>;

const RiskAssessmentOutputSchema = z.object({
  riskProfileDescription: z.string().describe('A description of the user\'s risk profile (e.g., conservative, moderate, aggressive).'),
  investmentStrategyImpact: z.string().describe('How the risk profile should impact the user\'s investment strategy.'),
});

export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function analyzeRiskAssessment(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  return riskAssessmentAnalysisFlow(input);
}

const riskAssessmentPrompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: {schema: RiskAssessmentInputSchema},
  output: {schema: RiskAssessmentOutputSchema},
  prompt: `You are a financial advisor analyzing a user's risk assessment data.

  Based on the following information, provide a description of the user's risk profile and explain how it should impact their investment strategy.

  Risk Tolerance Score: {{{riskToleranceScore}}}
  Investment Horizon: {{{investmentHorizon}}}
  Financial Goals: {{{financialGoals}}}

  Risk Profile Description:
  Investment Strategy Impact: `,
});

const riskAssessmentAnalysisFlow = ai.defineFlow(
  {
    name: 'riskAssessmentAnalysisFlow',
    inputSchema: RiskAssessmentInputSchema,
    outputSchema: RiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await riskAssessmentPrompt(input);
    return output!;
  }
);
