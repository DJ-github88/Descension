/**
 * Talent Icon De-duplicator
 * =========================
 * Ensures no single talent tree renders the same icon twice.
 *
 * Root cause: many distinct WoW icon ids map to the same local ability art in
 * assetManager's convertWowIconToAbilityIcon(), and unmapped ids all fall back
 * to 'Arcane/Abstract Rune'. Trees authored with WoW ids therefore show
 * repeated icons.
 *
 * Strategy: resolve every node's icon. For any icon repeated inside one tree,
 * keep the first node and rewrite the duplicates' `icon` field to a distinct,
 * same-theme local ability path that exists on disk and is not already used in
 * that tree. Global usage counts spread picks so the same art is not reused
 * everywhere.
 *
 * Usage: node src/utils/talentIconDedupe.cjs [--dry]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const DRY = process.argv.includes('--dry');

const ROOT = path.resolve(__dirname, '..', '..');
const AM_PATH = path.join(ROOT, 'src', 'utils', 'assetManager.js');
const TREES_DIR = path.join(ROOT, 'src', 'data', 'talentTrees');
const ICONS_DIR = path.join(ROOT, 'public', 'assets', 'icons', 'abilities');

const FALLBACK = 'Arcane/Abstract Rune';
const EXCLUDED_FILES = new Set(['index.js', 'debug_script.js', 'transform_descriptions.js']);

// ---------------------------------------------------------------------------
// 1. Extract the WoW -> local ability icon mapping straight from assetManager
// ---------------------------------------------------------------------------
function loadIconMapping() {
  const text = fs.readFileSync(AM_PATH, 'utf8');
  const start = text.indexOf('const iconMapping = {');
  if (start === -1) throw new Error('iconMapping not found in assetManager.js');
  const braceStart = text.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < text.length; i++) {
    const c = text[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  // eslint-disable-next-line no-eval
  return eval('(' + text.slice(braceStart, end + 1) + ')');
}

// ---------------------------------------------------------------------------
// 2. Discover the local ability icons that actually exist on disk
// ---------------------------------------------------------------------------
function loadAvailableIcons() {
  const byFolder = {};
  const all = [];
  const hash = {};
  if (!fs.existsSync(ICONS_DIR)) throw new Error(`Icons dir not found: ${ICONS_DIR}`);
  for (const folder of fs.readdirSync(ICONS_DIR, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    const names = [];
    for (const file of fs.readdirSync(path.join(ICONS_DIR, folder.name))) {
      if (!file.toLowerCase().endsWith('.png')) continue;
      const iconPath = `${folder.name}/${file.replace(/\.png$/i, '')}`;
      const buf = fs.readFileSync(path.join(ICONS_DIR, folder.name, file));
      hash[iconPath] = crypto.createHash('md5').update(buf).digest('hex');
      names.push(iconPath);
      all.push(iconPath);
    }
    names.sort();
    byFolder[folder.name] = names;
  }
  return { byFolder, all, hash };
}

function folderOf(iconPath) {
  const i = (iconPath || '').indexOf('/');
  return i === -1 ? null : iconPath.slice(0, i);
}

function derivedFolder(wowId) {
  const s = (wowId || '').toLowerCase();
  if (/holy|radiant|divine|sacred|hallow/.test(s)) return 'Radiant';
  if (/arcane|enchant/.test(s)) return 'Arcane';
  if (/fire|flame|burn|ember|inferno/.test(s)) return 'Fire';
  if (/frost|ice|chill|freez/.test(s)) return 'Frost';
  if (/nature|storm|earth|wind|wolf|thorn|root|moon/.test(s)) return 'Nature';
  if (/shadow|necro|death|unholy|wither|plague|drain|skull|blood/.test(s)) return 'Necrotic';
  if (/poison|venom|acid|toxic|corros/.test(s)) return 'Poison';
  if (/lightning|thunder|shock/.test(s)) return 'Lightning';
  if (/psychic|mind|psionic/.test(s)) return 'Psychic';
  if (/void|nether|shadow.*void/.test(s)) return 'Void';
  if (/force|shield|barrier|ward|protect/.test(s)) return 'Force';
  if (/bludgeon|crush|stomp|hammer|mace/.test(s)) return 'Bludgeoning';
  if (/slash|cleave|sword|axe|blade|bleed/.test(s)) return 'Slashing';
  if (/pierc|arrow|dagger|thrown|shot/.test(s)) return 'Piercing';
  return null;
}

// ---------------------------------------------------------------------------
// 3. Load tree data from the ES-module files under CJS node
// ---------------------------------------------------------------------------
function loadTreesFromFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (!/icon:\s*["']/.test(source)) return {}; // aggregator / no nodes
  const names = [...source.matchAll(/^export\s+const\s+([A-Za-z0-9_]+)/gm)].map(m => m[1]);
  if (!names.length) return {};
  const transformed = source
    .replace(/^export\s+default\s+/gm, 'const __default__ = ')
    .replace(/^export\s+(const|let|var|function)\s/gm, '$1 ')
    .concat(`\nmodule.exports = { ${names.join(', ')} };\n`);
  const tmpPath = path.join(os.tmpdir(), `${path.basename(filePath, '.js')}.${process.pid}.icon.cjs`);
  fs.writeFileSync(tmpPath, transformed);
  try {
    const loaded = require(tmpPath);
    const trees = {};
    for (const name of names) if (Array.isArray(loaded[name])) trees[name] = loaded[name];
    return trees;
  } finally {
    fs.rmSync(tmpPath, { force: true });
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteIconForId(source, id, newIcon) {
  const idMatch = new RegExp(`id:\\s*"${escapeRegExp(id)}"`).exec(source);
  if (!idMatch) return { source, ok: false };
  const after = source.slice(idMatch.index);
  let iconMatch = /icon:\s*"([^"]*)"/.exec(after);
  let quote = '"';
  if (!iconMatch) {
    iconMatch = /icon:\s*'([^']*)'/.exec(after);
    quote = "'";
  }
  if (!iconMatch) return { source, ok: false };
  const quoteIndex = iconMatch[0].indexOf(quote);
  const absStart = idMatch.index + iconMatch.index + quoteIndex + 1;
  const absEnd = absStart + iconMatch[1].length;
  return { source: source.slice(0, absStart) + newIcon + source.slice(absEnd), ok: true };
}

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------
const iconMapping = loadIconMapping();
const { byFolder, all: allIcons, hash: iconHash } = loadAvailableIcons();
const availableSet = new Set(allIcons);

// A few catalog entries are clearly placeholder/joke art — never auto-pick them.
const BLOCKED_ICONS = new Set([
  'Utility/Utility',
  'Nature/Waste of Time',
  'Necrotic/Railway',
  'Necrotic/Pocket Rocks',
  'Utility/Blue Door',
  'Utility/Boat Horizon',
  'Utility/Ladder',
  'Necrotic/Ladder',
  'Frost/Cooldown',
  'Frost/Confused',
]);

function resolve(icon) {
  if (!icon) return FALLBACK;
  if (icon.includes('/')) return icon;
  return iconMapping[icon] || FALLBACK;
}

// Visual identity: distinct file paths that share pixel content count as one.
function visualId(iconPath) {
  return availableSet.has(iconPath) ? `H:${iconHash[iconPath]}` : 'MISSING';
}

const files = fs
  .readdirSync(TREES_DIR)
  .filter(f => f.endsWith('.js') && !EXCLUDED_FILES.has(f))
  .sort();

const loadedFiles = files.map(f => ({ file: f, full: path.join(TREES_DIR, f), source: fs.readFileSync(path.join(TREES_DIR, f), 'utf8') }));
const treesByFile = new Map();
const globalUsage = new Map();

for (const { file, full } of loadedFiles) {
  const trees = loadTreesFromFile(full);
  treesByFile.set(file, trees);
  for (const tree of Object.values(trees)) {
    for (const node of tree) {
      const r = resolve(node.icon);
      globalUsage.set(r, (globalUsage.get(r) || 0) + 1);
    }
  }
}

const RELATED_FOLDERS = {
  Force: ['Utility', 'Radiant', 'Arcane'],
  Healing: ['Nature', 'Radiant'],
  Radiant: ['Force', 'Healing'],
  Necrotic: ['Void', 'Poison'],
  Void: ['Necrotic', 'Psychic'],
  Poison: ['Necrotic', 'Nature'],
  Psychic: ['Void', 'Arcane'],
  Arcane: ['Force', 'Psychic'],
  Fire: ['Lightning'],
  Frost: ['Nature'],
  Nature: ['Frost', 'Healing'],
  Lightning: ['Nature', 'Fire'],
  Utility: ['General', 'Force'],
  General: ['Utility'],
  Bludgeoning: ['Force', 'Utility'],
  Slashing: ['Piercing', 'General'],
  Piercing: ['Slashing', 'General'],
  Social: ['Psychic'],
};

const STOP_WORDS = new Set([
  'the', 'of', 'and', 'for', 'from', 'into', 'your', 'you', 'this', 'that',
  'with', 'rank', 'passive', 'active', 'mastery', 'doctrine', 'supreme',
  'greater', 'lesser', 'spell', 'ability', 'inv', 'aura', 'effect', 'tool',
]);

function tokenize(str) {
  const out = [];
  for (const w of (str || '').toLowerCase().split(/[^a-z0-9]+/)) {
    if (w.length > 2 && !STOP_WORDS.has(w)) out.push(w);
  }
  return out;
}

function scoreCandidate(candidateName, tokens) {
  const words = candidateName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  let score = 0;
  for (const w of words) {
    if (w.length < 3) continue;
    for (const t of tokens) {
      if (w === t) { score += 4; break; }
      if (w.length > 3 && t.length > 3 && (w.includes(t) || t.includes(w))) { score += 1; break; }
    }
  }
  if (/\d/.test(candidateName)) score -= 0.5;
  if (/variant|creature-/i.test(candidateName)) score -= 1;
  return score;
}

function pickReplacement(node, origIcon, resolvedIcon, usedVisuals) {
  const rf = folderOf(resolvedIcon);
  const df = folderOf(origIcon) || derivedFolder(origIcon);
  const folders = [];
  const pushFolder = (f) => { if (f && !folders.includes(f) && byFolder[f]) folders.push(f); };

  if (resolvedIcon !== FALLBACK && rf) {
    pushFolder(rf);
    (RELATED_FOLDERS[rf] || []).forEach(pushFolder);
  }
  pushFolder(df);
  (RELATED_FOLDERS[df] || []).forEach(pushFolder);
  if (!folders.length) pushFolder('Arcane');

  const tokens = Array.from(new Set([
    ...tokenize(folderOf(resolvedIcon)),
    ...tokenize(resolvedIcon.split('/').slice(1).join(' ')),
    ...tokenize(node.name),
    ...tokenize(node.id),
    ...tokenize(origIcon),
  ]));

  const candidates = [];
  folders.forEach((folder, folderRank) => {
    for (const p of byFolder[folder]) {
      if (p === FALLBACK) continue;
      if (BLOCKED_ICONS.has(p)) continue;
      if (!availableSet.has(p)) continue;
      // Prefer clean, canonical art names over legacy "creature-" aliases.
      if (p.split('/').pop().startsWith('creature-')) continue;
      if (usedVisuals.has(visualId(p))) continue;
      candidates.push({
        icon: p,
        rank: folderRank,
        score: scoreCandidate(p.split('/').slice(1).join(' '), tokens),
      });
    }
  });

  if (candidates.length === 0) {
    // last resort: any unused art, spread by global usage
    for (const p of allIcons) {
      if (p === FALLBACK) continue;
      if (BLOCKED_ICONS.has(p)) continue;
      if (usedVisuals.has(visualId(p))) continue;
      candidates.push({ icon: p, rank: 99, score: 0 });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) =>
    b.score - a.score ||
    a.rank - b.rank ||
    (globalUsage.get(a.icon) || 0) - (globalUsage.get(b.icon) || 0) ||
    a.icon.localeCompare(b.icon)
  );
  return candidates[0].icon;
}

const report = [];
let totalReassigned = 0;
let treesFixed = 0;

for (const { file, full, source: originalSource } of loadedFiles) {
  const trees = treesByFile.get(file);
  if (!trees || Object.keys(trees).length === 0) continue;

  let source = originalSource;
  const fileChanges = [];

  for (const [treeName, tree] of Object.entries(trees)) {
    const resolvedList = tree.map(n => resolve(n.icon));
    const visualList = resolvedList.map(visualId);
    const countByVisual = new Map();
    visualList.forEach((v, i) => {
      if (!countByVisual.has(v)) countByVisual.set(v, []);
      countByVisual.get(v).push(i);
    });

    const usedVisuals = new Set(visualList);
    const pending = [];

    for (const [visual, indices] of countByVisual.entries()) {
      if (indices.length <= 1) continue;
      // keep first occurrence; rewrite the rest
      for (const idx of indices.slice(1)) {
        const node = tree[idx];
        const resolved = resolvedList[idx];
        const newIcon = pickReplacement(node, node.icon, resolved, usedVisuals);
        if (!newIcon) continue;
        usedVisuals.add(visualId(newIcon));
        globalUsage.set(newIcon, (globalUsage.get(newIcon) || 0) + 1);
        pending.push({
          id: node.id,
          resolved: visual === 'MISSING' ? `${resolved} (missing)` : resolved,
          newIcon,
        });
      }
    }

    for (const change of pending) {
      const res = rewriteIconForId(source, change.id, change.newIcon);
      if (!res.ok) {
        report.push(`  !! could not rewrite icon for ${change.id} in ${treeName}`);
        continue;
      }
      source = res.source;
      fileChanges.push(`${treeName} :: ${change.id}  ${change.resolved}  ->  ${change.newIcon}`);
      totalReassigned++;
    }

    if (pending.length) treesFixed++;
  }

  if (fileChanges.length) {
    report.push(`\n${file} (${fileChanges.length} reassigned)`);
    fileChanges.forEach(c => report.push(`  ${c}`));
    if (!DRY) fs.writeFileSync(full, source);
  }
}

console.log(report.join('\n'));
console.log(`\n${DRY ? '[DRY RUN] ' : ''}Reassigned ${totalReassigned} icons across ${treesFixed} trees in ${loadedFiles.length} files.`);
