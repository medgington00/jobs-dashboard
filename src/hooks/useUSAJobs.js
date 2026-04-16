import { useState, useCallback } from 'react';
import { fetchAllJobs } from '../utils/api';
import { processJobs } from '../utils/dataProcessing';

export function useUSAJobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { items, total: t } = await fetchAllJobs(params);
      setJobs(processJobs(items));
      setTotal(t);
      setLastFetched(new Date());
    } catch (e) {
      setError(e.message);
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, total, loading, error, lastFetched, search };
}
