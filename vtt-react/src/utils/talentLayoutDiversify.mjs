/**
 * Talent Tree Layout — Iconic Shapes
 * ============================================
 * Lays each v2 tree out in a shape that matches its fantasy
 * (Jailer = cage, Moonwell = funnel, Entropy Weaver = vortex, Deceiver = eye,
 * Shadowblade = dagger, Vengeance = wings, Inferno = bonfire, ...).
 *
 * Positioning is free-form: tiers come from DAG depth (see talentSystem.mjs),
 * NOT from grid rows, so shapes can start in the middle, rise, drain,
 * spiral, or branch in any direction while gates stay intact.
 *
 * Usage: node src/utils/talentLayoutDiversify.mjs [--dry]
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TREES_DIR = path.resolve(__dirname, '..', 'data', 'talentTrees');
const DRY = process.argv.includes('--dry');

const CX = 2, CY = 4;          // grid center (x 0..4, y 0..8)
const clampX = (v) => Math.max(0, Math.min(4, Math.round(v * 2) / 2));
const clampY = (v) => Math.max(0, Math.min(8, Math.round(v * 2) / 2));
const deg = (d) => (d * Math.PI) / 180;

// Anchor on a circle/arc around a center. x-scale squashed 2:1 vs y for grid aspect.
const arcPt = (cx, cy, r, aDeg, squash = 0.55) => [
  clampX(cx + r * Math.cos(deg(aDeg))),
  clampY(cy + r * Math.sin(deg(aDeg)) * squash * 2),
];
const arc = (cx, cy, r, from, to, count, phase = 0) =>
  Array.from({ length: count }, (_, i) =>
    arcPt(cx, cy, r, from + ((to - from) * i) / Math.max(1, count - 1) + phase)
  );

const row = (y, xs) => xs.map((x) => [clampX(x), clampY(y)]);

/**
 * Shape library. Each shape maps depth (0..6) -> list of [x,y] anchors for
 * that depth's nodes (standard counts 3,2,2,2,2,3,5; extras are spread).
 */
