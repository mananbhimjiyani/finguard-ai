import { RetirementWithdrawalSimulator } from '@/components/simulator/retirement-withdrawal-simulator';

export default function WithdrawalSimulatorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Retirement Withdrawal Simulator</h1>
        <p className="text-muted-foreground">Compare different withdrawal strategies to see how they impact your retirement savings.</p>
      </div>
      <RetirementWithdrawalSimulator />
    </div>
  );
}
