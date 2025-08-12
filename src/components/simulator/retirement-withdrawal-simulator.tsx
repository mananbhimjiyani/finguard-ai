'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, TestTube2 } from 'lucide-react';
import { getSuperannuationAdvice } from '@/lib/actions';
import { userProfileData } from '@/lib/data';

export function RetirementWithdrawalSimulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = async (strategy: 'fixed' | 'dynamic' | 'comparison') => {
    let query = '';
    if (strategy === 'fixed') {
      query = 'simulate_strategy:fixed';
    } else if (strategy === 'dynamic') {
      query = 'simulate_strategy:dynamic';
    } else {
      query = 'compare_strategies';
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const simulationResult = await getSuperannuationAdvice({ 
          query,
          userProfile: JSON.stringify(userProfileData) 
      });
      setResult(simulationResult.response);
    } catch (e) {
      console.error('Error getting simulation:', e);
      setError('Sorry, I couldn\'t process the simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Simulator</CardTitle>
        <CardDescription>
          Select a retirement withdrawal strategy to simulate. The AI will use its built-in tool to project the outcomes based on your financial profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => handleSimulation('fixed')} disabled={isLoading}>
                Simulate Fixed Strategy
            </Button>
            <Button variant="outline" onClick={() => handleSimulation('dynamic')} disabled={isLoading}>
                Simulate Dynamic Strategy
            </Button>
            <Button onClick={() => handleSimulation('comparison')} disabled={isLoading}>
                Compare Both Strategies
            </Button>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center gap-4 rounded-lg border bg-muted/50 p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-medium">Running simulation...</p>
            </div>
        )}
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && !isLoading && (
          <Alert className="mt-4">
            <TestTube2 className="h-4 w-4" />
            <AlertTitle>Simulation Result</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert mt-2">
                {result.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
            This tool uses a Genkit AI flow with a `simulateWithdrawalStrategy` tool to provide data-backed projections.
        </p>
      </CardFooter>
    </Card>
  );
}
