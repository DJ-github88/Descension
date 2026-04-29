import { useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';
import useAuthStore from '../store/authStore';

function isLocalRoom() {
  try {
    return typeof window !== 'undefined' && localStorage.getItem('isLocalRoom') === 'true';
  } catch {
    return false;
  }
}

export default function useFeatureFlag(featureName) {
  const { user } = useAuthStore();
  const [allowed, setAllowed] = useState(() => isLocalRoom());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLocalRoom()) {
      setAllowed(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function check() {
      setLoading(true);
      try {
        const result = await subscriptionService.canUseFeature(featureName, user?.uid);
        if (!cancelled) setAllowed(result);
      } catch {
        if (!cancelled) setAllowed(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (user) {
      check();
    } else {
      setAllowed(false);
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [featureName, user?.uid]);

  return { allowed, loading };
}

export function useMultipleFeatureFlags(featureNames) {
  const { user } = useAuthStore();
  const [flags, setFlags] = useState(() => {
    if (isLocalRoom()) {
      const allTrue = {};
      featureNames.forEach(n => { allTrue[n] = true; });
      return allTrue;
    }
    return {};
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLocalRoom()) {
      const allTrue = {};
      featureNames.forEach(n => { allTrue[n] = true; });
      setFlags(allTrue);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function check() {
      setLoading(true);
      try {
        const results = {};
        for (const name of featureNames) {
          results[name] = await subscriptionService.canUseFeature(name, user?.uid);
        }
        if (!cancelled) setFlags(results);
      } catch {
        if (!cancelled) setFlags({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (user) {
      check();
    } else {
      setFlags({});
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [JSON.stringify(featureNames), user?.uid]);

  return { flags, loading };
}
