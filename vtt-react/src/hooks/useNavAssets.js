import { useState, useEffect } from 'react';
import { processNavSprite } from '../utils/navSpriteProcessor';

/**
 * Loads and processes the navigation sprite sheet at mount time.
 *
 * Returns:
 *   assets  – object with parchment, character, adventure, tools, settings, esc
 *             as PNG data-URL strings (null while loading / on error)
 *   loading – true while the sprite is being processed
 *   error   – error message if processing failed
 */
export function useNavAssets() {
    const [assets, setAssets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        processNavSprite()
            .then(result => {
                if (!cancelled) setAssets(result);
            })
            .catch(err => {
                if (!cancelled) setError(err.message || 'Sprite load failed');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    return { assets, loading, error };
}
