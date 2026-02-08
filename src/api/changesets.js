import { getBaseUrl } from './config.js';
import { fetchWithLog } from './fetchWithLog.js';

/**
 * @param {'prod' | 'stage'} environment
 * @param {string} token
 * @returns {Promise<unknown>}
 */
export async function fetchChangesets(environment, token) {
  const baseUrl = getBaseUrl(environment);
  const url = `${baseUrl}/api/v2/changesets/?pageSize=3`;

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
