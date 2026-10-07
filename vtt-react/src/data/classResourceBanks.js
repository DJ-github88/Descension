import { migrateBlockId } from '../utils/arcanoneerMigration';
import { resolveClassResourceEngineId } from './classResourceAliases';

export const ARCANONEER_ELEMENTS = Object.freeze(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd']);
export const ARCANONEER_BANK_MAX = 12;
export const ARCANONEER_ROLL_COUNT = 4;
export const MINSTREL_PITCHES = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
export const MINSTREL_MAX_PER_PITCH = 5;
export const MINSTREL_BANK_MAX = MINSTREL_PITCHES.length * MINSTREL_MAX_PER_PITCH;

export const toCanonicalSphere = key => {
  if (typeof key !== 'string') return null;
  const clean = key.trim().toLowerCase().replace(/_sphere$/, '');
  const id = migrateBlockId(({ holy: 'sacred', necrotic: 'blight', lightning: 'storm' })[clean] || clean);
  return ARCANONEER_ELEMENTS.includes(id) ? id : null;
};

const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.trunc(Number(value))) : 0;
const pitch = key => typeof key === 'string' ? key.replace(/^note_/i, '').toUpperCase() : null;
export const normalizeSphereBank = bank => Array.isArray(bank) ? bank.map(toCanonicalSphere).filter(Boolean).slice(0, ARCANONEER_BANK_MAX) : [];
export const normalizeNoteBank = bank => {
  const notes = MINSTREL_PITCHES.map(() => 0);
  if (Array.isArray(bank)) {
    if (bank.length && bank.every(value => MINSTREL_PITCHES.includes(pitch(value)))) {
      bank.forEach(value => { notes[MINSTREL_PITCHES.indexOf(pitch(value))] += 1; });
    } else notes.forEach((_, index) => { notes[index] = count(bank[index]); });
  } else if (bank && typeof bank === 'object') {
    Object.entries(bank).forEach(([key, value]) => {
      const index = MINSTREL_PITCHES.indexOf(pitch(key));
      if (index >= 0) notes[index] = count(value);
    });
  }
  return notes.map(value => Math.min(MINSTREL_MAX_PER_PITCH, value));
};

export function getBankResourceId(resource, className) {
  if (className) {
    const name = String(className).replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
    return name === 'arcanoneer' ? 'elementalSpheres' : name === 'minstrel' ? 'musicalNotes' : null;
  }
  const id = resolveClassResourceEngineId(resource?.type);
  return ['elementalSpheres', 'musicalNotes'].includes(id) ? id : null;
}

export function normalizeBankResource(resource, className) {
  if (!resource) return resource;
  const id = getBankResourceId(resource, className);
  if (id === 'elementalSpheres') {
    const spheres = normalizeSphereBank(resource.spheres);
    const unrecognized = Array.isArray(resource.spheres) ? resource.spheres.filter(value => !toCanonicalSphere(value)) : [];
    return { ...resource, type: id, spheres, current: spheres.length, max: ARCANONEER_BANK_MAX,
      rollsPerTurn: ARCANONEER_ROLL_COUNT,
      ...(unrecognized.length ? { unrecognizedSpheres: [...(resource.unrecognizedSpheres || []), ...unrecognized] } : {}) };
  }
  if (id === 'musicalNotes') {
    const notes = normalizeNoteBank(resource.notes);
    return { ...resource, type: id, notes, current: notes.reduce((sum, value) => sum + value, 0),
      max: MINSTREL_BANK_MAX, maxPerNote: MINSTREL_MAX_PER_PITCH, totalNotes: MINSTREL_PITCHES.length };
  }
  return resource;
}

