import React, { forwardRef } from 'react';
import './styles/EditorOverlays.css';

export const EraserCursorPreview = ({ hoverPreview }) => {
    if (!hoverPreview.show || !hoverPreview.isEraser) return null;
    return (
        <div
            className="vtt-eraser-cursor"
            style={{
                left: hoverPreview.screenX - hoverPreview.eraserRadius,
                top: hoverPreview.screenY - hoverPreview.eraserRadius,
                width: hoverPreview.eraserRadius * 2,
                height: hoverPreview.eraserRadius * 2,
            }}
        />
    );
};

export const TextInputOverlay = forwardRef(({ textInput, onChangeText, onSubmit, onCancel, getPreviewStyle }, ref) => {
    if (!textInput.show) return null;
    return (
        <div className="vtt-text-input-overlay" style={{ left: textInput.x, top: textInput.y }}>
            <input
                ref={ref}
                type="text"
                value={textInput.text}
                onChange={(e) => onChangeText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onSubmit();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        onCancel();
                    }
                }}
                placeholder="Enter text..."
                autoFocus
                className="vtt-text-input-field"
            />
            {textInput.text && (
                <div className="vtt-text-preview">
                    <div className="vtt-text-preview-label">Preview:</div>
                    <div className="vtt-text-preview-content" style={getPreviewStyle()}>
                        {textInput.text}
                    </div>
                </div>
            )}
            <div className="vtt-text-input-hint">
                Press Enter to place &bull; Esc to cancel
            </div>
        </div>
    );
});
TextInputOverlay.displayName = 'TextInputOverlay';

export const AreaRemoveSelection = ({ selectionRect, overlayRef }) => {
    if (!selectionRect || !overlayRef?.current) return null;
    return (
        <div
            className="vtt-area-remove-rect"
            style={{
                left: overlayRef.current.offsetLeft + Math.min(selectionRect.startX, selectionRect.endX),
                top: overlayRef.current.offsetTop + Math.min(selectionRect.startY, selectionRect.endY),
                width: Math.abs(selectionRect.endX - selectionRect.startX),
                height: Math.abs(selectionRect.endY - selectionRect.startY),
            }}
        />
    );
};

export const WallSelectionIndicator = ({ selectedWindow, selectedWallKey, wallData, onUnlock }) => {
    if (!(selectedWallKey || selectedWindow)) return null;
    const label = selectedWindow
        ? 'Window'
        : (wallData[selectedWallKey]?.type?.includes('door') ? 'Door' : 'Wall');
    return (
        <div className="vtt-selection-indicator">
            <span className="vtt-selection-label">
                Selected: <strong>{label}</strong>
            </span>
            <span className="vtt-selection-hint">Drag to move</span>
            <button className="vtt-selection-unlock-btn" onClick={onUnlock}>
                Unlock
            </button>
        </div>
    );
};
