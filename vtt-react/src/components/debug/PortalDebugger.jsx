import React, { useState, useEffect } from 'react';
import { debugPortalSystem } from '../../utils/portalUtils';

const PortalDebugger = () => {
    const [debugInfo, setDebugInfo] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in production if debug flag is set
        const shouldShow = process.env.NODE_ENV === 'production' && 
                          (window.location.search.includes('debug=portal') || 
                           localStorage.getItem('debug_portal') === 'true');
        setIsVisible(shouldShow);

        if (shouldShow) {
            updateDebugInfo();
            const interval = setInterval(updateDebugInfo, 2000);
            return () => clearInterval(interval);
        }
    }, []);

    const updateDebugInfo = () => {
        const info = {
            environment: process.env.NODE_ENV,
            documentReady: document.readyState,
            bodyAvailable: !!document.body,
            rootAvailable: !!document.getElementById('root'),
            portalContainerAvailable: !!document.getElementById('portal-container'),
            productionStylesInjected: !!document.getElementById('production-portal-styles'),
            windowCount: document.querySelectorAll('.wow-window, .draggable-window, .shop-window, .item-wizard-modal').length,
            timestamp: new Date().toLocaleTimeString()
        };
        setDebugInfo(info);
    };

    const handleDebugPortalSystem = () => {
        debugPortalSystem();
        updateDebugInfo();
    };

    const handleTestPortal = () => {
        // Create a test portal to verify functionality
        const testDiv = document.createElement('div');
        testDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: red;
            color: white;
            padding: 20px;
            z-index: 99999;
            border: 2px solid white;
        `;
        testDiv.textContent = 'TEST PORTAL - This should be visible';
        
        const portalTarget = document.body || document.getElementById('root');
        if (portalTarget) {
            portalTarget.appendChild(testDiv);
            setTimeout(() => {
                if (testDiv.parentNode) {
                    testDiv.parentNode.removeChild(testDiv);
                }
            }, 3000);
        } else {
            alert('No portal target available!');
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 99999,
            maxWidth: '300px',
            fontFamily: 'monospace'
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>Portal Debug Info</h4>
            {debugInfo && (
                <div>
                    <div>Environment: {debugInfo.environment}</div>
                    <div>Document Ready: {debugInfo.documentReady}</div>
                    <div>Body Available: {debugInfo.bodyAvailable ? '✅' : '❌'}</div>
                    <div>Root Available: {debugInfo.rootAvailable ? '✅' : '❌'}</div>
                    <div>Portal Container: {debugInfo.portalContainerAvailable ? '✅' : '❌'}</div>
                    <div>Production Styles: {debugInfo.productionStylesInjected ? '✅' : '❌'}</div>
                    <div>Window Count: {debugInfo.windowCount}</div>
                    <div>Last Update: {debugInfo.timestamp}</div>
                </div>
            )}
            <div style={{ marginTop: '10px' }}>
                <button 
                    onClick={handleDebugPortalSystem}
                    style={{ 
                        background: '#333', 
                        color: 'white', 
                        border: '1px solid #666', 
                        padding: '5px', 
                        marginRight: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Debug Console
                </button>
                <button 
                    onClick={handleTestPortal}
                    style={{ 
                        background: '#333', 
                        color: 'white', 
                        border: '1px solid #666', 
                        padding: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Test Portal
                </button>
            </div>
            <div style={{ marginTop: '5px', fontSize: '10px', color: '#888' }}>
                Add ?debug=portal to URL or set localStorage.debug_portal = 'true'
            </div>
        </div>
    );
};

export default PortalDebugger;
