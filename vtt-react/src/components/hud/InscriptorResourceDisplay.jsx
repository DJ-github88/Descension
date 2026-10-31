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

const INSCRIPTOR_ACCENT = '#1d4ed8';

export default function InscriptorResourceDisplay({ resource = null, isOwner = false }) {
  const resonance = typeof resource === 'number'
    ? Math.max(0, Math.min(10, resource))
    : Math.max(0, Math.min(10, Number(resource?.resonance ?? resource?.value ?? 0)));

  const frame = pageFrame(240, 48);
  const titleText = `Runic Resonance: ${resonance}/10`;
  const descText = `${resonance} of 10 active runic resonance nodes available for lattice activation.`;

  return (
    <div
      className="inscriptor-resource-display"
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

        {/* Header Label */}
        <text x="12" y="14" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="serif" letterSpacing="0.4">
          RUNIC RESONANCE
        </text>
        <text x="228" y="14" fontSize="9" fontWeight="700" textAnchor="end" fill={resonance > 0 ? inked(INSCRIPTOR_ACCENT) : MUTED}>
          {resonance}/10
        </text>

        {/* 10 Lithic Slate Nodes */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
          const active = idx < resonance;
          const x = 12 + idx * 21.6;
          return (
            <g key={idx} transform={`translate(${x}, 20)`}>
              <rect
                x="0"
                y="0"
                width="16"
                height="18"
                rx="2"
                fill={active ? washed(INSCRIPTOR_ACCENT, 0.4) : PAPER}
                stroke={active ? inked(INSCRIPTOR_ACCENT) : RULE}
                strokeWidth="1"
              />
              {/* Rune symbol etched inside */}
              {active ? (
                <path
                  d="M 4 4 L 12 14 M 12 4 L 4 14 M 8 2 L 8 16"
                  stroke={inked(INSCRIPTOR_ACCENT, 0.8)}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              ) : (
                <circle cx="8" cy="9" r="2" fill={RULE} opacity="0.4" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
