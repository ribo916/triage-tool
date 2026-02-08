/** @typedef {{ id: number, method: string, url: string, status: number | string, durationMs: number, timestamp: string, error?: string }} LogEntry */

function createStore() {
  /** @type {LogEntry[]} */
  let entries = [];
  let nextId = 1;
  /** @type {Set<(entries: LogEntry[]) => void>} */
  const listeners = new Set();

  return {
    getEntries() {
      return [...entries];
    },
    /**
     * @param {{ method?: string, url: string, status: number | string, durationMs: number, timestamp: string, error?: string }} entry
     */
    append(entry) {
      const id = nextId++;
      entries = [...entries, { id, method: entry.method || 'GET', url: entry.url, status: entry.status, durationMs: entry.durationMs, timestamp: entry.timestamp, error: entry.error }];
      listeners.forEach((cb) => cb([...entries]));
    },
    /**
     * @param {(entries: LogEntry[]) => void} callback
     * @returns {() => void}
     */
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}

const KEY = '__TRIAGE_API_LOG_STORE__';
const store = (typeof window !== 'undefined' && window[KEY]) || createStore();
if (typeof window !== 'undefined') {
  window[KEY] = store;
}

export function getEntries() {
  return store.getEntries();
}

/**
 * @param {{ method?: string, url: string, status: number | string, durationMs: number, timestamp: string, error?: string }} entry
 */
export function append(entry) {
  store.append(entry);
}

/**
 * @param {(entries: LogEntry[]) => void} callback
 * @returns {() => void}
 */
export function subscribe(callback) {
  return store.subscribe(callback);
}
