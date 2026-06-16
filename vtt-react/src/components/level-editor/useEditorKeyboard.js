import { useEffect } from 'react';
import { getFirstTool } from './editorTools';

/**
 * Custom hook for editor keyboard shortcuts.
 * Extracted from ProfessionalVTTEditor for maintainability.
 */
export const useEditorKeyboard = ({
    isOpen,
    handleTabChange,
    handleToolSelect,
    selectedDrawings,
    clearDrawingSelection,
    isObjectLocked,
    selectedWallKey,
    selectedWindow,
    setSelectedWallKey,
    setSelectedWindowKey,
    setSelectedWindow,
    setIsObjectLocked,
    onClearDragRefs,
    selectedTool,
    removeWindowOverlay,
    removeWall,
    removeDrawingPath,
    getExplicitCurrentMapId,
    setIsOpen,
    setEditorMode,
    undo,
    redo
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Undo / Redo
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) { redo(); } else { undo(); }
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'escape':
                    e.preventDefault();
                    if (isObjectLocked || selectedWallKey || selectedWindow) {
                        setSelectedWallKey(null);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(false);
                        onClearDragRefs();
                    } else {
                        setIsOpen(false);
                        setEditorMode(false);
                    }
                    break;
                case '1':
                    e.preventDefault();
                    handleTabChange('terrain');
                    break;
                case '2':
                    e.preventDefault();
                    handleTabChange('drawing');
                    break;
                case '3':
                    e.preventDefault();
                    handleTabChange('walls');
                    break;
                case '4':
                    e.preventDefault();
                    handleTabChange('fog');
                    break;
                case '5':
                    e.preventDefault();
                    handleTabChange('objects');
                    break;
                case '6':
                    e.preventDefault();
                    handleTabChange('grid');
                    break;
                case '7':
                    e.preventDefault();
                    handleTabChange('lighting');
                    break;
                case 'v':
                    e.preventDefault();
                    handleToolSelect('select');
                    break;
                case 'delete':
                case 'backspace':
                    e.preventDefault();
                    if (selectedTool === 'wall_select' && isObjectLocked) {
                        if (selectedWindow) {
                            removeWindowOverlay(selectedWindow.gridX, selectedWindow.gridY, getExplicitCurrentMapId());
                            setSelectedWindow(null);
                            setSelectedWindowKey(null);
                        } else if (selectedWallKey) {
                            const [x1, y1, x2, y2] = selectedWallKey.split(',').map(Number);
                            removeWall(x1, y1, x2, y2, getExplicitCurrentMapId());
                            setSelectedWallKey(null);
                        }
                        setIsObjectLocked(false);
                        onClearDragRefs();
                    } else if (selectedDrawings.length > 0) {
                        selectedDrawings.forEach(id => removeDrawingPath(id));
                        clearDrawingSelection();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        isOpen, selectedDrawings, clearDrawingSelection, handleTabChange, handleToolSelect,
        isObjectLocked, selectedWallKey, selectedWindow, setSelectedWallKey, setSelectedWindowKey,
        setSelectedWindow, setIsObjectLocked, onClearDragRefs,
        selectedTool, removeWindowOverlay, removeWall, removeDrawingPath, undo, redo,
        getExplicitCurrentMapId, setIsOpen, setEditorMode
    ]);
};
