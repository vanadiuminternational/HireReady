import { useCallback, useEffect, useState } from 'react';
import {
  getApplicationContext,
  patchApplicationContext,
  resetApplicationContext,
  saveApplicationContext,
} from '@/lib/applicationContext';

export function useApplicationContext() {
  const [context, setContext] = useState(() => getApplicationContext());

  useEffect(() => {
    setContext(getApplicationContext());
  }, []);

  const save = useCallback((nextContext) => {
    const saved = saveApplicationContext(nextContext);
    setContext(saved);
    return saved;
  }, []);

  const patch = useCallback((patchValue) => {
    const saved = patchApplicationContext(patchValue);
    setContext(saved);
    return saved;
  }, []);

  const reset = useCallback(() => {
    const saved = resetApplicationContext();
    setContext(saved);
    return saved;
  }, []);

  const refresh = useCallback(() => {
    const latest = getApplicationContext();
    setContext(latest);
    return latest;
  }, []);

  return {
    context,
    save,
    patch,
    reset,
    refresh,
  };
}

export default useApplicationContext;
