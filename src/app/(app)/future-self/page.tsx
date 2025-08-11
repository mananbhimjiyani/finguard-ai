import { FinancialFutureVisualizer } from '@/components/future-self/financial-future-visualizer';

export default function FutureSelfPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Financial Future Visualizer</h1>
        <p className="text-muted-foreground">Watch a video of your financial journey, showing your progress towards your retirement goals.</p>
      </div>
      <FinancialFutureVisualizer />
    </div>
  );
}
