import { getBaseUrl } from './config.js';
import { fetchWithLog } from './fetchWithLog.js';

/**
 * Fetch pricing scenario details for a given PE request.
 *
 * @param {'prod' | 'stage'} environment
 * @param {string} token
 * @param {string} peRequestId
 * @returns {Promise<unknown>}
 */
export async function fetchPricingScenario(environment, token, peRequestId) {
  const baseUrl = getBaseUrl(environment);
  const url = `${baseUrl}/api/v2/pe/pricing-scenarios/${encodeURIComponent(peRequestId)}/`;

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

