import { OverviewCards } from '@/components/dashboard/overview-cards';
import { AssetAllocation } from '@/components/dashboard/asset-allocation';
import { GoalTracker } from '@/components/dashboard/goal-tracker';
import { AnomalyDetector } from '@/components/dashboard/anomaly-detector';
import { FinancialQuery } from '@/components/dashboard/financial-query';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
              <OverviewCards />
          </div>
          <GoalTracker />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FinancialQuery />
          <AnomalyDetector />
        </div>
        <div>
          <AssetAllocation />
        </div>
      </div>
    </div>
  );
}
