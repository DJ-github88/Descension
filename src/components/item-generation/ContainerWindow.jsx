import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import useItemStore from '../../store/itemStore';
import LockSettingsModal from './LockSettingsModal';
import '../../styles/container-window.css';

const ContainerWindow = ({ container, onClose }) => {
    const [position, setPosition] = useState(() => ({
        x: Math.max(0, window.innerWidth / 4),
        y: Math.max(0, window.innerHeight / 4)
    }));
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showLockSettings, setShowLockSettings] = useState(false);
    const updateItem = useItemStore(state => state.updateItem);
    const containerRef = useRef(null);

    const defaultContainerProperties = {
        gridSize: { rows: 4, cols: 6 },
        items: [],
        isLocked: false,
        lockType: 'none',
        lockDC: 0,
        lockCode: '',
        flavorText: '',
        maxAttempts: 3,
        failureAction: 'none',
        failureActionDetails: {
            removeItems: false,
            removePercentage: 50,
            destroyContainer: false,
            triggerTrap: false,
            trapDetails: '',
            transformIntoCreature: false,
            creatureType: ''
        }
    };

    // Ensure container properties are initialized
    useEffect(() => {
        if (!container.containerProperties) {
            updateItem(container.id, {
                containerProperties: { ...defaultContainerProperties }
            });
        }
    }, [container.id, container.containerProperties, updateItem]);

    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showContextMenu && !e.target.closest('.context-menu')) {
                setShowContextMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showContextMenu]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        // Only show context menu if clicking on the header
        if (e.target.closest('.container-window-header')) {
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    const handleLockSettingsSave = (settings) => {
        // Get existing container properties or initialize with defaults
        const existingProps = container.containerProperties || { ...defaultContainerProperties };

        // Create updated container properties
        const updatedProps = {
            ...existingProps,
            isLocked: settings.isLocked,
            lockType: settings.isLocked ? settings.lockType : 'none',
            lockDC: settings.isLocked && settings.lockType === 'thievery' ? settings.lockDC : 0,
            lockCode: settings.isLocked && (settings.lockType === 'code' || settings.lockType === 'numeric') ? settings.lockCode : '',
            flavorText: settings.isLocked ? settings.flavorText : '',
            maxAttempts: settings.isLocked ? settings.maxAttempts : 3,
            failureAction: settings.isLocked ? settings.failureAction : 'none',
            failureActionDetails: settings.isLocked ? settings.failureActionDetails : {
                removeItems: false,
                removePercentage: 50,
                destroyContainer: false,
                triggerTrap: false,
                trapDetails: '',
                transformIntoCreature: false,
                creatureType: ''
            }
        };

        // Update the container
        updateItem(container.id, {
            containerProperties: updatedProps
        });

        setShowLockSettings(false);
    };

    // Create grid cells based on container properties
    const renderGrid = () => {
        const containerProps = container.containerProperties || { gridSize: { rows: 4, cols: 6 } };
        const rows = containerProps.gridSize.rows;
        const cols = containerProps.gridSize.cols;
        const grid = [];

        for (let row = 0; row < rows; row++) {
            const gridRow = [];
            for (let col = 0; col < cols; col++) {
                gridRow.push(
                    <div
                        key={`${row}-${col}`}
                        className="container-cell"
                        data-row={row}
                        data-col={col}
                    />
                );
            }
            grid.push(
                <div key={row} className="container-row">
                    {gridRow}
                </div>
            );
        }

        return grid;
    };

    // If container properties are not initialized yet, show loading or return null
    if (!container.containerProperties) {
        return null;
    }

    return (
        <>
            <Draggable
                handle=".container-window-header"
                defaultPosition={position}
                bounds={null}
                positionOffset={null}
            >
                <div 
                    className="container-window" 
                    ref={containerRef}
                    onContextMenu={handleContextMenu}
                >
                    <div className="container-window-header">
                        <div className="container-title">
                            <img 
                                src={`https://wow.zamimg.com/images/wow/icons/large/${container.iconId}.jpg`}
                                alt={container.name}
                                className="container-icon"
                            />
                            <span>{container.name}</span>
                            {container.containerProperties.isLocked && (
                                <i className="fas fa-lock" style={{ color: '#ffaa00' }}></i>
                            )}
                        </div>
                        <button className="close-button" onClick={onClose}>×</button>
                    </div>
                    <div className="container-window-content">
                        <div className="container-grid">
                            {renderGrid()}
                        </div>
                    </div>
                </div>
            </Draggable>

            {showContextMenu && (
                <div 
                    className="context-menu"
                    style={{
                        position: 'fixed',
                        top: contextMenuPos.y,
                        left: contextMenuPos.x,
                        zIndex: 1002
                    }}
                >
                    <div 
                        className="context-menu-item"
                        onClick={() => {
                            setShowContextMenu(false);
                            setShowLockSettings(true);
                        }}
                    >
                        <i className="fas fa-lock"></i>
                        <span>Lock Settings</span>
                    </div>
                </div>
            )}

            {showLockSettings && (
                <LockSettingsModal
                    container={container}
                    onSave={handleLockSettingsSave}
                    onClose={() => setShowLockSettings(false)}
                />
            )}
        </>
    );
};

export default ContainerWindow;
