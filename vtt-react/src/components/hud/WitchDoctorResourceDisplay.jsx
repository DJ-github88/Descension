import React from 'react';
import {
  INK,
  MUTED,
  PAGE,
  PAPER,
  RULE,
  inked,
  pageFrame,
  washed
} from './calmBarPalette';

const WITCH_DOCTOR_ACCENT = '#15803d'; // Bog Moss Green

export default function WitchDoctorResourceDisplay({ resource = null, isOwner = false }) {
  const tallow = typeof resource === 'number'
    ? Math.max(0, Math.min(100, resource))
    : Math.max(0, Math.min(100, Number(resource?.tallow ?? resource?.essence ?? resource?.value ?? 50)));

  const frame = pageFrame(240, 48);
  const barWidth = 135;
  const fillWidth = (tallow / 100) * barWidth;
  const titleText = `Bog Tallow: ${tallow}/100`;
  const descText = `${tallow} of 100 bog tallow units available for sympathetic effigy poppets and miasma brewing.`;

  return (
    <div
      className="witch-doctor-resource-display"
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

        {/* Clay Crucible / Effigy Vessel Icon */}
        <g transform="translate(14, 15)">
          <path
            d="M 3 5 Q 12 20 21 5 Z"
            fill={washed(WITCH_DOCTOR_ACCENT, 0.4)}
            stroke={inked(WITCH_DOCTOR_ACCENT)}
            strokeWidth="1.2"
          />
          {/* Bone needle piercing */}
          <line x1="1" y1="2" x2="23" y2="18" stroke={INK} strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Header Label */}
        <text x="46" y="15" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="serif" letterSpacing="0.4">
          BOG TALLOW
        </text>
        <text x="228" y="15" fontSize="9" fontWeight="700" textAnchor="end" fill={inked(WITCH_DOCTOR_ACCENT)}>
          {tallow}%
        </text>

        {/* Tallow Fill Gauge */}
        <rect x="46" y="21" width={barWidth} height="13" rx="2" fill={PAPER} stroke={RULE} strokeWidth="1" />
        {fillWidth > 0 && (
          <rect
            x="47"
            y="22"
            width={Math.max(0, fillWidth - 2)}
            height="11"
            rx="1.5"
            fill={washed(WITCH_DOCTOR_ACCENT, 0.7)}
          />
        )}

        {/* 20 Tallow Poppet molding notches */}
        {[20, 40, 60, 80].map((val) => (
          <line
            key={val}
            x1={46 + (val / 100) * barWidth}
            y1="21"
            x2={46 + (val / 100) * barWidth}
            y2="34"
            stroke={RULE}
            strokeWidth="0.8"
            opacity="0.6"
          />
        ))}

        <text x="188" y="31" fontSize="7" fill={MUTED} letterSpacing="0.2">
          POPPET = 20
        </text>
      </svg>
    </div>
  );
}
