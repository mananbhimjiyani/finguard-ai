'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Video, Sparkles } from 'lucide-react';
import { generateFinancialVideo } from '@/lib/actions';

export function FinancialFutureVisualizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    setIsLoading(true);
    setError(null);
    setVideoDataUri(null);

    try {
      // The input is currently empty as the flow uses static data, 
      // but you could pass a userId here in a real application.
      const result = await generateFinancialVideo({});
      if (result.videoDataUri) {
        setVideoDataUri(result.videoDataUri);
      } else {
        setError(result.error || 'An unknown error occurred while generating the video.');
      }
    } catch (e: any) {
      console.error('Error generating video:', e);
      setError(e.message || 'Failed to generate video. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Visualize Your Financial Journey</CardTitle>
        <CardDescription>
          Generate a short, symbolic video of your journey towards your retirement goal, including market growth and final achievement.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">Click the button below to see an AI-generated video of your financial path.</p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button onClick={handleGenerateVideo} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate My Financial Future
        </Button>

        {isLoading && (
            <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Generating Your Video...</AlertTitle>
                <AlertDescription>
                    This can take a minute or two. Please be patient while the AI creates your financial visualization.
                </AlertDescription>
            </Alert>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {videoDataUri && (
          <div className="space-y-4">
            <Alert>
              <Video className="h-4 w-4" />
              <AlertTitle>Your Financial Future!</AlertTitle>
              <AlertDescription>
                Here is a glimpse of the financial journey you're on. Stay focused and keep growing!
              </AlertDescription>
            </Alert>
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <video
                    src={videoDataUri}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
