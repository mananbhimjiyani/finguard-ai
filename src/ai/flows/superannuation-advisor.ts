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
  // The following fields are optional and will be provided by the flow logic itself.
  fixedStrategyResult: z.string().optional().describe("The result of the 'fixed' withdrawal simulation. This is for internal use."),
  dynamicStrategyResult: z.string().optional().describe("The result of the 'dynamic' withdrawal simulation. This is for internal use."),
  singleStrategyResult: z.string().optional().describe("The result of a single withdrawal simulation. This is for internal use."),
  strategyType: z.string().optional().describe("The type of single strategy being presented. This is for internal use."),
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

type WithdrawalSimulationOutput = {
    yearsOfPayout: number;
    finalBalance: number;
    annualPayout: number;
};

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
    async (input) : Promise<WithdrawalSimulationOutput> => {
      // This is a simplified simulation model. A real-world application would use more sophisticated financial modeling.
      const { retirementAge, initialWithdrawalRate, strategy } = input;
      const user = { currentSavings: 284127, age: 46, retirementGoal: 1500000 }; 
      const yearsToRetirement = retirementAge - user.age;
      const growthRate = 0.07; // Assumed average annual growth
      
      // Project savings at retirement
      const retirementSavings = user.currentSavings * Math.pow(1 + growthRate, yearsToRetirement);

      let currentBalance = retirementSavings;
      const lifeExpectancy = 85;
      const payoutYears = lifeExpectancy - retirementAge;
      let totalPayout = 0;
      let actualPayoutYears = 0;

      for (let year = 0; year < payoutYears; year++) {
        actualPayoutYears++;
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
        yearsOfPayout: actualPayoutYears,
        finalBalance: Math.max(0, currentBalance),
        annualPayout: totalPayout / actualPayoutYears,
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
  prompt: `You are an expert AI Investment Advisor specializing in superannuation. Your goal is to provide personalized, data-driven advice.
Analyze the user's query and their detailed profile data.

- Your advice MUST be tailored to the user's specific circumstances, including their age, country, risk tolerance, and financial goals.
- If you are provided with pre-computed simulation results, your primary goal is to present these results to the user in a clear, easy-to-understand format.
- If comparing strategies, start with a brief intro, then show the results for the 'Fixed' strategy, then the 'Dynamic' strategy, and conclude with a brief summary of the trade-offs.
- If presenting a single strategy, introduce it, explain what the results mean, and then show the results.
- If the user asks a general question about withdrawal strategies, use the 'simulateWithdrawalStrategy' tool. If the user does not specify a retirement age or initial withdrawal rate, you MUST use a retirement age of 65 and an initial withdrawal rate of 4% for the simulation. Do NOT ask the user for this information.
- Be professional, yet friendly. Do not mention that you are an AI or add disclaimers.

User Profile:
{{{userProfile}}}

{{#if fixedStrategyResult}}
**Comparison Simulation Results:**

Fixed Strategy Results:
{{{fixedStrategyResult}}}

Dynamic Strategy Results:
{{{dynamicStrategyResult}}}
{{/if}}

{{#if singleStrategyResult}}
**{{strategyType}} Strategy Simulation Results:**

{{{singleStrategyResult}}}
{{/if}}

User Query:
"{{{query}}}"

Generate a comprehensive response based on the above information.`,
});

const superannuationAdvisorFlow = ai.defineFlow(
  {
    name: 'superannuationAdvisorFlow',
    inputSchema: SuperannuationAdvisorInputSchema,
    outputSchema: SuperannuationAdvisorOutputSchema,
  },
  async (input) => {
    // Define default simulation parameters.
    const simulationParams = { retirementAge: 65, initialWithdrawalRate: 4 };

    // Check if the user is asking for a comparison.
    if (input.query.toLowerCase().includes('compare_strategies')) {
      // Run both simulations in parallel.
      const [fixedResult, dynamicResult] = await Promise.all([
        simulateWithdrawalStrategy({ ...simulationParams, strategy: 'fixed' }),
        simulateWithdrawalStrategy({ ...simulationParams, strategy: 'dynamic' }),
      ]);
      
      // Augment the input with the simulation results for the prompt.
      const augmentedInput = {
        ...input,
        query: "Please compare the fixed and dynamic withdrawal strategies based on the provided results.",
        fixedStrategyResult: JSON.stringify(fixedResult, null, 2),
        dynamicStrategyResult: JSON.stringify(dynamicResult, null, 2),
      };

      const { output } = await prompt(augmentedInput);
      if (!output) {
        throw new Error('The model failed to generate a comparison response. Please try again.');
      }
      return output;

    } else if (input.query.toLowerCase().startsWith('simulate_strategy:')) {
        const strategy = input.query.split(':')[1].trim() as 'fixed' | 'dynamic';
        const result = await simulateWithdrawalStrategy({ ...simulationParams, strategy });

        const augmentedInput = {
            ...input,
            query: `Please explain the results of the ${strategy} withdrawal strategy.`,
            singleStrategyResult: JSON.stringify(result, null, 2),
            strategyType: strategy.charAt(0).toUpperCase() + strategy.slice(1),
        };
        
        const { output } = await prompt(augmentedInput);
        if (!output) {
            throw new Error(`The model failed to generate a response for the ${strategy} strategy. Please try again.`);
        }
        return output;

    } else {
      // Handle general chat queries directly.
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('The model failed to generate a response. Please try again.');
      }
      return output;
    }
  }
);
