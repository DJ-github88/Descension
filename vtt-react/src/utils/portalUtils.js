/**
 * Portal utilities for ensuring proper rendering in production environments
 */

/**
 * Get a safe portal target with fallbacks
 * @returns {HTMLElement|null} Safe portal target element
 */
export const getSafePortalTarget = () => {
    // Ensure DOM is available
    if (typeof document === 'undefined') {
        console.warn('Document not available for portal rendering');
        return null;
    }

    // Try document.body first (preferred)
    if (document.body) {
        return document.body;
    }

    // Fallback to root element
    const root = document.getElementById('root');
    if (root) {
        console.warn('Using #root as portal target (document.body not available)');
        return root;
    }

    // Last resort - document element
    if (document.documentElement) {
        console.warn('Using document.documentElement as portal target');
        return document.documentElement;
    }

    console.error('No suitable portal target found');
    return null;
};

/**
 * Initialize portal system for production environment
 */
export const initializePortalSystem = () => {
    if (process.env.NODE_ENV !== 'production') {
        return; // Only run in production
    }


    // Ensure DOM is ready
    const ensureDOMReady = () => {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    };

    // Force style recalculation and ensure portal containers are ready
    const preparePortalContainers = () => {
        // Force a reflow to ensure all CSS is applied
        if (document.body) {
            const _forceReflow = document.body.offsetHeight; // eslint-disable-line no-unused-vars
        }

        // Add production-specific portal container if needed
        if (!document.getElementById('portal-container')) {
            const portalContainer = document.createElement('div');
            portalContainer.id = 'portal-container';
            portalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(portalContainer);
        }

        // Ensure critical CSS classes are applied
        // Note: z-index is now managed by windowManagerStore, not hardcoded here
        const criticalStyles = `
            .wow-window,
            .draggable-window,
            .shop-window,
            .item-wizard-modal,
            .quick-item-generator-modal,
            .categorize-modal {
                position: fixed !important;
                pointer-events: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .modal-backdrop,
            .shop-window-overlay,
            .quick-item-generator-overlay,
            .categorize-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                pointer-events: auto !important;
            }
        `;

        // Inject critical styles if not already present
        if (!document.getElementById('production-portal-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'production-portal-styles';
            styleElement.textContent = criticalStyles;
            document.head.appendChild(styleElement);
        }
    };

    // Initialize the system
    ensureDOMReady().then(() => {
        preparePortalContainers();
    });
};

/**
 * Get portal container with production fallbacks
 * @returns {HTMLElement} Portal container element
 */
export const getPortalContainer = () => {
    // Try production portal container first
    const portalContainer = document.getElementById('portal-container');
    if (portalContainer) {
        return portalContainer;
    }

    // Fallback to safe portal target
    return getSafePortalTarget();
};

/**
 * Debug portal system status
 */
export const debugPortalSystem = () => {
    console.log('🔍 Portal System Debug:', {
        environment: process.env.NODE_ENV,
        documentReady: document.readyState,
        bodyAvailable: !!document.body,
        rootAvailable: !!document.getElementById('root'),
        portalContainerAvailable: !!document.getElementById('portal-container'),
        productionStylesInjected: !!document.getElementById('production-portal-styles')
    });
};
