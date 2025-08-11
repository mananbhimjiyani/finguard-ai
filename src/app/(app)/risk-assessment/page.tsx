import { RiskAssessmentForm } from '@/components/risk-assessment/risk-assessment-form';

export default function RiskAssessmentPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Risk Tolerance Assessment</h1>
        <p className="text-muted-foreground">Understand your comfort with financial risk to tailor your investment strategy.</p>
      </div>
      <RiskAssessmentForm />
    </div>
  );
}
