import { useEffect, useState, useCallback, useRef } from "react";
import useCreatureStore from '../../../vtt-react/src/store/creatureStore';
import CreatureToken from './grid/CreatureToken';
import TokenTester from './grid/TokenTester';
import '../styles/Grid.css';

export default function Grid() {
    const tileSize = 50; // Set grid tile size
    const [grid, setGrid] = useState([]);
    const [isDraggingCreature, setIsDraggingCreature] = useState(false);
    const [draggedCreatureId, setDraggedCreatureId] = useState(null);
    const gridRef = useRef(null);

    const { tokens, creatures, addToken, removeToken } = useCreatureStore();

    const createGrid = useCallback(() => {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        const cols = Math.ceil(containerWidth / tileSize);
        const rows = Math.ceil(containerHeight / tileSize);

        let newGrid = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newGrid.push({
                    x: j * tileSize,
                    y: i * tileSize,
                    row: i,
                    col: j
                });
            }
        }
        setGrid(newGrid);
    }, [tileSize]);

    useEffect(() => {
        createGrid();

        // Debounce resize event
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                createGrid();
            }, 100); // Wait 100ms after last resize event
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, [createGrid]);

    // Set up drag and drop event listeners for creatures
    useEffect(() => {
        // Handle drag start event
        const handleDragStart = (e) => {
            // Note: We cannot access dataTransfer data during dragstart
            // We'll just set the state to indicate we're dragging a creature
            // The actual creature ID will be determined during drop
            setIsDraggingCreature(true);
        };

        // Handle drag end event
        const handleDragEnd = () => {
            setIsDraggingCreature(false);
            setDraggedCreatureId(null);
        };

        // Handle drop event
        const handleDrop = (e) => {
            e.preventDefault();

            try {
                // Try to get creature ID directly
                const creatureId = e.dataTransfer.getData('creature/id');

                if (creatureId) {
                    // Get the drop position
                    const gridRect = gridRef.current.getBoundingClientRect();
                    const x = e.clientX - gridRect.left;
                    const y = e.clientY - gridRect.top;

                    // Find the closest grid tile
                    const col = Math.floor(x / tileSize);
                    const row = Math.floor(y / tileSize);

                    // Calculate the center position of the tile
                    const centerX = (col * tileSize) + (tileSize / 2);
                    const centerY = (row * tileSize) + (tileSize / 2);

                    // Add the creature token to the grid
                    console.log('Document-level drop: Adding token with creatureId:', creatureId, 'at position:', { x: centerX, y: centerY });
                    addToken(creatureId, { x: centerX, y: centerY });

                    // Debug: Check if token was added
                    setTimeout(() => {
                        const currentTokens = useCreatureStore.getState().tokens;
                        console.log('Document-level drop: Current tokens after adding:', currentTokens);
                        const addedToken = currentTokens.find(token => token.creatureId === creatureId);
                        if (addedToken) {
                            console.log('Document-level drop: Successfully added token:', addedToken);
                        } else {
                            console.error('Document-level drop: Failed to add token. Token not found in tokens array.');
                        }
                    }, 100);
                } else {
                    // If no direct creature ID, check for JSON data
                    const dataText = e.dataTransfer.getData('text/plain');
                    if (dataText && dataText.trim() !== '') {
                        const data = JSON.parse(dataText);
                        if (data && data.type === 'creature' && data.id) {
                            // Get the drop position
                            const gridRect = gridRef.current.getBoundingClientRect();
                            const x = e.clientX - gridRect.left;
                            const y = e.clientY - gridRect.top;

                            // Find the closest grid tile
                            const col = Math.floor(x / tileSize);
                            const row = Math.floor(y / tileSize);

                            // Calculate the center position of the tile
                            const centerX = (col * tileSize) + (tileSize / 2);
                            const centerY = (row * tileSize) + (tileSize / 2);

                            // Add the creature token to the grid
                            console.log('Document-level JSON drop: Adding token with data.id:', data.id, 'at position:', { x: centerX, y: centerY });
                            addToken(data.id, { x: centerX, y: centerY });

                            // Debug: Check if token was added
                            setTimeout(() => {
                                const currentTokens = useCreatureStore.getState().tokens;
                                console.log('Document-level JSON drop: Current tokens after adding:', currentTokens);
                                const addedToken = currentTokens.find(token => token.creatureId === data.id);
                                if (addedToken) {
                                    console.log('Document-level JSON drop: Successfully added token:', addedToken);
                                } else {
                                    console.error('Document-level JSON drop: Failed to add token. Token not found in tokens array.');
                                }
                            }, 100);
                        }
                    }
                }
            } catch (error) {
                console.log('Error handling drop:', error);
            }

            setIsDraggingCreature(false);
            setDraggedCreatureId(null);
        };

        // Handle drag over event
        const handleDragOver = (e) => {
            if (isDraggingCreature) {
                e.preventDefault();
            }
        };

        // Add event listeners
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragend', handleDragEnd);
        document.addEventListener('drop', handleDrop);
        document.addEventListener('dragover', handleDragOver);

        return () => {
            // Remove event listeners
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('dragend', handleDragEnd);
            document.removeEventListener('drop', handleDrop);
            document.removeEventListener('dragover', handleDragOver);
        };
    }, [isDraggingCreature, addToken, tileSize]);

    // Handle removing a token
    const handleRemoveToken = (tokenId) => {
        removeToken(tokenId);
    };

    return (
        <div
            ref={gridRef}
            id="grid-overlay"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "auto", // Always enable pointer events
                overflow: "hidden",
                zIndex: 0
            }}
        >
            {grid.map((tile) => (
                <div
                    key={`${tile.x}-${tile.y}`}
                    className="grid-tile"
                    style={{
                        position: "absolute",
                        width: `${tileSize}px`,
                        height: `${tileSize}px`,
                        left: `${tile.x}px`,
                        top: `${tile.y}px`,
                        border: "1px solid rgba(64, 196, 255, 0.2)", // Increased opacity from 0.05 to 0.2
                        boxSizing: "border-box",
                        pointerEvents: "all" // Enable pointer events for grid tiles
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();

                        try {
                            // Try to get creature ID directly
                            const creatureId = e.dataTransfer.getData('creature/id');

                            if (creatureId) {
                                // Calculate the center position of the tile
                                const centerX = tile.x + (tileSize / 2);
                                const centerY = tile.y + (tileSize / 2);

                                // Add the creature token to the grid
                                console.log('Adding token with creatureId:', creatureId, 'at position:', { x: centerX, y: centerY });
                                addToken(creatureId, { x: centerX, y: centerY });

                                // Debug: Check if token was added
                                setTimeout(() => {
                                    const currentTokens = useCreatureStore.getState().tokens;
                                    console.log('Current tokens after adding:', currentTokens);
                                    const addedToken = currentTokens.find(token => token.creatureId === creatureId);
                                    if (addedToken) {
                                        console.log('Successfully added token:', addedToken);
                                    } else {
                                        console.error('Failed to add token. Token not found in tokens array.');
                                    }
                                }, 100);
                                return;
                            }

                            // If no direct creature ID, check for JSON data
                            const dataText = e.dataTransfer.getData('text/plain');
                            if (!dataText || dataText.trim() === '') {
                                console.log('No valid data in drop event');
                                return;
                            }

                            try {
                                const data = JSON.parse(dataText);
                                if (data && data.type === 'creature' && data.id) {
                                    // Calculate the center position of the tile
                                    const centerX = tile.x + (tileSize / 2);
                                    const centerY = tile.y + (tileSize / 2);

                                    // Add the creature token to the grid
                                    console.log('Adding token with data.id:', data.id, 'at position:', { x: centerX, y: centerY });
                                    addToken(data.id, { x: centerX, y: centerY });

                                    // Debug: Check if token was added
                                    setTimeout(() => {
                                        const currentTokens = useCreatureStore.getState().tokens;
                                        console.log('Current tokens after adding from JSON data:', currentTokens);
                                        const addedToken = currentTokens.find(token => token.creatureId === data.id);
                                        if (addedToken) {
                                            console.log('Successfully added token from JSON data:', addedToken);
                                        } else {
                                            console.error('Failed to add token from JSON data. Token not found in tokens array.');
                                        }
                                    }, 100);
                                }
                            } catch (jsonError) {
                                console.log('Error parsing JSON data:', jsonError);
                            }
                        } catch (error) {
                            console.log('Drop event did not contain valid creature data:', error);
                        }
                    }}
                />
            ))}

            {/* Render creature tokens */}
            {console.log('Grid rendering tokens:', tokens)}
            {tokens.length > 0 ? (
                tokens.map(token => {
                    console.log('Rendering token:', token);
                    return (
                        <CreatureToken
                            key={token.id}
                            tokenId={token.id}
                            position={token.position}
                            onRemove={handleRemoveToken}
                        />
                    );
                })
            ) : (
                <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', zIndex: 1000 }}>
                    No tokens on grid
                </div>
            )}

            {/* Add the TokenTester component for debugging */}
            <TokenTester />
        </div>
    );
}