// Explicit structured encodings take precedence over their duplicate summaries.
// No pitch/category is inferred from prose or from an untyped generic gain.
export function extractSphereRequirementsAndGains(spell = {}) {
  if (!spell) return { costs: [], gains: [], valid: true };
  const values = spell.resourceCost?.resourceValues || {};
  const parseList = value => {
    if (Array.isArray(value)) return value.map(toCanonicalSphere);
    if (typeof value !== 'string') return [null];
    return value.split(/[+,/&]/).flatMap(part => {
      const match = part.trim().match(/^(\d+)?\s*([a-zA-Z_]+)$/);
      if (!match) return [null];
      const amount = Number(match[1] || 1);
      return amount > ARCANONEER_BANK_MAX ? [null] : Array(amount).fill(toCanonicalSphere(match[2]));
    });
  };
  const fromValues = (entries, gains) => Object.entries(entries).flatMap(([key, value]) => {
    const isGain = /generate|gain/i.test(key);
    const clean = key.replace(/(_generate|_gain|generate_|gain_)/gi, '');
    const element = toCanonicalSphere(clean);
    if (!element || isGain !== gains) return [];
    const amount = Number(value);
    return !Number.isInteger(amount) || amount < 0 || amount > ARCANONEER_BANK_MAX ? [null] : Array(amount).fill(element);
  });
  const explicitCosts = spell._arcanoneerElements ?? spell.elements ?? spell.resourceCost?.spheres ?? spell.sphereCost;
  const explicitGains = spell.sphereGenerate ?? spell.sphereGain ?? spell.resourceGain?.spheres;
  let costs = explicitCosts !== undefined ? parseList(explicitCosts) : fromValues(values, false);
  if (explicitCosts === undefined && !costs.length && !Object.keys(values).some(key => toCanonicalSphere(key))) {
    costs = (spell.resourceCost?.resourceTypes || []).map(toCanonicalSphere).filter(Boolean);
  }
  const gains = explicitGains !== undefined ? parseList(explicitGains)
    : spell.resourceGain?.resourceValues ? fromValues(Object.fromEntries(Object.entries(spell.resourceGain.resourceValues).map(([key, value]) => [`${key}_gain`, value])), true)
    : fromValues(values, true);
  return { costs, gains, valid: !costs.includes(null) && !gains.includes(null) };
}

