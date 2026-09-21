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
    const isDoor = selectedWallKey && wallData[selectedWallKey]?.type?.includes('door');
    const label = selectedWindow
        ? 'Window'
        : (isDoor ? 'Door' : 'Wall');
    const hint = (!selectedWindow && !isDoor)
        ? 'Drag to move • Drag gold handles to reshape'
        : 'Drag to move';
    return (
        <div className="vtt-selection-indicator">
            <span className="vtt-selection-label">
                Selected: <strong>{label}</strong>
            </span>
            <span className="vtt-selection-hint">{hint}</span>
            <button className="vtt-selection-unlock-btn" onClick={onUnlock}>
                Unlock
            </button>
        </div>
    );
};

export const ObjectShortcutHUD = ({
    mode = 'place',
    objectName = '',
    scale = 1,
    rotation = 0,
    rotationX = 0,
    rotationY = 0,
    elevation = 0,
    isEHeld = false,
    isAltHeld = false,
    isShiftHeld = false
}) => {
    const formattedElevation = `${elevation > 0 ? '+' : ''}${elevation} lvl (${elevation > 0 ? '+' : ''}${Math.round(elevation * 5 * 10) / 10} ft)`;
    const formattedRotation = `${rotation}°`;
    const formattedScale = `${scale}×`;

    return (
        <div className="vtt-object-shortcut-hud">
            <div className="vtt-object-hud-header">
                <span className="vtt-object-hud-badge">
                    {mode === 'place' ? 'Placing' : 'Selected'}
                </span>
                <strong className="vtt-object-hud-title">{objectName}</strong>
            </div>

            <div className="vtt-object-hud-divider" />

            <div className="vtt-object-hud-shortcuts">
                {/* Height / Elevation Shortcut */}
                <div className={`vtt-object-hud-item ${isEHeld ? 'active' : ''}`}>
                    <span className="vtt-hud-keys">
                        <kbd>Shift</kbd>+<kbd>E</kbd>+<kbd>Wheel</kbd>
                    </span>
                    <span className="vtt-hud-label">Height:</span>
                    <span className="vtt-hud-val">{formattedElevation}</span>
                </div>

                {/* Rotation Shortcut */}
                <div className={`vtt-object-hud-item ${((isAltHeld || isShiftHeld) && !isEHeld) ? 'active' : ''}`}>
                    <span className="vtt-hud-keys">
                        {isShiftHeld && !isAltHeld ? (
                            <><kbd>Shift</kbd>+<kbd>Wheel</kbd></>
                        ) : isAltHeld && isShiftHeld ? (
                            <><kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Wheel</kbd></>
                        ) : (
                            <><kbd>Alt</kbd>+<kbd>Wheel</kbd></>
                        )}
                    </span>
                    <span className="vtt-hud-label">
                        {isShiftHeld && !isAltHeld ? 'Roll:' : isAltHeld && isShiftHeld ? 'Pitch:' : 'Rotate:'}
                    </span>
                    <span className="vtt-hud-val">
                        {isShiftHeld && !isAltHeld ? `${rotationY}°` : isAltHeld && isShiftHeld ? `${rotationX}°` : formattedRotation}
                    </span>
                </div>

                {/* Scale Shortcut */}
                <div className={`vtt-object-hud-item ${!isAltHeld && !isEHeld && !isShiftHeld ? 'active' : ''}`}>
                    <span className="vtt-hud-keys">
                        <kbd>Wheel</kbd>
                    </span>
                    <span className="vtt-hud-label">Scale:</span>
                    <span className="vtt-hud-val">{formattedScale}</span>
                </div>

                {/* Contextual Action Hint */}
                <div className="vtt-object-hud-action">
                    {mode === 'place' ? (
                        <>
                            <span><kbd>Click</kbd> Place</span>
                            <span><kbd>Esc</kbd> Cancel</span>
                        </>
                    ) : (
                        <>
                            <span><kbd>Drag</kbd> Move</span>
                            <span><kbd>Del</kbd> Delete</span>
                            <span><kbd>Esc</kbd> Deselect</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
