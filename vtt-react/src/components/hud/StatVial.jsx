import React, { useState } from 'react';
import ResourceGlyph, { getResourcePhase, legacyStateFor } from './ResourceGlyph';

const TITLES = { health: 'Health', mana: 'Mana', ap: 'Action Points', exhaustion: 'Exhaustion' };

export const EXHAUSTION_STAGES = [
    'Refreshed',
    'Disadvantage on Checks',
    'Speed Halved',
    'Disadvantage on Attacks & Saves',
    'HP Max Halved',
    'Speed Reduced to 0',
    'Death'
];

/**
 * StatVial — corner-mounted state vial for the party HUD.
 * Draws the resource as an SVG glyph (heart flask / crystal / winged boot / exhaustion hourglass)
 * that fills to the live value and cracks, shatters or glows by phase. No numbers on the frame itself — hovering
 * pops a big numeric readout of the exact value.
 */
const StatVial = ({ kind = 'health', current = 0, max = 1, temp = 0, memberName = 'Character', tilt = 0 }) => {
    const isExh = kind === 'exhaustion';
    const safeMax = isExh ? 6 : Math.max(1, max);
    const safeValue = isExh ? Math.min(6, Math.max(0, Math.round(Number(current) || 0))) : Math.max(0, current);
    const safeTemp = Math.max(0, temp);
    const isSurplus = safeTemp > 0;

    const phase = getResourcePhase(safeValue, safeMax, kind);
    const state = legacyStateFor(phase);
    const title = TITLES[kind] || TITLES.health;

    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`party-vial vial-${kind} vial-state-${state}${isSurplus ? ` vial-surplus vial-surplus-${kind}` : ''}`}
            data-phase={phase}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="img"
            aria-label={`${memberName} ${title}: ${safeValue} of ${safeMax}`}
            style={{ '--vial-tilt': `${tilt}deg` }}
        >
            <ResourceGlyph kind={kind} current={safeValue} max={safeMax} surplus={isSurplus} className="party-vial-icon" />
            {hovered && (
                <div className="party-vial-readout" aria-hidden="true">
                    <span className="readout-current">{safeValue}</span>
                    <span className="readout-max">/{safeMax}</span>
                    {safeTemp > 0 && <span className="readout-temp">+{safeTemp}</span>}
                    {isExh && (
                        <span className="readout-stage-name">{EXHAUSTION_STAGES[safeValue]}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatVial;
