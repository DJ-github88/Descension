// Version check hook
// Automatic fresh loads are handled via HTTP Cache-Control and service worker de-registration.
// Periodic polling and disruptive reload loops are removed.

export function useVersionCheck() {
  return {
    hasUpdate: false,
    latestInfo: null,
    countdown: 0,
    triggerUpdate: () => {}
  };
}
