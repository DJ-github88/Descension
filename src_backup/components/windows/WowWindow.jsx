import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './WowWindow.css';

/**
 * WowWindow component
 * A draggable and resizable window with World of Warcraft styling
 * 
 * @param {Object} props
 * @param {string} props.title - Window title
 * @param {React.ReactNode} props.children - Window content
 * @param {boolean} props.isOpen - Whether the window is open
 * @param {Function} props.onClose - Callback when the window is closed
 * @param {Object} props.defaultPosition - Default position of the window
 * @param {Object} props.defaultSize - Default size of the window
 * @param {React.ReactNode} props.customHeader - Custom header content
 * @param {Array} props.headerTabs - Array of tab objects for the header
 * @param {string} props.activeTab - Active tab ID
 * @param {Function} props.onTabChange - Callback when a tab is changed
 */
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

  // Create refs for Draggable and Resizable components
  const draggableNodeRef = useRef(null);
  const resizableNodeRef = useRef(null);

  // Use state to manage window size
  const [windowSize, setWindowSize] = useState({
    width: defaultSize.width,
    height: defaultSize.height
  });

  // Handle resize
  const handleResize = (event, { size }) => {
    setWindowSize({
      width: size.width,
      height: size.height
    });
  };

  return (
    <Draggable
      handle=".window-header"
      defaultPosition={defaultPosition}
      nodeRef={draggableNodeRef}
    >
      <div ref={draggableNodeRef}>
        <Resizable
          width={windowSize.width}
          height={windowSize.height}
          minConstraints={[300, 400]}
          maxConstraints={[1200, 1000]}
          onResize={handleResize}
          resizeHandles={['se']}
        >
          <div
            className="wow-window"
            style={{
              width: windowSize.width,
              height: windowSize.height
            }}
          >
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
              </div>

              {/* Close button */}
              <button className="window-close" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="window-content">
              {children}
            </div>

            {/* Resize handle */}
            <div className="resize-handle"></div>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
}
