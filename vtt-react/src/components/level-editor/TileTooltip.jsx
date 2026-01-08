import React, { useState, useEffect } from 'react';
import useLevelEditorStore, { TERRAIN_TYPES, OBJECT_TYPES, DND_ELEMENTS, WALL_TYPES } from '../../store/levelEditorStore';
import './styles/TileTooltip.css';

const TileTooltip = ({ gridX, gridY, mouseX, mouseY, visible }) => {
    const [tooltipData, setTooltipData] = useState(null);

    const {
        getTerrain,
        environmentalObjects,
        dndElements,
        getFogOfWar,
        wallData,
        getWall
    } = useLevelEditorStore();

    useEffect(() => {
        if (!visible || gridX === null || gridY === null) {
            setTooltipData(null);
            return;
        }

        // Gather all information about this tile
        const tileInfo = {
            coordinates: { x: gridX, y: gridY },
            terrain: null,
            objects: [],
            dndElements: [],
            walls: [],
            fogOfWar: false
        };

        // Get terrain information - show all terrain types including grass when explicitly set
        const terrainType = getTerrain(gridX, gridY);
        if (terrainType) {
            tileInfo.terrain = TERRAIN_TYPES[terrainType];
        }

        // Get environmental objects on this tile
        const objectsOnTile = environmentalObjects.filter(obj => {
            // Handle different positioning systems
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                // Free-positioned objects use worldX/worldY
                return Math.floor(obj.worldX) === gridX && Math.floor(obj.worldY) === gridY;
            } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                // Grid-aligned objects use gridX/gridY
                return obj.gridX === gridX && obj.gridY === gridY;
            } else if (obj.position && obj.position.x !== undefined && obj.position.y !== undefined) {
                // Legacy objects with position property
                return Math.floor(obj.position.x) === gridX && Math.floor(obj.position.y) === gridY;
            }
            return false;
        });
        tileInfo.objects = objectsOnTile.map(obj => ({
            ...obj,
            type: OBJECT_TYPES[obj.type]
        }));

        // Get D&D elements on this tile
        const dndOnTile = dndElements.filter(element => {
            // Handle different positioning systems for D&D elements
            if (element.freePosition && element.worldX !== undefined && element.worldY !== undefined) {
                // Free-positioned elements use worldX/worldY
                return Math.floor(element.worldX) === gridX && Math.floor(element.worldY) === gridY;
            } else if (element.gridX !== undefined && element.gridY !== undefined) {
                // Grid-aligned elements use gridX/gridY
                return element.gridX === gridX && element.gridY === gridY;
            } else if (element.position && element.position.x !== undefined && element.position.y !== undefined) {
                // Legacy elements with position property
                return Math.floor(element.position.x) === gridX && Math.floor(element.position.y) === gridY;
            }
            return false;
        });
        tileInfo.dndElements = dndOnTile.map(element => ({
            ...element,
            type: DND_ELEMENTS[element.type]
        }));

        // Get fog of war status
        tileInfo.fogOfWar = getFogOfWar(gridX, gridY);

        // Get walls adjacent to this tile (on the edges)
        const adjacentWalls = [];
        // Check all four edges of the tile
        const edges = [
            { x1: gridX, y1: gridY, x2: gridX + 1, y2: gridY }, // Top edge
            { x1: gridX + 1, y1: gridY, x2: gridX + 1, y2: gridY + 1 }, // Right edge
            { x1: gridX, y1: gridY + 1, x2: gridX + 1, y2: gridY + 1 }, // Bottom edge
            { x1: gridX, y1: gridY, x2: gridX, y2: gridY + 1 } // Left edge
        ];

        edges.forEach(edge => {
            const wall = getWall(edge.x1, edge.y1, edge.x2, edge.y2);
            if (wall) {
                const wallType = typeof wall === 'string' ? wall : wall.type;
                const wallState = typeof wall === 'object' ? wall.state : 'default';
                const wallTypeData = WALL_TYPES[wallType];
                if (wallTypeData) {
                    adjacentWalls.push({
                        type: wallTypeData,
                        state: wallState,
                        edge: edge
                    });
                }
            }
        });
        tileInfo.walls = adjacentWalls;

        // Only show tooltip if there's something interesting on this tile
        const hasWalls = tileInfo.walls.length > 0;
        const hasContent = tileInfo.terrain ||
                          tileInfo.objects.length > 0 ||
                          tileInfo.dndElements.length > 0 ||
                          tileInfo.fogOfWar;

        // Show tile tooltip if there's content (even if walls are present)
        if (hasContent) {
            setTooltipData({ ...tileInfo, hasWalls });
        } else {
            setTooltipData(null);
        }
    }, [visible, gridX, gridY, getTerrain, environmentalObjects, dndElements, getFogOfWar, wallData, getWall]);

    if (!visible || !tooltipData) {
        return null;
    }

    // Calculate tooltip position to keep it on screen and avoid wall tooltip overlap
    const hasWalls = tooltipData.hasWalls;
    const baseOffsetX = 15;
    const baseOffsetY = -10;

    // If there are walls, position tile tooltip to the left of cursor, wall tooltip to the right
    const offsetX = hasWalls ? -320 : baseOffsetX; // Move tile tooltip to left when walls present
    const offsetY = baseOffsetY;

    const tooltipStyle = {
        left: mouseX + offsetX,
        top: mouseY + offsetY,
        transform: (mouseX + offsetX < 0) ? 'translateX(0)' : 'none', // Adjust if going off left edge
        zIndex: 2147483647 // Maximum z-index value to ensure tooltips always appear above windows
    };

    return (
        <div className="tile-tooltip unified-tooltip-style" style={tooltipStyle}>
            <div className="tooltip-content">
                {/* If fog of war is present, ONLY show fog of war - hide everything else */}
                {tooltipData.fogOfWar ? (
                    <div className="tooltip-item">
                        <strong>Fog of War</strong>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                            Hidden from players
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Show terrain name */}
                        {tooltipData.terrain && (
                            <div className="tooltip-item">
                                {tooltipData.terrain.name}
                            </div>
                        )}

                        {/* Show object names */}
                        {tooltipData.objects.map((obj, index) => (
                            <div key={index} className="tooltip-item">
                                {obj.type?.name || obj.type}
                            </div>
                        ))}

                        {/* Show D&D element names */}
                        {tooltipData.dndElements.map((element, index) => (
                            <div key={index} className="tooltip-item">
                                {element.type?.name || element.type}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default TileTooltip;
