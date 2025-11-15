
'use client';

import { useState, useEffect, useMemo } from 'react';
import type {
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// A utility hook to memoize Firestore queries.
// This prevents re-creating the query on every render, which can cause infinite loops.
export function useMemoQuery(
  createQuery: () => Query | null,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(createQuery, deps);
}

// Defines the shape of the return value from the useCollection hook.
interface UseCollectionResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
}

interface UseCollectionOptions<T> {
    initialData?: T[];
}

export function useCollection<T extends DocumentData>(
  query: Query | null,
  options?: UseCollectionOptions<T>
): UseCollectionResult<T> {
  const [data, setData] = useState<T[] | null>(options?.initialData || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If the query is null or undefined, don't do anything.
    if (!query) {
      // If we have initial data, don't show loading state, just use that.
      if (!options?.initialData) {
        setData(null);
      }
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        let permissionError;
        // Firestore includes the path in the error message for permission denied errors,
        // but the Query object itself doesn't have a reliable 'path' property for collection groups.
        // We construct a more generic error here. The listener will throw it for dev overlay.
        if (err.code === 'permission-denied') {
            permissionError = new FirestorePermissionError({
              // This path is a placeholder; the actual path will be visible in the developer console
              // via the error thrown by the Firebase SDK itself. This provides context for our listener.
              path: `Firestore Collection Query`,
              operation: 'list',
            });
            // Emit the error so our listener can catch it and show it in the overlay.
            errorEmitter.emit('permission-error', permissionError);
        } else {
            // For other errors (like needing an index), we can use the regular error.
            permissionError = err;
        }
        
        setError(permissionError);
        setLoading(false);
        setData(null);
      }
    );

    // Unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { data, loading, error };
}
