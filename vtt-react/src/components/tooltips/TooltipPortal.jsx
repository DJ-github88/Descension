import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Retrieve or create the portal root synchronously so that the portal is immediately ready on first render,
// preventing timing/mounting lag with ref-based positioning in parent components.
let portalRootElement = typeof document !== 'undefined' ? document.getElementById('tooltip-portal-root') : null;

const TooltipPortal = ({ children }) => {
    const [portalRoot, setPortalRoot] = useState(portalRootElement);

    useEffect(() => {
        if (portalRoot) return;

        let element = document.getElementById('tooltip-portal-root');
        if (!element) {
            element = document.createElement('div');
            element.id = 'tooltip-portal-root';
            element.style.position = 'fixed';
            element.style.left = '0';
            element.style.top = '0';
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '2147483647'; // Maximum z-index value to ensure tooltips always appear above all windows and modals
            document.body.appendChild(element);
        }
        portalRootElement = element;
        setPortalRoot(element);
    }, [portalRoot]);

    // Don't try to remove the portal root, let it persist
    // It will be reused by other tooltips

    if (!portalRoot) return null;
    return createPortal(children, portalRoot);
};

export default TooltipPortal;
