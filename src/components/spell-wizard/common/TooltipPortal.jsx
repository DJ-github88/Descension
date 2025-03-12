import React from 'react';
import ReactDOM from 'react-dom';

const TooltipPortal = ({ children, position }) => {
  // Create portal container if it doesn't exist
  React.useEffect(() => {
    const portalRoot = document.getElementById('tooltip-portal-root');
    if (!portalRoot) {
      const div = document.createElement('div');
      div.id = 'tooltip-portal-root';
      document.body.appendChild(div);
    }
    return () => {
      const portalRoot = document.getElementById('tooltip-portal-root');
      if (portalRoot && portalRoot.childNodes.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, []);

  const portalRoot = document.getElementById('tooltip-portal-root');
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div 
      className="tooltip-portal"
      style={{
        position: 'fixed',
        top: position?.y || 0,
        left: position?.x || 0,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      {children}
    </div>,
    portalRoot
  );
};

export default TooltipPortal;
