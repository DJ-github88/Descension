import React from 'react';
import {
  INK,
  MUTED,
  PAGE,
  PAPER,
  RULE,
  BRICK,
  WARN,
  GOOD,
  pageFrame
} from './calmBarPalette';

export default function DreadnaughtResourceDisplay({ resource = null, isOwner = false }) {
  const psi = typeof resource === 'number'
    ? Math.max(0, Math.min(100, resource))
    : Math.max(0, Math.min(100, Number(resource?.psi ?? resource?.pressure ?? resource?.value ?? 20)));

  const frame = pageFrame(240, 48);
  const isOverheat = psi >= 90;
  const isSupercharged = psi >= 61 && psi < 90;
  const isWorking = psi >= 31 && psi <= 60;

  const statusLabel = isOverheat ? 'OVERHEAT' : isSupercharged ? 'SUPERCHARGED' : isWorking ? 'WORKING' : 'IDLE';
  const statusColor = isOverheat ? BRICK : isSupercharged ? WARN : isWorking ? GOOD : MUTED;

  const barWidth = 120;
  const fillWidth = (psi / 100) * barWidth;
  const titleText = `Furnace Pressure: ${psi} PSI (${statusLabel})`;
  const descText = `${psi} PSI boiler pressure: ${statusLabel}. Safe venting range 0-90 PSI.`;

  return (
    <div
      className="dreadnaught-resource-display"
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
          stroke={isOverheat ? BRICK : RULE}
          strokeWidth={isOverheat ? '1.5' : '1'}
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

        {/* Boiler Dial Icon */}
        <circle cx="28" cy="24" r="14" fill={PAPER} stroke={statusColor} strokeWidth="1.5" />
        <circle cx="28" cy="24" r="2" fill={INK} />
        {/* Dial needle pointing based on PSI (0 to 180 degrees) */}
        {(() => {
          const angle = -180 + (psi / 100) * 180;
          const rad = (angle * Math.PI) / 180;
          const nx = 28 + 9 * Math.cos(rad);
          const ny = 24 + 9 * Math.sin(rad);
          return <line x1="28" y1="24" x2={nx} y2={ny} stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />;
        })()}

        {/* Header Label */}
        <text x="52" y="15" fontSize="8.5" fontWeight="600" fill={INK} fontFamily="serif" letterSpacing="0.4">
          FURNACE PRESSURE
        </text>
        <text x="228" y="15" fontSize="9" fontWeight="700" textAnchor="end" fill={statusColor}>
          {psi} PSI · {statusLabel}
        </text>

        {/* Pressure Progress Bar */}
        <rect x="52" y="21" width={barWidth} height="13" rx="2" fill={PAPER} stroke={RULE} strokeWidth="1" />
        {fillWidth > 0 && (
          <rect
            x="53"
            y="22"
            width={Math.max(0, fillWidth - 2)}
            height="11"
            rx="1.5"
            fill={statusColor}
            opacity="0.75"
          />
        )}

        {/* Danger zone threshold indicator at 90 PSI */}
        <line x1={52 + 0.9 * barWidth} y1="20" x2={52 + 0.9 * barWidth} y2="35" stroke={BRICK} strokeWidth="1" strokeDasharray="1,1" />

        {/* Warning label if overheat */}
        {isOverheat && (
          <text x="180" y="31" fontSize="7" fill={BRICK} fontWeight="700" letterSpacing="0.2">
            VENT REQUIRED
          </text>
        )}
      </svg>
    </div>
  );
}
