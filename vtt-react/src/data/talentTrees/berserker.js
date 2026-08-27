// ============================================
// BERSERKER TALENT TREES (v2) — re-export shim
// Trees live in dedicated v2 files; this module preserves the original
// import surface (talentTreeData.js / index.js import from here).
// ============================================

export { BERSERKER_SAVAGE } from './berserkerSavage.js';
export { BERSERKER_JUGGERNAUT } from './berserkerJuggernaut.js';
export { BERSERKER_WARLORD } from './berserkerWarlord.js';

// Legacy compatibility exports
export { BERSERKER_SAVAGE as BERSERKER_PRIMAL_RAGE } from './berserkerSavage.js';
export { BERSERKER_WARLORD as BERSERKER_BLOOD_FRENZY } from './berserkerWarlord.js';
export { BERSERKER_JUGGERNAUT as BERSERKER_SAVAGE_INSTINCTS } from './berserkerJuggernaut.js';