const SHAPES = {
  // ---- Spellguard ----
  SHIELD: { // crest: wide top, tapering to a point
    0: row(0, [0.5, 2, 3.5]), 1: row(1, [1, 3]), 2: row(2, [1.25, 2.75]),
    3: row(3, [1.5, 2.5]), 4: row(4.5, [1.5, 2.5]), 5: row(5.5, [1, 2, 3]),
    6: [...row(6.5, [0.5, 1.5, 2.5, 3.5]), [2, 8]],
  },
  MIRROR: { // diamond: points top/bottom, widest at middle
    0: [[2, 0], ...row(1, [1, 3])], 1: arc(CX, CY, 2.4, 200, 340, 2),
    2: arc(CX, CY, 2.9, 170, 10, 2), 3: arc(CX, CY, 2.4, 150, 30, 2),
    4: arc(CX, CY, 1.6, 140, 40, 2), 5: row(7, [1, 2, 3]),
    6: [...row(8, [0.5, 1.5, 2.5, 3.5]), [2, 7.5]],
  },
  SIPHON: { // funnel draining downward into a pool
    0: row(0, [1, 2, 3]), 1: row(1.5, [1.25, 2.75]), 2: row(3, [1.5, 2.5]),
    3: row(4.5, [1.75, 2.25]), 4: row(6, [2, 2.5]),
    5: row(7, [1.5, 2.5, 3.5]), 6: row(8, [0.5, 1.5, 2.5, 3.5, 4]),
  },

  // ---- Berserker ----
  BONFIRE: { // pyre at bottom, flame rising to a crown at the top
    0: row(8, [1, 2, 3]), 1: row(6.5, [1.5, 2.5]), 2: row(5, [1.25, 2.75]),
    3: row(3.5, [1.5, 2.5]), 4: row(2, [1.75, 2.25]),
    5: row(1, [1.25, 2, 2.75]), 6: row(0, [0, 1, 2, 3, 4]),
  },
  BLOODDROP: { // a falling drop: narrow top, bulge, splash base
    0: row(0, [1.75, 2, 2.25]), 1: row(1, [1.5, 2.5]), 2: row(2.5, [1, 3]),
    3: row(4, [0.75, 3.25]), 4: row(5.5, [1, 3]),
    5: row(6.5, [1.5, 2, 2.5]), 6: [...row(8, [0.5, 1.5, 2.5, 3.5]), [2, 7.5]],
  },
  CLAW: { // three long slashes raking down the grid
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [0.5, 3.5]), 2: row(3, [0.5, 3.5]),
    3: row(4.5, [0.5, 3.5]), 4: row(5, [1.75, 2.25]),
    5: row(6, [0.5, 1.5, 3]), 6: row(8, [0, 1.25, 2, 2.75, 4]),
  },

  // ---- Augur ----
  BALANCE: { // scales: beam, pans, column, plinth
    0: [[2, 0], ...row(1, [0.5, 3.5])], 1: row(2, [0, 4]), 2: row(3.5, [1, 3]),
    3: row(4.5, [1.5, 2.5]), 4: row(5.5, [1.5, 2.5]), 5: row(6.5, [1, 2, 3]),
    6: row(8, [0.5, 1.5, 2, 2.5, 3.5]),
  },
  ECLIPSE: { // ring with a dark core; entry at the crown, capstone inside
    0: [[2, 0], ...row(1, [1.25, 2.75])],
    1: arc(CX, CY, 2.6, 200, 340, 2), 2: arc(CX, CY, 3.2, 175, 5, 2),
    3: arc(CX, CY, 2.6, 150, 30, 2), 4: arc(CX, CY, 1.8, 140, 40, 2),
    5: arc(CX, CY, 0.8, 180, 0, 3),
    6: arc(CX, CY, 1.4, 160, 20, 5),
  },
  SUNBURST: { // radiant: core at center, rays out, entry at the heart
    0: arc(CX, CY - 0.5, 0.6, 180, 0, 3),
    1: arc(CX, CY, 1.4, 200, 340, 2), 2: arc(CX, CY, 1.8, 170, 10, 2),
    3: arc(CX, CY, 2.3, 150, 30, 2), 4: arc(CX, CY, 2.7, 140, 40, 2),
    5: arc(CX, CY, 1.2, 180, 0, 3),
    6: arc(CX, CY, 3.2, 195, 165, 5),
  },

  // ---- Pyrofiend ----
  SPREAD: { // ignition point bottom-left, fire leaping up-and-right in branches
    0: row(8, [0, 0.5, 1]), 1: row(6.5, [0.5, 1.5]), 2: row(5, [0.5, 2]),
    3: row(3.5, [1, 3]), 4: row(2, [1.5, 3.5]),
    5: row(1, [1, 2.5, 4]), 6: [...row(0, [1, 2, 3, 4]), [0.5, 0.5]],
  },
  PENTACLE: { // inverted pentagram: points out, ritual core at center
    0: [[2, 8], ...row(7, [0.5, 3.5])], 1: row(5.5, [0, 4]),
    2: arc(CX, CY, 2.4, 150, 30, 2), 3: arc(CX, CY, 2.4, 210, 330, 2),
    4: arc(CX, CY, 1.5, 180, 0, 2), 5: arc(CX, CY, 0.7, 180, 0, 3),
    6: arc(CX, CY, 2.9, 200, 160, 5),
  },

  // ---- Toxicologist ----
  FANGS: { // two venomous fangs curving down from the top
    0: row(0, [1.25, 2, 2.75]), 1: row(1, [0.75, 3.25]), 2: row(2.5, [0.75, 3.25]),
    3: row(4.5, [1, 3]), 4: row(6, [1.25, 2.75]),
    5: row(7.5, [1.5, 2, 2.5]), 6: [...row(8, [1, 2, 3]), [0.5, 8], [3.5, 8]],
  },
  GEAR: { // gear: hub, ring, teeth
    0: arc(CX, CY, 0.7, 180, 0, 3), 1: arc(CX, CY, 1.5, 200, 340, 2),
    2: arc(CX, CY, 1.5, 170, 10, 2), 3: arc(CX, CY, 2.2, 150, 30, 2),
    4: arc(CX, CY, 2.2, 210, 330, 2), 5: arc(CX, CY, 0.4, 180, 0, 3),
    6: arc(CX, CY, 3.2, 190, 170, 5),
  },
  BOLT: { // lightning zigzag from top to ground
    0: row(0, [2, 2.5, 3]), 1: row(1.5, [1.5, 2.5]), 2: row(3, [2, 3.5]),
    3: row(4.5, [1.5, 3]), 4: row(6, [1, 2.5]),
    5: row(7, [0.5, 1.5, 2.5]), 6: row(8, [0, 1, 2, 3, 4]),
  },

  // ---- Martyr ----
  CHALICE: { // goblet: rim, bowl, stem, base
    0: row(0, [0.5, 2, 3.5]), 1: row(1, [1, 3.5]), 2: row(2, [1.25, 3.25]),
    3: row(3, [1.5, 3]), 4: row(4.5, [1.75, 2.25]),
    5: row(6, [1.5, 2, 2.5]), 6: row(8, [0.5, 1.5, 2, 2.5, 3.5]),
  },
  CROSS: { // crusader cross: crossbeam high, shaft down, calvary base
    0: [[2, 0], ...row(1, [0.5, 3.5])], 1: row(2, [1, 4]), 2: row(3.5, [1.75, 2.25]),
    3: row(4.5, [1.75, 2.25]), 4: row(5.5, [1.75, 2.25]),
    5: row(6.5, [1.5, 2, 2.5]), 6: row(8, [0.5, 1.5, 2, 2.5, 3.5]),
  },
  BASTION: { // fortress: gatehouse top, thick walls, keep at base
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [0.5, 3.5]), 2: row(3, [0.5, 3.5]),
    3: row(4.5, [1, 3]), 4: row(6, [1.5, 2.5]),
    5: row(7, [1, 2, 3]), 6: row(8, [0, 1, 2, 3, 4]),
  },

  // ---- False Prophet ----
  BOOK: { // open tome: two pages spreading from a central spine
    0: [[2, 0], ...row(0.5, [1, 3])], 1: row(2, [0.5, 3.5]), 2: row(3.5, [0.5, 3.5]),
    3: row(5, [1, 3]), 4: row(6.5, [1.5, 2.5]),
    5: row(7.5, [1, 2, 3]), 6: row(8, [0.5, 1.5, 2, 2.5, 3.5]),
  },
  EYE: { // a watching eye: lids, iris ring, pupil center
    0: [[2, 0], ...row(0.5, [0.75, 3.25])],
    1: arc(CX, CY, 2.6, 200, 340, 2), 2: arc(CX, CY, 3.1, 180, 0, 2),
    3: arc(CX, CY, 2.6, 160, 20, 2), 4: arc(CX, CY, 1.6, 180, 0, 2),
    5: arc(CX, CY, 0.8, 180, 0, 3),
    6: arc(CX, CY, 1.3, 160, 20, 5),
  },
  SIGIL: { // ritual circle: outer ring, inner ring, sacrifice core
    0: arc(CX, CY - 1, 0.7, 180, 0, 3),
    1: arc(CX, CY, 1.6, 210, 330, 2), 2: arc(CX, CY, 1.6, 150, 30, 2),
    3: arc(CX, CY, 2.5, 200, 340, 2), 4: arc(CX, CY, 2.5, 160, 20, 2),
    5: arc(CX, CY, 0.8, 180, 0, 3),
    6: arc(CX, CY, 3.3, 190, 170, 5),
  },

  // ---- Lunarch ----
  CRESCENT: { // crescent moon opening left; entry at upper horn
    0: [[3.5, 0.5], ...arc(CX + 0.4, CY - 1, 1.6, 250, 340, 2)],
    1: arc(CX + 0.4, CY, 2.4, 260, 300, 2), 2: arc(CX + 0.4, CY, 2.9, 280, 290, 2),
    3: arc(CX + 0.4, CY, 2.9, 60, 100, 2), 4: arc(CX + 0.4, CY, 2.4, 80, 120, 2),
    5: arc(CX + 0.4, CY + 1.5, 1.6, 200, 290, 3),
    6: [...arc(CX + 0.4, CY, 3.4, 240, 300, 4), [0.5, 8]],
  },
  STARFALL: { // scattered meteors streaking toward the ground
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [1, 3]), 2: row(3, [0.5, 3.5]),
    3: row(4.5, [1, 3]), 4: row(5.5, [0.5, 3.5]),
    5: row(7, [1, 2, 3]), 6: [...row(8, [0, 1.5, 3, 4]), [2, 7.5]],
  },
  WELL: { // moonwell: wide rim, water funneling to a bright center
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [1, 3]), 2: row(3, [1.25, 2.75]),
    3: row(4.5, [1.5, 2.5]), 4: row(6, [1.75, 2.25]),
    5: arc(CX, CY + 1.5, 0.7, 180, 0, 3),
    6: [...row(8, [0.5, 1.5, 3, 3.5]), [2, 7.5]],
  },

  // ---- Warden ----
  DAGGER: { // blade pointing down: pommel, guard, edge, tip
    0: row(0, [1.5, 2, 2.5]), 1: row(1.5, [1, 3]), 2: row(3, [1.5, 2.5]),
    3: row(4.5, [1.5, 2.5]), 4: row(6, [1.75, 2.25]),
    5: row(7, [1.5, 2, 2.5]), 6: [...row(8, [0.5, 1.5, 2.5, 3.5]), [2, 8]],
  },
  CAGE: { // prison bars: vertical columns, lock at the heart
    0: row(0, [0.5, 2, 3.5]), 1: row(2, [0.5, 3.5]), 2: row(3.5, [0.5, 3.5]),
    3: row(5, [0.5, 3.5]), 4: row(6.5, [0.5, 3.5]),
    5: arc(CX, CY, 0.7, 180, 0, 3),
    6: row(8, [0, 1, 2, 3, 4]),
  },
  WINGS: { // avenging wings rising from a central spine
    0: row(8, [1.5, 2, 2.5]), 1: arc(CX, CY, 2.2, 100, 140, 2),
    2: arc(CX, CY, 2.8, 90, 130, 2), 3: arc(CX, CY, 3.2, 80, 120, 2),
    4: arc(CX, CY, 3.4, 70, 110, 2), 5: arc(CX, CY, 1.6, 60, 120, 3),
    6: row(0, [0.5, 1.5, 2, 2.5, 3.5]),
  },

  // ---- Arcanoneer ----
  PRISM: { // triangular prism: apex top, wide base, refracted core
    0: [[2, 0], ...row(1, [1.25, 2.75])], 1: row(3, [0.75, 3.25]),
    2: row(5, [0.25, 3.75]), 3: row(7, [0.5, 3.5]),
    4: row(8, [1, 3]),
    5: arc(CX, CY, 0.7, 180, 0, 3),
    6: arc(CX, CY, 1.5, 180, 0, 5),
  },
  VORTEX: { // spiral draining into the center
    0: arc(CX, CY, 3.4, 270, 310, 3),
    1: arc(CX, CY, 2.9, 180, 220, 2), 2: arc(CX, CY, 2.4, 90, 130, 2),
    3: arc(CX, CY, 1.9, 0, 40, 2), 4: arc(CX, CY, 1.4, 270, 310, 2),
    5: arc(CX, CY, 0.8, 180, 0, 3),
    6: arc(CX, CY, 0.3, 180, 0, 5),
  },
  LATTICE: { // engineering lattice: ordered matrix with a central core
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [0.5, 3.5]), 2: row(3, [0.5, 3.5]),
    3: row(4.5, [1.5, 2.5]), 4: row(6, [0.5, 3.5]),
    5: row(7, [1, 2, 3]), 6: row(8, [0, 1, 2, 3, 4]),
  },

  // ---- Shaper ----
  WAVE: { // flowing S-curve from top-left to bottom-right
    0: row(0, [0.5, 1, 1.5]), 1: row(1.5, [2, 3]), 2: row(3, [3, 3.5]),
    3: row(4.5, [2, 1]), 4: row(6, [1, 0.5]),
    5: row(7, [1.5, 2.5, 3.5]), 6: row(8, [0, 1, 2, 3, 4]),
  },
  XSWORDS: { // crossed blades: two diagonals through a center guard
    0: [[0, 0], ...row(0.5, [2, 4])], 1: row(2, [0.75, 3.25]),
    2: row(4, [1.75, 2.25]), 3: row(5.5, [2, 2.5]), 4: row(6.5, [0.75, 3.25]),
    5: row(7.5, [1, 2, 3]), 6: [[4, 8], ...row(8, [0, 1.5, 2.5]), [0, 8]],
  },
  NEWMOON: { // dark ring: entry at the rim, hollow heart, hidden core
    0: arc(CX, CY, 3, 250, 290, 3),
    1: arc(CX, CY, 3, 160, 200, 2), 2: arc(CX, CY, 3, 70, 110, 2),
    3: arc(CX, CY, 2.2, 180, 0, 2), 4: arc(CX, CY, 1.5, 160, 20, 2),
    5: arc(CX, CY, 0.6, 180, 0, 3),
    6: arc(CX, CY, 1.1, 180, 0, 5),
  },

  // ---- Inquisitor ----
  HAMMER: { // witch-hammer: T shape driving down
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [0.5, 3.5]), 2: row(3, [1.75, 2.25]),
    3: row(4.5, [1.75, 2.25]), 4: row(6, [1.75, 2.25]),
    5: row(7, [1.5, 2, 2.5]), 6: row(8, [0, 1, 2, 3, 4]),
  },
  COURTHOUSE: { // pediment and columns: wide gable, ordered pillars
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [0.25, 3.75]), 2: row(3, [0.5, 3.5]),
    3: row(5, [0.5, 3.5]), 4: row(6.5, [1, 3]),
    5: row(7.5, [1, 2, 3]), 6: row(8, [0, 1, 2, 3, 4]),
  },
  HALO: { // halo above a descending devout line
    0: arc(CX, CY - 2.5, 1.2, 180, 0, 3),
    1: arc(CX, CY - 1.5, 2.2, 200, 340, 2), 2: row(4, [1, 3]),
    3: row(5.5, [1.5, 2.5]), 4: row(6.5, [1.5, 2.5]),
    5: row(7.5, [1, 2, 3]), 6: row(8, [0, 1, 2, 3, 4]),
  },

  // ---- Minstrel ----
  HARP: { // harp frame: sweeping column + strings
    0: row(0, [3, 3.5, 4]), 1: arc(3, CY - 1, 2.2, 250, 290, 2),
    2: arc(3, CY, 3, 250, 280, 2), 3: arc(3, CY + 1, 2.6, 250, 290, 2),
    4: arc(3, CY + 2, 1.8, 250, 290, 2),
    5: row(7.5, [1, 2, 3]), 6: row(8, [0, 1, 2, 3, 4]),
  },
  TRIDENT: { // trident: three prongs above a shaft
    0: row(0, [0.5, 2, 3.5]), 1: row(1.5, [0.5, 3.5]), 2: row(3, [0.5, 3.5]),
    3: row(4.5, [1.75, 2.25]), 4: row(6, [1.75, 2.25]),
    5: row(7, [1.5, 2, 2.5]), 6: row(8, [0.5, 1.5, 2, 2.5, 3.5]),
  },
  SINE: { // soundwave: sine crest, trough, and resonance below
    0: row(0, [0, 1, 2]), 1: row(2, [2.5, 3.5]), 2: row(4, [3.5, 4]),
    3: row(5.5, [2.5, 3]), 4: row(7, [1, 2]),
    5: row(7.5, [0.5, 1.5, 2.5]), 6: row(8, [0, 1, 2, 3, 4]),
  },

  // ---- Plaguebringer ----
  WEB: { // spider web: concentric rings with radial catches
    0: arc(CX, CY - 2.5, 0.7, 180, 0, 3),
    1: arc(CX, CY - 1.5, 2, 200, 340, 2), 2: arc(CX, CY, 2.6, 180, 0, 2),
    3: arc(CX, CY + 1.5, 2, 160, 20, 2), 4: arc(CX, CY + 2.5, 1.2, 180, 0, 2),
    5: arc(CX, CY, 0.7, 180, 0, 3),
    6: arc(CX, CY, 1.4, 180, 0, 5),
  },
  ROOTS: { // taproot descending, root flare at the bottom
    0: row(0, [1.5, 2, 2.5]), 1: row(1.5, [1.75, 2.25]), 2: row(3, [1.75, 2.25]),
    3: row(4.5, [1.5, 2.5]), 4: row(6, [1, 3]),
    5: row(7, [0.5, 2, 3.5]), 6: row(8, [0, 1, 2, 3, 4]),
  },
};

