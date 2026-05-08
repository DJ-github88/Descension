import { lazy } from 'react';

/**
 * A wrapper for React.lazy that retries the import if it fails.
 * This helps mitigate ChunkLoadError which often occurs due to network issues
 * or when the dev server is restarted and the browser has a stale manifest.
 * 
 * @param {Function} componentImport - A function that returns a promise (e.g., () => import('./MyComponent'))
 * @returns {React.Component} A lazy-loaded component with retry logic
 */
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasBeenForceRefreshed) {
        // Log that we're forcing a refresh
        console.warn('Chunk load failed. Force refreshing page to sync with server...', error);
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      // If we already refreshed and it still fails, try one more time after a short delay
      // before giving up. This can help if the server is still compiling.
      console.error('Chunk load failed after refresh. Retrying in 2 seconds...', error);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        return await componentImport();
      } catch (retryError) {
        console.error('Final attempt to load chunk failed:', retryError);
        throw retryError;
      }
    }
  });

export default lazyWithRetry;
