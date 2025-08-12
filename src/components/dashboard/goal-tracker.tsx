'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { userProfileData } from '@/lib/data';
import { Flag } from 'lucide-react';

export function GoalTracker() {
  const { Current_Savings: currentSavings, retirementGoal } = userProfileData;
  const progressPercentage = (currentSavings / retirementGoal) * 100;
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Goal Tracking
        </CardTitle>
        <CardDescription>
          You are {progressPercentage.toFixed(1)}% of the way to your retirement goal.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(1)}% progress towards retirement goal`} />
        <div className="flex justify-between font-medium text-sm">
          <span>{formatCurrency(currentSavings)}</span>
          <span className="text-muted-foreground">{formatCurrency(retirementGoal)}</span>
        </div>
        <p className="text-sm text-muted-foreground">Keep up the great work! Consistent savings are key to reaching your financial independence.</p>
      </CardContent>
    </Card>
  );
}
