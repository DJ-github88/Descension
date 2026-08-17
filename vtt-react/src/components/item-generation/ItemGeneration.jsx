import React, { useState, useEffect, useRef } from 'react';
import useItemStore from '../../store/itemStore';
import useInventoryStore from '../../store/inventoryStore';
import ItemWizard from './ItemWizard';
import ContainerWizard from './ContainerWizard';
import ManualCoinGenerationModal from './ManualCoinGenerationModal';
import { createCustomShape } from '../../utils/itemShapeUtils';


// Base grid size - will be adjusted based on available space
const BASE_GRID_SIZE = {
    ROWS: 4,
    COLS: 6
};

export default function ItemGeneration({ onContainerCreate, onItemCreated }) {
    const {
        selectedTiles,
        addSelectedTile,
        removeSelectedTile,
        clearSelectedTiles,
        generateItem,
        previewItem,
        setPreviewItem,
        addItem
    } = useItemStore();

    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
    const [isContainerModalOpen, setIsContainerModalOpen] = useState(false);
    const [gridSize, setGridSize] = useState(null);
    const containerRef = useRef(null);
    const controlsRef = useRef(null);

    // Calculate optimal grid size based on controls width and fixed 5 rows
    useEffect(() => {
        const calculateGridSize = () => {
            if (!containerRef.current || !controlsRef.current) return;

            const controls = controlsRef.current;
            const controlsRect = controls.getBoundingClientRect();

            // Only calculate if we have valid dimensions
            if (controlsRect.width === 0) {
                setTimeout(calculateGridSize, 100);
                return;
            }

            // Get the actual tile size from CSS custom property
            const container = containerRef.current;
            const computedStyle = getComputedStyle(container);
            const tileSize = parseInt(computedStyle.getPropertyValue('--tile-size')) || 65;
            const tileGap = parseInt(computedStyle.getPropertyValue('--tile-gap')) || 4;

            // Keep a clean, compact canvas: 8 columns × 6 rows (ideal for all TTRPG item shapes)
            const rows = 6;
            const cols = Math.min(Math.max(maxCols, 6), 8);

            // Only update if grid size actually changed
            setGridSize(prev => {
                if (prev && prev.ROWS === rows && prev.COLS === cols) return prev;
                return { ROWS: rows, COLS: cols };
            });
        };

        // Use ResizeObserver for better detection of size changes
        let resizeObserver;
        if (controlsRef.current) {
            resizeObserver = new ResizeObserver(() => {
                setTimeout(calculateGridSize, 50);
            });
            resizeObserver.observe(controlsRef.current);
        }

        // Initial calculation with multiple attempts to ensure it runs
        const timeoutId1 = setTimeout(calculateGridSize, 100);
        const timeoutId2 = setTimeout(calculateGridSize, 300);
        const timeoutId3 = setTimeout(calculateGridSize, 500);

        // Also listen for window resize as fallback
        const handleResize = () => {
            setTimeout(calculateGridSize, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, []);

    const handleMouseDown = (row, col) => {
        const tileKey = `${row}-${col}`;

        if (editMode) {
            if (selectedTiles.includes(tileKey)) {
                const { shape, dimensions } = createShapeFromSelectedTiles();
                console.log('Creating item with shape:', shape);
                console.log('Shape type:', shape?.type);
                console.log('Shape cells:', shape?.cells);
                setEditingItem({
                    name: 'New Item',
                    quality: 'common',
                    stats: {},
                    description: '',
                    // Set width and height for backward compatibility
                    width: dimensions.width,
                    height: dimensions.height,
                    // Set shape data for custom shapes
                    shape: shape
                });
            }
            return;
        }

        if (drawMode) {
            setIsDrawing(true);
            addSelectedTile(tileKey);
        }
    };

    const handleMouseEnter = (row, col) => {
        if (!isDrawing || !drawMode) return;
        const tileKey = `${row}-${col}`;
        addSelectedTile(tileKey);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const createShapeFromSelectedTiles = () => {
        if (selectedTiles.length === 0) return null;

        const positions = selectedTiles.map(tile => {
            const [r, c] = tile.split('-').map(Number);
            return { row: r, col: c };
        });

        const minCol = Math.min(...positions.map(p => p.col));
        const maxCol = Math.max(...positions.map(p => p.col));
        const minRow = Math.min(...positions.map(p => p.row));
        const maxRow = Math.max(...positions.map(p => p.row));

        const width = maxCol - minCol + 1;
        const height = maxRow - minRow + 1;

        // Create 2D array for the shape
        const cells = Array(height).fill(null).map(() => Array(width).fill(false));

        // Mark occupied cells
        positions.forEach(pos => {
            const relativeRow = pos.row - minRow;
            const relativeCol = pos.col - minCol;
            cells[relativeRow][relativeCol] = true;
        });

        return {
            shape: createCustomShape(cells),
            dimensions: { width, height }
        };
    };

    const handleEditClick = () => {
        if (selectedTiles.length > 0) {
            setEditMode(true);
            setDrawMode(false);
        }
    };

    const handleSaveItem = (item) => {
        if (item) {
            console.log('Saving item with shape data:', {
                width: item.width,
                height: item.height,
                shape: item.shape,
                shapeType: item.shape?.type,
                shapeCells: item.shape?.cells
            });

            setPreviewItem(item);
            generateItem(item);
            useInventoryStore.getState().addItemFromLibrary(item, { quantity: 1 });
            if (onItemCreated) onItemCreated(item);
        }
        setEditingItem(null);
        setEditMode(false);
        clearSelectedTiles();
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditMode(false);
    };

    const renderGrid = () => {
        if (!gridSize) return null;
        const grid = [];
        for (let row = 0; row < gridSize.ROWS; row++) {
            const gridRow = [];
            for (let col = 0; col < gridSize.COLS; col++) {
                const tileKey = `${row}-${col}`;
                const isSelected = selectedTiles.includes(tileKey);

                gridRow.push(
                    <div
                        key={tileKey}
                        className={`preview-tile ${isSelected ? 'selected' : ''}`}
                        onMouseDown={() => handleMouseDown(row, col)}
                        onMouseEnter={() => handleMouseEnter(row, col)}
                        data-position={tileKey}
                    />
                );
            }
            grid.push(
                <div key={row} className="preview-row">
                    {gridRow}
                </div>
            );
        }
        return grid;
    };

    return (
        <div
            ref={containerRef}
            className="item-generation"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="designer-header-bar" ref={controlsRef}>
                <div className="designer-title-group">
                    <h2 className="designer-title">Item Designer</h2>
                    <span className="grid-info-badge">
                        Grid: {gridSize ? `${gridSize.COLS} × ${gridSize.ROWS}` : '...'}
                    </span>
                </div>

                <div className="controls">
                    <button
                        className={`tool-button ${drawMode ? 'active' : ''}`}
                        onClick={() => {
                            setDrawMode(!drawMode);
                            setEditMode(false);
                        }}
                        disabled={editMode}
                    >
                        Draw
                    </button>
                    <button
                        className={`tool-button ${editMode ? 'active' : ''}`}
                        onClick={handleEditClick}
                        disabled={selectedTiles.length === 0}
                    >
                        Edit
                    </button>
                    <button
                        className="tool-button"
                        onClick={() => {
                            clearSelectedTiles();
                            setEditMode(false);
                            setDrawMode(false);
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className="tool-button"
                        onClick={() => {
                            if (onContainerCreate) {
                                onContainerCreate();
                            } else {
                                setIsContainerModalOpen(true);
                            }
                        }}
                    >
                        Create Container
                    </button>
                    <button
                        className="tool-button"
                        onClick={() => setIsCoinModalOpen(true)}
                    >
                        Add Coins
                    </button>
                </div>
            </div>

            {gridSize && (
            <div className="preview-grid">
                {selectedTiles.length === 0 && !drawMode && !editMode && (
                    <div className="grid-instructions">
                        <span>Click "Draw" and drag to create item shapes</span>
                    </div>
                )}
                {renderGrid()}
            </div>
            )}

            {isCoinModalOpen && (
                <ManualCoinGenerationModal
                    onClose={() => setIsCoinModalOpen(false)}
                    onComplete={(coinItem) => {
                        setPreviewItem(coinItem);
                        generateItem(coinItem);
                        useInventoryStore.getState().addItemFromLibrary(coinItem, { quantity: coinItem.quantity || 1 });
                        if (onItemCreated) onItemCreated(coinItem);
                        setIsCoinModalOpen(false);
                    }}
                />
            )}

            {isContainerModalOpen && (
                <ContainerWizard
                    onCancel={() => setIsContainerModalOpen(false)}
                    onComplete={(containerItem) => {
                        generateItem(containerItem);
                        useInventoryStore.getState().addItemFromLibrary(containerItem, { quantity: 1 });
                        if (onItemCreated) onItemCreated(containerItem);
                        setIsContainerModalOpen(false);
                    }}
                />
            )}

            {editingItem && (
                <ItemWizard
                    initialData={editingItem}
                    onComplete={handleSaveItem}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
}
