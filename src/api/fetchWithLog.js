import { append } from './apiLogStore.js';

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function fetchWithLog(url, options = {}) {
  const start = Date.now();
  const method = (options.method || 'GET').toUpperCase();

  try {
    const response = await fetch(url, options);
    const durationMs = Date.now() - start;
    append({
      method,
      url,
      status: response.status,
      durationMs,
      timestamp: new Date().toISOString(),
    });
    return response;
  } catch (err) {
    const durationMs = Date.now() - start;
    append({
      method,
      url,
      status: 'error',
      durationMs,
      timestamp: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
