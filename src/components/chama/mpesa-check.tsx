"use client";

import { useState, useEffect, useMemo } from 'react';
import { CircleCheck, CircleX, Loader2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { checkMpesaReference } from '@/app/actions';

type Status = 'idle' | 'loading' | 'valid' | 'invalid' | 'error';

// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function MpesaReferenceCheck({ referenceCode }: { referenceCode: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [confidence, setConfidence] = useState<number>(0);
  const debouncedReferenceCode = useDebounce(referenceCode, 500);

  useEffect(() => {
    if (!debouncedReferenceCode || debouncedReferenceCode.length < 10) {
      setStatus('idle');
      return;
    }

    let isCancelled = false;
    const verify = async () => {
      setStatus('loading');
      try {
        const result = await checkMpesaReference({ mpesaReference: debouncedReferenceCode });
        if (!isCancelled) {
          if (result.isValid) {
            setStatus('valid');
          } else {
            setStatus('invalid');
          }
          setConfidence(result.confidence);
        }
      } catch (error) {
        if (!isCancelled) {
          setStatus('error');
        }
      }
    };

    verify();

    return () => {
      isCancelled = true;
    };
  }, [debouncedReferenceCode]);

  const { Icon, color, tooltipText } = useMemo(() => {
    switch (status) {
      case 'loading':
        return { Icon: Loader2, color: 'text-muted-foreground animate-spin', tooltipText: 'Verifying...' };
      case 'valid':
        return { Icon: CircleCheck, color: 'text-green-500', tooltipText: `Verified with ${Math.round(confidence * 100)}% confidence` };
      case 'invalid':
        return { Icon: CircleX, color: 'text-yellow-500', tooltipText: `Potentially invalid (${Math.round(confidence * 100)}% confidence)` };
      case 'error':
        return { Icon: HelpCircle, color: 'text-destructive', tooltipText: 'Could not verify' };
      default:
        return { Icon: () => null, color: '', tooltipText: '' };
    }
  }, [status, confidence]);

  if (status === 'idle') {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className={`h-4 w-4 ${color}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
