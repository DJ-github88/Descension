import { useEffect } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';

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
            if (!isOpen || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

            // If focus is inside another window (Character Sheet, Inventory, Codex, etc.) or modal,
            // do not intercept hotkeys or close the editor.
            const inOtherWindow = e.target && typeof e.target.closest === 'function' &&
                Boolean(e.target.closest('.mythrill-window:not(.level-editor-window), .modal-content, .custom-dialog, .dialog-container, .inventory-container'));

            if (inOtherWindow) return;

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
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7': {
                    // Only intercept 1-7 to change editor tabs if Alt is held OR focus is within the level editor UI.
                    // Otherwise, allow raw number keys to activate Action Bar slots and game hotkeys.
                    const isEditorFocused = e.target && typeof e.target.closest === 'function' &&
                        Boolean(e.target.closest('.professional-vtt-editor, .level-editor-window, .vtt-tool-palette, .vtt-editor-content'));
                    if (e.altKey || isEditorFocused) {
                        e.preventDefault();
                        const tabMap = {
                            '1': 'terrain',
                            '2': 'drawing',
                            '3': 'walls',
                            '4': 'fog',
                            '5': 'objects',
                            '6': 'grid',
                            '7': 'lighting'
                        };
                        handleTabChange(tabMap[e.key]);
                    }
                    break;
                }
                case 'v':
                    e.preventDefault();
                    handleToolSelect('select');
                    break;
                case 'l': {
                    // L = freeze/unfreeze the selected object, Shift+L = every object.
                    e.preventDefault();
                    const editorState = useLevelEditorStore.getState();
                    const selectedEnvObj = (editorState.environmentalObjects || []).find(o => o.selected);
                    if (e.shiftKey) {
                        editorState.setAllEnvironmentalObjectsLocked(
                            !(editorState.environmentalObjects || []).every(o => o.locked),
                            getExplicitCurrentMapId()
                        );
                    } else if (selectedEnvObj) {
                        editorState.setEnvironmentalObjectLocked(
                            selectedEnvObj.id,
                            !selectedEnvObj.locked,
                            getExplicitCurrentMapId()
                        );
                    }
                    break;
                }
                case 'delete':
                case 'backspace':
                    e.preventDefault();
                    // First check if any environmental objects are selected
                    {
                        const editorState = useLevelEditorStore.getState();
                        const selectedEnvObjs = (editorState.environmentalObjects || []).filter(o => o.selected);
                        if (selectedEnvObjs.length > 0) {
                            selectedEnvObjs.forEach(o => editorState.removeEnvironmentalObject(o.id, getExplicitCurrentMapId()));
                            return;
                        }
                    }
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
                default:
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
