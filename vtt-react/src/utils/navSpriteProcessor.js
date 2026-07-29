const SPRITE_SHEET_URL = '/assets/ui/Navigation%20Assets.jpg';
const BACKGROUND_URL = '/assets/ui/Background%20Nav.PNG';
const QUILLL_URL = '/assets/ui/Quill.PNG';

/**
 * Crop regions for button assets within the sprite sheet (1024×705).
 */
const SPRITE_REGIONS = {
    character:  { x: 50,  y: 255, w: 230,  h: 90 },
    adventure:  { x: 285, y: 255, w: 240,  h: 90 },
    tools:      { x: 525, y: 255, w: 190,  h: 90 },
    settings:   { x: 705, y: 255, w: 100,  h: 90 },
    esc:        { x: 800, y: 255, w: 100,  h: 90 },
};

/**
 * Aggressive chroma key: removes any pixel where green meaningfully
 * dominates both red and blue. Kills neon green, yellow-green, and
 * green fringe from JPG compression artifacts.
 *
 * Two-pass approach:
 *  Pass 1 — hard cutoff: any pixel where green dominates by >15 is fully removed
 *  Pass 2 — edge cleanup: any pixel that still has green > 180 AND dominance > 5 is removed
 *           (catches anti-aliased edge pixels that slip past the first pass)
 */
function removeGreenBackground(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Pass 1: hard cutoff on green dominance
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (data[i + 3] === 0) continue;

        const dominance = Math.min(g - r, g - b);
        if (dominance > 15) {
            data[i + 3] = 0;
        }
    }

    // Pass 2: catch anti-aliased edge pixels still carrying green
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

/**
 * Load an image from URL onto a canvas.
 */
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

function extractRegion(sourceCanvas, region) {
    const canvas = document.createElement('canvas');
    canvas.width = region.w;
    canvas.height = region.h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        sourceCanvas,
        region.x, region.y, region.w, region.h,
        0, 0, region.w, region.h
    );
    return canvas;
}

/**
 * Load sprite sheet + background + quill, remove green from ALL, extract buttons.
 *
 * @returns {{ background, character, adventure, tools, settings, esc, quill }}
 */
export function processNavSprite() {
    return new Promise(async (resolve, reject) => {
        try {
            // --- Process background PNG through chroma key ---
            const bg = await loadImageToCanvas(BACKGROUND_URL);
            removeGreenBackground(bg.ctx, bg.width, bg.height);
            const backgroundURL = bg.canvas.toDataURL('image/png');

            // --- Process quill PNG through chroma key ---
            const quill = await loadImageToCanvas(QUILLL_URL);
            removeGreenBackground(quill.ctx, quill.width, quill.height);
            const quillURL = quill.canvas.toDataURL('image/png');

            // --- Process sprite sheet through chroma key ---
            const sheet = await loadImageToCanvas(SPRITE_SHEET_URL);
            removeGreenBackground(sheet.ctx, sheet.width, sheet.height);

            // Scale regions if source differs from expected 1024×705
            const sx = sheet.width / 1024;
            const sy = sheet.height / 705;

            const assets = { background: backgroundURL, quill: quillURL };

            for (const [name, region] of Object.entries(SPRITE_REGIONS)) {
                const scaled = {
                    x: Math.round(region.x * sx),
                    y: Math.round(region.y * sy),
                    w: Math.round(region.w * sx),
                    h: Math.round(region.h * sy),
                };
                const assetCanvas = extractRegion(sheet.canvas, scaled);
                assets[name] = assetCanvas.toDataURL('image/png');
            }

            console.log('[navSprite] All assets processed (bg + buttons + quill)');
            resolve(assets);
        } catch (err) {
            console.error('[navSprite] Error:', err);
            reject(err);
        }
    });
}
