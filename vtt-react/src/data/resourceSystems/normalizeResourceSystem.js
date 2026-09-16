import { getClassResourceConfig } from '../classResources';
import { getResourceSystemGuide } from './index';

const PROSE_ICONS = {
 manaRegeneration: 'fa-tint',
 actionPointsRule: 'fa-bolt',
 fortuneRollRule: 'fa-dice-d6',
 practicalExample: 'fa-dice-d20',
 strategicConsiderations: 'fa-lightbulb',
 resourceBarExplanation: 'fa-gauge-high',
 corruptionManifestation: 'fa-exclamation-triangle',
 demonicWhisper: 'fa-book-open',
};

const prettifyKey = (key) =>
 key
  .replace(/Table$/, '')
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, (char) => char.toUpperCase())
  .trim();

const toTableSection = (id, table, meta = {}) => {
 if (!table) return null;
 const headers = meta.headers || table.headers || [];
 const rows = meta.rows || table.rows || [];
 if (!Array.isArray(headers) || headers.length === 0) return null;
 if (!Array.isArray(rows) || rows.length === 0) return null;
 return {
  kind: 'table',
  id,
  title: meta.title || table.title || prettifyKey(id),
  subtitle: meta.subtitle || table.subtitle || null,
  headers,
  rows,
  footnote: meta.footnote || table.footnote || null,
  defaultOpen: Boolean(meta.defaultOpen),
 };
};

/**
 * Build the canonical d8 -> sphere generation table straight from
 * classResources.js so it cannot drift from the combination matrix.
 */
export const buildSphereGenerationTable = (className) => {
 const cfg = getClassResourceConfig(className);
 const elements = cfg?.elements;
 if (!Array.isArray(elements) || elements.length === 0) return null;

 const sorted = [...elements].sort((a, b) => (a.d8Value || 0) - (b.d8Value || 0));
 return {
  kind: 'table',
  id: 'sphereGenerationTable',
  title: `Sphere Generation (Roll ${cfg.mechanics?.generation || 'the generation dice'})`,
  subtitle: 'Each die result produces one sphere in your hand.',
  headers: ['d8', 'Sphere', 'Theme', 'Primary Effects'],
  rows: sorted.map((el) => [String(el.d8Value), el.name, el.theme, el.summary]),
  rowAccents: sorted.map((el) => (el.isGradient ? null : el.color)),
  defaultOpen: false,
 };
};

const parsePipSections = (content) => {
 const lines = content.split('\n');
 const sections = [];
 let current = null;

 const flush = () => {
  if (current) {
   current.body = current.body.join('\n').trim();
   sections.push(current);
   current = null;
  }
 };

 lines.forEach((rawLine) => {
  const line = rawLine.trim();
  if (line === '---') {
   flush();
   return;
  }
  const header = line.match(/^\*\*([^*]+?)\*\*:?\s*(.*)$/);
  if (header) {
   flush();
   current = { title: header[1].trim(), body: header[2] ? [header[2]] : [] };
   return;
  }
  if (!current) current = { title: '', body: [] };
  current.body.push(rawLine);
 });

 flush();
 return sections;
};

const extractMaterials = (sections) => {
 const materials = [];
 sections.forEach((section) => {
  if (/required materials|what you need/i.test(section.title)) {
   section.body.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
     materials.push(trimmed.replace(/^[-•]\s*/, '').replace(/\*\*/g, ''));
    }
   });
  }
 });
 return materials;
};

const normalizePlayingInPerson = (pip, cfg, className) => {
 if (!pip?.content) return null;

 const sections = parsePipSections(pip.content);
 const elements = getClassResourceConfig(className)?.elements;
 const materials = cfg.materials?.length ? cfg.materials : extractMaterials(sections);
 const intro = sections.find((section) => !section.title && section.body)?.body || null;

 let chart = null;
 let colors = null;
 if (Array.isArray(elements) && elements.length > 0) {
  const sorted = [...elements].sort((a, b) => (a.d8Value || 0) - (b.d8Value || 0));
  if (cfg.generateChart) {
   chart = {
    headers: ['d8', 'Sphere', 'Theme', 'Primary Effects'],
    rows: sorted.map((el) => [String(el.d8Value), el.name, el.theme, el.summary]),
    rowAccents: sorted.map((el) => (el.isGradient ? null : el.color)),
   };
  }
  if (cfg.generateColors) {
   colors = sorted.map((el) => ({
    name: el.name,
    color: el.color,
    gradient: Boolean(el.isGradient),
   }));
  }
 }

 const keptSections = sections
  .filter((section) => section.title && section.body)
  .filter((section) => {
   if (cfg.keepSections?.length) {
    return cfg.keepSections.some((keep) =>
     section.title.toLowerCase().includes(keep.toLowerCase())
    );
   }
   // Default: keep the whole physical-tracking guide but drop sections that are
   // extracted (materials) or generated (token colors) above.
   return !/material|what you need|token color|recommended/i.test(section.title);
  })
  .map((section) => ({ title: section.title, content: section.body }));

 return {
  kind: 'playingInPerson',
  id: 'playingInPerson',
  title: pip.title || 'Playing in Person',
  subtitle: pip.subtitle || null,
  intro,
  materials,
  chart,
  colors,
  sections: keptSections,
 };
};

