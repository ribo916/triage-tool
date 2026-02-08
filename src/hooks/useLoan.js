import { useState, useCallback } from 'react';
import { fetchLoan } from '../api/loans.js';
import { parseLoan } from '../parsers/loans.js';

/**
 * error shape:
 *   { status?: number, statusText?: string, data?: unknown, message?: string }
 */
export function useLoan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: did we attempt a GetLoan call this run?
  const [attempted, setAttempted] = useState(false);

  const fetch = useCallback(async (environment, token, loanId) => {
    setAttempted(true);
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const raw = await fetchLoan(environment, token, loanId);
      setData(parseLoan(raw));
    } catch (err) {
      // Preserve structured API error payload if it exists
      if (err && typeof err === 'object' && ('status' in err || 'data' in err)) {
        setError(err);
      } else {
        // Fallback for unexpected runtime errors (network, parsing, etc.)
        setError({ message: err?.message ?? String(err) });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAttempted(false);
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, attempted, fetch, reset };
}
