import { useState, useEffect, useRef } from 'react';
import { getCachedData, setCachedData } from '../services/dataCache';
import { DATA_VERSIONS, DATA_FILES } from '../data/versions';
import { initRulesData, initLoreData } from '../data/rulesData';

const inMemoryCache = {};

export function getLoadedData(dataKey) {
  return inMemoryCache[dataKey] || null;
}

export default function useGameData(dataKey) {
  const [data, setData] = useState(() => {
    const cached = inMemoryCache[dataKey] || null;
    if (cached && dataKey === 'rules') {
      initRulesData(cached, inMemoryCache['lore'] || null);
    } else if (cached && dataKey === 'lore') {
      initLoreData(cached);
    }
    return cached;
  });
  const [isLoading, setIsLoading] = useState(() => !inMemoryCache[dataKey]);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (inMemoryCache[dataKey]) {
      if (dataKey === 'rules') {
        initRulesData(inMemoryCache[dataKey], inMemoryCache['lore'] || null);
      } else if (dataKey === 'lore') {
        initLoreData(inMemoryCache[dataKey]);
      }
      return;
    }

    let cancelled = false;
    const expectedVersion = DATA_VERSIONS[dataKey];
    const filePath = DATA_FILES[dataKey];

    if (!filePath) {
      if (mountedRef.current) {
        setError(new Error(`Unknown data key: ${dataKey}`));
        setIsLoading(false);
      }
      return;
    }

    async function load() {
      let cached = null;
      try {
        // Try IndexedDB cache first
        cached = await getCachedData(dataKey);
        if (!cancelled && cached && cached.version === expectedVersion) {
          inMemoryCache[dataKey] = cached.data;

          if (dataKey === 'rules') {
            initRulesData(cached.data, inMemoryCache['lore'] || null);
          } else if (dataKey === 'lore') {
            initLoreData(cached.data);
          }

          setData(cached.data);
          setIsLoading(false);
          return;
        }

        // Fetch from network
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();

        // Cache in IndexedDB and memory
        setCachedData(dataKey, expectedVersion, json).catch(() => {});
        inMemoryCache[dataKey] = json;

        if (dataKey === 'rules') {
          initRulesData(json, inMemoryCache['lore'] || null);
        } else if (dataKey === 'lore') {
          initLoreData(json);
        }

        if (!cancelled && mountedRef.current) {
          setData(json);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          // If we have stale cached data, use it as fallback
          if (cached?.data) {
            inMemoryCache[dataKey] = cached.data;
            setData(cached.data);
          }
          setError(err);
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);
    load();

    return () => { cancelled = true; };
  }, [dataKey]);

  return { data, isLoading, error };
}

export function preloadGameData(dataKey) {
  if (inMemoryCache[dataKey]) return;

  const expectedVersion = DATA_VERSIONS[dataKey];
  const filePath = DATA_FILES[dataKey];
  if (!filePath) return;

  getCachedData(dataKey).then(cached => {
    if (cached && cached.version === expectedVersion) {
      inMemoryCache[dataKey] = cached.data;
      if (dataKey === 'rules') initRulesData(cached.data);
      return;
    }
    fetch(filePath)
      .then(r => r.json())
      .then(json => {
        inMemoryCache[dataKey] = json;
        setCachedData(dataKey, expectedVersion, json).catch(() => {});
        if (dataKey === 'rules') initRulesData(json);
      })
      .catch(() => {});
  }).catch(() => {});
}
