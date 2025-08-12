import { FutureSelfVisualizer } from '@/components/future-self/future-self-visualizer';

export default function FutureSelfPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Meet Your Future Self</h1>
        <p className="text-muted-foreground">Visualize your retirement dreams to make them feel more real and achievable.</p>
      </div>
      <FutureSelfVisualizer />
    </div>
  );
}
