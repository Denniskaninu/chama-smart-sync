
'use client';

import { useState, useEffect } from 'react';
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

export function useCollection<T extends DocumentData>(
  query: Query | null
): UseCollectionResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If the query is null or undefined, don't do anything.
    if (!query) {
      setData(null);
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
        // Create a rich, contextual error for permission issues.
        const permissionError = new FirestorePermissionError({
          path: query.path,
          operation: 'list',
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
  }, [query]);

  return { data, loading, error };
}
