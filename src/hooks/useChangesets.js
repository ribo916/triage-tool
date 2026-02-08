import { useState, useCallback } from 'react';
import { fetchChangesets } from '../api/changesets.js';
import { fetchPeRates } from '../api/peRates.js';
import { parseChangesets } from '../parsers/changesets.js';
import { parsePeRates } from '../parsers/peRates.js';

/**
 * @returns {{ data: unknown | null, parsed: unknown | null, ratesByChangesetId: Record<string, { items: Array<{ id: string, changesetId: string, baseRateSetId?: string }>, total: number }>, ratesError: { status?: number, statusText?: string, data?: unknown } | null, error: { status?: number, statusText?: string, data?: unknown } | null, loading: boolean, fetch: (environment: 'prod' | 'stage', token: string) => Promise<void> }}
 */
export function useChangesets() {
  const [data, setData] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [ratesByChangesetId, setRatesByChangesetId] = useState({});
  const [ratesError, setRatesError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (environment, token) => {
    setLoading(true);
    setError(null);
    setRatesError(null);
    setRatesByChangesetId({});
    setData(null);
    setParsed(null);

    try {
      const raw = await fetchChangesets(environment, token);
      setData(raw);
      const parsedResult = parseChangesets(raw);
      setParsed(parsedResult);

      const ids = parsedResult.changesets?.map((cs) => cs.id) ?? [];
      if (ids.length > 0) {
        try {
          const raws = await Promise.all(
            ids.map((id) => fetchPeRates(environment, token, id))
          );
          const byId = {};
          ids.forEach((id, i) => {
            byId[id] = parsePeRates(raws[i]);
          });
          setRatesByChangesetId(byId);
          setRatesError(null);
        } catch (ratesErr) {
          setRatesError(ratesErr);
          setRatesByChangesetId({});
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, parsed, ratesByChangesetId, ratesError, error, loading, fetch };
}
