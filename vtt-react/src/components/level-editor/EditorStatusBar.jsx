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
                    [1] Terrain &nbsp; [2] Drawing &nbsp; [3] Walls &nbsp; [4] Fog &nbsp; [5] Objects &nbsp; [6] Grid &nbsp; [7] Lighting &nbsp; [V] Select &nbsp; [Del] Delete &nbsp; [Esc] Close &nbsp; [Ctrl+Z] Undo &nbsp; [Ctrl+Shift+Z] Redo
                </small>
            </div>
        </>
    );
};

export default EditorStatusBar;
