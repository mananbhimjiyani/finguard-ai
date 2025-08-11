'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { detectAnomaly } from '@/lib/actions';
import { recentTransactionsForAnomalyCheck } from '@/lib/data';
import type { DetectAnomalousTransactionsOutput } from '@/ai/flows/detect-anomalous-transactions';

export function AnomalyDetector() {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>(recentTransactionsForAnomalyCheck[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectAnomalousTransactionsOutput | null>(null);

  const handleCheckAnomaly = async () => {
    const selectedTransaction = recentTransactionsForAnomalyCheck.find(t => t.id === selectedTransactionId);
    if (!selectedTransaction) return;

    setIsLoading(true);
    setResult(null);
    try {
      const anomalyResult = await detectAnomaly(selectedTransaction.data);
      setResult(anomalyResult);
    } catch (error) {
      console.error('Error detecting anomaly:', error);
      setResult({ isAnomalous: true, explanation: 'An error occurred while checking the transaction.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTransaction = recentTransactionsForAnomalyCheck.find(t => t.id === selectedTransactionId);
  const transactionDetails = selectedTransaction ? JSON.parse(selectedTransaction.data.recentTransaction) : {};

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Fraud Detection
        </CardTitle>
        <CardDescription>
          Check transactions for suspicious activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Select value={selectedTransactionId} onValueChange={setSelectedTransactionId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a transaction" />
            </SelectTrigger>
            <SelectContent>
              {recentTransactionsForAnomalyCheck.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.description}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {transactionDetails.description} - ${Math.abs(transactionDetails.amount).toFixed(2)}
          </div>
          <Button onClick={handleCheckAnomaly} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Check Transaction
          </Button>
        </div>
        {result && (
          <Alert variant={result.isAnomalous ? 'destructive' : 'default'} className="mt-4">
            {result.isAnomalous ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <AlertTitle>{result.isAnomalous ? 'Anomaly Detected!' : 'Transaction Appears Normal'}</AlertTitle>
            <AlertDescription>{result.explanation}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
