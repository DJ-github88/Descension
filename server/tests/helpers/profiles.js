/** Creator choices for the first-playable passive packet.
 *
 * Defaults are the recommended answers in CREATOR_CARD.md. They are NOT
 * approved. `PASSIVE_APPROVED=1` is required before any acceptance row runs.
 */
const fs = require('fs');
const path = require('path');

const value = (name, fallback) => (process.env[name] === undefined || process.env[name] === '' ? fallback : process.env[name]);
const readFixture = name => JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8'));

const ACTIVATION_OPTIONS = Object.freeze({
  'gm-explicit': { label: 'GM explicitly switches the passive on for one exact character', recommended: true },
  'sheet-eligible': { label: 'The passive is on whenever the character has the qualifying record (Perception NOVICE)', recommended: false }
});
const CONFIRM_OPTIONS = Object.freeze({
  automatic: { label: 'The modifier applies automatically to each initiative roll; no per-roll prompt', recommended: true },
  'gm-confirm': { label: 'The GM confirms the modifier before each initiative roll', recommended: false }
});
const STACKING_OPTIONS = Object.freeze({
  'one-copy-additive': { label: 'One active copy per character; +2 stacks additively with other initiative modifiers', recommended: true },
  exclusive: { label: 'One active copy; it does not combine with any other passive initiative modifier', recommended: false },
  'both-copies': { label: 'Two active copies of the same passive both apply (+4)', recommended: false }
});

const profile = {
  APPROVED: process.env.PASSIVE_APPROVED === '1',
  ACTIVATION: value('PASSIVE_ACTIVATION', 'gm-explicit'),
  CONFIRM: value('PASSIVE_CONFIRM', 'automatic'),
  STACKING: value('PASSIVE_STACKING', 'one-copy-additive'),
  ACTIVATION_OPTIONS,
  CONFIRM_OPTIONS,
  STACKING_OPTIONS,
  readFixture
};

if (!ACTIVATION_OPTIONS[profile.ACTIVATION]) { throw Error(`Unknown PASSIVE_ACTIVATION: ${profile.ACTIVATION}`); }
if (!CONFIRM_OPTIONS[profile.CONFIRM]) { throw Error(`Unknown PASSIVE_CONFIRM: ${profile.CONFIRM}`); }
if (!STACKING_OPTIONS[profile.STACKING]) { throw Error(`Unknown PASSIVE_STACKING: ${profile.STACKING}`); }

module.exports = profile;
