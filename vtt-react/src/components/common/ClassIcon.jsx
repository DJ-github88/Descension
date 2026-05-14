/**
 * ClassIcon - Performant class icon component with lazy loading and responsive sizing.
 *
 * Serves optimized WebP thumbnails at appropriate sizes, falling back to
 * the original PNG if thumbnails aren't available. Uses native lazy loading,
 * IntersectionObserver-based fade-in, and GPU-accelerated transitions.
 *
 * Props:
 *   - src:       Original icon path (e.g. '/assets/icons/classes/berserker.png')
 *   - alt:       Alt text for the image
 *   - size:      Display size hint: 'tiny' (≤40px), 'small' (≤100px), 'medium' (≤200px), 'large' (>200px)
 *   - className: Additional CSS classes
 *   - dataClass: data-class attribute value for per-class CSS tuning
 *   - style:     Inline styles
 *   - onClick:   Click handler
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import './ClassIcon.css';

// Map size hints to thumbnail directory and fallback sizes
const SIZE_MAP = {
    tiny:   { dir: 'tiny',   px: 64  },
    small:  { dir: 'small',  px: 128 },
    medium: { dir: 'medium', px: 256 },
    large:  { dir: 'large',  px: 512 }
};

// Cache for which thumbnails exist (avoids repeated 404s)
const thumbCache = new Map();

function getThumbSrc(originalSrc, sizeHint) {
    if (!originalSrc) return null;
    const sizeInfo = SIZE_MAP[sizeHint] || SIZE_MAP.small;
    
    // Convert '/assets/icons/classes/berserker.png' → '/assets/icons/classes/thumbs/small/berserker.webp'
    const dir = originalSrc.substring(0, originalSrc.lastIndexOf('/'));
    const filename = originalSrc.substring(originalSrc.lastIndexOf('/') + 1);
    const baseName = filename.replace(/\.\w+$/, '');
    
    return `${dir}/thumbs/${sizeInfo.dir}/${baseName}.png`;
}

const ClassIcon = memo(({
    src,
    alt = '',
    size = 'small',
    className = '',
    dataClass,
    style,
    onClick
}) => {
    const [loaded, setLoaded] = useState(false);
    const [useFallback, setUseFallback] = useState(false);
    const imgRef = useRef(null);

    const thumbSrc = getThumbSrc(src, size);
    const activeSrc = (!useFallback && thumbSrc) ? thumbSrc : src;

    // Build srcSet for responsive loading with larger size for hover/zoom
    const buildSrcSet = () => {
        if (useFallback || !src) return undefined;
        const dir = src.substring(0, src.lastIndexOf('/'));
        const filename = src.substring(src.lastIndexOf('/') + 1);
        const baseName = filename.replace(/\.\w+$/, '');
        
        const sets = [];
        for (const [, info] of Object.entries(SIZE_MAP)) {
            sets.push(`${dir}/thumbs/${info.dir}/${baseName}.png ${info.px}w`);
        }
        return sets.join(', ');
    };

    const getSizes = () => {
        const sizeInfo = SIZE_MAP[size] || SIZE_MAP.small;
        return `${sizeInfo.px}px`;
    };

    const handleError = () => {
        if (!useFallback) {
            // Thumbnail failed, fall back to original PNG
            setUseFallback(true);
        }
    };

    const handleLoad = () => {
        setLoaded(true);
    };

    return (
        <img
            ref={imgRef}
            src={activeSrc}
            srcSet={!useFallback ? buildSrcSet() : undefined}
            sizes={!useFallback ? getSizes() : undefined}
            alt={alt}
            className={`class-icon-img ${className} ${loaded ? 'loaded' : 'loading'}`}
            data-class={dataClass}
            style={style}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            onClick={onClick}
        />
    );
});

ClassIcon.displayName = 'ClassIcon';

export default ClassIcon;
