import React, { useState, useEffect } from 'react';

const ProductionDebugger = () => {
    const [debugInfo, setDebugInfo] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show on production
        if (window.location.hostname.includes('netlify')) {
            setIsVisible(true);
            
            // Collect debug info
            setDebugInfo({
                hostname: window.location.hostname,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                cssLoaded: document.styleSheets.length,
                reactVersion: React.version
            });

            // Add global debug logging
            window.debugLootOrb = (gridItemId) => {
                console.log(`🎯 MANUAL DEBUG: Checking loot orb ${gridItemId}`);
                // Import the store dynamically
                import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
                    const gridStore = useGridItemStore.getState();
                    console.log(`🎯 Grid items count:`, gridStore.gridItems.length);
                    console.log(`🎯 All grid items:`, gridStore.gridItems.map(item => ({ id: item.id, name: item.name })));
                    const hasItem = gridStore.gridItems.find(item => item.id === gridItemId);
                    console.log(`🎯 Has item ${gridItemId}:`, !!hasItem);
                    if (hasItem) {
                        console.log(`🎯 Item details:`, hasItem);
                    }
                });
            };

            window.debugContextMenu = () => {
                console.log(`🎯 MANUAL DEBUG: Context menu elements`);
                const menus = document.querySelectorAll('.party-context-menu, .character-hud-context-menu');
                console.log(`🎯 Found ${menus.length} context menus`);
                menus.forEach((menu, i) => {
                    const styles = window.getComputedStyle(menu);
                    console.log(`🎯 Menu ${i}:`, {
                        display: styles.display,
                        position: styles.position,
                        zIndex: styles.zIndex,
                        background: styles.background
                    });
                });
            };
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 999999,
            maxWidth: '300px'
        }}>
            <div><strong>🚨 PRODUCTION DEBUG</strong></div>
            <div>Host: {debugInfo.hostname}</div>
            <div>CSS: {debugInfo.cssLoaded} sheets</div>
            <div>Time: {debugInfo.timestamp}</div>
            <div style={{ marginTop: '5px', fontSize: '10px' }}>
                Open console and use:<br/>
                • debugLootOrb('item-id')<br/>
                • debugContextMenu()
            </div>
        </div>
    );
};

export default ProductionDebugger;
