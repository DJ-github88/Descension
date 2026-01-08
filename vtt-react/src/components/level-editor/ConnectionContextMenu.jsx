import React, { useState, useEffect, memo } from 'react';
import UnifiedContextMenu from './UnifiedContextMenu';
import ConnectionSelectorDialog from './ConnectionSelectorDialog';
import ConnectionRenameDialog from './ConnectionRenameDialog';
import ConfirmationDialog from '../item-generation/ConfirmationDialog';

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
    maps,
    currentMapId,
    isGMMode
}) => {
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showConnectionDialog, setShowConnectionDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Close all dialogs when context menu closes
    useEffect(() => {
        if (!visible) {
            setShowRenameDialog(false);
            setShowConnectionDialog(false);
            setShowDeleteConfirm(false);
        }
    }, [visible]);

    // PERFORMANCE: Early return if not visible - prevents unnecessary renders during drag
    if (!visible || !connection) {
        return null;
    }

    const menuItems = [
        {
            label: connection.properties?.portalName || 'Unnamed Connection',
            disabled: true,
            icon: '◉' // Connection symbol
        },
        { type: 'separator' },
        {
            label: 'Rename',
            icon: '✏',
            onClick: () => {
                setShowRenameDialog(true);
            }
        },
        {
            label: connection.properties?.isHidden ? 'Show' : 'Hide',
            icon: connection.properties?.isHidden ? '👁' : '👁‍🗨',
            onClick: () => {
                onToggleVisibility(connection);
                onClose();
            }
        },
        {
            label: 'Connect to...',
            icon: '🔗',
            onClick: () => {
                setShowConnectionDialog(true);
            }
        },
        { type: 'separator' },
        {
            label: 'Delete',
            icon: '🗑',
            onClick: () => {
                setShowDeleteConfirm(true);
            },
            danger: true
        }
    ];

    return (
        <>
            <UnifiedContextMenu
                visible={visible}
                x={x}
                y={y}
                onClose={() => {
                    // Close all dialogs when context menu closes
                    setShowRenameDialog(false);
                    setShowConnectionDialog(false);
                    setShowDeleteConfirm(false);
                    onClose();
                }}
                items={menuItems}
                title="Connection"
            />
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
                    message={`Are you sure you want to delete the connection "${connection.properties?.portalName || 'Unnamed Connection'}"? This action cannot be undone.`}
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
    // PERFORMANCE: Custom comparison to prevent re-renders during drag
    // Only re-render if visible state changes or connection changes
    if (prevProps.visible !== nextProps.visible) return false;
    if (!nextProps.visible) return true; // Don't re-render if not visible
    if (prevProps.connection?.id !== nextProps.connection?.id) return false;
    if (prevProps.x !== nextProps.x || prevProps.y !== nextProps.y) return false;
    // All other props can change without causing re-render when visible
    return true; // Skip re-render
});

ConnectionContextMenu.displayName = 'ConnectionContextMenu';

export default ConnectionContextMenu;

