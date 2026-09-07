import React from 'react';
import './styles/ClassTip.css';

/**
 * ClassTip — the single shared hover-tooltip body for every class resource bar.
 *
 * Every class tooltip answers the same three questions, in the same order:
 *   1. MECHANIC — what is this resource and how does it flow? (1–2 lines)
 *   2. RIGHT NOW — the live state and what it means for usability.
 *   3. USE — how to work it (click / right-click / menu hints).
 *
 * Props:
 *   icon      - glyph (emoji/unicode/♪) or node rendered in the medallion
 *   tint      - accent color for the medallion glow + state pill border
 *   title     - resource name, e.g. "Time Shards"
 *   state     - short live state for the header pill, e.g. "5/10"
 *   stateTone - 'good' | 'warn' | 'bad' | 'neutral' (pill coloring)
 *   mechanic  - string or node: the one-line mechanic
 *   status    - array of strings/nodes: live state bullets (RIGHT NOW)
 *   usage     - string or node: how to operate the bar
 *   hint      - optional owner-only footnote (rendered dim italic)
 */
const TONE_COLORS = {
    good: '#2d8a4e',
    warn: '#b7791f',
    bad: '#c0392b',
    neutral: 'rgba(58,42,26,0.55)',
};

const ClassTip = ({
    icon = '✦',
    tint = '#b7791f',
    title = 'Resource',
    state = null,
    stateTone = 'neutral',
    mechanic = null,
    status = [],
    usage = null,
    hint = null,
}) => {
    const tone = TONE_COLORS[stateTone] || TONE_COLORS.neutral;
    const statusLines = Array.isArray(status) ? status.filter(Boolean) : [status].filter(Boolean);

    return (
        <div className="class-tip">
            <div className="class-tip-header">
                <span
                    className="class-tip-medallion"
                    style={{ '--tip-tint': tint }}
                    aria-hidden="true"
                >
                    {typeof icon === 'string' && (icon.startsWith('fa') || icon.includes('fa-')) ? (
                        <i className={icon} />
                    ) : (
                        icon
                    )}
                </span>
                <span className="class-tip-title">{title}</span>
                {state !== null && state !== undefined && (
                    <span
                        className="class-tip-state"
                        style={{ color: tone, borderColor: tone }}
                    >
                        {state}
                    </span>
                )}
            </div>
            {mechanic && (
                <div className="tooltip-section">
                    <div className="tooltip-label">Mechanic</div>
                    <div className="class-tip-mechanic">{mechanic}</div>
                </div>
            )}
            {statusLines.length > 0 && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-section">
                        <div className="tooltip-label">Right now</div>
                        <div className="class-tip-status">
                            {statusLines.map((line, i) => (
                                <div key={i} className="class-tip-status-line">{line}</div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {(usage || hint) && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-section">
                        <div className="tooltip-label">Use</div>
                        {usage && <div className="class-tip-usage">{usage}</div>}
                        {hint && <div className="class-tip-hint">{hint}</div>}
                    </div>
                </>
            )}
        </div>
    );
};

export default ClassTip;