/**
 * Convert a class's resource payload into the three-layer Resource System tab
 * view model. Returns null when the class has no authored v2 guide yet, so the
 * caller can keep rendering the legacy tab.
 */
export const buildResourceSystemView = (classData) => {
 if (!classData) return null;

 const classId = (classData.id || classData.name || '')
  .toLowerCase()
  .replace(/\s+/g, '_');
 const guide = getResourceSystemGuide(classId);
 if (!guide) return null;

 const rs = classData.resourceSystem || {};
 const mechanics = rs.mechanics || {};
 const excluded = new Set(guide.excludeLegacy || []);
 const overrides = guide.sectionOverrides || {};
 const deepDive = [];
 const addDeepDive = (section) => {
  if (section) deepDive.push(section);
 };

 // ---- Deep Dive -----------------------------------------------------------
 if (mechanics.content && !excluded.has('mechanicsContent')) {
  addDeepDive({
   kind: 'prose',
   id: 'mechanicsHowItWorks',
   title: mechanics.title || 'How It Works',
   icon: 'fa-cogs',
   content: mechanics.content,
  });
 }

 if (
  Array.isArray(mechanics.sections) &&
  mechanics.sections.length > 0 &&
  !guide.loop &&
  !excluded.has('sections')
 ) {
  addDeepDive({
   kind: 'steps',
   id: 'mechanicsSteps',
   title: mechanics.title || 'How It Works',
   sections: mechanics.sections,
  });
 }

 if (mechanics.actionTable && !classData.combinationMatrix && !excluded.has('actionTable')) {
  addDeepDive({
   kind: 'actionProfiles',
   id: 'actionTable',
   title: mechanics.actionTable.title,
   subtitle: mechanics.actionTable.subtitle || null,
   actions: mechanics.actionTable.actions || [],
  });
 }

 if (mechanics.manaWarning && !excluded.has('manaWarning')) {
  addDeepDive({
   kind: 'callout',
   id: 'manaWarning',
   tone: 'danger',
   icon: 'fa-tint',
   title: guide.manaWarningTitle || 'Spheres + Mana',
   content: mechanics.manaWarning,
  });
 }

 if (mechanics.comboTiers && !excluded.has('comboTiers')) {
  addDeepDive({ kind: 'tierCards', id: 'comboTiers', ...mechanics.comboTiers });
 }

 (guide.extraSections || []).forEach(addDeepDive);

 if (mechanics.singleSphereFallbacks && !excluded.has('singleSphereFallbacks')) {
  addDeepDive({
   kind: 'abilityCards',
   id: 'singleSphereFallbacks',
   title: mechanics.singleSphereFallbacks.title,
   subtitle: mechanics.singleSphereFallbacks.subtitle || null,
   abilities: mechanics.singleSphereFallbacks.abilities || [],
  });
 }

 ['manaRegeneration', 'actionPointsRule', 'fortuneRollRule'].forEach((key) => {
  const entry = mechanics[key];
  if (entry && !excluded.has(key)) {
   addDeepDive({
    kind: 'prose',
    id: key,
    title: entry.title || prettifyKey(key),
    icon: PROSE_ICONS[key],
    content: entry.content,
   });
  }
 });

 if (classData.combinationMatrix) {
  addDeepDive({
   kind: 'interactive',
   id: 'combinationMatrix',
   title: guide.combinationMatrixTitle || 'The Combination Matrix',
   subtitle:
    guide.combinationMatrixSubtitle ||
    'Pick your spheres to see the formulation, then choose a firing profile.',
  });
 }

 if (Array.isArray(rs.cards) && rs.cards.length > 0 && !excluded.has('cards')) {
  addDeepDive({
   kind: 'cards',
   id: 'cards',
   title: guide.cardsTitle || 'At a Glance',
   cards: rs.cards,
  });
 }

 if (rs.description && guide.includeDescription) {
  addDeepDive({
   kind: 'prose',
   id: 'description',
   title: 'Full Breakdown',
   icon: 'fa-book-open',
   content: rs.description,
  });
 }

 if (rs.practicalExample && !excluded.has('practicalExample')) {
  const override = overrides.practicalExample || {};
  addDeepDive({
   kind: 'prose',
   id: 'practicalExample',
   icon: PROSE_ICONS.practicalExample,
   title: override.title || rs.practicalExample.title || 'Practical Example',
   content: override.content || rs.practicalExample.content,
  });
 }

 if (rs.strategicConsiderations && !excluded.has('strategicConsiderations')) {
  addDeepDive({
   kind: 'prose',
   id: 'strategicConsiderations',
   icon: PROSE_ICONS.strategicConsiderations,
   title: rs.strategicConsiderations.title || 'Strategic Considerations',
   content: rs.strategicConsiderations.content,
  });
 }

 if (rs.overheatRules && !excluded.has('overheatRules')) {
  addDeepDive({
   kind: 'callout',
   id: 'overheatRules',
   tone: 'danger',
   icon: 'fa-fire-alt',
   title: rs.overheatRules.title || 'Overheat',
   content: rs.overheatRules.content,
  });
 }

 if (rs.generationTable && !excluded.has('generationTable')) {
  addDeepDive(
   toTableSection('generationTable', rs.generationTable, {
    title: guide.generationTableTitle || 'Resource Changes at a Glance',
   })
  );
 }

 if (rs.usage && !excluded.has('usage')) {
  const items = Object.entries(rs.usage)
   .filter(([, value]) => typeof value === 'string' && value)
   .map(([key, value]) => ({ label: prettifyKey(key), text: value }));
  if (items.length > 0) {
   addDeepDive({
    kind: 'usage',
    id: 'usage',
    title: guide.usageTitle || 'At the Table',
    items,
   });
  }
 }

 if (rs.keyAbilities && !excluded.has('keyAbilities')) {
  const list = Array.isArray(rs.keyAbilities)
   ? rs.keyAbilities
   : rs.keyAbilities.abilities || [];
  if (list.length > 0) {
   addDeepDive({
    kind: 'abilityCards',
    id: 'keyAbilities',
    title: rs.keyAbilities.title || 'Key Abilities',
    abilities: list.map((ability) =>
     typeof ability === 'string' ? { name: '', description: ability } : ability
    ),
   });
  }
 }

 ['resourceBarExplanation', 'corruptionManifestation', 'demonicWhisper'].forEach((key) => {
  const entry = rs[key];
  if (!entry || excluded.has(key)) return;
  const content = typeof entry === 'string' ? entry : entry.content || entry.description;
  if (!content) return;
  addDeepDive({
   kind: 'prose',
   id: key,
   icon: PROSE_ICONS[key] || 'fa-book-open',
   title: entry.title || prettifyKey(key),
   content,
  });
 });

 // ---- Reference -----------------------------------------------------------
 const reference = [];
 const tableMeta = guide.tableMeta || {};

 if (mechanics.chaosEffectsTable) {
  const merged = { ...mechanics.chaosEffectsTable, ...(overrides.chaosEffectsTable || {}) };
  const table = toTableSection('chaosEffectsTable', merged, { defaultOpen: true });
  if (table) reference.push(table);
 }

 const sphereTable = buildSphereGenerationTable(classData.name);
 const collected = new Map();
 const skipKeys = new Set(['generationTable', 'resourceTables', 'playingInPerson']);
 if (sphereTable) skipKeys.add('sphereGenerationTable');

 Object.entries(rs).forEach(([key, value]) => {
  if (!/Table$/.test(key) || !value || skipKeys.has(key)) return;
  if (!value.headers || !value.rows) return;
  const table = toTableSection(key, value, tableMeta[key] || {});
  if (table) collected.set(key, table);
 });

 if (collected.has('manaCostTable')) {
  reference.push(collected.get('manaCostTable'));
  collected.delete('manaCostTable');
 }
 if (sphereTable) reference.push(sphereTable);
 [...collected.values()]
  .sort((a, b) => a.title.localeCompare(b.title))
  .forEach((table) => reference.push(table));

 if (Array.isArray(rs.resourceTables)) {
  rs.resourceTables.forEach((table, index) => {
   const section = toTableSection(`resourceTables-${index}`, table);
   if (section) reference.push(section);
  });
 }

 if (rs.playingInPerson && !excluded.has('playingInPerson')) {
  const pip = normalizePlayingInPerson(
   rs.playingInPerson,
   guide.playingInPerson || {},
   classData.name
  );
  if (pip) reference.push(pip);
 }

 // ---- Hero + Essentials ---------------------------------------------------
 const hero = {
  title: guide.titleOverride || rs.title || `${classData.name} Resource`,
  subtitle: rs.subtitle || null,
  tagline: guide.tagline || null,
  archetype: guide.archetype || null,
  vitals: guide.vitals || [],
  trackerHint:
   guide.trackerHint ||
   `Interactive preview of the ${classData.name} resource bar. Click or interact with it to see how it behaves in play.`,
 };

 const essentials = {
  loop: guide.loop || null,
  exampleTurn: guide.exampleTurn || null,
  weaveIn: guide.weaveIn || [],
  quickStart: guide.quickStart || null,
 };

 return { classId, hero, essentials, deepDive, reference };
};
