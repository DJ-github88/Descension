import { useState, useEffect } from 'react';

const ACTIONBAR_URL = '/assets/ui/Actionbar.PNG';

/**
 * Same aggressive two-pass chroma key used for the nav sprites.
 */
function removeGreenBackground(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dominance = Math.min(g - r, g - b);
        if (dominance > 15) {
            data[i + 3] = 0;
        }
    }

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dominance = Math.min(g - r, g - b);
        if (g > 150 && dominance > 5) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function loadImageToCanvas(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve({ canvas, ctx, width: img.width, height: img.height });
        };
        img.onerror = () => reject(new Error(`Failed to load ${url}`));
        img.src = url;
    });
}

/**
 * Loads Actionbar.PNG, removes green background, returns a data URL.
 */
export function useActionBarAsset() {
    const [asset, setAsset] = useState(null);

    useEffect(() => {
        let cancelled = false;

        loadImageToCanvas(ACTIONBAR_URL)
            .then(({ ctx, canvas, width, height }) => {
                removeGreenBackground(ctx, width, height);
                if (!cancelled) setAsset(canvas.toDataURL('image/png'));
            })
            .catch(err => {
                console.error('[actionBarAsset] Error:', err);
            });

        return () => { cancelled = true; };
    }, []);

    return asset;
}
