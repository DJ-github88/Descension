import React, { useState } from 'react';
import useItemStore from '../../store/itemStore';
import ItemWizard from './ItemWizard';
import ManualCoinGenerationModal from './ManualCoinGenerationModal';
import '../../styles/item-generation.css';

const GRID_SIZE = {
    ROWS: 5,
    COLS: 15
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

    const handleMouseDown = (row, col) => {
        const tileKey = `${row}-${col}`;

        if (editMode) {
            if (selectedTiles.includes(tileKey)) {
                const dimensions = calculateDimensions();
                setEditingItem({
                    name: 'New Item',
                    quality: 'common',
                    stats: {},
                    description: '',
                    // Set width and height directly from dimensions
                    width: dimensions.width,
                    height: dimensions.height
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

    const calculateDimensions = () => {
        const positions = selectedTiles.map(tile => {
            const [r, c] = tile.split('-').map(Number);
            return { row: r, col: c };
        });

        const minCol = Math.min(...positions.map(p => p.col));
        const maxCol = Math.max(...positions.map(p => p.col));
        const minRow = Math.min(...positions.map(p => p.row));
        const maxRow = Math.max(...positions.map(p => p.row));

        return {
            width: maxCol - minCol + 1,
            height: maxRow - minRow + 1
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
            // Ensure dimensions are preserved
            const dimensions = calculateDimensions();
            const itemWithDimensions = {
                ...item,
                width: item.width || dimensions.width,
                height: item.height || dimensions.height
            };

            console.log('Saving item with dimensions:', {
                width: itemWithDimensions.width,
                height: itemWithDimensions.height
            });

            setPreviewItem(itemWithDimensions);
            generateItem(itemWithDimensions);
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
        for (let row = 0; row < GRID_SIZE.ROWS; row++) {
            const gridRow = [];
            for (let col = 0; col < GRID_SIZE.COLS; col++) {
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
            className="item-generation"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
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
