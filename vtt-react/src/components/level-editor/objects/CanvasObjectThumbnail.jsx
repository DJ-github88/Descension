import React, { useState, useEffect } from 'react';

import { MODEL_REGISTRY } from '../three/ThreeDPropManager';
import { PROFESSIONAL_OBJECTS } from './ObjectSystem';
import modelThumbnailService from '../../../services/ModelThumbnailService';

const fallback = (objectType) => `/assets/objects/misc_box.png?v=${CACHE_BUST}`;
const CACHE_BUST = Date.now();

const CanvasObjectThumbnail = ({ objectType, className, style, size = 80 }) => {
    const [, setTick] = useState(0);

    const is3D = !!MODEL_REGISTRY[objectType];
    const modelDef = is3D ? MODEL_REGISTRY[objectType] : null;

    useEffect(() => {
        if (is3D && modelDef?.url) {
            const unsub = modelThumbnailService.subscribe(() => {
                setTick(t => t + 1);
            });
            // Ensure thumbnail is requested
            modelThumbnailService.getThumbnail(modelDef.url);
            return unsub;
        }
    }, [is3D, modelDef]);

    if (!objectType) return null;

    let thumbSrc = null;
    if (is3D && modelDef?.url) {
        thumbSrc = modelThumbnailService.getThumbnail(modelDef.url);
    }

    const objDef = PROFESSIONAL_OBJECTS ? PROFESSIONAL_OBJECTS[objectType] : null;
    const src = thumbSrc || (objDef && objDef.image) || (is3D ? null : `/assets/objects/${objectType}.png?v=${CACHE_BUST}`);

    return (
        <div
            className="canvas-object-thumb"
            style={{ position: 'relative', display: 'inline-block', width: size, height: size }}
        >
            {src ? (
                <img
                    src={src}
                    alt={objectType}
                    className={className}
                    style={{
                        ...style,
                        imageRendering: is3D ? 'auto' : 'pixelated',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block'
                    }}
                    onError={(e) => {
                        if (!is3D) {
                            const fb = fallback(objectType);
                            if (!e.currentTarget.src.endsWith(fb.split('?')[0])) {
                                e.currentTarget.src = fb;
                            }
                        }
                    }}
                />
            ) : (
                <div className="canvas-object-thumb-loading">
                    <i className="fas fa-cube fa-spin" />
                </div>
            )}
            {is3D && (
                <span className="thumb-3d-badge">3D</span>
            )}
        </div>
    );
};

export default CanvasObjectThumbnail;
