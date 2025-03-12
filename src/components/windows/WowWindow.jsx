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
    defaultPosition = { x: 100, y: 100 },
    defaultSize = { width: 400, height: 600 },
    customHeader
}) {
    if (!isOpen) return null;

    return (
        <Draggable
            handle=".window-header"
            defaultPosition={defaultPosition}
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
                    <div className="window-content">
                        {children}
                    </div>
                </div>
            </Resizable>
        </Draggable>
    );
}
