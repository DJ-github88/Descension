import React from 'react';
import { getNoteIconDef } from './noteIcons';

// Default colour new connections are created with (see ProfessionalVTTEditor),
// so previews and the placed marker agree.
export const CONNECTION_MARKER_COLOR = '#4a90e2';

// Parchment paper the GM note is drawn on. Mirrors ObjectSystem's canvas
// `renderGMObject` so the palette/placement preview is the placed object.
export const GM_NOTE_PAPER = {
    background: '#f8f4e6',
    border: '#8B4513',
    borderWidth: 2,
    rule: 'rgba(212, 175, 55, 0.3)',
    icon: '#5a1e12'
};

/**
 * Palette / placement preview of a GM note: the exact parchment + icon square
 * ObjectSystem renders on the map, drawn in the DOM so it stays crisp at any
 * zoom and picks up the icon font without a canvas font race.
 */
export const GmNotePreview = ({ size = 64, noteIcon = 'scroll', className, style }) => {
    const icon = getNoteIconDef(noteIcon);
    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: size,
                height: size,
                boxSizing: 'border-box',
                background: GM_NOTE_PAPER.background,
                border: `${GM_NOTE_PAPER.borderWidth}px solid ${GM_NOTE_PAPER.border}`,
                ...style
            }}
        >
            <div style={{ position: 'absolute', left: '10%', right: '10%', top: 0, bottom: 0 }}>
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${i * 20}%`,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: GM_NOTE_PAPER.rule
                        }}
                    />
                ))}
            </div>
            <i
                className={`fas ${icon.icon}`}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: size * 0.45,
                    color: GM_NOTE_PAPER.icon
                }}
            />
        </div>
    );
};

/**
 * The ring glyph drawn inside a connection marker. Identical to the SVG
 * TileOverlay renders for placed connections.
 */
export const ConnectionMarkerGlyph = ({ size = 38, color = CONNECTION_MARKER_COLOR }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
        <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4" fill={color} opacity="0.6" />
        <path d="M12 4 L12 8 M12 16 L12 20 M4 12 L8 12 M16 12 L20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/**
 * Full connection marker (translucent disc + border + ring glyph) used by the
 * catalog card and the placement ghost; TileOverlay composes the same pieces
 * around its interactive wrapper.
 */
export const ConnectionMarker = ({ size = 64, color = CONNECTION_MARKER_COLOR, className, style }) => {
    const borderWidth = Math.max(1, size * 0.1);
    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: size,
                height: size,
                boxSizing: 'border-box',
                borderRadius: '50%',
                border: `${borderWidth}px solid ${color}`,
                backgroundColor: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 ${size * 0.4}px ${color}80, inset 0 0 ${size * 0.25}px ${color}40`,
                ...style
            }}
        >
            <ConnectionMarkerGlyph size={size * 0.6} color={color} />
        </div>
    );
};
