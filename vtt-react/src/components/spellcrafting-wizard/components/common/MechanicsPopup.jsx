import React from 'react';
import { createPortal } from 'react-dom';
// Pathfinder styles imported via main.css

const MechanicsPopup = ({ show, onHide, title, children, size = 'medium' }) => {
  if (!show) return null;

  return createPortal(
    <div className="mechanics-popup-overlay" onClick={onHide}>
      <div 
        className={`mechanics-popup-container ${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mechanics-popup-header">
          <h3 className="mechanics-popup-title">{title}</h3>
          <button className="mechanics-popup-close" onClick={onHide}>×</button>
        </div>
        <div className="mechanics-popup-body">
          {children}
        </div>
        <div className="mechanics-popup-footer">
          <button className="mechanics-popup-button" onClick={onHide}>
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MechanicsPopup;
