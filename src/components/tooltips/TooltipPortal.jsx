import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const TooltipPortal = ({ children }) => {
    const [portalRoot, setPortalRoot] = useState(null);

    useEffect(() => {
        const existingPortal = document.getElementById('tooltip-portal-root');
        if (existingPortal) {
            setPortalRoot(existingPortal);
            return;
        }

        const element = document.createElement('div');
        element.id = 'tooltip-portal-root';
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '9999';
        document.body.appendChild(element);
        setPortalRoot(element);
    }, []);

    // Don't try to remove the portal root, let it persist
    // It will be reused by other tooltips

    if (!portalRoot) return null;
    return createPortal(children, portalRoot);
};

export default TooltipPortal;
