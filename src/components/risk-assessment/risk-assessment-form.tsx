'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getRiskAnalysis } from '@/lib/actions';
import type { RiskAssessmentOutput } from '@/ai/flows/risk-assessment-analysis';
import { Loader2, TrendingUp, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  investmentHorizon: z.string().min(1, 'Please select an investment horizon.'),
  riskReaction: z.string().min(1, 'Please select your reaction.'),
  financialGoals: z.string().min(1, 'Please state your financial goals.'),
  riskSlider: z.number().min(1).max(10),
});

const questions = {
  investmentHorizon: {
    label: '1. What is your investment horizon?',
    options: [
      { value: 'short-term (less than 3 years)', label: 'Short-term (less than 3 years)' },
      { value: 'medium-term (3-10 years)', label: 'Medium-term (3-10 years)' },
      { value: 'long-term (more than 10 years)', label: 'Long-term (more than 10 years)' },
    ],
  },
  riskReaction: {
    label: '2. Your portfolio drops 20% in a month. How do you react?',
    options: [
      { value: 'sell everything', label: 'Sell everything to cut losses.' },
      { value: 'sell some', label: 'Sell some to reduce risk.' },
      { value: 'do nothing', label: 'Do nothing and wait for recovery.' },
      { value: 'buy more', label: 'Buy more, it\'s a discount!' },
    ],
  },
  riskSlider: {
    label: '3. On a scale of 1-10, how much risk are you willing to take for higher returns?'
  }
};

export function RiskAssessmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RiskAssessmentOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentHorizon: '',
      riskReaction: '',
      financialGoals: 'Retirement and wealth growth',
      riskSlider: 5,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const riskMapping: { [key: string]: number } = {
        'sell everything': 1,
        'sell some': 3,
        'do nothing': 6,
        'buy more': 9
    }
    const reactionScore = riskMapping[values.riskReaction] || 5;
    const riskToleranceScore = (values.riskSlider + reactionScore) / 2;

    try {
      const analysisResult = await getRiskAnalysis({
        riskToleranceScore,
        investmentHorizon: values.investmentHorizon,
        financialGoals: values.financialGoals,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error('Error getting risk analysis:', error);
      setResult({ riskProfileDescription: 'Error', investmentStrategyImpact: 'Could not analyze risk profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-8">
            <FormField
              control={form.control}
              name="investmentHorizon"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-semibold text-base">{questions.investmentHorizon.label}</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      {questions.investmentHorizon.options.map(opt => (
                        <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                          <FormLabel className="font-normal">{opt.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="riskReaction"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-semibold text-base">{questions.riskReaction.label}</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      {questions.riskReaction.options.map(opt => (
                        <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                          <FormLabel className="font-normal">{opt.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskSlider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">{questions.riskSlider.label}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Conservative</span>
                        <Slider
                            onValueChange={(value) => field.onChange(value[0])}
                            defaultValue={[field.value]}
                            max={10}
                            min={1}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">Aggressive</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
              Analyze My Risk Profile
            </Button>
            {result && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Your Risk Profile Analysis</AlertTitle>
                <AlertDescription className="space-y-2 mt-2">
                    <p className="font-semibold">{result.riskProfileDescription}</p>
                    <p>{result.investmentStrategyImpact}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
