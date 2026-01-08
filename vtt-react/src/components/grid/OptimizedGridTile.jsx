import React, { memo } from 'react';

/**
 * Optimized grid tile component with React.memo to prevent unnecessary re-renders
 * Only re-renders when props actually change
 */
const OptimizedGridTile = memo(({
    tile,
    tileSize,
    effectiveZoom,
    borderStyle,
    tileWalls,
    hoveredTile,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onContextMenu,
    children
}) => {
    const isHovered = hoveredTile === tile;
    
    return (
        <div
            key={tile.key}
            className={`grid-tile ${isHovered ? 'hovered' : ''}`}
            style={{
                position: "absolute",
                width: `${tileSize * effectiveZoom}px`,
                height: `${tileSize * effectiveZoom}px`,
                left: `${tile.screenX}px`,
                top: `${tile.screenY}px`,
                ...borderStyle,
                boxSizing: "border-box",
                pointerEvents: "all",
                zIndex: tileWalls.length > 0 ? 10 : 1,
                background: 'transparent',
                // Enhanced performance optimizations
                willChange: effectiveZoom < 0.5 ? 'auto' : 'transform',
                backfaceVisibility: 'hidden',
                // Reduce repaints by using transform instead of changing position
                transform: 'translateZ(0)', // Force GPU acceleration
                // Optimize for frequent updates
                contain: 'layout style paint',
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onContextMenu={onContextMenu}
        >
            {children}
        </div>
    );
});

OptimizedGridTile.displayName = 'OptimizedGridTile';

export default OptimizedGridTile;
