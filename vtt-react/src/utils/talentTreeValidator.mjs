/**
 * Talent Tree Validator (v2) — CLI
 * ============================================
 * Validates every talent tree in src/data/talentTrees/ against the v2
 * talent-as-spell system (see talentSystem.mjs for the canonical rules).
 *
 * - v2 trees: full validation (capacity 50, tier gates, prerequisites,
 *   hand-tuned per-rank spell format compliance, rank monotonicity).
 * - legacy trees: reported as conversion backlog with current stats.
 *
 * Usage:
 *   node src/utils/talentTreeValidator.mjs             (full report)
 *   node src/utils/talentTreeValidator.mjs --summary   (backlog counts only)
 *   node src/utils/talentTreeValidator.mjs --file spellguard
 *
 * Exit code 0 = all trees are valid v2. Exit 1 = errors or pending conversions.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { validateTalentTree, TALENT_SYSTEM } from '../data/talentTrees/talentSystem.mjs';
import { validateSpell } from './spellDataValidator.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TREES_DIR = path.resolve(__dirname, '..', 'data', 'talentTrees');
const EXCLUDED_FILES = new Set([
  'index.js',
  'debug_script.js',
  'transform_descriptions.js',
  'talentSystem.mjs',
]);

const args = process.argv.slice(2);
const SUMMARY_ONLY = args.includes('--summary');
const fileFilterIdx = args.indexOf('--file');
const fileFilter = fileFilterIdx !== -1 ? args[fileFilterIdx + 1] : null;

/**
 * Load ESM tree data files under CJS node by transpiling the pure-data modules:
 * strip `export ` from top-level const declarations and export via module.exports.
 */
function loadTreeFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const exportMatches = [...source.matchAll(/^export\s+const\s+([A-Za-z0-9_]+)/gm)];
  if (exportMatches.length === 0) return {};

  const names = exportMatches.map((m) => m[1]);
  const transformed = source
    .replace(/^export\s+default\s+/gm, 'const __default__ = ')
    .replace(/^export\s+(const|let|var|function)\s/gm, '$1 ')
    .concat(`\nmodule.exports = { ${names.join(', ')} };\n`);

  const tmpPath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'vtt-talents-')),
    path.basename(filePath).replace(/\.js$/, '.cjs')
  );
  fs.writeFileSync(tmpPath, transformed);
  try {
    const loaded = require(tmpPath);
    const trees = {};
    for (const name of names) {
      const value = loaded[name];
      if (Array.isArray(value)) trees[name] = value;
    }
    return trees;
  } finally {
    fs.rmSync(path.dirname(tmpPath), { recursive: true, force: true });
  }
}

// ---------- Run ----------

const files = fs
  .readdirSync(TREES_DIR)
  .filter((f) => f.endsWith('.js') && !EXCLUDED_FILES.has(f))
  .filter((f) => !fileFilter || f.replace(/\.js$/, '') === fileFilter)
  .sort();

const report = { v2Valid: 0, v2Invalid: 0, legacy: 0, legacyNodes: 0, totalPoints: 0 };
const invalidDetails = [];
const backlog = [];
const allIssues = [];

for (const file of files) {
  let trees;
  try {
    trees = loadTreeFile(path.join(TREES_DIR, file));
  } catch (err) {
    report.v2Invalid += 1;
    invalidDetails.push(`${file}: FAILED TO LOAD — ${err.message}`);
    continue;
  }

  for (const [treeName, tree] of Object.entries(trees)) {
    const result = validateTalentTree(tree, validateSpell);
    const label = `${file} :: ${treeName}`;

    if (result.format === 'legacy') {
      report.legacy += 1;
      report.legacyNodes += result.stats.nodes;
      backlog.push(
        `${label}: LEGACY — ${result.stats.nodes} nodes, ${result.stats.totalCapacity}/${TALENT_SYSTEM.TREE_CAPACITY} pts, ${result.stats.tiers} tiers (need 7)` +
          (result.errors.length ? ` | ${result.errors.length} structural errors` : '')
      );
      continue;
    }

    if (result.errors.length === 0) {
      report.v2Valid += 1;
      if (result.warnings.length && !SUMMARY_ONLY) {
        console.log(`\u26a0 ${label}: valid with ${result.warnings.length} warning(s)`);
        result.warnings.forEach((w) => console.log(`    - ${w}`));
      }
    } else {
      report.v2Invalid += 1;
      invalidDetails.push(`${label}: ${result.errors.length} error(s)`);
      result.errors.forEach((e) => allIssues.push(`${label}\n    ERROR: ${e}`));
    }
    result.warnings.forEach((w) => allIssues.push(`${label}\n    warn: ${w}`));
  }
}

console.log('\n=== TALENT TREE VALIDATION REPORT (v2 system) ===\n');
console.log(`Files scanned:        ${files.length}`);
console.log(`v2 trees valid:       ${report.v2Valid}`);
console.log(`v2 trees invalid:     ${report.v2Invalid}`);
console.log(`legacy (to convert):  ${report.legacy} trees, ${report.legacyNodes} nodes`);

if (invalidDetails.length && !SUMMARY_ONLY) {
  console.log('\n--- INVALID ---\n');
  invalidDetails.forEach((d) => console.log(`\u274c ${d}`));
}
if (allIssues.length && !SUMMARY_ONLY) {
  console.log('\n--- DETAILS ---\n');
  allIssues.forEach((i) => console.log(i));
}
if (backlog.length) {
  console.log('\n--- CONVERSION BACKLOG (legacy trees) ---\n');
  backlog.forEach((b) => console.log(`\u2022 ${b}`));
}

console.log('\n=== END REPORT ===');

process.exitCode = report.v2Invalid === 0 && report.legacy === 0 ? 0 : 1;
