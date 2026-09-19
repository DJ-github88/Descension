import React, { useState, useEffect } from 'react';

import { MODEL_REGISTRY } from '../three/ThreeDPropManager';
import { PROFESSIONAL_OBJECTS } from './ObjectSystem';
import modelThumbnailService from '../../../services/ModelThumbnailService';

const fallback = (objectType) => `/assets/objects/misc_box.png?v=${CACHE_BUST}`;
const CACHE_BUST = Date.now();

const CanvasObjectThumbnail = ({ objectType, className, style }) => {
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
        <div style={{ position: 'relative', display: 'inline-block', width: 80, height: 80 }}>
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
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 180, 219, 0.08)',
                    borderRadius: 6
                }}>
                    <i className="fas fa-cube fa-spin" style={{ color: '#00b4db', fontSize: 22, opacity: 0.8 }} />
                </div>
            )}
            {is3D && (
                <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    background: 'linear-gradient(135deg, #00b4db, #0083b0)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    pointerEvents: 'none'
                }}>
                    3D
                </span>
            )}
        </div>
    );
};

export default CanvasObjectThumbnail;
