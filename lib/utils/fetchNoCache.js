/**
 * Fetch wrapper that disables HTTP caching
 * Ensures fresh data is always fetched from the server
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise}
 */
export async function fetchNoCache(url, options = {}) {
  return fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      ...options.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
