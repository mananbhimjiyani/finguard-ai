'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Video } from 'lucide-react';
import { getRetirementVideo } from '@/lib/actions';

export function FutureSelfVisualizer() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setVideoUrl(null);
    setError(null);

    try {
      const result = await getRetirementVideo({ prompt });
      setVideoUrl(result.videoUrl);
    } catch (e) {
      console.error('Error generating video:', e);
      setError('Sorry, I couldn\'t create your video. The model may be busy, or the request may have been blocked. Please try a different prompt.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const samplePrompts = [
    "Relaxing on a quiet beach in a tropical location, with clear blue water and gentle waves.",
    "Hiking through a beautiful mountain range with my family, enjoying the fresh air and stunning views.",
    "Tending to a vibrant garden in the backyard of my cozy country home.",
    "Exploring ancient ruins in a historic European city, soaking in the culture and history."
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Retirement Vision Generator</CardTitle>
        <CardDescription>
          Describe your ideal retirement in a few words. What do you see? What are you doing? Let our AI bring your vision to life.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Sailing on a calm lake at sunset...'"
          className="min-h-24"
          disabled={isLoading}
        />
        <div className="text-xs text-muted-foreground">Try an example:</div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {samplePrompts.map((p) => (
                <Button key={p} variant="outline" size="sm" onClick={() => setPrompt(p)} className="h-auto whitespace-normal text-left">
                    {p}
                </Button>
            ))}
        </div>
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-muted/50 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Generating your vision...</p>
            <p className="text-sm text-muted-foreground">This can take up to a minute. Please be patient.</p>
          </div>
        )}
        {videoUrl && !isLoading && (
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border">
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="h-full w-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateVideo} disabled={isLoading || !prompt.trim()} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate My Future
        </Button>
      </CardFooter>
    </Card>
  );
}
