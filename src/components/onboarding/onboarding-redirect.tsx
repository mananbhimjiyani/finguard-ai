'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const ONBOARDING_KEY = 'fingaurd_onboarding_complete';

export function OnboardingRedirect() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (hasCompletedOnboarding === 'true') {
      redirect('/dashboard');
    } else {
      redirect('/onboarding');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}
