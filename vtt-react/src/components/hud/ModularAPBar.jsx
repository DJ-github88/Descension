import React from 'react';
import hpBarLeft from '../../assets/ui/hp-bar-left.png';
import hpBarMiddle from '../../assets/ui/hp-bar-middle.png';
import hpBarRight from '../../assets/ui/hp-bar-right.png';
import apFillTexture from '../../assets/ui/ap-fill-texture.png';

import apIconMax from '../../assets/ui/ap-icon-max.png';
import apIconHigh from '../../assets/ui/ap-icon-high.png';
import apIconLow from '../../assets/ui/ap-icon-low.png';
import apIconEmpty from '../../assets/ui/ap-icon-empty.png';

const ModularAPBar = ({ currentAP = 0, maxAP = 1, showText = true, className = '', onClick, onContextMenu }) => {
    const safeMax = Math.max(1, maxAP);
    const safeAP = Math.max(0, currentAP);
    const apPercent = Math.min(100, Math.max(0, (safeAP / safeMax) * 100));

    // Dynamic Winged Hermes Boot icon selection based on AP ratio:
    // 1. MAX: currentAP >= maxAP (Glowing golden winged boot with shield & sparkles)
    // 2. HIGH: currentAP >= maxAP * 0.5 && currentAP < maxAP (Golden winged boot)
    // 3. LOW: currentAP > 0 && currentAP < maxAP * 0.5 (Bronze winged boot)
    // 4. EMPTY: currentAP === 0 (Dark cracked stone winged boot)
    let apIcon = apIconLow;
    let apStateClass = 'low';

    if (safeAP >= safeMax) {
        apIcon = apIconMax;
        apStateClass = 'max';
    } else if (safeAP >= safeMax * 0.5) {
        apIcon = apIconHigh;
        apStateClass = 'high';
    } else if (safeAP > 0) {
        apIcon = apIconLow;
        apStateClass = 'low';
    } else {
        apIcon = apIconEmpty;
        apStateClass = 'empty';
    }

    return (
        <div 
            className={`modular-ap-bar-container ${className}`}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {/* Continuous Trough Base Layer: Dark Slate Background + Golden Amber Fluid Fill (z-index 1 & 2) */}
            <div className="ap-trough-base">
                <div className="ap-trough-empty-bg" />
                <div 
                    className="ap-fill-bar" 
                    style={{ 
                        width: `${apPercent}%`,
                        backgroundImage: `url(${apFillTexture})`
                    }} 
                />
                {showText && (
                    <span className="ap-bar-text">
                        {safeAP}/{safeMax} AP
                    </span>
                )}
            </div>

            {/* Frame Overlay Layer: Wooden & Brass Frame identical to Health Bar (z-index 3) */}
            <div className="ap-frame-overlay">
                {/* Left Wooden Module & Brass Socket Ring with Winged Hermes Boot */}
                <div className="ap-module-left">
                    <img src={hpBarLeft} alt="" className="ap-module-frame-left" draggable={false} />
                    <div className={`ap-socket-icon-wrapper ap-state-${apStateClass}`}>
                        <img src={apIcon} alt="Action Points Status" className="ap-boot-icon" draggable={false} />
                    </div>
                </div>

                {/* Middle Wooden Channel Rails */}
                <div className="ap-module-middle" style={{ backgroundImage: `url(${hpBarMiddle})` }} />

                {/* Right Wooden Endcap Module */}
                <div className="ap-module-right">
                    <img src={hpBarRight} alt="" className="ap-module-frame-right" draggable={false} />
                </div>
            </div>
        </div>
    );
};

export default ModularAPBar;
