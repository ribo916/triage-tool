/**
 * Utilities to diff pricing input data between lock requests.
 * Only sections in PRICING_INPUT_SECTIONS are compared (borrower, loan, property, search, customValues).
 * Add new top-level sections here and in the parser to extend.
 */

export const PRICING_INPUT_SECTIONS = [
  'borrower',
  'loan',
  'property',
  'search',
  'customValues',
];

const EMPTY_DISPLAY = '—';

/**
 * Format a value for display in the diff table.
 * @param {unknown} value
 * @returns {string}
 */
function formatForDisplay(value) {
  if (value === null || value === undefined) return EMPTY_DISPLAY;
  if (Array.isArray(value)) return value.length === 0 ? '(empty)' : value.join(', ');
  if (typeof value === 'object') return Object.keys(value).length === 0 ? '(empty)' : JSON.stringify(value);
  const s = String(value);
  return s === '' ? '(empty)' : s;
}

/**
 * Recursively flatten an object to dot-path → value (leaves only).
 * Arrays are joined to a single string for comparison.
 * @param {Record<string, unknown>} obj
 * @param {string} prefix
 * @returns {Record<string, string>}
 */
export function flattenSection(obj, prefix) {
  if (!obj || typeof obj !== 'object') return {};
  const out = /** @type {Record<string, string>} */ ({});
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenSection(/** @type {Record<string, unknown>} */ (value), path));
    } else {
      const leaf = Array.isArray(value)
        ? value.map((x) => (x != null ? String(x) : '')).join(', ')
        : value == null ? '' : String(value);
      out[path] = leaf;
    }
  }
  return out;
}

/**
 * @typedef {{ path: string, previous: string, current: string }} PricingChange
 */

/**
 * Compare two parsed pricing objects and return changes in input sections only.
 * @param {Record<string, unknown> | null | undefined} prevPricing
 * @param {Record<string, unknown> | null | undefined} currPricing
 * @returns {PricingChange[]}
 */
export function diffPricing(prevPricing, currPricing) {
  if (!prevPricing || !currPricing) return [];
  const changes = /** @type {PricingChange[]} */ ([]);
  for (const section of PRICING_INPUT_SECTIONS) {
    const prevSection = (prevPricing[section] != null && typeof prevPricing[section] === 'object')
      ? /** @type {Record<string, unknown>} */ (prevPricing[section])
      : {};
    const currSection = (currPricing[section] != null && typeof currPricing[section] === 'object')
      ? /** @type {Record<string, unknown>} */ (currPricing[section])
      : {};
    const prevFlat = flattenSection(prevSection, section);
    const currFlat = flattenSection(currSection, section);
    const allPaths = new Set([...Object.keys(prevFlat), ...Object.keys(currFlat)]);
    for (const path of allPaths) {
      const prevVal = prevFlat[path];
      const currVal = currFlat[path];
      const prevStr = formatForDisplay(prevVal);
      const currStr = formatForDisplay(currVal);
      if (prevStr !== currStr) {
        changes.push({ path, previous: prevStr, current: currStr });
      }
    }
  }
  return changes;
}

/**
 * Build an array of pricing diffs from the chronologically previous lock, in the same order as locks.
 * Locks may be in any order (e.g. API order = newest first). "Previous" is always the lock before
 * this one in time (requestedOn). The initial (oldest) lock gets null; every other lock is diffed
 * against the lock that came before it chronologically.
 * @param {Array<{ id: number, requestedOn: string, buySide: { peRequestId: string } }>} locks
 * @param {Record<string, Record<string, unknown> | null>} pricingByPeRequestId
 * @returns {(PricingChange[] | null)[]}
 */
export function getPricingDiffsFromPrevious(locks, pricingByPeRequestId) {
  if (!Array.isArray(locks) || locks.length === 0) return [];
  if (locks.length === 1) return [null];

  // Chronological order (oldest first) so "previous" = lock at index i-1 in time
  const chronological = [...locks].sort((a, b) => {
    const tA = a.requestedOn || '';
    const tB = b.requestedOn || '';
    return tA.localeCompare(tB) || (a.id - b.id);
  });

  const chronoDiffs = /** @type {(PricingChange[] | null)[]} */ ([null]);
  for (let i = 1; i < chronological.length; i++) {
    const prevPeId = chronological[i - 1].buySide?.peRequestId;
    const currPeId = chronological[i].buySide?.peRequestId;
    const prev = prevPeId ? pricingByPeRequestId[prevPeId] : null;
    const curr = currPeId ? pricingByPeRequestId[currPeId] : null;
    if (prev && curr) {
      chronoDiffs.push(diffPricing(prev, curr));
    } else {
      chronoDiffs.push(null);
    }
  }

  // Map lock id -> chronological index so we can return diffs in original (display) order
  const chronoIndexByLockId = new Map();
  chronological.forEach((lock, idx) => {
    chronoIndexByLockId.set(lock.id, idx);
  });

  return locks.map((lock) => chronoDiffs[chronoIndexByLockId.get(lock.id)] ?? null);
}
