import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../api/products';
import { fetchProducts } from '../api/products';

interface Params {
  page: number;
  size: number;
  filters: Record<string, unknown>;
}

const useProducts = ({ page, size, filters }: Params) => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchProducts({ ...filters, page, size });
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};

export default useProducts;
