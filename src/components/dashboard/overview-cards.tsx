'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { userProfileData, portfolioData } from '@/lib/data';
import { Bar, BarChart, Pie, PieChart } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const retirementProjectionChartConfig = {
  value: {
    label: 'Value',
  },
  Current: {
    label: 'Current',
    color: 'hsl(var(--chart-2))',
  },
  Goal: {
    label: 'Goal',
    color: 'hsl(var(--chart-1))',
  },
};

const portfolioDiversityChartConfig = {
  allocation: {
    label: 'Allocation',
  },
  ...Object.fromEntries(portfolioData.holdings.map((h, i) => [h.name.replace(/\s/g, ''), { label: h.name, color: `hsl(var(--chart-${i + 1}))` }]))
};


export function OverviewCards() {
  const retirementProjectionData = [
    { name: 'Current', value: userProfileData.currentSavings, fill: 'var(--color-Current)' },
    { name: 'Goal', value: userProfileData.retirementGoal, fill: 'var(--color-Goal)' },
  ];

  const portfolioDiversityData = portfolioData.holdings.map((h, i) => ({ ...h, name: h.name.replace(/\s/g, ''), fill: `var(--color-${h.name.replace(/\s/g, '')})` }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Retirement Projection
          </CardTitle>
          <CardDescription>
            Progress to your retirement goal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={retirementProjectionChartConfig} className="h-40 w-full">
            <BarChart data={retirementProjectionData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} hideLabel />}
              />
              <Bar dataKey="value" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Portfolio Diversity
          </CardTitle>
          <CardDescription>
            Your current asset mix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={portfolioDiversityChartConfig} className="h-40 w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Pie data={portfolioDiversityData} dataKey="allocation" nameKey="name" innerRadius={40} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
