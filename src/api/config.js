const BASE_URLS = {
  prod: 'https://api.prod.polly.io',
  stage: 'https://api.stage.polly.io',
};

/**
 * @param {'prod' | 'stage'} environment
 * @returns {string}
 */
export function getBaseUrl(environment) {
  return BASE_URLS[environment] ?? BASE_URLS.stage;
}
