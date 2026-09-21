import React from 'react';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { CONNECTION_MARKER_COLOR, ConnectionMarker, GmNotePreview } from './objects/objectPreviewArt';

/**
 * PlacementGhostPreview - cursor-following preview for object placements that
 * have no 3D model ghost: GM notes (canvas-rendered paper note) and connections
 * (portal marker). Mirrors the exact art the editor draws once the object is
 * placed, so what you hover is what you get.
 *
 * `ghost`: 'gmNotes' | 'connection'
 * GM notes are free-positioned, so the ghost follows the cursor; connections
 * snap to the hovered cell center like the placed marker does.
 */
const PlacementGhostPreview = ({ ghost, screenX, screenY, gridX, gridY, scale = 1, elevation = 0 }) => {
    const gridSize = useGameStore(state => state.gridSize);
    const gs = gridSize || 50;

    if (!Number.isFinite(gs)) return null;

    const gridSystem = getGridSystem();
    const viewport = gridSystem.getViewportDimensions();
    const transform = gridSystem.getProjectionTransform(viewport.width, viewport.height);
    const tileSize = gs * transform.effectiveZoom;

    if (ghost === 'connection') {
        if (!Number.isFinite(gridX) || !Number.isFinite(gridY)) return null;
        const centerWorld = gridSystem.gridToWorld(gridX, gridY);
        const center = gridSystem.worldToScreen(centerWorld.x, centerWorld.y, viewport.width, viewport.height);
        const markerSize = Math.max(20, tileSize * 0.6);
        return (
            <div
                className="vtt-placement-ghost"
                style={{ left: center.x, top: center.y, width: markerSize, height: markerSize }}
            >
                <ConnectionMarker size={markerSize} color={CONNECTION_MARKER_COLOR} />
            </div>
        );
    }

    // GM note: centred on the cursor, lifted by the placement elevation the
    // same way ObjectSystem lifts the placed note.
    const noteScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const noteSize = Math.max(16, tileSize * noteScale);
    const lift = (Number.isFinite(elevation) ? elevation : 0) * gs * 0.5 * transform.cosTilt * transform.effectiveZoom;
    return (
        <div
            className="vtt-placement-ghost"
            style={{ left: screenX, top: screenY - lift, width: noteSize, height: noteSize }}
        >
            <GmNotePreview size={noteSize} />
        </div>
    );
};

export default PlacementGhostPreview;
