import React from 'react';
import './styles/ClassTip.css';

/**
 * ClassTip — the single shared hover-tooltip body for every class resource bar.
 *
 * Every class tooltip answers the same three questions, in the same order:
 *   1. HOW IT WORKS — what is this resource and how does it flow? (1–2 lines)
 *   2. RIGHT NOW — the live state and what it means for usability.
 *   3. HOW TO USE — how to work it (click / right-click / menu hints).
 *
 * Props:
 *   icon      - glyph (emoji/unicode/♪) or node rendered in the medallion
 *   tint      - accent color for the medallion glow + state pill border
 *   title     - resource name, e.g. "Time Shards"
 *   state     - short live state for the header pill, e.g. "5/10"
 *   stateTone - 'good' | 'warn' | 'bad' | 'neutral' (pill coloring)
 *   mechanic  - string or node: the one-line mechanic
 *   status    - array of strings/nodes: live state bullets (RIGHT NOW).
 *               An entry may also be { text, tone } where tone is
 *               'good' | 'warn' | 'bad' | 'critical' to color that line.
 *   usage     - string or node: how to operate the bar
 *   hint      - optional owner-only footnote (rendered dim italic)
 */
const TONE_COLORS = {
    good: '#4ade80',
    warn: '#fbbf24',
    bad: '#f87171',
    critical: '#ef4444',
    arcane: '#c084fc',
    neutral: '#cbd5e1',
};

const ClassTip = React.forwardRef(({
    icon = '✦',
    tint = '#b7791f',
    title = 'Resource',
    subtitle = null,
    state = null,
    stateTone = 'neutral',
    mechanic = null,
    status = [],
    usage = null,
    hint = null,
    className = '',
    children = null,
}, ref) => {
    const tone = TONE_COLORS[stateTone] || TONE_COLORS.neutral;
    const statusLines = (Array.isArray(status) ? status : [status])
        .filter(Boolean)
        .map((line) => (line && typeof line === 'object' && !React.isValidElement(line)
            ? { text: line.text, tone: line.tone }
            : { text: line, tone: null }));

    return (
        <div ref={ref} className={`class-tip ${className}`.trim()}>
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
                <div className="class-tip-titles">
                    <span className="class-tip-title">{title}</span>
                    {subtitle && <span className="class-tip-subtitle">{subtitle}</span>}
                </div>
                {state !== null && state !== undefined && (
                    <span
                        className={`class-tip-state ${stateTone === 'critical' ? 'critical-pulse' : ''}`}
                        style={{ color: tone, borderColor: tone }}
                    >
                        {state}
                    </span>
                )}
            </div>
            {mechanic && (
                <div className="tooltip-section">
                    <div className="tooltip-label">How it works</div>
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
                                <div
                                    key={i}
                                    className={`class-tip-status-line${line.tone ? ` tone-${line.tone}` : ''}`}
                                >
                                    {line.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {children && (
                <>
                    <div className="tooltip-divider" />
                    <div className="class-tip-custom">
                        {children}
                    </div>
                </>
            )}
            {(usage || hint) && (
                <>
                    <div className="tooltip-divider" />
                    <div className="tooltip-section">
                        <div className="tooltip-label">How to use</div>
                        {usage && <div className="class-tip-usage">{usage}</div>}
                        {hint && <div className="class-tip-hint">{hint}</div>}
                    </div>
                </>
            )}
        </div>
    );
});

ClassTip.displayName = 'ClassTip';

export default ClassTip;
