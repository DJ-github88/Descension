import React from 'react';
import useInventoryStore from '../../store/inventoryStore';
import '../../styles/inventory.css';

const GRID_SIZE = {
    WIDTH: 15,
    HEIGHT: 5,
    NORMAL_SECTION: 5,
    ENCUMBERED_SECTION: 5,
    OVERENCUMBERED_SECTION: 5
};

export default function InventoryWindow() {
    const { currency, items, encumbranceState, updateCurrency } = useInventoryStore();

    const renderGrid = () => {
        const grid = [];
        for (let row = 0; row < GRID_SIZE.HEIGHT; row++) {
            const gridRow = [];
            for (let col = 0; col < GRID_SIZE.WIDTH; col++) {
                let cellType = 'normal';
                if (col >= GRID_SIZE.NORMAL_SECTION) {
                    cellType = 'encumbered';
                }
                if (col >= GRID_SIZE.NORMAL_SECTION + GRID_SIZE.ENCUMBERED_SECTION) {
                    cellType = 'overencumbered';
                }
                
                const item = items.find(item => 
                    item.position.row === row && 
                    item.position.col === col
                );

                gridRow.push(
                    <div 
                        key={`${row}-${col}`} 
                        className={`inventory-cell ${cellType} ${item ? 'occupied' : ''}`}
                        data-row={row}
                        data-col={col}
                    >
                        {item && (
                            <div className="inventory-item">
                                {/* Replace with actual item rendering */}
                                {item.name}
                            </div>
                        )}
                    </div>
                );
            }
            grid.push(
                <div key={row} className="inventory-row">
                    {gridRow}
                </div>
            );
        }
        return grid;
    };

    return (
        <div className="wow-window-content">
            <div className="inventory-container">
                <div className="currency-section">
                    <div className="currency">
                        <span className="coin gold"></span>
                        <input
                            type="number"
                            value={currency.gold}
                            onChange={(e) => updateCurrency({ gold: parseInt(e.target.value) || 0 })}
                            className="currency-input"
                        />
                    </div>
                    <div className="currency">
                        <span className="coin silver"></span>
                        <input
                            type="number"
                            value={currency.silver}
                            onChange={(e) => updateCurrency({ silver: parseInt(e.target.value) || 0 })}
                            className="currency-input"
                        />
                    </div>
                    <div className="currency">
                        <span className="coin copper"></span>
                        <input
                            type="number"
                            value={currency.copper}
                            onChange={(e) => updateCurrency({ copper: parseInt(e.target.value) || 0 })}
                            className="currency-input"
                        />
                    </div>
                </div>

                <div className="inventory-grid">
                    {renderGrid()}
                </div>

                <div className={`encumbrance-indicator ${encumbranceState}`}>
                    {encumbranceState.charAt(0).toUpperCase() + encumbranceState.slice(1)}
                </div>
            </div>
        </div>
    );
}
