import { useState, useCallback } from 'react';
import { fetchLoan } from '../api/loans.js';
import { parseLoan } from '../parsers/loans.js';

/**
 * @returns {{ data: ReturnType<parseLoan>, error: { status?: number, statusText?: string, data?: unknown } | null, loading: boolean, fetch: (environment: 'prod' | 'stage', token: string, loanId: string) => Promise<void> }}
 */
export function useLoan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (environment, token, loanId) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const raw = await fetchLoan(environment, token, loanId);
      setData(parseLoan(raw));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, fetch };
}
