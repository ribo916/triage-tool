/**
 * Parse PE rates API response into a normalized shape.
 *
 * @param {unknown} rawResponse - Raw JSON from api/peRates.fetchPeRates
 * @returns {{ items: Array<{ id: string, changesetId: string, baseRateSetId?: string, createdOn?: string, isPublished?: boolean }>, total: number }}
 */
export function parsePeRates(rawResponse) {
  const fallback = { items: [], total: 0 };

  if (!rawResponse || typeof rawResponse !== 'object' || !('data' in rawResponse)) {
    return fallback;
  }

  const data = /** @type {{ items?: unknown[], total?: number }} */ (
    typeof rawResponse.data === 'object' && rawResponse.data !== null ? rawResponse.data : {}
  );
  const list = Array.isArray(data.items) ? data.items : [];
  const total = typeof data.total === 'number' ? data.total : 0;

  const items = list.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const o = /** @type {Record<string, unknown>} */ (item);
    const parsed = {
      id: String(o.id ?? ''),
      changesetId: String(o.changesetId ?? ''),
    };
    if (o.baseRateSetId !== undefined) parsed.baseRateSetId = String(o.baseRateSetId);
    if (o.createdOn !== undefined) parsed.createdOn = String(o.createdOn);
    if (typeof o.isPublished === 'boolean') parsed.isPublished = o.isPublished;
    return parsed;
  }).filter(Boolean);

  return {
    items: /** @type {Array<{ id: string, changesetId: string, baseRateSetId?: string, createdOn?: string, isPublished?: boolean }>} */ (items),
    total,
  };
}
