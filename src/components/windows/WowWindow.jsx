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
    customHeader,
    headerTabs = [],
    activeTab,
    onTabChange
}) {
    if (!isOpen) return null;

    return (
        <Draggable
            handle=".window-header"
            defaultPosition={defaultPosition}
        >
            <Resizable
                width={defaultSize.width}
                height={defaultSize.height}
                minConstraints={[300, 400]}
                maxConstraints={[800, 1000]}
            >
                <div className="wow-window">
                    <div className="window-header">
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                            {customHeader || (
                                <>
                                    <div className="window-title">{title}</div>

                                    {/* Header tabs */}
                                    {headerTabs.length > 0 && (
                                        <div className="window-header-tabs">
                                            {headerTabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    className={`window-header-tab ${activeTab === tab.id ? 'active' : ''}`}
                                                    onClick={() => onTabChange && onTabChange(tab.id)}
                                                >
                                                    {tab.icon && (
                                                        <img
                                                            src={tab.icon}
                                                            alt={tab.label}
                                                            className="tab-icon-img"
                                                        />
                                                    )}
                                                    <span>{tab.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                            <button className="window-close" onClick={onClose} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>×</button>
                        </div>
                    </div>
                    <div className="window-content">
                        {children}
                    </div>
                </div>
            </Resizable>
        </Draggable>
    );
}
