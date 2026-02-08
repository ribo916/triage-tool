/**
 * Transform raw changesets API response into a triage-friendly shape.
 *
 * @param {unknown} rawResponse - Raw JSON from api/changesets.fetchChangesets
 * @returns {{ total: number, changesets: Array<{ id: string, name: string, details: { status: string, initiatedAt: string, publishedAt: string, pricingGeneratedAt: string }, versionInfo: { basedOnId: string, additionsToBase: number, modificationsToBase: number, removalsFromBase: number } }>, nextPage: string | null, previousPage: string | null }}
 */
export function parseChangesets(rawResponse) {
  const fallback = {
    total: 0,
    changesets: [],
    nextPage: null,
    previousPage: null,
  };

  if (!rawResponse || typeof rawResponse !== 'object' || !('changesets' in rawResponse)) {
    return fallback;
  }

  const raw = /** @type {{ total?: number, changesets?: unknown[], nextPage?: string | null, previousPage?: string | null }} */ (rawResponse);
  const total = typeof raw.total === 'number' ? raw.total : 0;
  const list = Array.isArray(raw.changesets) ? raw.changesets : [];
  const nextPage = raw.nextPage ?? null;
  const previousPage = raw.previousPage ?? null;

  const changesets = list.map((item) => {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const o = /** @type {Record<string, unknown>} */ (item);
    const details = o.details && typeof o.details === 'object' ? (/** @type {Record<string, unknown>} */ (o.details)) : {};
    const versionInfo = o.versionInfo && typeof o.versionInfo === 'object' ? (/** @type {Record<string, unknown>} */ (o.versionInfo)) : {};
    return {
      id: String(o.id ?? ''),
      name: String(o.name ?? ''),
      details: {
        status: String(details.status ?? ''),
        initiatedAt: String(details.initiatedAt ?? ''),
        publishedAt: String(details.publishedAt ?? ''),
        pricingGeneratedAt: String(details.pricingGeneratedAt ?? ''),
      },
      versionInfo: {
        basedOnId: String(versionInfo.basedOnId ?? ''),
        additionsToBase: Number(versionInfo.additionsToBase ?? 0),
        modificationsToBase: Number(versionInfo.modificationsToBase ?? 0),
        removalsFromBase: Number(versionInfo.removalsFromBase ?? 0),
      },
    };
  }).filter(Boolean);

  // Sort by publishedAt descending (most recent first)
  changesets.sort((a, b) => {
    const dateA = a?.details?.publishedAt ?? '';
    const dateB = b?.details?.publishedAt ?? '';
    return dateB.localeCompare(dateA);
  });

  return {
    total,
    changesets: /** @type {Array<{ id: string, name: string, details: { status: string, initiatedAt: string, publishedAt: string, pricingGeneratedAt: string }, versionInfo: { basedOnId: string, additionsToBase: number, modificationsToBase: number, removalsFromBase: number } }>} */ (changesets),
    nextPage: nextPage != null ? String(nextPage) : null,
    previousPage: previousPage != null ? String(previousPage) : null,
  };
}
