import React from 'react';
import hpBarLeft from '../../assets/ui/hp-bar-left.png';
import hpBarMiddle from '../../assets/ui/hp-bar-middle.png';
import hpBarRight from '../../assets/ui/hp-bar-right.png';
import manaFillTexture from '../../assets/ui/mana-fill-texture.png';

import manaIconMax from '../../assets/ui/mana-icon-max.png';
import manaIconHigh from '../../assets/ui/mana-icon-high.png';
import manaIconLow from '../../assets/ui/mana-icon-low.png';
import manaIconEmpty from '../../assets/ui/mana-icon-empty.png';

const ModularManaBar = ({ currentMana = 0, maxMana = 1, tempMana = 0, showText = true, className = '', onClick, onContextMenu }) => {
    const safeMax = Math.max(1, maxMana);
    const safeMana = Math.max(0, currentMana);
    const manaPercent = Math.min(100, Math.max(0, (safeMana / safeMax) * 100));

    // Dynamic Arcane Crystal selection based on Mana ratio:
    // 1. MAX: currentMana >= maxMana (Radiant glowing crystal with electric aura & sparkle rays)
    // 2. HIGH: currentMana >= maxMana * 0.5 && currentMana < maxMana (Subdued humming blue crystal)
    // 3. LOW: currentMana > 0 && currentMana < maxMana * 0.5 (Subdued humming blue crystal)
    // 4. EMPTY: currentMana === 0 (Dark cracked obsidian crystal)
    let manaIcon = manaIconLow;
    let manaStateClass = 'low';

    if (safeMana >= safeMax) {
        manaIcon = manaIconMax;
        manaStateClass = 'max';
    } else if (safeMana >= safeMax * 0.5) {
        manaIcon = manaIconHigh;
        manaStateClass = 'high';
    } else if (safeMana > 0) {
        manaIcon = manaIconLow;
        manaStateClass = 'low';
    } else {
        manaIcon = manaIconEmpty;
        manaStateClass = 'empty';
    }

    return (
        <div 
            className={`modular-mana-bar-container ${className}`}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {/* Continuous Trough Base Layer: Slate Blue Background + Royal Blue Arcane Fluid Fill (z-index 1 & 2) */}
            <div className="mana-trough-base">
                <div className="mana-trough-empty-bg" />
                <div 
                    className="mana-fill-bar" 
                    style={{ 
                        width: `${manaPercent}%`,
                        backgroundImage: `url(${manaFillTexture})`
                    }} 
                />
                {showText && (
                    <span className="mana-bar-text">
                        {safeMana}/{safeMax}{tempMana > 0 && ` (+${tempMana})`}
                    </span>
                )}
            </div>

            {/* Frame Overlay Layer: Wooden & Brass Frame identical to Health Bar (z-index 3) */}
            <div className="mana-frame-overlay">
                {/* Left Wooden Module & Brass Socket Ring with Arcane Crystal */}
                <div className="mana-module-left">
                    <img src={hpBarLeft} alt="" className="mana-module-frame-left" draggable={false} />
                    <div className={`mana-socket-icon-wrapper mana-state-${manaStateClass}`}>
                        <img src={manaIcon} alt="Mana Status" className="mana-crystal-icon" draggable={false} />
                    </div>
                </div>

                {/* Middle Wooden Channel Rails */}
                <div className="mana-module-middle" style={{ backgroundImage: `url(${hpBarMiddle})` }} />

                {/* Right Wooden Endcap Module */}
                <div className="mana-module-right">
                    <img src={hpBarRight} alt="" className="mana-module-frame-right" draggable={false} />
                </div>
            </div>
        </div>
    );
};

export default ModularManaBar;
