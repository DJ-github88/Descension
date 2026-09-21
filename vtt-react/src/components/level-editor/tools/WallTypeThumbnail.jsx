import React, { useEffect, useMemo, useState } from 'react';
import { resolveWallModelUrlForType } from '../three/ThreeDWallManager';
import modelThumbnailService from '../../../services/ModelThumbnailService';

// Energy barriers render from a generated emissive material rather than a lit
// wall model, so a 3D snapshot of their stand-in masonry model would
// misrepresent them. Those types show their seamless 2.5D texture instead.
// Windows and doors render real models (kit windows / dedicated doorway
// models), so they must preview that exact model.
const TEXTURE_ONLY_TYPES = new Set([
  'magical_barrier',
  'force_wall'
]);

/**
 * Palette preview for a wall type: an isometric snapshot of the exact 3D model
 * the type places (same resolution the wall manager uses), falling back to the
 * type's seamless 2.5D texture while the model loads.
 */
const WallTypeThumbnail = ({ typeId, className }) => {
  const [, setTick] = useState(0);
  const textureOnly = TEXTURE_ONLY_TYPES.has(typeId);
  const modelUrl = useMemo(
    () => (textureOnly ? null : resolveWallModelUrlForType(typeId)),
    [typeId, textureOnly]
  );

  useEffect(() => {
    if (!modelUrl) return undefined;
    const unsub = modelThumbnailService.subscribe(() => setTick((t) => t + 1));
    modelThumbnailService.getThumbnail(modelUrl);
    return unsub;
  }, [modelUrl]);

  const thumb = modelUrl ? modelThumbnailService.peek(modelUrl) : null;
  const src = thumb || `/assets/textures/walls/${typeId}.png`;

  return (
    <img
      src={src}
      alt=""
      className={className}
      draggable={false}
      style={{
        imageRendering: thumb ? 'auto' : 'pixelated',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block'
      }}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  );
};

export default WallTypeThumbnail;
