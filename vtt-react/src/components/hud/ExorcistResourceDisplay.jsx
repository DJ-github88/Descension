import React from 'react';
import {
  INK,
  PAGE,
  PAPER,
  RULE,
  BRICK,
  inked,
  pageFrame,
  washed
} from './calmBarPalette';

const EXORCIST_ACCENT = '#4f46e5';

export default function ExorcistResourceDisplay({ resource = null, isOwner = false }) {
  const sanctity = typeof resource === 'number'
    ? Math.max(0, Math.min(10, resource))
    : Math.max(0, Math.min(10, Number(resource?.sanctity ?? resource?.value ?? 3)));

  const frame = pageFrame(240, 48);
  const titleText = `Purification Sanctity: ${sanctity}/10`;
  const descText = `${sanctity} of 10 purification sanctity points available for expulsion and salt rites.`;
  const barWidth = 140;
  const fillWidth = (sanctity / 10) * barWidth;

  return (
    <div
      className="exorcist-resource-display"
      style={{ width: '100%', maxWidth: 360, margin: '0 auto', boxSizing: 'border-box' }}
    >
      <svg
        viewBox="0 0 240 48"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: 'auto' }}
        role="img"
        aria-label={titleText}
      >
        <title>{titleText}</title>
        <desc>{descText}</desc>
        <rect
          x={frame.outer.x}
          y={frame.outer.y}
          width={frame.outer.width}
          height={frame.outer.height}
          rx={frame.outer.rx}
          fill={PAGE}
          stroke={RULE}
          strokeWidth="1"
        />
        <rect
          x={frame.inner.x}
          y={frame.inner.y}
          width={frame.inner.width}
          height={frame.inner.height}
          rx={frame.inner.rx}
          fill="none"
          stroke={RULE}
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* Sacred Salt Circle Emblem */}
        <circle cx="28" cy="24" r="13" fill={sanctity > 0 ? washed(EXORCIST_ACCENT, 0.25) : PAPER} stroke={inked(EXORCIST_ACCENT, 0.4)} strokeWidth="1.2" />
        <circle cx="28" cy="24" r="9" fill="none" stroke={RULE} strokeWidth="0.8" strokeDasharray="2,2" />
        <path d="M 28 15 L 28 33 M 19 24 L 37 24" stroke={inked(EXORCIST_ACCENT)} strokeWidth="1.2" />

        {/* Header Label */}
        <text x="52" y="15" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="serif" letterSpacing="0.4">
          PURIFICATION SANCTITY
        </text>
        <text x="228" y="15" fontSize="9" fontWeight="700" textAnchor="end" fill={sanctity === 0 ? BRICK : inked(EXORCIST_ACCENT)}>
          {sanctity}/10
        </text>

        {/* Sanctity Meter Bar */}
        <rect x="52" y="21" width={barWidth} height="13" rx="2" fill={PAPER} stroke={RULE} strokeWidth="1" />
        {fillWidth > 0 && (
          <rect
            x="53"
            y="22"
            width={Math.max(0, fillWidth - 2)}
            height="11"
            rx="1.5"
            fill={sanctity === 0 ? BRICK : washed(EXORCIST_ACCENT, 0.6)}
          />
        )}

        {/* Tick markers */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((tick) => (
          <line
            key={tick}
            x1={52 + (tick / 10) * barWidth}
            y1="21"
            x2={52 + (tick / 10) * barWidth}
            y2="34"
            stroke={RULE}
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}

        {/* Warning text if zero */}
        {sanctity === 0 && (
          <text x="52" y="42" fontSize="7" fill={BRICK} fontWeight="600">
            SANCTITY DEPLETED — DISADVANTAGE VS INTRUSION
          </text>
        )}
      </svg>
    </div>
  );
}
