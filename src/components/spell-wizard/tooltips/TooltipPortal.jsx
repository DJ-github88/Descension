import React from 'react';
import ReactDOM from 'react-dom';

const TooltipPortal = ({ children }) => {
  // Create a div for the portal if it doesn't exist
  React.useEffect(() => {
    const portalRoot = document.getElementById('tooltip-portal');
    if (!portalRoot) {
      const div = document.createElement('div');
      div.id = 'tooltip-portal';
      document.body.appendChild(div);
    }
    
    // Cleanup on unmount
    return () => {
      const portalRoot = document.getElementById('tooltip-portal');
      if (portalRoot && portalRoot.childNodes.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, []);

  const portalRoot = document.getElementById('tooltip-portal');
  if (!portalRoot) return null;

  return ReactDOM.createPortal(children, portalRoot);
};

export default TooltipPortal;
