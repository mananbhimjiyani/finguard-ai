'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing superannuation investment advice.
 *
 * The flow takes a user's query and their profile data to provide comprehensive, personalized investment advice.
 * - superannuationAdvisor - A function that handles the query and returns advice.
 * - SuperannuationAdvisorInput - The input type for the superannuationAdvisor function.
 * - SuperannuationAdvisorOutput - The return type for the superannuationAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuperannuationAdvisorInputSchema = z.object({
  query: z.string().describe("The user's financial query related to their superannuation."),
  userProfile: z.string().describe("A JSON string representing the user's profile data, including financial details and goals."),
});
export type SuperannuationAdvisorInput = z.infer<typeof SuperannuationAdvisorInputSchema>;

const SuperannuationAdvisorOutputSchema = z.object({
  response: z.string().describe('A detailed and personalized response to the user query, providing advice, explanations, and recommendations.'),
});
export type SuperannuationAdvisorOutput = z.infer<typeof SuperannuationAdvisorOutputSchema>;

const withdrawalSimulationArgs = z.object({
    retirementAge: z.number().describe("The user's desired retirement age."),
    initialWithdrawalRate: z.number().describe("The initial percentage of the portfolio to withdraw annually (e.g., 4 for 4%)."),
    strategy: z.enum(['fixed', 'dynamic']).describe("The withdrawal strategy to simulate. 'fixed' for a constant percentage, 'dynamic' for adjustments based on market performance."),
});

const simulateWithdrawalStrategy = ai.defineTool(
    {
      name: 'simulateWithdrawalStrategy',
      description: 'Simulates a retirement withdrawal strategy to project portfolio longevity and payout amounts. Use this to answer user questions about how to withdraw money in retirement.',
      inputSchema: withdrawalSimulationArgs,
      outputSchema: z.object({
        yearsOfPayout: z.number().describe("The number of years the portfolio is projected to last."),
        finalBalance: z.number().describe("The projected balance of the portfolio at the end of the payout period."),
        annualPayout: z.number().describe("The average annual payout amount."),
      }),
    },
    async (input) => {
      // This is a simplified simulation model. A real-world application would use more sophisticated financial modeling.
      const { retirementAge, initialWithdrawalRate, strategy } = input;
      const user = { currentSavings: 250000, age: 35, retirementGoal: 1500000 }; 
      const yearsToRetirement = retirementAge - user.age;
      const growthRate = 0.07; // Assumed average annual growth
      
      // Project savings at retirement
      const retirementSavings = user.currentSavings * Math.pow(1 + growthRate, yearsToRetirement);

      let currentBalance = retirementSavings;
      const lifeExpectancy = 85;
      const payoutYears = lifeExpectancy - retirementAge;
      let totalPayout = 0;

      for (let year = 0; year < payoutYears; year++) {
        const marketPerformance = (Math.random() - 0.4) * 0.2 + growthRate; // Simulate market volatility
        let withdrawalRate = initialWithdrawalRate / 100;
        
        if (strategy === 'dynamic') {
            if (marketPerformance < 0.02) withdrawalRate *= 0.9; // Reduce withdrawal in bad years
            if (marketPerformance > 0.08) withdrawalRate *= 1.1; // Increase withdrawal in good years
        }
        
        const withdrawalAmount = currentBalance * withdrawalRate;
        if (currentBalance < withdrawalAmount) {
            totalPayout += currentBalance;
            currentBalance = 0;
            break;
        }

        currentBalance -= withdrawalAmount;
        currentBalance *= (1 + marketPerformance);
        totalPayout += withdrawalAmount;
      }
      
      return {
        yearsOfPayout: Math.min(payoutYears, lifeExpectancy - user.age),
        finalBalance: Math.max(0, currentBalance),
        annualPayout: totalPayout / payoutYears,
      };
    }
  );


export async function superannuationAdvisor(input: SuperannuationAdvisorInput): Promise<SuperannuationAdvisorOutput> {
  return superannuationAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'superannuationAdvisorPrompt',
  input: {schema: SuperannuationAdvisorInputSchema},
  output: {schema: SuperannuationAdvisorOutputSchema},
  tools: [simulateWithdrawalStrategy],
  prompt: `You are an expert AI Investment Advisor for superannuation users. Your goal is to help users make informed investment decisions by providing personalized, data-driven advice.

You will be given a user's query and their profile data. Use this information to:
1. Understand the user's financial situation, goals, risk appetite, and retirement timeline.
2. Analyze their current investment strategy and superannuation status.
3. Provide personalized recommendations based on their profile, historical data, and market trends.
4. If the user asks about retirement withdrawal strategies, use the 'simulateWithdrawalStrategy' tool to provide a data-backed analysis.
5. If the user asks to compare strategies, you MUST call the tool twice: once for 'fixed' and once for 'dynamic'. Then, present the results of both simulations in a comparative format.
6. Offer clear explanations and educational insights to improve their financial literacy.
7. Be interactive, intuitive, and respond in a professional, yet friendly tone.

User's Profile Data (in JSON format):
{{{userProfile}}}

User's Query:
"{{{query}}}"

Based on the user's profile and query, generate a comprehensive response. Address their specific questions, provide actionable recommendations, and explain the reasoning behind your advice.
If the query is generic, provide general educational information relevant to their profile.
When presenting simulation results, format them clearly in your response.
Do not mention that you are an AI. Do not add caveats or disclaimers.
`,
});

const superannuationAdvisorFlow = ai.defineFlow(
  {
    name: 'superannuationAdvisorFlow',
    inputSchema: SuperannuationAdvisorInputSchema,
    outputSchema: SuperannuationAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
