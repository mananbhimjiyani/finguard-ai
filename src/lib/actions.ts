'use server';

import { analyzeRiskAssessment } from '@/ai/flows/risk-assessment-analysis';
import type { RiskAssessmentInput, RiskAssessmentOutput } from '@/ai/flows/risk-assessment-analysis';
import { financialInsightsFromQuery } from '@/ai/flows/financial-insights-from-query';
import type { FinancialInsightsFromQueryInput, FinancialInsightsFromQueryOutput } from '@/ai/flows/financial-insights-from-query';
import { detectAnomalousTransactions } from '@/ai/flows/detect-anomalous-transactions';
import type { DetectAnomalousTransactionsInput, DetectAnomalousTransactionsOutput } from '@/ai/flows/detect-anomalous-transactions';
import { superannuationAdvisor } from '@/ai/flows/superannuation-advisor';
import type { SuperannuationAdvisorInput, SuperannuationAdvisorOutput } from '@/ai/flows/superannuation-advisor';
import { assessPortfolioRisk } from '@/ai/flows/assess-portfolio-risk';
import type { PortfolioRiskInput, PortfolioRiskOutput } from '@/ai/flows/assess-portfolio-risk';
import { generateFinancialProjectionVideo } from '@/ai/flows/generate-retirement-video';
import type { GenerateFinancialProjectionVideoInput, GenerateFinancialProjectionVideoOutput } from '@/ai/flows/generate-retirement-video';

export async function getRiskAnalysis(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  return await analyzeRiskAssessment(input);
}

export async function getFinancialInsight(input: FinancialInsightsFromQueryInput): Promise<FinancialInsightsFromQueryOutput> {
  return await financialInsightsFromQuery(input);
}

export async function getSuperannuationAdvice(input: SuperannuationAdvisorInput): Promise<SuperannuationAdvisorOutput> {
    return await superannuationAdvisor(input);
}

export async function detectAnomaly(input: DetectAnomalousTransactionsInput): Promise<DetectAnomalousTransactionsOutput> {
  return await detectAnomalousTransactions(input);
}

export async function assessPortfolio(input: PortfolioRiskInput): Promise<PortfolioRiskOutput> {
  return await assessPortfolioRisk(input);
}

export async function generateFinancialVideo(input: GenerateFinancialProjectionVideoInput): Promise<GenerateFinancialProjectionVideoOutput> {
  return await generateFinancialProjectionVideo(input);
}
