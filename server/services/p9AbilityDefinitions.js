'use strict';

/**
 * Server-held legacy P9 ability authority.
 *
 * A P9 approval is authorized only when its id, whole-record hash, display identity and
 * executable terms all resolve to one reviewed entry in
 * `server/shared/data/p9AbilityDefinitions.json`. The table is generated from the authored
 * class records and the client P9 support contract; it is never populated from a request.
 *
 * Catalogue-pinned spells stay outside this table. `catalogueP9Gate` refuses them before this
 * module is consulted, so a missing/revoked catalogue admission never reopens a P9 fallback.
 *
 * The attribute-scored roll remains owner-attested under the existing P9 contract (the roll binds
 * the formula reading and the declared score arithmetic); this module binds definition identity,
 * name, kind, damage types, AP/mana price, dice, formula and typed class payment.
 */

const data = require('../shared/data/p9AbilityDefinitions.json');

const P9_PREFIX = 'p9-spell:v1/';
const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };
const sort = value => Array.isArray(value) ? value.map(sort)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])])) : value;
const canonical = value => JSON.stringify(sort(value));
const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const describe = entry => `'${entry.definitionId}' (${entry.definitionHash})`;

const RAW = Array.isArray(data?.entries) ? data.entries : [];
const ENTRIES = Object.freeze(RAW.map(entry => Object.freeze({
  ...entry,
  damageTypes: Object.freeze([...(entry.damageTypes || [])]),
  price: Object.freeze({ ...entry.price }),
  dice: Object.freeze((entry.dice || []).map(group => Object.freeze({ ...group }))),
  classPrice: entry.classPrice
    ? Object.freeze({ costs: Object.freeze([...(entry.classPrice.costs || [])]), gains: Object.freeze([...(entry.classPrice.gains || [])]) })
    : null
})));
const BY_ID = new Map(ENTRIES.map(entry => [entry.definitionId, entry]));
const BY_HASH = new Map(ENTRIES.map(entry => [entry.definitionHash, entry]));
if (BY_ID.size !== ENTRIES.length || BY_HASH.size !== ENTRIES.length) {
  throw Error('invalid_p9_definition_table');
}

function isP9Hash(value) {
  return typeof value === 'string' && value.startsWith(P9_PREFIX);
}