// Tree -> shape map (fantasy-matched)
const TREE_SHAPES = {
  SPELLGUARD_ARCANE_WARDEN: 'SHIELD',
  SPELLGUARD_SPELL_BREAKER: 'MIRROR',
  SPELLGUARD_MANA_REAVER: 'SIPHON',
  BERSERKER_PRIMAL_RAGE: 'BONFIRE',
  BERSERKER_BLOOD_FRENZY: 'BLOODDROP',
  BERSERKER_SAVAGE_INSTINCTS: 'CLAW',
  AUGUR_AUSPICE: 'BALANCE',
  AUGUR_HARBINGER: 'ECLIPSE',
  AUGUR_HIEROPHANT: 'SUNBURST',
  PYROFIEND_INFERNO: 'BONFIRE',
  PYROFIEND_WILDFIRE: 'SPREAD',
  PYROFIEND_HELLFIRE: 'PENTACLE',
  TOXICOLOGIST_VENOMANCER: 'FANGS',
  TOXICOLOGIST_GADGETEER: 'GEAR',
  TOXICOLOGIST_SABOTEUR: 'BOLT',
  MARTYR_REDEMPTION: 'CHALICE',
  MARTYR_ZEALOT: 'CROSS',
  MARTYR_ASCETIC: 'BASTION',
  FALSE_PROPHET_SILENCE_SPEAKER: 'BOOK',
  FALSE_PROPHET_DECEIVER: 'EYE',
  FALSE_PROPHET_CULTIST: 'SIGIL',
  LUNARCH_MOONLIGHT_SENTINEL: 'CRESCENT',
  LUNARCH_STARFALL_INVOKER: 'STARFALL',
  LUNARCH_MOONWELL_GUARDIAN: 'WELL',
  WARDEN_SHADOWBLADE: 'DAGGER',
  WARDEN_JAILER: 'CAGE',
  WARDEN_VENGEANCE_SEEKER: 'WINGS',
  ARCANONEER_PRISM_MAGE: 'PRISM',
  ARCANONEER_ENTROPY_WEAVER: 'VORTEX',
  ARCANONEER_SPHERE_ARCHITECT: 'LATTICE',
  SHAPER_FLOW_MASTER: 'WAVE',
  SHAPER_IRON_DANCER: 'XSWORDS',
  SHAPER_PRIMAL_SHADOW: 'NEWMOON',
  INQUISITOR_WITCH_HAMMER: 'HAMMER',
  INQUISITOR_IRON_VERDICT: 'COURTHOUSE',
  INQUISITOR_HOLLOW_SAINT: 'HALO',
  MINSTREL_HARMONIC_WEAVING: 'HARP',
  MINSTREL_CHORD_COMBINATIONS: 'TRIDENT',
  MINSTREL_MUSICAL_MAGIC: 'SINE',
  PLAGUEBRINGER_VIRULENT_SPREADER: 'SPREAD',
  PLAGUEBRINGER_TORMENT_WEAVER: 'WEB',
  PLAGUEBRINGER_DECAY_HARBINGER: 'ROOTS',
};

