import React from 'react';

const fallback = (objectType) => `/assets/objects/misc_box.png?v=${CACHE_BUST}`;
const CACHE_BUST = Date.now();

const CanvasObjectThumbnail = ({ objectType, className, style }) => {
    if (!objectType) return null;
    return (
        <img
            src={`/assets/objects/${objectType}.png?v=${CACHE_BUST}`}
            alt={objectType}
            className={className}
            style={{
                ...style,
                imageRendering: 'pixelated',
                width: 80,
                height: 80,
                objectFit: 'contain',
                display: 'block'
            }}
            onError={(e) => {
                const fb = fallback(objectType);
                if (!e.currentTarget.src.endsWith(fb.split('?')[0])) {
                    e.currentTarget.src = fb;
                }
            }}
        />
    );
};

export default CanvasObjectThumbnail;
