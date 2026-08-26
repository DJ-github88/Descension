import React, { useEffect, useState, useRef, useMemo } from 'react';
import useSettingsStore from '../../store/settingsStore';
import useGameStore from '../../store/gameStore';
import { useShallow } from 'zustand/react/shallow';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import './CursorTracker.css';

/**
 * CursorTracker Component
 * 
 * Displays other players' cursor positions in real-time during multiplayer sessions.
 * Shows a glowy, non-obstructive circular indicator with the player's name and color.
 */
const CursorTracker = ({ socket }) => {
    // Default to true if undefined (e.g., before settings load)
    const showCursorTracking = useSettingsStore(state => state.showCursorTracking) ?? true;
    const [cursors, setCursors] = useState({});
    const cursorTimeouts = useRef({});

    useEffect(() => {
        if (!socket) {
            // console.log('鼠标 CursorTracker: No socket available');
            setCursors({});
            return;
        }

        if (!showCursorTracking) {
            console.log('🖱️ CursorTracker: Cursor tracking disabled in settings');
            setCursors({});
            return;
        }

        /*
        console.log('🖱️ CursorTracker: Setting up cursor_move listener');
        */

        // Buffer incoming cursor packets and flush once per frame to avoid
        // re-rendering at network packet frequency (dozens/sec per player)
        const pendingCursors = {};
        let flushRafId = null;

        // Listen for cursor movements from other players
        const handleCursorMove = (data) => {
            const { playerId, playerName, playerColor, worldX, worldY, x, y } = data;

            // Use world coordinates if available, fall back to screen coords (legacy)
            const finalWorldX = worldX !== undefined ? worldX : x;
            const finalWorldY = worldY !== undefined ? worldY : y;

            // console.log(`鼠标 CursorTracker: Received cursor from ${playerName} at world (${finalWorldX}, ${finalWorldY})`);

            pendingCursors[playerId] = {
                worldX: finalWorldX,
                worldY: finalWorldY,
                playerName: playerName || 'Unknown',
                playerColor: playerColor || '#4a90e2',
                timestamp: Date.now()
            };

            if (flushRafId === null) {
                flushRafId = requestAnimationFrame(() => {
                    flushRafId = null;
                    const updates = pendingCursors;
                    const count = Object.keys(updates).length;
                    if (count === 0) return;
                    setCursors(prev => ({ ...prev, ...updates }));
                    Object.keys(pendingCursors).forEach(k => delete pendingCursors[k]);
                });
            }

            // Clear existing timeout for this player
            if (cursorTimeouts.current[playerId]) {
                clearTimeout(cursorTimeouts.current[playerId]);
            }

            // Set timeout to hide cursor if no movement for 3 seconds
            cursorTimeouts.current[playerId] = setTimeout(() => {
                setCursors(prev => {
                    const newCursors = { ...prev };
                    delete newCursors[playerId];
                    return newCursors;
                });
            }, 3000);
        };

        socket.on('cursor_move', handleCursorMove);

        return () => {
            socket.off('cursor_move', handleCursorMove);
            if (flushRafId !== null) {
                cancelAnimationFrame(flushRafId);
                flushRafId = null;
            }
            // Clear all timeouts
            Object.values(cursorTimeouts.current).forEach(clearTimeout);
            cursorTimeouts.current = {};
            /*
            console.log('🖱️ CursorTracker: Cleaned up cursor_move listener');
            */
        };
    }, [socket, showCursorTracking]);

    // Subscribe to game store and viewport dimensions to re-render cursors on move/zoom
    const gameStore = useGameStore(useShallow(state => ({
        cameraX: state.cameraX,
        cameraY: state.cameraY,
        zoomLevel: state.zoomLevel,
        playerZoom: state.playerZoom
    })));

    // Calculate screen positions for all cursors
    const visibleCursors = useMemo(() => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();

            return Object.entries(cursors).map(([playerId, cursor]) => {
                const screenPos = gridSystem.worldToScreen(
                    cursor.worldX,
                    cursor.worldY,
                    viewport.width,
                    viewport.height
                );

                return {
                    id: playerId,
                    ...cursor,
                    screenX: screenPos.x,
                    screenY: screenPos.y
                };
            });
        } catch (e) {
            return [];
        }
    }, [cursors, gameStore]);

    if (!showCursorTracking || visibleCursors.length === 0) {
        return null;
    }

    return (
        <div className="cursor-tracker-container">
            {visibleCursors.map((cursor) => (
                <div
                    key={cursor.id}
                    className="player-cursor"
                    style={{
                        left: `${cursor.screenX}px`,
                        top: `${cursor.screenY}px`,
                        '--cursor-color': cursor.playerColor
                    }}
                >
                    <div className="cursor-circle"></div>
                    <div className="cursor-label" style={{ color: cursor.playerColor }}>
                        {cursor.playerName}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CursorTracker;