function dedupeAll(positions) {
  // positions: array of [x,y] in node order — nudge duplicates by half-steps
  const seen = new Set();
  return positions.map(([x, y]) => {
    let nx = x, ny = y;
    let v = `${nx},${ny}`;
    let guard = 0;
    while (seen.has(v) && guard < 40) {
      let cand = Math.round((nx + 0.5) * 2) / 2;
      if (cand > 4) {
        // no room right — drop down a half-row and reset to left
        const down = Math.round((ny + 0.5) * 2) / 2;
        if (down <= 8) { ny = down; cand = 0; }
        else { cand = Math.round((nx - 0.5) * 2) / 2; }
      }
      nx = Math.max(0, Math.min(4, cand));
      v = `${nx},${ny}`;
      guard++;
    }
    seen.add(v);
    return [nx, ny];
  });
}

function loadTreeFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const exportMatches = [...source.matchAll(/^export\s+const\s+([A-Za-z0-9_]+)/gm)];
  if (exportMatches.length === 0) return { source, trees: {} };
  const names = exportMatches.map((m) => m[1]);
  const transformed = source
    .replace(/^export\s+default\s+/gm, 'const __default__ = ')
    .replace(/^export\s+(const|let|var|function)\s/gm, '$1 ')
    .concat(`\nmodule.exports = { ${names.join(', ')} };\n`);
  const tmpPath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'vtt-shape-')),
    path.basename(filePath).replace(/\.js$/, '.cjs')
  );
  fs.writeFileSync(tmpPath, transformed);
  try {
    const loaded = require(tmpPath);
    const trees = {};
    for (const name of names) if (Array.isArray(loaded[name])) trees[name] = loaded[name];
    return { source, trees };
  } finally {
    fs.rmSync(path.dirname(tmpPath), { recursive: true, force: true });
  }
}

