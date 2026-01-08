import React, { useEffect, useRef, useState } from 'react';
import './HotkeyAssignmentPopup.css';

const HotkeyAssignmentPopup = ({ slotIndex, currentHotkey, onAssign, onClose, actionBarRef }) => {
    const popupRef = useRef(null);
    const [position, setPosition] = useState({ bottom: 100, left: '50%' });

    useEffect(() => {
        // Calculate position relative to action bar
        if (actionBarRef && actionBarRef.current) {
            const actionBarRect = actionBarRef.current.getBoundingClientRect();
            const popupHeight = 250; // Approximate popup height
            const spacing = 20; // Space between action bar and popup

            // Position popup above the action bar, centered
            setPosition({
                bottom: window.innerHeight - actionBarRect.top + spacing,
                left: '50%'
            });
        }
    }, [actionBarRef]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent default behavior
            e.preventDefault();
            e.stopPropagation();

            // Escape key to cancel
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            // Ignore modifier-only keys
            if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
                return;
            }

            // Build the hotkey string
            let hotkey = '';

            if (e.ctrlKey) hotkey += 'Ctrl+';
            if (e.altKey) hotkey += 'Alt+';
            if (e.shiftKey) hotkey += 'Shift+';

            // Get the key name
            let keyName = e.key.toUpperCase();

            // Handle special keys
            if (e.key === ' ') keyName = 'Space';
            else if (e.key.length === 1) keyName = e.key.toUpperCase();
            else keyName = e.key;

            hotkey += keyName;

            // Assign the hotkey
            onAssign(hotkey);
        };

        // Click outside to close
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onAssign, onClose]);

    return (
        <div className="hotkey-popup-overlay">
            <div
                className="hotkey-popup"
                ref={popupRef}
                style={{
                    position: 'fixed',
                    bottom: `${position.bottom}px`,
                    left: position.left,
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="hotkey-popup-header">
                    <h3>Assign Hotkey</h3>
                    <button className="hotkey-popup-close" onClick={onClose}>×</button>
                </div>
                <div className="hotkey-popup-content">
                    <div className="hotkey-popup-slot-info">
                        Slot {slotIndex + 1}
                    </div>
                    {currentHotkey && (
                        <div className="hotkey-popup-current">
                            Current: <span className="hotkey-key">{currentHotkey}</span>
                        </div>
                    )}
                    <div className="hotkey-popup-instruction">
                        Press any key to assign...
                    </div>
                    <div className="hotkey-popup-hint">
                        Press ESC to cancel
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotkeyAssignmentPopup;

