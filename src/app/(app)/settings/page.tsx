import { SettingsForm } from '@/components/settings/settings-form';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and notification preferences.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
