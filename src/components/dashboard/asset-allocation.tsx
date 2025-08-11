'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { portfolioData } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const allocationData = portfolioData.recommendedAllocation.map(item => ({
  name: item.name,
  Recommended: item.value,
  Current: portfolioData.holdings.find(h => h.name.includes(item.name.split(' ')[0]))?.allocation || 0,
}));

const chartConfig = {
  Current: {
    label: 'Current',
    color: 'hsl(var(--chart-2))',
  },
  Recommended: {
    label: 'Recommended',
    color: 'hsl(var(--chart-1))',
  },
};

export function AssetAllocation() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Asset Allocation
        </CardTitle>
        <CardDescription>
          Your current vs. recommended allocation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <BarChart data={allocationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
            />
            <Legend />
            <Bar dataKey="Current" fill="var(--color-Current)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Recommended" fill="var(--color-Recommended)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
