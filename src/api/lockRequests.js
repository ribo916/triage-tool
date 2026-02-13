import { getBaseUrl } from './config.js';
import { fetchWithLog } from './fetchWithLog.js';

/**
 * Fetch all lock requests for a given loan.
 *
 * @param {'prod' | 'stage'} environment
 * @param {string} token
 * @param {string} loanId
 * @returns {Promise<unknown>}
 */
export async function fetchLockRequests(environment, token, loanId) {
  const baseUrl = getBaseUrl(environment);
  const url = `${baseUrl}/api/v2/pe/loans/${encodeURIComponent(loanId)}/lock-requests/`;

  const response = await fetchWithLog(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw { status: response.status, statusText: response.statusText, data: errorData };
  }

  return response.json();
}

