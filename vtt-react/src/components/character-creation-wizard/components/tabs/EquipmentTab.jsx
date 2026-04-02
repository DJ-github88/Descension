/**
 * EquipmentTab - Displays starting equipment grid
 * 
 * Used by Race, Class, and Background selections
 */

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { getIconUrl } from '../../../../utils/assetManager';
import { STARTING_EQUIPMENT_LIBRARY } from '../../../../data/startingEquipmentData';
import ItemTooltip from '../../../item-generation/ItemTooltip';

const EquipmentTab = ({
    equipmentNames = [],
    currency = null,
    note = null
}) => {
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const tooltipRef = useRef(null);

    const getFullItemObjects = (itemNames) => {
        if (!itemNames || !Array.isArray(itemNames)) return [];
        return itemNames.filter(name => typeof name === 'string' && name.trim() !== '').map(itemName => {
            return STARTING_EQUIPMENT_LIBRARY.find(item =>
                item && item.name && (
                item.name.toLowerCase() === itemName.toLowerCase() ||
                item.name.toLowerCase().includes(itemName.toLowerCase().split(' ')[0])
            ));
        }).filter(item => item != null);
    };

    const fullItems = getFullItemObjects(equipmentNames);

    const handleItemMouseEnter = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            item: item,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const handleItemMouseMove = (e) => {
        if (tooltip.show) {
            setTooltip(prev => ({
                ...prev,
                x: e.clientX,
                y: e.clientY - 10
            }));
        }
    };

    const handleItemMouseLeave = () => {
        setTooltip({ show: false, item: null, x: 0, y: 0 });
    };

    const renderEquipmentGrid = () => {
        if (fullItems.length === 0) {
            return (
                <div className="no-data-message">
                    <i className="fas fa-shopping-bag"></i>
                    <p>No starting equipment available</p>
                </div>
            );
        }

        const COLS = 6;
        const occupiedCells = new Map();
        const gridRows = [];
        const itemWrappers = [];
        let totalRows = 0;
        const cellSize = 40;
        const cellGap = 1;
        const rowGap = 2;
        const gridPadding = 8;

        fullItems.forEach((item, index) => {
            if (!item) return;
            const width = item.width || 1;
            const height = item.height || 1;
            let placed = false;
            let maxRowToCheck = Math.max(6, totalRows + height + 2);

            for (let row = 0; row < maxRowToCheck && !placed; row++) {
                for (let col = 0; col < COLS && !placed; col++) {
                    let canPlace = true;
                    for (let dy = 0; dy < height && canPlace; dy++) {
                        for (let dx = 0; dx < width && canPlace; dx++) {
                            if (col + dx >= COLS || occupiedCells.has(`${row + dy},${col + dx}`)) {
                                canPlace = false;
                            }
                        }
                    }

                    if (canPlace) {
                        for (let dy = 0; dy < height; dy++) {
                            for (let dx = 0; dx < width; dx++) {
                                occupiedCells.set(`${row + dy},${col + dx}`, true);
                            }
                        }

                        const itemLeft = gridPadding + col * (cellSize + cellGap);
                        const itemTop = gridPadding + row * (cellSize + rowGap);
                        const itemWidth = width * cellSize + (width - 1) * cellGap;
                        const itemHeight = height * cellSize + (height - 1) * rowGap;

                        if (!gridRows[row]) gridRows[row] = [];
                        gridRows[row][col] = true;

                        itemWrappers.push(
                            <div
                                key={`item-${index}`}
                                className="equipment-preview-item-wrapper"
                                style={{
                                    width: `${itemWidth}px`,
                                    height: `${itemHeight}px`,
                                    left: `${itemLeft}px`,
                                    top: `${itemTop}px`
                                }}
                                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                onMouseMove={handleItemMouseMove}
                                onMouseLeave={handleItemMouseLeave}
                            >
                                <div
                                    className="equipment-item-icon"
                                    style={{
                                        backgroundImage: `url(${getIconUrl(item.iconId, 'items')})`,
                                        backgroundColor: 'transparent',
                                        width: '100%',
                                        height: '100%',
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0
                                    }}
                                    title={item.name}
                                />
                            </div>
                        );
                        placed = true;
                        totalRows = Math.max(totalRows, row + height);
                    }
                }
            }
        });

        const minRows = Math.max(2, totalRows + 1);
        while (gridRows.length < minRows) {
            gridRows.push(new Array(COLS).fill(null));
        }

        const gridHeight = (gridPadding * 2) + (gridRows.length * cellSize) + ((gridRows.length - 1) * rowGap);

        return (
            <>
                <div 
                    className="equipment-preview-grid" 
                    style={{ minHeight: `${gridHeight}px` }}
                >
                    {gridRows.map((rowCells, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="equipment-preview-row">
                            {Array.from({ length: COLS }, (_, colIndex) => {
                                const isOccupied = occupiedCells.has(`${rowIndex},${colIndex}`);
                                return (
                                    <div 
                                        key={`cell-${rowIndex}-${colIndex}`} 
                                        className={`equipment-preview-cell ${isOccupied ? 'occupied' : 'empty'}`}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                    {itemWrappers}
                </div>
            </>
        );
    };

    return (
        <div className="selection-tab equipment-tab">
            <h5 className="section-title">
                <i className="fas fa-shopping-bag"></i> Starting Equipment Pool
            </h5>
            
            {renderEquipmentGrid()}

            {currency && (
                <div className="equipment-currency-info">
                    <i className="fas fa-coins"></i>
                    <span className="currency-label">Starting Currency:</span>
                    <span className="currency-amount">{currency}</span>
                </div>
            )}

            <div className="equipment-pool-note">
                <div className="note-content">
                    <i className="fas fa-info-circle"></i>
                    <span>{note || 'These items are added to your starting equipment pool. You can purchase additional items in Step 10.'}</span>
                </div>
            </div>

            {tooltip.show && tooltip.item && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        zIndex: 10001,
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <ItemTooltip item={tooltip.item} />
                </div>,
                document.body
            )}
        </div>
    );
};

export default EquipmentTab;
