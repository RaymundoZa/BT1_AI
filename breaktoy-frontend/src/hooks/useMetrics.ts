import { useState, useEffect, useCallback } from 'react';
import type { Metrics } from '../api/products';
import { fetchMetrics } from '../api/products';

const useMetrics = () => {
  const [data, setData] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMetrics();
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};

export default useMetrics;
