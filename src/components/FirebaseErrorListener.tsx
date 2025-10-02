
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';

// This component is designed to run on the client and should be placed in your layout.
// It listens for custom 'permission-error' events and displays a detailed toast.
// In a production environment, you might want to log these errors to a service instead.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.message, error.context);

      // We are throwing the error here to make it visible in the Next.js development overlay.
      // This is for development purposes only and helps in debugging security rules.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }

      // In a production environment, you would likely not show a toast for this
      // and instead log it to a monitoring service.
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Contact support if you believe this is an error.',
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything.
}
