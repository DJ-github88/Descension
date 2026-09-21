import React from 'react';
import { EDITOR_TABS } from './editorTools';

const EditorStatusBar = ({
    activeTab,
    selectedTool,
    drawingLayers,
    hasUnsavedChanges,
    onUndo,
    onRedo
}) => {
    const tabName = EDITOR_TABS[activeTab]?.name || activeTab;
    const toolName = EDITOR_TABS[activeTab]?.tools.find(t => t.id === selectedTool)?.name || selectedTool;

    return (
        <>
            <div className="vtt-status-bar">
                <span className="vtt-status-item">
                    <strong>Tool:</strong> {tabName} / {toolName}
                </span>
                <span className="vtt-status-item">
                    <strong>Layers:</strong> {drawingLayers.length}
                </span>
                <div className="vtt-status-actions">
                    <button className="vtt-status-btn" onClick={onUndo} title="Undo (Ctrl+Z)">
                        <i className="fas fa-undo"></i>
                    </button>
                    <button className="vtt-status-btn" onClick={onRedo} title="Redo (Ctrl+Shift+Z)">
                        <i className="fas fa-redo"></i>
                    </button>
                </div>
                {hasUnsavedChanges && (
                    <span className="vtt-status-item vtt-status-unsaved">
                        <i className="fas fa-exclamation-circle"></i> Unsaved changes
                    </span>
                )}
            </div>

            <div className="vtt-shortcuts-help">
                <small>
                    {activeTab === 'objects'
                        ? '[Wheel] Scale  [Alt+Wheel] Rotate  [Shift+E+Wheel] Elevate  [Del] Delete  [Esc] Deselect'
                        : '[1] Terrain  [2] Drawing  [3] Walls  [4] Fog  [5] Objects  [6] Grid  [7] Lighting  [V] Select  [Del] Delete  [Esc] Close  [Ctrl+Z] Undo'}
                </small>
            </div>
        </>
    );
};

export default EditorStatusBar;
