import React, { useState, useEffect, useRef } from 'react';
import useItemStore from '../../store/itemStore';
import ItemWizard from './ItemWizard';
import ManualCoinGenerationModal from './ManualCoinGenerationModal';
import { createCustomShape } from '../../utils/itemShapeUtils';
import '../../styles/item-generation.css';

// Base grid size - will be adjusted based on available space
const BASE_GRID_SIZE = {
    ROWS: 6,
    COLS: 10
};

export default function ItemGeneration({ onContainerCreate }) {
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
    const [gridSize, setGridSize] = useState(BASE_GRID_SIZE);
    const containerRef = useRef(null);

    // Calculate optimal grid size based on available space
    useEffect(() => {
        const calculateGridSize = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();

            // Only calculate if we have valid dimensions
            if (containerRect.width === 0 || containerRect.height === 0) {
                setTimeout(calculateGridSize, 100);
                return;
            }

            // Get the actual tile size from CSS custom property
            const computedStyle = getComputedStyle(container);
            const tileSize = parseInt(computedStyle.getPropertyValue('--tile-size')) || 32;
            const tileGap = parseInt(computedStyle.getPropertyValue('--tile-gap')) || 2;

            // Account for container padding and grid padding
            const containerPadding = 32; // item-generation padding
            const gridPadding = 32; // preview-grid padding
            const headerHeight = 120; // header + controls height
            const bottomMargin = 20; // safety margin

            const availableWidth = containerRect.width - containerPadding - gridPadding;
            const availableHeight = containerRect.height - headerHeight - gridPadding - bottomMargin;

            // Calculate how many complete tiles can fit
            const tileWithGap = tileSize + tileGap;
            const maxCols = Math.floor((availableWidth + tileGap) / tileWithGap);
            const maxRows = Math.floor((availableHeight + tileGap) / tileWithGap);

            // Ensure minimum usable grid size
            const cols = Math.max(maxCols, 6); // Minimum 6 columns
            const rows = Math.max(maxRows, 4); // Minimum 4 rows

            console.log('Grid calculation:', {
                containerSize: { width: containerRect.width, height: containerRect.height },
                tileSize,
                tileGap,
                availableSpace: { width: availableWidth, height: availableHeight },
                calculatedGrid: { cols, rows }
            });

            // Only update if different to avoid constant recalculation
            if (gridSize.COLS !== cols || gridSize.ROWS !== rows) {
                setGridSize({ ROWS: rows, COLS: cols });
            }
        };

        // Use ResizeObserver for better detection of size changes
        let resizeObserver;
        if (containerRef.current) {
            resizeObserver = new ResizeObserver(() => {
                setTimeout(calculateGridSize, 100);
            });
            resizeObserver.observe(containerRef.current);
        }

        // Initial calculation
        const timeoutId = setTimeout(calculateGridSize, 300);

        // Also listen for window resize as fallback
        const handleResize = () => {
            setTimeout(calculateGridSize, 200);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
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
            <div className="designer-header">
                <h2>Item Designer</h2>
                <p>Draw shapes to create custom items, then edit their properties</p>
                <div className="grid-info">
                    Grid: {gridSize.COLS} × {gridSize.ROWS}
                </div>
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
                    onClick={onContainerCreate}
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

            <div className="preview-grid">
                {selectedTiles.length === 0 && !drawMode && !editMode && (
                    <div className="grid-instructions">
                        <span>Click "Draw" and drag to create item shapes</span>
                    </div>
                )}
                {renderGrid()}
            </div>

            {isCoinModalOpen && (
                <ManualCoinGenerationModal
                    onClose={() => setIsCoinModalOpen(false)}
                    onComplete={(coinItem) => {
                        setPreviewItem(coinItem);
                        generateItem(coinItem);
                        setIsCoinModalOpen(false);
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
