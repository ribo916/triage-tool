import { useState, useCallback } from 'react';
import { fetchLockRequests } from '../api/lockRequests.js';
import { fetchPricingScenario } from '../api/pricingScenarios.js';
import { parseLockRequests } from '../parsers/lockRequests.js';
import { parsePricingScenario } from '../parsers/pricingScenarios.js';

/**
 * error shape:
 *   { status?: number, statusText?: string, data?: unknown, message?: string }
 *
 * @returns {{
 *   locks: Array<ReturnType<typeof parseLockRequests>['items'][number]>,
 *   pricingByPeRequestId: Record<string, ReturnType<typeof parsePricingScenario> | null>,
 *   error: { status?: number, statusText?: string, data?: unknown, message?: string } | null,
 *   loading: boolean,
 *   attempted: boolean,
 *   fetch: (environment: 'prod' | 'stage', token: string, loanId: string) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useLockRequests() {
  const [locks, setLocks] = useState([]);
  const [pricingByPeRequestId, setPricingByPeRequestId] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const fetch = useCallback(async (environment, token, loanId) => {
    setAttempted(true);
    setLoading(true);
    setError(null);
    setLocks([]);
    setPricingByPeRequestId({});

    try {
      const rawLocks = await fetchLockRequests(environment, token, loanId);
      const parsed = parseLockRequests(rawLocks);
      setLocks(parsed.items);

      // Collect unique peRequestIds for pricing lookups
      const peRequestIds = Array.from(
        new Set(
          parsed.items
            .map((lock) => lock.buySide?.peRequestId)
            .filter((id) => typeof id === 'string' && id.length > 0),
        ),
      );

      if (peRequestIds.length > 0) {
        const results = await Promise.all(
          peRequestIds.map(async (id) => {
            try {
              const rawPricing = await fetchPricingScenario(environment, token, id);
              const parsedPricing = parsePricingScenario(rawPricing);
              return [id, parsedPricing];
            } catch (err) {
              // Keep panel resilient even if some pricing calls fail
              return [id, null];
            }
          }),
        );

        const next = {};
        for (const [id, value] of results) {
          next[id] = value;
        }
        setPricingByPeRequestId(next);
      }
    } catch (err) {
      if (err && typeof err === 'object' && ('status' in err || 'data' in err)) {
        setError(err);
      } else {
        setError({ message: err?.message ?? String(err) });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAttempted(false);
    setLocks([]);
    setPricingByPeRequestId({});
    setError(null);
    setLoading(false);
  }, []);

  return { locks, pricingByPeRequestId, error, loading, attempted, fetch, reset };
}

