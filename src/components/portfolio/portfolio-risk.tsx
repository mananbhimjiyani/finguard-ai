'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, ShieldQuestion, Loader2 } from 'lucide-react';
import { assessPortfolio } from '@/lib/actions';
import { portfolioData } from '@/lib/data';
import type { PortfolioRiskOutput } from '@/ai/flows/assess-portfolio-risk';

const riskLevelIcons: { [key: string]: React.ReactNode } = {
  default: <ShieldQuestion className="h-4 w-4" />,
  Low: <Shield className="h-4 w-4 text-green-500" />,
  "Low-to-Moderate": <Shield className="h-4 w-4 text-yellow-500" />,
  Moderate: <Shield className="h-4 w-4 text-orange-500" />,
  "Moderate-to-High": <Shield className="h-4 w-4 text-red-500" />,
  High: <Shield className="h-4 w-4 text-red-700" />,
};

export function PortfolioRisk() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<PortfolioRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const analysisResult = await assessPortfolio({
          portfolioData: JSON.stringify(portfolioData),
        });
        setResult(analysisResult);
      } catch (e) {
        setError('Failed to load risk analysis.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getAnalysis();
  }, []);

  const riskIcon = result?.riskLevel && riskLevelIcons[result.riskLevel] ? riskLevelIcons[result.riskLevel] : riskLevelIcons.default;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5 text-primary" />
          Portfolio Risk Analysis
        </CardTitle>
        <CardDescription>
          AI-powered assessment of your portfolio's risk level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
            </div>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
          <Alert>
            <div className="flex items-center gap-2">
              {riskIcon}
              <AlertTitle>{result.riskLevel}</AlertTitle>
            </div>
            <AlertDescription className="mt-2">{result.analysis}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
