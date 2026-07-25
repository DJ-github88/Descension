import React from 'react';
import hpBarLeft from '../../assets/ui/hp-bar-left.png';
import hpBarMiddle from '../../assets/ui/hp-bar-middle.png';
import hpBarRight from '../../assets/ui/hp-bar-right.png';
import hpFillTexture from '../../assets/ui/hp-fill-texture.png';

import hpIconMax from '../../assets/ui/hp-icon-max.png';
import hpIconHigh from '../../assets/ui/hp-icon-high.png';
import hpIconLow from '../../assets/ui/hp-icon-low.png';
import hpIconEmpty from '../../assets/ui/hp-icon-empty.png';

const ModularHealthBar = ({ currentHP = 0, maxHP = 1, tempHP = 0, showText = true, className = '', onClick, onContextMenu }) => {
    const safeMax = Math.max(1, maxHP);
    const safeHP = Math.max(0, currentHP);
    const hpPercent = Math.min(100, Math.max(0, (safeHP / safeMax) * 100));

    // Dynamic heart potion icon selection based on HP ratio:
    // 1. MAX: currentHP >= maxHP (radiant overflowing potion)
    // 2. HIGH: currentHP >= maxHP * 0.5 && currentHP < maxHP
    // 3. LOW: currentHP > 0 && currentHP < maxHP * 0.5
    // 4. EMPTY: currentHP === 0 (shattered potion bottle)
    let heartIcon = hpIconLow;
    let heartStateClass = 'low';

    if (safeHP >= safeMax) {
        heartIcon = hpIconMax;
        heartStateClass = 'max';
    } else if (safeHP >= safeMax * 0.5) {
        heartIcon = hpIconHigh;
        heartStateClass = 'high';
    } else if (safeHP > 0) {
        heartIcon = hpIconLow;
        heartStateClass = 'low';
    } else {
        heartIcon = hpIconEmpty;
        heartStateClass = 'empty';
    }

    return (
        <div 
            className={`modular-health-bar-container ${className}`}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {/* Continuous Trough Base Layer: Dark Slate Background + Red Fluid Fill (z-index 1 & 2) */}
            <div className="hp-trough-base">
                <div className="hp-trough-empty-bg" />
                <div 
                    className="hp-fill-bar" 
                    style={{ 
                        width: `${hpPercent}%`,
                        backgroundImage: `url(${hpFillTexture})`
                    }} 
                />
                {showText && (
                    <span className="hp-bar-text">
                        {safeHP}/{safeMax}{tempHP > 0 && ` (+${tempHP})`}
                    </span>
                )}
            </div>

            {/* Frame Overlay Layer: Wooden Rails & Brass Socket Ring (z-index 3) */}
            <div className="hp-frame-overlay">
                {/* Left Wooden Module & Brass Socket Ring */}
                <div className="hp-module-left">
                    <img src={hpBarLeft} alt="" className="hp-module-frame-left" draggable={false} />
                    <div className={`hp-socket-icon-wrapper heart-state-${heartStateClass}`}>
                        <img src={heartIcon} alt="Health Status" className="hp-heart-icon" draggable={false} />
                    </div>
                </div>

                {/* Middle Wooden Channel Rails */}
                <div className="hp-module-middle" style={{ backgroundImage: `url(${hpBarMiddle})` }} />

                {/* Right Wooden End-Cap & Brass Collar */}
                <div className="hp-module-right">
                    <img src={hpBarRight} alt="" className="hp-module-frame-right" draggable={false} />
                </div>
            </div>
        </div>
    );
};

export default ModularHealthBar;
