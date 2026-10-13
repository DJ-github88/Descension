/*
 * Shared palette for class resource bar art (calm TTRPG style).
 *
 * Every class bar draws on the same parchment page with the same ink, rule and
 * etching colors; a class keeps its identity through its own glyphs/shapes and
 * one accent ink. Values mirror the --adventure-* tokens in
 * styles/adventurer-windows.css (SVG attributes cannot read CSS variables in
 * every renderer, so they are repeated here as literals).
 *
 * Rules for bar art:
 *  - no <filter>, glows, drop shadows, or looping animations
 *  - page fill + 1px rule frame; filled state = accent wash + accent ink stroke
 *  - empty state = paper fill + rule stroke, glyphs in ETCH
 *  - warnings/danger use BRICK, never neon red
 */

export const INK = '#34251a';
export const MUTED = '#68533e';
export const PAGE = '#f8f5ee';
export const PAPER = '#f1ece1';
export const PANEL = '#e8e2d4';
export const RULE = '#c4baa6';
export const ETCH = '#cdc4b1';
export const BRICK = '#8b3a2a';
export const SEAL = '#663c32';
export const BRASS = '#9a7b3c';
export const GOOD = '#3f6b3a';
export const WARN = '#8a5a12';

const toRgb = (hex) => {
    const h = hex.replace('#', '');
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};
const toHex = (rgb) => `#${rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`;
export const mix = (a, b, t) => {
    const x = toRgb(a);
    const y = toRgb(b);
    return toHex(x.map((v, i) => v + (y[i] - v) * t));
};

/** A class accent toned toward ink so it reads calmly on parchment. */
export const inked = (accent, amount = 0.32) => mix(accent, INK, amount);
/** A pale tint of a class accent for filled segments and sockets. */
export const washed = (accent, amount = 0.2) => mix(PAGE, accent, amount);

/** Standard parchment page + inner ledger rule, in viewBox units. */
export const pageFrame = (w, h, inset = 2.5) => ({
    outer: { x: inset, y: inset, width: w - inset * 2, height: h - inset * 2, rx: 3 },
    inner: { x: inset + 3, y: inset + 3, width: w - (inset + 3) * 2, height: h - (inset + 3) * 2, rx: 1.5 }
});
