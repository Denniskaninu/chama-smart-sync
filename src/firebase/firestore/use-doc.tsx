
'use client';

import { useState, useEffect, useMemo } from 'react';
import type {
  DocumentReference,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// A utility hook to memoize Firestore document references.
// This prevents re-creating the reference on every render.
export function useMemoDoc(
  createReference: () => DocumentReference | null,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(createReference, deps);
}

// Defines the shape of the return value from the useDoc hook.
interface UseDocResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDoc<T extends DocumentData>(
  ref: DocumentReference | null
): UseDocResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If the reference is null, don't do anything.
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        // Create a rich, contextual error for permission issues.
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        // Emit the error so our listener can catch it.
        errorEmitter.emit('permission-error', permissionError);

        setError(permissionError);
        setLoading(false);
        setData(null);
      }
    );

    // Unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
