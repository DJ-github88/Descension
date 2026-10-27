#!/usr/bin/env node
/**
 * Copies the client rules modules the server depends on into server/shared/.
 *
 * Railway deploys only the server/ folder, so the server must never require
 * anything from ../vtt-react at runtime. The client files stay the source of
 * truth; run `npm run sync:shared` after editing any of them and commit the copy.
 * tests/sharedModulesSync.test.js fails if the copies drift.
 */
const fs = require('fs');
const path = require('path');

const CLIENT_SRC = path.resolve(__dirname, '../../vtt-react/src');
const SHARED = path.resolve(__dirname, '../shared');

// Paths relative to vtt-react/src. Keep the folder layout so relative
// requires between these files (./x, ../data/x.json) keep working.
const FILES = [
  'services/authoredAbility.js',
  'services/authoredCondition.js',
  'services/sharedConditionProfile.js',
  'services/sharedEffectTiming.js',
  'services/shieldBashResult.js',
  'data/sharedConditionProfiles.json',
];

function sync({ check = false } = {}) {
  if (!fs.existsSync(CLIENT_SRC)) {
    throw new Error(`Client source not found at ${CLIENT_SRC}`);
  }
  const drifted = [];
  for (const rel of FILES) {
    const from = path.join(CLIENT_SRC, rel);
    const to = path.join(SHARED, rel);
    const source = fs.readFileSync(from);
    const current = fs.existsSync(to) ? fs.readFileSync(to) : null;
    if (current && current.equals(source)) {continue;}
    drifted.push(rel);
    if (!check) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.writeFileSync(to, source);
    }
  }
  return drifted;
}

module.exports = { sync, FILES, CLIENT_SRC, SHARED };

if (require.main === module) {
  const check = process.argv.includes('--check');
  const drifted = sync({ check });
  if (check && drifted.length) {
    console.error(`server/shared is out of date: ${drifted.join(', ')}\nRun: npm run sync:shared`);
    process.exit(1);
  }
  console.log(drifted.length ? `${check ? 'Out of date' : 'Synced'}: ${drifted.join(', ')}` : 'server/shared is up to date');
}
