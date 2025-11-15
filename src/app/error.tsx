'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-12 shadow-lg">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <h1 className="text-3xl font-bold font-headline">Oops! Something went wrong.</h1>
            <p className="text-muted-foreground">
                We've encountered an unexpected error. Please try again.
            </p>
            <Button
                onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
                }
            >
                Try again
            </Button>
        </div>
    </div>
  );
}
