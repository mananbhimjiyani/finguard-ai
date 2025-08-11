'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb } from 'lucide-react';
import { getFinancialInsight } from '@/lib/actions';
import type { FinancialInsightsFromQueryOutput } from '@/ai/flows/financial-insights-from-query';

export function FinancialQuery() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FinancialInsightsFromQueryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const sampleQueries = [
    "Impact of 0.5% fee increase over 20 years?",
    "Should I invest more in international stocks?",
    "What is dollar-cost averaging?",
    "How does inflation affect my savings?",
  ];

  const handleQuery = async (queryText?: string) => {
    const currentQuery = queryText || query;
    if (!currentQuery) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const insightResult = await getFinancialInsight({ query: currentQuery });
      setResult(insightResult);
    } catch (e) {
      console.error('Error getting financial insight:', e);
      setError('Sorry, I couldn\'t process that question. Please try another one.');
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Financial Query
        </CardTitle>
        <CardDescription>
          Ask a financial question and get a personalized, AI-powered explanation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleQuery();
            }}
            className="flex items-center gap-2"
            >
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How does inflation affect my savings?"
                className="flex-grow"
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask'}
            </Button>
        </form>
        
        <div className="text-xs text-muted-foreground">Try an example:</div>
        <div className="grid grid-cols-2 gap-2">
            {sampleQueries.map((q) => (
                <Button key={q} variant="outline" size="sm" onClick={() => handleQuery(q)} className="h-auto whitespace-normal text-left">
                    {q}
                </Button>
            ))}
        </div>

        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
          <Alert className="mt-4 max-h-60 overflow-y-auto">
            <AlertTitle className="font-semibold">Your Personalized Insight</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert">
                <p>{result.insight}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
