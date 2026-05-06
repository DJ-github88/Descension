import React, { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import UnifiedContextMenu from './UnifiedContextMenu';
import ConnectionSelectorDialog from './ConnectionSelectorDialog';
import ConnectionRenameDialog from './ConnectionRenameDialog';
import ConfirmationDialog from '../item-generation/ConfirmationDialog';
import './styles/ConnectionContextMenu.css';

const ConnectionContextMenu = memo(({
    visible,
    x,
    y,
    connection,
    onClose,
    onRename,
    onToggleVisibility,
    onConnect,
    onDelete,
    onJump,
    maps,
    currentMapId,
    isGMMode
}) => {
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showConnectionDialog, setShowConnectionDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!visible) {
            setShowRenameDialog(false);
            setShowConnectionDialog(false);
            setShowDeleteConfirm(false);
        }
    }, [visible]);

    if (!visible || !connection) {
        return null;
    }

    const hasDestination = connection.properties?.destinationMapId;

    const menuItems = [
        {
            label: connection.properties?.portalName || 'Unnamed Connection',
            disabled: true,
            icon: <i className="fas fa-circle" style={{ fontSize: '8px' }}></i>,
            className: 'connection-menu-header-item'
        },
        { type: 'separator' },
        {
            label: 'Rename',
            icon: <i className="fas fa-pen"></i>,
            onClick: () => {
                setShowRenameDialog(true);
            }
        },
        {
            label: connection.properties?.isHidden ? 'Make Visible' : 'Hide from Players',
            icon: <i className={`fas ${connection.properties?.isHidden ? 'fa-eye' : 'fa-eye-slash'}`}></i>,
            onClick: () => {
                onToggleVisibility(connection);
                onClose();
            }
        },
        {
            label: 'Connect to...',
            icon: <i className="fas fa-link"></i>,
            onClick: () => {
                setShowConnectionDialog(true);
            }
        },
        {
            label: 'Jump to Destination',
            icon: <i className="fas fa-bolt"></i>,
            disabled: !hasDestination,
            onClick: () => {
                if (onJump) {
                    onJump(connection);
                }
                onClose();
            },
            tooltip: hasDestination ? 'Instantly travel to the linked portal' : 'No destination configured'
        },
        { type: 'separator' },
        {
            label: 'Remove Connection',
            icon: <i className="fas fa-trash-alt"></i>,
            onClick: () => {
                setShowDeleteConfirm(true);
            },
            danger: true
        }
    ];

    return (
        <>
            {visible && createPortal(
                <UnifiedContextMenu
                    visible={visible}
                    x={x}
                    y={y}
                    onClose={() => {
                        setShowRenameDialog(false);
                        setShowConnectionDialog(false);
                        setShowDeleteConfirm(false);
                        onClose();
                    }}
                    items={menuItems}
                    title="Connection"
                    className="connection-menu-container"
                />,
                document.body
            )}
            {showRenameDialog && (
                <ConnectionRenameDialog
                    isOpen={showRenameDialog}
                    onClose={() => setShowRenameDialog(false)}
                    connection={connection}
                    onSave={(newName) => {
                        onRename(connection, newName);
                        setShowRenameDialog(false);
                        onClose();
                    }}
                />
            )}
            {showConnectionDialog && (
                <ConnectionSelectorDialog
                    isOpen={showConnectionDialog}
                    onClose={() => setShowConnectionDialog(false)}
                    sourceConnection={connection}
                    maps={maps}
                    currentMapId={currentMapId}
                    onConnect={(targetConnection) => {
                        onConnect(connection, targetConnection);
                        setShowConnectionDialog(false);
                        onClose();
                    }}
                />
            )}
            {showDeleteConfirm && (
                <ConfirmationDialog
                    message={`Remove connection "${connection.properties?.portalName || 'Unnamed Connection'}"?`}
                    onConfirm={() => {
                        onDelete(connection);
                        setShowDeleteConfirm(false);
                        onClose();
                    }}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                    }}
                />
            )}
        </>
    );
}, (prevProps, nextProps) => {
    if (prevProps.visible !== nextProps.visible) return false;
    if (!nextProps.visible) return true;
    if (prevProps.connection?.id !== nextProps.connection?.id) return false;
    if (prevProps.x !== nextProps.x || prevProps.y !== nextProps.y) return false;
    return true;
});

ConnectionContextMenu.displayName = 'ConnectionContextMenu';

export default ConnectionContextMenu;
