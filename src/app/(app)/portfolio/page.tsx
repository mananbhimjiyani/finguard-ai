import { PortfolioView } from '@/components/portfolio/portfolio-view';

export default function PortfolioPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio</h1>
        <p className="text-muted-foreground">An overview of your current holdings and performance.</p>
      </div>
      <PortfolioView />
    </div>
  );
}
