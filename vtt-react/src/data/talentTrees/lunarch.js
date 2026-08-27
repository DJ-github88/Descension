// ============================================
// LUNARCH TALENT TREES (v2) — re-export shim
// Trees live in dedicated v2 files; this module preserves the original
// import surface (talentTreeData.js / index.js import from here).
// ============================================

export { LUNARCH_HOLLOW_SENTINEL } from './lunarchHollowSentinel.js';
export { LUNARCH_SILENCE_SPEAKER } from './lunarchSilenceSpeaker.js';
export { LUNARCH_SANGUINE_WARDEN } from './lunarchSanguineWarden.js';

// Legacy compatibility exports
export { LUNARCH_HOLLOW_SENTINEL as LUNARCH_MOONLIGHT_SENTINEL } from './lunarchHollowSentinel.js';
export { LUNARCH_SILENCE_SPEAKER as LUNARCH_STARFALL_INVOKER } from './lunarchSilenceSpeaker.js';
export { LUNARCH_SANGUINE_WARDEN as LUNARCH_MOONWELL_GUARDIAN } from './lunarchSanguineWarden.js';