export function getBankSpellResourcePlan(spell, resource, className) {
  const generic = spell.resourceCost?.classResource ?? spell.resourceCost?.resourceValues?.classResource ?? {};
  const combo = spell.musicalCombo ?? spell.specialMechanics?.musicalCombo ?? {};
  const noteValues = Object.entries(spell.resourceCost?.resourceValues || {}).filter(([key]) => /^note_/i.test(key));
  const noteCosts = spell._cadenceNotes ?? spell.notes ?? spell.resourceCost?.notes ?? combo.requires ??
    (noteValues.length ? Object.fromEntries(noteValues.filter(([, value]) => Number(value) < 0).map(([key, value]) => [key, -Number(value)])) : undefined);
  const noteGains = spell.noteGenerate ?? spell.resourceGain?.notes ?? combo.generates ??
    (noteValues.length ? Object.fromEntries(noteValues.filter(([, value]) => Number(value) >= 0).map(([key, value]) => [key, Number(value)])) : undefined);
  const spheres = extractSphereRequirementsAndGains(spell);
  const genericId = resolveClassResourceEngineId(generic.type);
  const id = noteCosts !== undefined || noteGains !== undefined ? 'musicalNotes'
    : spheres.costs.length || spheres.gains.length ? 'elementalSpheres'
    : ['musicalNotes', 'elementalSpheres'].includes(genericId) ? genericId : null;
  if (!id) return { handled: false };
  const owned = getBankResourceId(resource, className) === id;
  const normalized = normalizeBankResource(resource || {}, id === 'musicalNotes' ? 'Minstrel' : 'Arcanoneer');
  const field = id === 'musicalNotes' ? 'notes' : 'spheres';
  let valid = id === 'elementalSpheres' ? spheres.valid
    : noteValues.every(([key, value]) => MINSTREL_PITCHES.includes(pitch(key)) && Number.isInteger(Number(value)));
  const parseNotes = source => {
    if (source === undefined) return [];
    const entries = Array.isArray(source) ? source.map(entry => [entry?.note, entry?.count]) : Object.entries(source || {});
    return entries.flatMap(([key, value]) => {
      const numeral = pitch(key);
      const amount = Number(value);
      if (!MINSTREL_PITCHES.includes(numeral) || !Number.isInteger(amount) || amount < 0 || amount > MINSTREL_BANK_MAX) {
        valid = false;
        return [];
      }
      return Array(amount).fill(numeral);
    });
  };
  let costs = id === 'musicalNotes' ? parseNotes(noteCosts) : [...spheres.costs];
  const gains = id === 'musicalNotes' ? parseNotes(noteGains) : [...spheres.gains];
  const explicitCosts = id === 'musicalNotes' ? noteCosts !== undefined
    : spell._arcanoneerElements !== undefined || spell.elements !== undefined || spell.resourceCost?.spheres !== undefined || spell.sphereCost !== undefined || costs.length > 0;
  const bankItems = id === 'musicalNotes' ? normalized.notes.flatMap((amount, index) => Array(amount).fill(MINSTREL_PITCHES[index])) : [...normalized.spheres];
  if (!explicitCosts && generic.cost !== undefined) {
    const amount = generic.cost === 'all' ? bankItems.length : Number(generic.cost);
    if (!Number.isInteger(amount) || amount < 0 || amount > bankItems.length || (generic.cost === 'all' && amount === 0)) valid = false;
    else costs = bankItems.slice(0, amount);
  }
  if (!gains.length && generic.gain !== undefined && Number(generic.gain) !== 0 && (id === 'musicalNotes' ? noteGains === undefined : !spell.sphereGenerate && !spell.sphereGain && !spell.resourceGain?.spheres)) valid = false;
  const remaining = [...bankItems];
  costs.forEach(key => {
    const index = remaining.indexOf(key);
    if (index < 0) valid = false;
    else remaining.splice(index, 1);
  });
  const nextResource = normalizeBankResource({ ...normalized, [field]: field === 'notes'
    ? MINSTREL_PITCHES.map(key => [...remaining, ...gains].filter(value => value === key).length)
    : [...remaining, ...gains] }, id === 'musicalNotes' ? 'Minstrel' : 'Arcanoneer');
  return { handled: true, bank: field, id, resourceKey: generic.type, current: normalized.current,
    cost: costs.length, gain: gains.length, required: 0, costs, gains, nextResource, affordable: owned && valid,
    label: id === 'musicalNotes' ? 'Musical Notes' : 'Elemental Spheres' };
}

export function changeBankResource(resource, className, amount, resourceKey) {
  const normalized = normalizeBankResource(resource, className);
  const id = getBankResourceId(normalized, className);
  const key = id === 'musicalNotes' ? (MINSTREL_PITCHES.includes(pitch(resourceKey)) ? pitch(resourceKey) : null) : toCanonicalSphere(resourceKey);
  if (!Number.isInteger(amount)) return normalized;
  if (amount > 0 && !key) return normalized;
  const field = id === 'musicalNotes' ? 'notes' : 'spheres';
  const items = field === 'notes' ? normalized.notes.flatMap((value, index) => Array(value).fill(MINSTREL_PITCHES[index])) : [...normalized.spheres];
  if (amount > 0) items.push(...Array(Math.min(amount, id === 'musicalNotes' ? MINSTREL_MAX_PER_PITCH : ARCANONEER_BANK_MAX)).fill(key));
  else {
    const available = key ? items.filter(value => value === key).length : items.length;
    if (available < -amount) return normalized;
    for (let n = 0; n < -amount; n++) items.splice(key ? items.indexOf(key) : 0, 1);
  }
  return normalizeBankResource({ ...normalized, [field]: field === 'notes'
    ? MINSTREL_PITCHES.map(numeral => items.filter(value => value === numeral).length) : items }, className);
}
