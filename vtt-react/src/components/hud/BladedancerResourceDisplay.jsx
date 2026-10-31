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

const BLADEDANCER_ACCENT = '#e11d48'; // Rose Blade Steel

export default function BladedancerResourceDisplay({ resource = null, isOwner = false }) {
  const momentum = typeof resource === 'number'
    ? Math.max(0, Math.min(10, resource))
    : Math.max(0, Math.min(10, Number(resource?.momentum ?? resource?.value ?? 0)));

  const frame = pageFrame(240, 48);
  const tier = momentum >= 9 ? 'PRESTO' : momentum >= 6 ? 'ALLEGRO' : momentum >= 3 ? 'ANDANTE' : 'ADAGIO';
  const titleText = `Kinetic Momentum: ${momentum}/10 (${tier})`;
  const descText = `${momentum} of 10 momentum points. Current flow tempo: ${tier}.`;

  const TIERS = [
    { label: 'ADAGIO', range: [0, 2], min: 0 },
    { label: 'ANDANTE', range: [3, 5], min: 3 },
    { label: 'ALLEGRO', range: [6, 8], min: 6 },
    { label: 'PRESTO', range: [9, 10], min: 9 }
  ];

  return (
    <div
      className="bladedancer-resource-display"
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

        {/* Crossed Scimitars Icon */}
        <g transform="translate(14, 15)">
          <path d="M 2 2 Q 12 10 22 2 M 2 18 Q 12 10 22 18" stroke={inked(BLADEDANCER_ACCENT)} strokeWidth="1.2" fill="none" />
          <circle cx="12" cy="10" r="2" fill={INK} />
        </g>

        {/* Header Label */}
        <text x="46" y="15" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="serif" letterSpacing="0.4">
          KINETIC MOMENTUM
        </text>
        <text x="228" y="15" fontSize="9" fontWeight="700" textAnchor="end" fill={momentum >= 6 ? inked(BLADEDANCER_ACCENT) : INK}>
          {momentum}/10 · {tier}
        </text>

        {/* 4 Tiered Tempo Blocks */}
        {TIERS.map((t, idx) => {
          const isActive = momentum >= t.min;
          const isCurrentTier = (idx === 0 && momentum <= 2)
            || (idx === 1 && momentum >= 3 && momentum <= 5)
            || (idx === 2 && momentum >= 6 && momentum <= 8)
            || (idx === 3 && momentum >= 9);

          const bx = 46 + idx * 44;
          return (
            <g key={t.label}>
              <rect
                x={bx}
                y="21"
                width="40"
                height="13"
                rx="2"
                fill={isActive ? washed(BLADEDANCER_ACCENT, 0.4 + idx * 0.15) : PAPER}
                stroke={isCurrentTier ? inked(BLADEDANCER_ACCENT) : RULE}
                strokeWidth={isCurrentTier ? '1.2' : '0.8'}
              />
              <text
                x={bx + 20}
                y="30.5"
                fontSize="6.5"
                fontWeight={isCurrentTier ? '700' : '500'}
                textAnchor="middle"
                fill={isActive ? inked(BLADEDANCER_ACCENT) : RULE}
                letterSpacing="0.2"
              >
                {t.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
