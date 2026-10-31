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

const TOTEMIST_ACCENT = '#d97706'; // Terracotta Amber

export default function TotemistResourceDisplay({ resource = null, isOwner = false }) {
  const attunement = typeof resource === 'number'
    ? Math.max(0, Math.min(10, resource))
    : Math.max(0, Math.min(10, Number(resource?.attunement ?? resource?.value ?? 0)));

  const activePylons = Math.max(0, Math.min(3, Number(resource?.activePylons ?? resource?.pylons ?? 0)));

  const frame = pageFrame(240, 48);
  const barWidth = 100;
  const fillWidth = (attunement / 10) * barWidth;
  const titleText = `Conduit Attunement: ${attunement}/10, Pylons: ${activePylons}/3`;
  const descText = `${attunement} of 10 conduit attunement. ${activePylons} of 3 active standing pylons deployed on tactical grid.`;

  return (
    <div
      className="totemist-resource-display"
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

        {/* 3 Physical Pylon Socket Icons */}
        {[0, 1, 2].map((idx) => {
          const active = idx < activePylons;
          const px = 14 + idx * 18;
          return (
            <g key={idx} transform={`translate(${px}, 16)`}>
              {/* Lithic standing pylon stone */}
              <polygon
                points="7,0 12,18 2,18"
                fill={active ? washed(TOTEMIST_ACCENT, 0.5) : PAPER}
                stroke={active ? inked(TOTEMIST_ACCENT) : RULE}
                strokeWidth="1"
              />
              {active && <circle cx="7" cy="11" r="1.5" fill={inked(TOTEMIST_ACCENT, 0.9)} />}
            </g>
          );
        })}

        {/* Header Label */}
        <text x="74" y="15" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="serif" letterSpacing="0.4">
          CONDUIT ATTUNEMENT
        </text>
        <text x="228" y="15" fontSize="9" fontWeight="700" textAnchor="end" fill={inked(TOTEMIST_ACCENT)}>
          {activePylons}/3 Pylons · {attunement}/10
        </text>

        {/* Attunement Gauge */}
        <rect x="74" y="21" width={barWidth} height="13" rx="2" fill={PAPER} stroke={RULE} strokeWidth="1" />
        {fillWidth > 0 && (
          <rect
            x="75"
            y="22"
            width={Math.max(0, fillWidth - 2)}
            height="11"
            rx="1.5"
            fill={washed(TOTEMIST_ACCENT, 0.7)}
          />
        )}

        {/* Threshold ticks */}
        {[2, 4, 6, 8].map((t) => (
          <line
            key={t}
            x1={74 + (t / 10) * barWidth}
            y1="21"
            x2={74 + (t / 10) * barWidth}
            y2="34"
            stroke={RULE}
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}

        <text x="180" y="31" fontSize="7" fill={MUTED} letterSpacing="0.2">
          RESONANCE
        </text>
      </svg>
    </div>
  );
}
