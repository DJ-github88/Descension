import React from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import '../../styles/wow-window.css';
import 'react-resizable/css/styles.css';

export default function WowWindow({ 
    title, 
    children, 
    isOpen, 
    onClose, 
    defaultPosition,
    defaultSize = { width: 400, height: 600 },
    customHeader
}) {
    if (!isOpen) return null;

    const getContentClass = () => {
        if (title === 'Character Sheet') {
            return 'window-content character-sheet-content';
        }
        return 'window-content';
    };

    return (
        <Draggable
            handle=".window-header"
            defaultPosition={defaultPosition}
            // Removed the bounds="parent" constraint to allow free movement
        >
            <Resizable
                defaultSize={defaultSize}
                minConstraints={[300, 400]}
                maxConstraints={[800, 1000]}
            >
                <div className="wow-window">
                    <div className="window-header">
                        {customHeader || (
                            <>
                                <div className="window-title">{title}</div>
                                <button className="window-close" onClick={onClose}>×</button>
                            </>
                        )}
                    </div>
                    <div className={getContentClass()}>
                        {children}
                    </div>
                </div>
            </Resizable>
        </Draggable>
    );
}



