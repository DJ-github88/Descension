import React, { useState } from 'react';
import hpIconMax from '../../assets/ui/hp-icon-max.png';
import hpIconHigh from '../../assets/ui/hp-icon-high.png';
import hpIconLow from '../../assets/ui/hp-icon-low.png';
import hpIconEmpty from '../../assets/ui/hp-icon-empty.png';
import manaIconMax from '../../assets/ui/mana-icon-max.png';
import manaIconHigh from '../../assets/ui/mana-icon-high.png';
import manaIconLow from '../../assets/ui/mana-icon-low.png';
import manaIconEmpty from '../../assets/ui/mana-icon-empty.png';
import apIconMax from '../../assets/ui/ap-icon-max.png';
import apIconHigh from '../../assets/ui/ap-icon-high.png';
import apIconLow from '../../assets/ui/ap-icon-low.png';
import apIconEmpty from '../../assets/ui/ap-icon-empty.png';

const ICONS = {
    health: { max: hpIconMax, high: hpIconHigh, low: hpIconLow, empty: hpIconEmpty },
    mana: { max: manaIconMax, high: manaIconHigh, low: manaIconLow, empty: manaIconEmpty },
    ap: { max: apIconMax, high: apIconHigh, low: apIconLow, empty: apIconEmpty },
};

const TITLES = { health: 'Health', mana: 'Mana', ap: 'Action Points' };

/**
 * StatVial — corner-mounted state vial for the party HUD.
 * Reuses the existing four-state asset sets (bottle / crystal / boot), tilted
 * and pinned on the frame corners. No numbers on the frame itself — hovering
 * pops a big numeric readout of the exact value.
 */
const StatVial = ({ kind = 'health', current = 0, max = 1, temp = 0, memberName = 'Character', tilt = 0 }) => {
    const safeMax = Math.max(1, max);
    const safeValue = Math.max(0, current);
    const safeTemp = Math.max(0, temp);
    const isSurplus = safeTemp > 0;

    let state = 'empty';
    if (safeValue >= safeMax) state = 'max';
    else if (safeValue / safeMax >= 0.5) state = 'high';
    else if (safeValue > 0) state = 'low';

    const icon = (ICONS[kind] || ICONS.health)[state];
    const title = TITLES[kind] || TITLES.health;

    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`party-vial vial-${kind} vial-state-${state}${isSurplus ? ` vial-surplus vial-surplus-${kind}` : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="img"
            aria-label={`${memberName} ${title}: ${safeValue} of ${safeMax}`}
            style={{ '--vial-tilt': `${tilt}deg` }}
        >
            <img src={icon} alt="" className="party-vial-icon" draggable={false} />
            {hovered && (
                <div className="party-vial-readout" aria-hidden="true">
                    <span className="readout-current">{safeValue}</span>
                    <span className="readout-max">/{safeMax}</span>
                    {safeTemp > 0 && <span className="readout-temp">+{safeTemp}</span>}
                </div>
            )}
        </div>
    );
};

export default StatVial;
