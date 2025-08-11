'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, LayoutDashboard, MessageSquare, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ONBOARDING_KEY = 'fingaurd_onboarding_complete';

const onboardingSteps = [
  {
    icon: Bot,
    title: 'Welcome to FinGuard AI',
    description: "Your intelligent financial companion. Let's take a quick tour of the key features designed to help you secure your financial future.",
  },
  {
    icon: MessageSquare,
    title: 'AI Investment Advisor',
    description: 'Use our advanced AI Chat to get personalized advice on your superannuation, ask complex financial questions, and simulate retirement strategies.',
  },
  {
    icon: LayoutDashboard,
    title: 'Comprehensive Dashboard',
    description: 'Get a holistic view of your finances. Track your retirement goals, analyze portfolio risk, and detect anomalies all in one place.',
  },
];


export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const isLastStep = step === onboardingSteps.length - 1;
  const progress = ((step + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      router.push('/dashboard');
    } else {
      setStep(prev => prev + 1);
    }
  };
  
  const CurrentIcon = onboardingSteps[step].icon;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CurrentIcon className="h-8 w-8" />
        </div>
        <CardTitle>{onboardingSteps[step].title}</CardTitle>
        <CardDescription>{onboardingSteps[step].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} className="w-full">
            {isLastStep ? (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Started
                </>
            ) : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
