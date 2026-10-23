import React from 'react';
import './styles/EditorTouchBar.css';

/**
 * Floating controls for the level editor on tablets and touch laptops.
 *
 * A finger or stylus has no keyboard and no right button, so everything the
 * editor normally hides behind Ctrl+Z, Escape, Enter, Delete or a right click
 * gets a large visible button here: undo / redo, finish or cancel a polygon,
 * delete / duplicate the selected drawing, and the finger "draw or pan" switch.
 *
 * It is a plain presentational component; the editor owns every action.
 */
const EditorTouchBar = ({
    visible,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    fingerAction,
    penDetected,
    onToggleFingerAction,
    onZoomIn,
    onZoomOut,
    polygonPointCount = 0,
    onFinishPolygon,
    onUndoPolygonPoint,
    onCancelPolygon,
    selectionCount = 0,
    onDeleteSelection,
    onDuplicateSelection
}) => {
    if (!visible) return null;

    const polygonActive = polygonPointCount > 0;
    const fingerLabel = fingerAction === 'pan' ? 'Finger: pan' : 'Finger: draw';
    const fingerHint = penDetected
        ? 'Stylus detected: your stylus draws, your finger pans. Tap to change.'
        : 'Tap to switch between drawing and panning with one finger. Two fingers always pan and zoom.';

    return (
        <div className="vtt-touch-bar" role="toolbar" aria-label="Touch controls" data-testid="editor-touch-bar">
            <div className="vtt-touch-group">
                <button type="button" className="vtt-touch-btn" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
                    <span aria-hidden="true">&#8630;</span>
                    <span className="vtt-touch-label">Undo</span>
                </button>
                <button type="button" className="vtt-touch-btn" onClick={onRedo} disabled={!canRedo} aria-label="Redo">
                    <span aria-hidden="true">&#8631;</span>
                    <span className="vtt-touch-label">Redo</span>
                </button>
            </div>

            <div className="vtt-touch-group">
                <button
                    type="button"
                    className={`vtt-touch-btn vtt-touch-toggle ${fingerAction === 'pan' ? 'is-pan' : 'is-draw'}`}
                    onClick={onToggleFingerAction}
                    title={fingerHint}
                    aria-label={fingerLabel}
                    aria-pressed={fingerAction === 'pan'}
                >
                    <span aria-hidden="true">{fingerAction === 'pan' ? '✋' : '☝'}</span>
                    <span className="vtt-touch-label">{fingerLabel}</span>
                </button>
                <button type="button" className="vtt-touch-btn" onClick={onZoomOut} aria-label="Zoom out">
                    <span aria-hidden="true">&minus;</span>
                </button>
                <button type="button" className="vtt-touch-btn" onClick={onZoomIn} aria-label="Zoom in">
                    <span aria-hidden="true">+</span>
                </button>
            </div>

            {polygonActive && (
                <div className="vtt-touch-group vtt-touch-contextual">
                    <span className="vtt-touch-status">{polygonPointCount} {polygonPointCount === 1 ? 'corner' : 'corners'}</span>
                    <button type="button" className="vtt-touch-btn" onClick={onUndoPolygonPoint} aria-label="Remove last corner">
                        <span aria-hidden="true">&#8630;</span>
                        <span className="vtt-touch-label">Back</span>
                    </button>
                    <button
                        type="button"
                        className="vtt-touch-btn vtt-touch-primary"
                        onClick={onFinishPolygon}
                        disabled={polygonPointCount < 3}
                        aria-label="Finish polygon"
                    >
                        <span aria-hidden="true">&#10003;</span>
                        <span className="vtt-touch-label">Done</span>
                    </button>
                    <button type="button" className="vtt-touch-btn" onClick={onCancelPolygon} aria-label="Cancel polygon">
                        <span aria-hidden="true">&#10005;</span>
                        <span className="vtt-touch-label">Cancel</span>
                    </button>
                </div>
            )}

            {selectionCount > 0 && (
                <div className="vtt-touch-group vtt-touch-contextual">
                    <button type="button" className="vtt-touch-btn" onClick={onDuplicateSelection} aria-label="Duplicate selected drawing">
                        <span aria-hidden="true">&#10064;</span>
                        <span className="vtt-touch-label">Copy</span>
                    </button>
                    <button type="button" className="vtt-touch-btn vtt-touch-danger" onClick={onDeleteSelection} aria-label="Delete selected drawing">
                        <span aria-hidden="true">&#128465;</span>
                        <span className="vtt-touch-label">Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditorTouchBar;