// DAG depth per node (same algorithm as talentSystem.mjs)
function depthsOf(tree) {
  const byId = new Map(tree.map((n) => [n.id, n]));
  const depths = new Map();
  const depthOf = (id) => {
    if (depths.has(id)) return depths.get(id);
    const node = byId.get(id);
    if (!node) return 0;
    depths.set(id, 0); // temp guard vs cycles
    let d = 0;
    const reqs = node.requires ? (Array.isArray(node.requires) ? node.requires : [node.requires]) : [];
    for (const r of reqs) d = Math.max(d, depthOf(r) + 1);
    depths.set(id, d);
    return d;
  };
  tree.forEach((n) => depthOf(n.id));
  return depths;
}

const files = fs
  .readdirSync(TREES_DIR)
  .filter((f) => f.endsWith('.js') && /^[a-z]+[A-Z]/.test(f))
  .sort();

let shaped = 0;
const report = [];

for (const file of files) {
  const full = path.join(TREES_DIR, file);
  const { source, trees } = loadTreeFile(full);
  if (Object.keys(trees).length === 0) continue;

  let newSource = source;
  let fileChanged = false;

  for (const [treeName, tree] of Object.entries(trees)) {
    if (!tree.every((n) => n && n.spell)) continue;
    const shapeName = TREE_SHAPES[treeName];
    const shape = shapeName && SHAPES[shapeName];
    if (!shape) { report.push(`${file} :: ${treeName}: NO SHAPE MAPPED`); continue; }

    const depths = depthsOf(tree); // cycle guard only
    // group by DESIGNED tier (id prefix _tN_), preserve file order
    const tierOf = (n) => {
      const m = String(n.id).match(/_t([1-7])(?=_)/);
      return m ? parseInt(m[1], 10) - 1 : 0;
    };
    const byDepth = new Map();
    tree.forEach((n) => {
      const d = tierOf(n);
      if (!byDepth.has(d)) byDepth.set(d, []);
      byDepth.get(d).push(n);
    });

    // collect [x,y] per node in file order
    const positions = new Array(tree.length).fill(null);
    for (const [d, nodes] of [...byDepth.entries()].sort((a, b) => a[0] - b[0])) {
      let anchors = shape[d] || shape[6] || [];
      // adapt count: spread extras on the last anchor's row
      if (nodes.length > anchors.length) {
        const [lx, ly] = anchors[anchors.length - 1];
        const extra = Array.from({ length: nodes.length - anchors.length },
          (_, i) => [clampX(lx - 0.5 * (i + 1)), ly]);
        anchors = [...anchors, ...extra];
      }
      nodes.forEach((n, i) => {
        const idx = tree.indexOf(n);
        positions[idx] = anchors[i] || anchors[anchors.length - 1];
      });
    }

    const final = dedupeAll(positions);

    // rewrite positions in source order
    let i = 0;
    newSource = newSource.replace(
      /(position:\s*\{\s*x:\s*)([\d.]+)(,\s*y:\s*)([\d.]+)(\s*\})/g,
      (match, pre, _ox, mid, _oy, post) => {
        const node = tree[i];
        i++;
        if (!node) return match;
        const [nx, ny] = final[i - 1];
        fileChanged = true;
        return `${pre}${nx}${mid}${ny}${post}`;
      }
    );

    shaped++;
    report.push(`${file} :: ${treeName}: ${shapeName}`);
  }

  if (fileChanged && !DRY) fs.writeFileSync(full, newSource);
}

console.log(`\nShaped ${shaped} trees (${DRY ? 'DRY RUN' : 'written'}).`);
report.forEach((r) => console.log(`  ${r}`));