function normalizeClassId(value) {
  const base = String(value || '').replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
  return base.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function resolve(spell) {
  if (!spell || typeof spell.definitionId !== 'string' || !isP9Hash(spell.definitionHash)) {
    fail('invalid_spell_approval');
  }
  const entry = BY_ID.get(spell.definitionId);
  if (!entry) {
    fail('p9_definition_unknown', 'This spell identity has no reviewed server-held P9 definition; nothing was registered.');
  }
  if (entry.definitionHash !== spell.definitionHash || BY_HASH.get(spell.definitionHash) !== entry) {
    fail('p9_definition_mismatch', `The requested P9 identity does not match the reviewed definition ${describe(entry)}; nothing was registered.`);
  }
  return entry;
}

function diceLabel(entry) {
  return entry.dice.map(group => `${group.count}d${group.sides}`).join(' + ');
}

function checkTerms(approval, entry) {
  const spell = approval.spell, roll = approval.roll;
  if (spell.name !== entry.name || spell.kind !== entry.kind ||
      canonical(spell.damageTypes || []) !== canonical(entry.damageTypes)) {
    fail('p9_definition_terms_mismatch', `The approved display or effect terms do not match the reviewed definition ${describe(entry)}; nothing was registered.`);
  }
  if (canonical(approval.price || {}) !== canonical(entry.price)) {
    fail('p9_definition_terms_mismatch', `The approved AP/mana price does not match the reviewed definition ${describe(entry)}; nothing was registered.`);
  }
  if (!roll || !Array.isArray(roll.dice) || roll.dice.length !== entry.dice.length ||
      entry.dice.some((group, index) => {
        const actual = roll.dice[index];
        return !actual || actual.sides !== group.sides || !Array.isArray(actual.faces) || actual.faces.length !== group.count;
      })) {
    fail('p9_roll_mismatch', `The recorded dice do not match the reviewed formula for ${describe(entry)}; nothing was registered.`);
  }
  if (entry.constantRule === 'zero') {
    if (roll.constant !== 0) fail('p9_roll_mismatch', `The reviewed formula for ${describe(entry)} has no constant; nothing was registered.`);
  } else if (entry.constantRule === 'spirit_score') {
    const label = escapeRegExp(diceLabel(entry));
    const pattern = new RegExp(`^${label} \\+ spirit → ${label}(?: [+-] \\d+)? \\(SPI score\\)$`);
    if (!Number.isSafeInteger(roll.constant) || roll.constant < 0 || !pattern.test(String(roll.reading || ''))) {
      fail('p9_roll_mismatch', `The recorded reading does not match the reviewed spirit formula for ${describe(entry)}; nothing was registered.`);
    }
  } else if (entry.constantRule === 'intelligence_div_4') {
    const label = escapeRegExp(diceLabel(entry));
    const pattern = new RegExp(`^${label} \\+ intelligence\\/4 → ${label} \\+ (\\d+) \\(INT (\\d+) ÷ 4, rounded down\\)$`);
    const match = pattern.exec(String(roll.reading || ''));
    const score = match ? Number(match[2]) : NaN;
    if (!match || !Number.isSafeInteger(roll.constant) || roll.constant < 0 ||
        Number(match[1]) !== roll.constant || !Number.isSafeInteger(score) || score < 0 ||
        Math.floor(score / 4) !== roll.constant) {
      fail('p9_roll_mismatch', `The recorded reading does not match the reviewed intelligence formula for ${describe(entry)}; nothing was registered.`);
    }
  } else {
    fail('invalid_p9_definition_table');
  }
  if (entry.classPrice) {
    if (!approval.classPayment || approval.classPayment.domain !== entry.paymentDomain ||
        canonical(approval.classPayment.price || {}) !== canonical(entry.classPrice)) {
      fail('p9_class_payment_mismatch', `The approved class payment does not match the reviewed definition ${describe(entry)}; nothing was registered.`);
    }
  } else if (approval.classPayment !== null && approval.classPayment !== undefined) {
    fail('p9_class_payment_mismatch', `The reviewed definition ${describe(entry)} has no class payment; nothing was registered.`);
  }
}

function assertSource(room, approval, entry) {
  if (approval.source?.kind !== 'character') {
    fail('unsupported_source_route', 'A legacy P9 definition is cast by a primary character source only.');
  }
  const source = require('./actorConsequences').locate(room, approval.source);
  const classId = normalizeClassId(source.token?.character?.class);
  if (classId !== entry.classId) {
    fail('p9_source_class_mismatch', `The caster class does not own the reviewed P9 definition ${describe(entry)}; nothing was registered.`);
  }
}

/** Approval-time and final-binding check for a P9 approval. Authored capabilities are untouched. */
function check(room, approval) {
  if (!isP9Hash(approval?.spell?.definitionHash)) return null;
  const entry = resolve(approval.spell);
  checkTerms(approval, entry);
  assertSource(room, approval, entry);
  return entry;
}

/**
 * Direct-command check. A P9-shaped consequence must be backed by an owner approval; and even a
 * historical pending approval is re-resolved here, so a fabricated identity cannot reach staging.
 */
function checkCommand(room, command) {
  const adjudication = command?.adjudication;
  if (!adjudication || !isP9Hash(adjudication.definitionVersionOrHash)) return null;
  const entry = resolve({ definitionId: adjudication.definitionId, definitionHash: adjudication.definitionVersionOrHash });
  if (!command.approval) {
    fail('approval_required', 'A legacy P9 consequence needs an exact owner approval; nothing was applied.');
  }
  let chosen;
  try { chosen = JSON.parse(adjudication.chosenResult); } catch (_) { fail('approval_mismatch'); }
  if (!chosen || chosen.capability !== P9_PREFIX.slice(0, -1) ||
      chosen.kind !== entry.kind || canonical(chosen.damageTypes || []) !== canonical(entry.damageTypes)) {
    fail('p9_definition_terms_mismatch', `The staged P9 result does not match the reviewed definition ${describe(entry)}; nothing was applied.`);
  }
  if (command.source) assertSource(room, { source: command.source }, entry);
  return entry;
}

/** Frozen specs for the existing Minstrel-specific approval validator. */
function specsForClass(classId) {
  const specs = {};
  for (const entry of ENTRIES) {
    if (entry.classId !== classId) continue;
    specs[entry.definitionId] = Object.freeze({
      definitionId: entry.definitionId,
      definitionHash: entry.definitionHash,
      name: entry.name,
      kind: entry.kind,
      damageTypes: entry.damageTypes,
      price: entry.price,
      dice: entry.dice,
      constantRule: entry.constantRule,
      classPrice: entry.classPrice
    });
  }
  return Object.freeze(specs);
}

function entries() {
  return ENTRIES;
}

module.exports = { P9_PREFIX, check, checkCommand, resolve, isP9Hash, normalizeClassId, specsForClass, entries };
