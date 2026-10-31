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

const COVENBANE_ACCENT = '#4b5563';

export default function CovenbaneResourceDisplay({ resource = null, isOwner = false }) {
  const rawValue = typeof resource === 'number'
    ? resource
    : (resource?.charges ?? resource?.current ?? resource?.value ?? 0);
  const parsedNum = Number(rawValue);
  const charges = Number.isFinite(parsedNum)
    ? Math.max(0, Math.min(6, Math.floor(parsedNum)))
    : 0;

  const frame = pageFrame(240, 48);
  const titleText = `Hexbreaker Charges: ${charges}/6`;
  const descText = `${charges} of 6 cold bog-iron null charges ready for spell disruption.`;

  return (
    <div
      className="covenbane-resource-display"
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
          HEXBREAKER CHARGES
        </text>
        <text x="228" y="14" fontSize="9" fontWeight="700" textAnchor="end" fill={charges > 0 ? inked(COVENBANE_ACCENT) : MUTED}>
          {charges}/6
        </text>

        {/* 6 Cold-Iron Spikes */}
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const active = idx < charges;
          const x = 18 + idx * 35;
          return (
            <g key={idx} transform={`translate(${x}, 20)`}>
              {/* Outer socket */}
              <polygon
                points="14,0 28,11 14,22 0,11"
                fill={active ? washed(COVENBANE_ACCENT, 0.4) : PAPER}
                stroke={active ? inked(COVENBANE_ACCENT) : RULE}
                strokeWidth="1"
              />
              {/* Inner active nail head */}
              {active && (
                <polygon
                  points="14,4 23,11 14,18 5,11"
                  fill={inked(COVENBANE_ACCENT, 0.7)}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
