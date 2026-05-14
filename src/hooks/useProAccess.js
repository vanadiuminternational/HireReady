import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Hook to check if the current user has Pro access.
 * Returns { isPro, loading, refresh }
 */
export function useProAccess() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('verifyProAccess', {});
      setIsPro(res.data?.isPro === true);
    } catch {
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { isPro, loading, refresh: check };
}