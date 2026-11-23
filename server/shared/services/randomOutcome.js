/**
 * Shared pure random-outcome adapter & outcome-branched spell contract (authored-outcome:v1).
 *
 * Normalizes existing mechanic sources (dice roll, fair coin flip, card draw) into a common
 * `random-outcome:v1` envelope for the trigger engine while preserving what makes each
 * mechanic different. Card execution stays fail-closed because deck persistence, reshuffle,
 * and reveal rules are not yet settled (do not invent them here).
 *
 * Zero RNG, zero store, zero network. No object/array spread (bundled as CJS by client build).
 */
const { canonical } = require('./canonicalHash');

const CAPABILITY = 'authored-outcome:v1';
const COMPILER = 'p14-random-outcome-1';
const SCHEMA_VERSION = 9;
const OUTCOME_ENVELOPE_VERSION = 'random-outcome:v1';

const MECHANICS = Object.freeze(['dice', 'coin', 'card']);
const SETTLED_MECHANICS = Object.freeze(['dice', 'coin']);
const MODES = Object.freeze(['digital', 'physical']);
const DICE_SIDES = Object.freeze([4, 6, 8, 10, 12, 20, 100]);
const DAMAGE_TYPES = Object.freeze([
  'arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd',
  'slicing', 'stabbing', 'smashing'
]);
const SUITS = Object.freeze(['Spades', 'Hearts', 'Diamonds', 'Clubs']);
const SUIT_SYMBOLS = Object.freeze({ Spades: '♠', Hearts: '♥', Diamonds: '♦', Clubs: '♣' });
const RANKS = Object.freeze(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']);
const RANK_NAMES = Object.freeze({ A: 'Ace', J: 'Jack', Q: 'Queen', K: 'King' });

const CARD_UNSETTLED_REASON = 'Card draw outcome execution is not yet supported: deck persistence, reshuffle, and face-down reveal rules are not settled. Your card table is preserved as authored for manual play.';
const WEIGHTED_COIN_REFUSAL = 'Weighted coins are not settled for automated execution; use fair standard coins (50/50) or keep this spell manual.';

const DICE_FORMULA = /^([1-9][0-9]?)d([1-9][0-9]{0,2})(?:([+-])([1-9][0-9]{0,4}))?$/;
const PLAIN_INT = /^([0-9]{1,5})$/;
const MAX_BRANCHES_DICE = 16;
const MAX_BRANCHES_COIN = 11;
const MAX_COINS = 10;
const MAX_CARDS = 10;

const isObject = v => !!v && typeof v === 'object' && !Array.isArray(v);
const int = (v, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(v) && v >= min && v <= max;
const text = (v, max = 120) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const exact = (v, names) => isObject(v) && Object.keys(v).sort().join('|') === names.slice().sort().join('|');
const clone = v => JSON.parse(JSON.stringify(v));

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.keys(value).forEach(k => deepFreeze(value[k]));
  }
  return value;
}

function outcomeError(code, message) {
  const err = Error(message || code);
  err.code = code;
  return err;
}

const isOutcome = value => Boolean(
  value && (
    String(value.definitionHash || (value.spell && value.spell.definitionHash) || '').startsWith(CAPABILITY + '/') ||
    value.capability === CAPABILITY
  )
);

const isSettledMechanic = mechanic => SETTLED_MECHANICS.includes(mechanic);

/** Reads a branch damage/healing formula: plain NdM[±K] OR plain fixed integer 0..10000. */
function readBranchFormula(formula) {
  if (typeof formula !== 'string') {
    throw outcomeError('invalid_branch_formula', 'Outcome branch formula must be plain NdM±K dice or a whole number (0..10000).');
  }
  const clean = formula.replace(/\s+/g, '');
  const mInt = PLAIN_INT.exec(clean);
  if (mInt) {
    const constant = Number(mInt[1]);
    if (!int(constant, 0, 10000)) {
      throw outcomeError('invalid_branch_formula', 'Fixed outcome branch amount must be between 0 and 10000.');
    }
    return { dice: [], constant, reading: String(constant) };
  }
  const mDice = DICE_FORMULA.exec(clean);
  if (!mDice) {
    throw outcomeError('invalid_branch_formula', 'Outcome branch formula "' + formula + '" must be plain NdM (optionally +K or -K) or a whole number.');
  }
  const count = Number(mDice[1]);
  const sides = Number(mDice[2]);
  const k = mDice[4] ? Number(mDice[4]) : 0;
  const constant = mDice[3] === '-' ? -k : k;
  if (!int(count, 1, 50) || !int(sides, 2, 100) || k > 10000) {
    throw outcomeError('invalid_branch_formula', 'Outcome branch dice bounds exceeded (1..50 dice, d2..d100, ±10000).');
  }
  return { dice: [{ count, sides }], constant, reading: clean };
}

/** Normalizes an existing dice roll (spellConsequence roll OR diceStore roll result) into a common envelope. */
function fromDiceRoll(rollOrStoreResult, source) {
  const src = source || 'spellDice';
  if (!isObject(rollOrStoreResult)) {
    throw outcomeError('invalid_outcome', 'Expected a dice roll result.');
  }
  let mode = rollOrStoreResult.mode;
  let sides;
  let face;
  if (Array.isArray(rollOrStoreResult.dice) && rollOrStoreResult.dice.length === 1) {
    const group = rollOrStoreResult.dice[0];
    if (!isObject(group) || !Array.isArray(group.faces) || group.faces.length !== 1) {
      throw outcomeError('invalid_outcome', 'Outcome die roll must record exactly one die.');
    }
    sides = group.sides;
    face = group.faces[0];
    if ((rollOrStoreResult.constant || 0) !== 0) {
      throw outcomeError('invalid_outcome', 'Outcome die roll must have zero constant modifier.');
    }
    mode = MODES.includes(mode) ? mode : 'digital';
  } else if (Array.isArray(rollOrStoreResult.results) && rollOrStoreResult.results.length === 1) {
    const r = rollOrStoreResult.results[0];
    const m = /^d(\d+)$/i.exec(String(r && r.type || ''));
    sides = m ? Number(m[1]) : NaN;
    face = r && r.value;
    mode = MODES.includes(mode) ? mode : 'digital';
  } else {
    throw outcomeError('invalid_outcome', 'Expected a single die roll result.');
  }
  if (!DICE_SIDES.includes(sides) || !int(face, 1, sides)) {
    throw outcomeError('invalid_outcome', 'Die face ' + face + ' is outside 1..' + sides + '.');
  }
  return deepFreeze({
    version: OUTCOME_ENVELOPE_VERSION,
    mechanic: 'dice',
    mode,
    source: src,
    summary: 'd' + sides + ' = ' + face,
    dice: {
      sides,
      faces: [face],
      total: face,
      reading: '1d' + sides
    }
  });
}

/** Normalizes an existing fair coin flip (`diceStore.coinFlip` OR flips array) into a common envelope. */
function fromCoinFlip(coinFlipOrFlips, mode, source) {
  const m = mode || 'digital';
  const src = source || 'diceStore';
  if (!MODES.includes(m)) {
    throw outcomeError('invalid_outcome', 'Coin flip mode must be digital or physical.');
  }
  let flips;
  if (Array.isArray(coinFlipOrFlips)) {
    flips = coinFlipOrFlips.slice();
  } else if (isObject(coinFlipOrFlips) && Array.isArray(coinFlipOrFlips.coins)) {
    if (coinFlipOrFlips.coinType && coinFlipOrFlips.coinType !== 'standard') {
      throw outcomeError('weighted_coin_unsupported', WEIGHTED_COIN_REFUSAL);
    }
    flips = coinFlipOrFlips.coins.map(c => (isObject(c) ? c.result : c));
  } else {
    throw outcomeError('invalid_outcome', 'Expected a fair coin flip result.');
  }
  if (!flips.length || flips.length > MAX_COINS || flips.some(f => f !== 'heads' && f !== 'tails')) {
    throw outcomeError('invalid_outcome', 'Coin flip must record 1..' + MAX_COINS + ' heads/tails results.');
  }
  const heads = flips.filter(f => f === 'heads').length;
  const tails = flips.length - heads;
  const summary = flips.length === 1
    ? '1 coin: ' + (heads === 1 ? 'Heads' : 'Tails')
    : flips.length + ' coins: ' + heads + 'H/' + tails + 'T (' + flips.map(f => (f === 'heads' ? 'H' : 'T')).join(', ') + ')';
  return deepFreeze({
    version: OUTCOME_ENVELOPE_VERSION,
    mechanic: 'coin',
    mode: m,
    source: src,
    summary,
    coin: {
      count: flips.length,
      coinType: 'standard',
      flips,
      heads,
      tails
    }
  });
}

/**
 * Normalizes an existing card draw (`diceStore.cardDraw`) into a common envelope while preserving
 * native card structure and deck/reveal flags. Never invents deck, reshuffle, or reveal rules.
 */
function fromCardDraw(cardDrawOrCards, mode, source) {
  const m = mode || 'digital';
  const src = source || 'diceStore';
  if (!MODES.includes(m)) {
    throw outcomeError('invalid_outcome', 'Card draw mode must be digital or physical.');
  }
  let rawCards;
  let manualReveal = false;
  let deckType = 'standard';
  if (Array.isArray(cardDrawOrCards)) {
    rawCards = cardDrawOrCards;
  } else if (isObject(cardDrawOrCards) && Array.isArray(cardDrawOrCards.cards)) {
    rawCards = cardDrawOrCards.cards;
    manualReveal = Boolean(cardDrawOrCards.manual);
    if (cardDrawOrCards.deckType) deckType = String(cardDrawOrCards.deckType);
  } else {
    throw outcomeError('invalid_outcome', 'Expected a card draw result.');
  }
  if (!rawCards.length || rawCards.length > MAX_CARDS) {
    throw outcomeError('invalid_outcome', 'Card draw must contain 1..' + MAX_CARDS + ' cards.');
  }
  const seen = new Set();
  const cards = rawCards.map(c => {
    if (!isObject(c) || !SUITS.includes(c.suit) || !RANKS.includes(c.rank)) {
      throw outcomeError('invalid_outcome', 'Card must have a standard 52-card suit and rank.');
    }
    const id = c.rank + c.suit;
    if (seen.has(id)) {
      throw outcomeError('invalid_outcome', 'Duplicate card in single draw: ' + id);
    }
    seen.add(id);
    const suitSymbol = SUIT_SYMBOLS[c.suit];
    const name = (RANK_NAMES[c.rank] || c.rank) + ' of ' + c.suit;
    return { suit: c.suit, rank: c.rank, suitSymbol, name };
  });
  return deepFreeze({
    version: OUTCOME_ENVELOPE_VERSION,
    mechanic: 'card',
    mode: m,
    source: src,
    summary: cards.length + ' card' + (cards.length === 1 ? '' : 's') + ': ' + cards.map(c => c.rank + c.suitSymbol).join(', '),
    card: {
      count: cards.length,
      deckType,
      manualReveal,
      cards
    }
  });
}

/** Validates and normalizes any `random-outcome:v1` payload across dice, coin, and card. */
function readOutcome(raw) {
  if (!isObject(raw) || raw.version !== OUTCOME_ENVELOPE_VERSION || !MECHANICS.includes(raw.mechanic) ||
      !MODES.includes(raw.mode) || !text(raw.source, 40) || !text(raw.summary, 200)) {
    throw outcomeError('invalid_outcome', 'Malformed random-outcome envelope.');
  }
  if (raw.mechanic === 'dice') {
    if (!exact(raw, ['version', 'mechanic', 'mode', 'source', 'summary', 'dice']) ||
        !exact(raw.dice, ['sides', 'faces', 'total', 'reading'])) {
      throw outcomeError('invalid_outcome', 'Malformed dice outcome payload.');
    }
    const norm = fromDiceRoll({ mode: raw.mode, dice: [{ sides: raw.dice.sides, faces: raw.dice.faces }], constant: 0 }, raw.source);
    if (raw.dice.total !== norm.dice.total || raw.dice.reading !== norm.dice.reading || raw.summary !== norm.summary) {
      throw outcomeError('invalid_outcome', 'Dice outcome fields disagree.');
    }
    return norm;
  }
  if (raw.mechanic === 'coin') {
    if (!exact(raw, ['version', 'mechanic', 'mode', 'source', 'summary', 'coin']) ||
        !exact(raw.coin, ['count', 'coinType', 'flips', 'heads', 'tails'])) {
      throw outcomeError('invalid_outcome', 'Malformed coin outcome payload.');
    }
    if (raw.coin.coinType !== 'standard') {
      throw outcomeError('weighted_coin_unsupported', WEIGHTED_COIN_REFUSAL);
    }
    const norm = fromCoinFlip(raw.coin.flips, raw.mode, raw.source);
    if (raw.coin.count !== norm.coin.count || raw.coin.heads !== norm.coin.heads ||
        raw.coin.tails !== norm.coin.tails || raw.summary !== norm.summary) {
      throw outcomeError('invalid_outcome', 'Coin outcome fields disagree.');
    }
    return norm;
  }
  if (!exact(raw, ['version', 'mechanic', 'mode', 'source', 'summary', 'card']) ||
      !exact(raw.card, ['count', 'deckType', 'manualReveal', 'cards']) ||
      typeof raw.card.manualReveal !== 'boolean') {
    throw outcomeError('invalid_outcome', 'Malformed card outcome payload.');
  }
  const norm = fromCardDraw({ cards: raw.card.cards, manual: raw.card.manualReveal, deckType: raw.card.deckType }, raw.mode, raw.source);
  if (raw.card.count !== norm.card.count || raw.card.deckType !== norm.card.deckType || raw.summary !== norm.summary) {
    throw outcomeError('invalid_outcome', 'Card outcome fields disagree.');
  }
  return norm;
}

/** Validates an outcome intended for automated execution (only settled mechanics succeed). */
function validateSettledOutcome(raw) {
  const norm = readOutcome(raw);
  if (norm.mechanic === 'card') {
    throw outcomeError('card_rules_unsettled', CARD_UNSETTLED_REASON);
  }
  if (!isSettledMechanic(norm.mechanic)) {
    throw outcomeError('unsupported_outcome_mechanic', 'Outcome mechanic "' + norm.mechanic + '" is not settled for execution.');
  }
  return norm;
}

/** Parses a settled standard-coin pattern for `count` fair coins into sorted unique heads counts, or null. */
function parseCoinPattern(pattern, count) {
  if (!int(count, 1, MAX_COINS) || typeof pattern !== 'string') return null;
  const p = pattern.trim();
  if (!p) return null;
  const lower = p.toLowerCase();

  if (count === 1) {
    if (['heads', 'all heads', 'majority heads', 'majority heads (1+)', 'any single heads'].includes(lower)) return [1];
    if (['tails', 'all tails', 'majority tails', 'majority tails (1+)', 'any single tails'].includes(lower)) return [0];
    if (/^exactly\s+1\s+heads?$/i.test(p) || /^exactly\s+0\s+tails?$/i.test(p)) return [1];
    if (/^exactly\s+1\s+tails?$/i.test(p) || /^exactly\s+0\s+heads?$/i.test(p)) return [0];
    return null;
  }

  if (lower === 'all heads') return [count];
  if (lower === 'all tails') return [0];

  const majHeads = /^majority\s+heads(?:\s*\((\d+)\+\))?$/i.exec(p);
  if (majHeads) {
    const threshold = Math.floor(count / 2) + 1;
    if (majHeads[1] && Number(majHeads[1]) !== threshold) return null;
    const list = [];
    for (let h = threshold; h <= count; h += 1) list.push(h);
    return list;
  }

  const majTails = /^majority\s+tails(?:\s*\((\d+)\+\))?$/i.exec(p);
  if (majTails) {
    const minTails = Math.floor(count / 2) + 1;
    if (majTails[1] && Number(majTails[1]) !== minTails) return null;
    const maxHeads = count - minTails;
    const list = [];
    for (let h = 0; h <= maxHeads; h += 1) list.push(h);
    return list;
  }

  if (count % 2 === 0 && ['tie', 'split', 'equal', 'equal heads and tails'].includes(lower)) {
    return [count / 2];
  }

  const exactHeads = /^exactly\s+(\d+)\s+heads?$/i.exec(p);
  if (exactHeads) {
    const h = Number(exactHeads[1]);
    return int(h, 0, count) ? [h] : null;
  }

  const exactTails = /^exactly\s+(\d+)\s+tails?$/i.exec(p);
  if (exactTails) {
    const t = Number(exactTails[1]);
    return int(t, 0, count) ? [count - t] : null;
  }

  return null;
}

function compileBranchEffect(entry, index) {
  const prefix = 'rollableTable branch ' + (index + 1) + ' (' + (entry.name || 'unnamed') + ')';
  if (entry.modifiesBaseSpell === true) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': modifiesBaseSpell is not supported.' };
  }
  if (entry.spellReference) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': linked spell references stay manual.' };
  }
  const type = entry.effectType;
  if (!['damage', 'healing'].includes(type)) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': only Damage and Healing branch effects are supported (got "' + (type || 'none') + '").' };
  }
  const cfg = entry.effectConfig;
  if (!isObject(cfg)) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': missing effect configuration.' };
  }
  if (type === 'damage') {
    if (cfg.aoeRadius !== undefined && cfg.aoeRadius !== 0) {
      return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': area damage inside a random-outcome branch stays manual.' };
    }
    if (cfg.ignoreArmor === true) {
      return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': ignoreArmor stays manual.' };
    }
    if (cfg.critMultiplier !== undefined && cfg.critMultiplier !== null && cfg.critMultiplier !== 2) {
      return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': custom critical multipliers stay manual.' };
    }
    const rawFormula = String(cfg.damageFormula || '').trim();
    let reading;
    try {
      reading = readBranchFormula(rawFormula);
    } catch (err) {
      return { ok: false, code: err.code || 'invalid_branch_formula', reason: prefix + ': ' + err.message };
    }
    if (!DAMAGE_TYPES.includes(cfg.damageType)) {
      return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': supported damageType required.' };
    }
    return { ok: true, effect: { kind: 'damage', formula: reading.reading, damageTypes: [cfg.damageType] } };
  }

  if (cfg.hotDuration !== undefined && cfg.hotDuration !== 0) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': heal-over-time inside a random-outcome branch stays manual.' };
  }
  if (cfg.healAoeRadius !== undefined && cfg.healAoeRadius !== 0) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': area healing inside a random-outcome branch stays manual.' };
  }
  if (cfg.allowOverheal === true || cfg.removeCurses === true) {
    return { ok: false, code: 'unsupported_outcome_effect', reason: prefix + ': overheal/purge modifiers inside a random-outcome branch stay manual.' };
  }
  const rawFormula = String(cfg.healingFormula || '').trim();
  let reading;
  try {
    reading = readBranchFormula(rawFormula);
  } catch (err) {
    return { ok: false, code: err.code || 'invalid_branch_formula', reason: prefix + ': ' + err.message };
  }
  return { ok: true, effect: { kind: 'healing', formula: reading.reading } };
}

/**
 * Compiles a Wizard `rollableTable` object into a canonical `outcomeTable`, or returns an
 * explicit fail-closed `{ ok: false, code, reason }` refusal (never dropping branches).
 */
function compileOutcomeTable(table) {
  if (!isObject(table) || table.enabled !== true) {
    return { ok: false, code: 'rollable_table_disabled', reason: 'rollableTable: enable the Rollable Table and author at least two outcomes.' };
  }
  const resType = table.resolutionType || 'DICE';
  if (resType === 'CARDS') {
    return { ok: false, code: 'card_rules_unsettled', reason: CARD_UNSETTLED_REASON };
  }
  if (resType !== 'DICE' && resType !== 'COINS') {
    return { ok: false, code: 'unsupported_outcome_mechanic', reason: 'rollableTable: unsupported resolutionType "' + resType + '".' };
  }
  const tableName = typeof table.name === 'string' ? table.name.trim() : '';
  if (!tableName || tableName.length > 120) {
    return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable: enter a table name (1..120 characters).' };
  }
  const cfg = isObject(table.resolutionConfig) ? table.resolutionConfig : {};
  const entries = Array.isArray(table.entries) ? table.entries : [];

  if (resType === 'DICE') {
    const mDie = /^d(\d+)$/i.exec(String(cfg.diceType || '').trim());
    const sides = mDie ? Number(mDie[1]) : NaN;
    if (!DICE_SIDES.includes(sides)) {
      return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable: choose a supported single die (d4, d6, d8, d10, d12, d20, or d100).' };
    }
    if (entries.length < 2 || entries.length > MAX_BRANCHES_DICE) {
      return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable: author between 2 and ' + MAX_BRANCHES_DICE + ' outcome branches for d' + sides + '.' };
    }
    const covered = new Map();
    const branches = [];
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      if (!isObject(entry) || !text(entry.name, 120)) {
        return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable branch ' + (i + 1) + ': enter a non-empty entry name (1..120 chars).' };
      }
      const range = entry.range;
      if (!isObject(range) || !int(range.min, 1, sides) || !int(range.max, 1, sides) || range.min > range.max) {
        return { ok: false, code: 'invalid_outcome_range', reason: 'rollableTable branch "' + entry.name.trim() + '": range must be within 1..' + sides + ' with min <= max.' };
      }
      for (let v = range.min; v <= range.max; v += 1) {
        if (covered.has(v)) {
          return { ok: false, code: 'overlapping_outcome_range', reason: 'rollableTable: die face ' + v + ' is claimed by multiple branches; ranges must not overlap.' };
        }
        covered.set(v, i);
      }
      const eff = compileBranchEffect(entry, i);
      if (!eff.ok) return eff;
      branches.push({
        branchId: 'branch-' + (i + 1),
        label: entry.name.trim(),
        matcher: { min: range.min, max: range.max },
        effect: eff.effect
      });
    }
    const missing = [];
    for (let v = 1; v <= sides; v += 1) {
      if (!covered.has(v)) missing.push(v);
    }
    if (missing.length) {
      return { ok: false, code: 'incomplete_outcome_coverage', reason: 'rollableTable: d' + sides + ' outcomes must cover every value 1..' + sides + ' (missing: ' + missing.slice(0, 6).join(', ') + (missing.length > 6 ? '…' : '') + ').' };
    }
    return { ok: true, outcomeTable: { name: tableName, mechanic: 'dice', spec: { sides }, branches } };
  }

  // COINS
  const coinType = cfg.coinType || 'standard';
  if (coinType !== 'standard') {
    return { ok: false, code: 'weighted_coin_unsupported', reason: WEIGHTED_COIN_REFUSAL };
  }
  const count = cfg.coinCount === undefined ? 1 : Number(cfg.coinCount);
  if (!int(count, 1, MAX_COINS)) {
    return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable: coinCount must be a whole number from 1 to ' + MAX_COINS + '.' };
  }
  if (entries.length < 2 || entries.length > MAX_BRANCHES_COIN) {
    return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable: author between 2 and ' + MAX_BRANCHES_COIN + ' coin outcome branches.' };
  }
  const covered = new Map();
  const branches = [];
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (!isObject(entry) || !text(entry.name, 120)) {
      return { ok: false, code: 'invalid_outcome_table', reason: 'rollableTable branch ' + (i + 1) + ': enter a non-empty entry name (1..120 chars).' };
    }
    const headsCounts = parseCoinPattern(entry.coinPattern, count);
    if (!headsCounts || !headsCounts.length) {
      return { ok: false, code: 'unsupported_coin_pattern', reason: 'rollableTable branch "' + entry.name.trim() + '": pattern "' + (entry.coinPattern || '') + '" is not a settled fair-coin partition for ' + count + ' coin' + (count === 1 ? '' : 's') + '.' };
    }
    for (let j = 0; j < headsCounts.length; j += 1) {
      const h = headsCounts[j];
      if (covered.has(h)) {
        return { ok: false, code: 'overlapping_outcome_range', reason: 'rollableTable: ' + h + ' heads is claimed by multiple coin branches; outcomes must not overlap.' };
      }
      covered.set(h, i);
    }
    const eff = compileBranchEffect(entry, i);
    if (!eff.ok) return eff;
    branches.push({
      branchId: 'branch-' + (i + 1),
      label: entry.name.trim(),
      matcher: { headsCounts },
      effect: eff.effect
    });
  }
  const missingHeads = [];
  for (let h = 0; h <= count; h += 1) {
    if (!covered.has(h)) missingHeads.push(h);
  }
  if (missingHeads.length) {
    return { ok: false, code: 'incomplete_outcome_coverage', reason: 'rollableTable: coin outcomes for ' + count + ' coin' + (count === 1 ? '' : 's') + ' must cover every heads count 0..' + count + ' (uncovered heads count: ' + missingHeads.join(', ') + ').' };
  }
  return { ok: true, outcomeTable: { name: tableName, mechanic: 'coin', spec: { count, coinType: 'standard' }, branches } };
}

function validBranchEffect(effect) {
  if (!isObject(effect) || !['damage', 'healing'].includes(effect.kind) || typeof effect.formula !== 'string') return false;
  let reading;
  try { reading = readBranchFormula(effect.formula); } catch (_) { return false; }
  if (reading.reading !== effect.formula) return false;
  if (effect.kind === 'healing') return exact(effect, ['kind', 'formula']);
  return exact(effect, ['kind', 'formula', 'damageTypes']) && Array.isArray(effect.damageTypes) &&
    effect.damageTypes.length === 1 && DAMAGE_TYPES.includes(effect.damageTypes[0]);
}

/** Strict canonical validator for `definition.outcomeTable` (used at server registry decode & admission). */
function validOutcomeTable(table) {
  if (!exact(table, ['name', 'mechanic', 'spec', 'branches']) || !text(table.name, 120) ||
      !isSettledMechanic(table.mechanic) || !Array.isArray(table.branches) || table.branches.length < 2) {
    return false;
  }
  if (table.mechanic === 'dice') {
    if (!exact(table.spec, ['sides']) || !DICE_SIDES.includes(table.spec.sides) || table.branches.length > MAX_BRANCHES_DICE) {
      return false;
    }
    const covered = new Set();
    for (let i = 0; i < table.branches.length; i += 1) {
      const b = table.branches[i];
      if (!exact(b, ['branchId', 'label', 'matcher', 'effect']) || b.branchId !== 'branch-' + (i + 1) ||
          !text(b.label, 120) || b.label !== b.label.trim() || !validBranchEffect(b.effect) ||
          !exact(b.matcher, ['min', 'max']) || !int(b.matcher.min, 1, table.spec.sides) ||
          !int(b.matcher.max, 1, table.spec.sides) || b.matcher.min > b.matcher.max) {
        return false;
      }
      for (let v = b.matcher.min; v <= b.matcher.max; v += 1) {
        if (covered.has(v)) return false;
        covered.add(v);
      }
    }
    return covered.size === table.spec.sides;
  }

  // coin
  if (!exact(table.spec, ['count', 'coinType']) || !int(table.spec.count, 1, MAX_COINS) ||
      table.spec.coinType !== 'standard' || table.branches.length > MAX_BRANCHES_COIN) {
    return false;
  }
  const covered = new Set();
  for (let i = 0; i < table.branches.length; i += 1) {
    const b = table.branches[i];
    if (!exact(b, ['branchId', 'label', 'matcher', 'effect']) || b.branchId !== 'branch-' + (i + 1) ||
        !text(b.label, 120) || b.label !== b.label.trim() || !validBranchEffect(b.effect) ||
        !exact(b.matcher, ['headsCounts']) || !Array.isArray(b.matcher.headsCounts) || !b.matcher.headsCounts.length) {
      return false;
    }
    for (let j = 0; j < b.matcher.headsCounts.length; j += 1) {
      const h = b.matcher.headsCounts[j];
      if (!int(h, 0, table.spec.count) || (j > 0 && h <= b.matcher.headsCounts[j - 1]) || covered.has(h)) {
        return false;
      }
      covered.add(h);
    }
  }
  return covered.size === table.spec.count + 1;
}

/** Deterministically resolves ONE matching branch for a settled outcome against a canonical outcomeTable. */
function resolveBranch(outcomeTable, rawOutcome) {
  if (!validOutcomeTable(outcomeTable)) {
    return { ok: false, code: 'invalid_outcome_table', reason: 'Canonical outcomeTable is invalid.' };
  }
  let outcome;
  try {
    outcome = validateSettledOutcome(rawOutcome);
  } catch (err) {
    return { ok: false, code: err.code || 'invalid_outcome', reason: err.message };
  }
  if (outcome.mechanic !== outcomeTable.mechanic) {
    return { ok: false, code: 'authored_outcome_mismatch', reason: 'Outcome mechanic "' + outcome.mechanic + '" does not match definition "' + outcomeTable.mechanic + '".' };
  }
  let matches;
  if (outcome.mechanic === 'dice') {
    if (outcome.dice.sides !== outcomeTable.spec.sides) {
      return { ok: false, code: 'authored_outcome_mismatch', reason: 'Expected 1d' + outcomeTable.spec.sides + ' roll.' };
    }
    const value = outcome.dice.total;
    matches = outcomeTable.branches.filter(b => value >= b.matcher.min && value <= b.matcher.max);
  } else {
    if (outcome.coin.count !== outcomeTable.spec.count || outcome.coin.coinType !== outcomeTable.spec.coinType) {
      return { ok: false, code: 'authored_outcome_mismatch', reason: 'Expected ' + outcomeTable.spec.count + ' standard coin flip(s).' };
    }
    const heads = outcome.coin.heads;
    matches = outcomeTable.branches.filter(b => b.matcher.headsCounts.includes(heads));
  }
  if (matches.length !== 1) {
    return { ok: false, code: 'outcome_branch_unbound', reason: 'Recorded outcome did not resolve to one unique branch.' };
  }
  return { ok: true, outcome, branch: clone(matches[0]) };
}

/** Common trigger-engine outcome reader: preserves mechanic-specific native facts under one envelope. */
function outcomeFacts(rawOutcome, branch) {
  const outcome = readOutcome(rawOutcome);
  const facts = {
    version: outcome.version,
    mechanic: outcome.mechanic,
    mode: outcome.mode,
    source: outcome.source,
    summary: outcome.summary,
    matchedBranchId: branch && typeof branch.branchId === 'string' ? branch.branchId : null,
    matchedBranchLabel: branch && typeof branch.label === 'string' ? branch.label : null,
    matchedEffectKind: branch && branch.effect && branch.effect.kind ? branch.effect.kind : null
  };
  if (outcome.mechanic === 'dice') facts.dice = clone(outcome.dice);
  else if (outcome.mechanic === 'coin') facts.coin = clone(outcome.coin);
  else facts.card = clone(outcome.card);
  return facts;
}

/** Evaluates a trigger predicate evidence key against `random-outcome` occurrence evidence. */
function matchesOutcomeEvidence(evidenceKey, evidence) {
  if (!isObject(evidence)) return false;
  if (evidenceKey === 'committed') return evidence.committed === 1 && MECHANICS.includes(evidence.mechanic);
  if (MECHANICS.includes(evidenceKey)) return evidence.mechanic === evidenceKey;
  return false;
}

function describeMatcher(matcher, mechanic, coinCount) {
  if (!isObject(matcher)) return '';
  if (mechanic === 'dice' && int(matcher.min, 1) && int(matcher.max, 1)) {
    return matcher.min === matcher.max ? 'Roll ' + matcher.min : 'Roll ' + matcher.min + '–' + matcher.max;
  }
  if (mechanic === 'coin' && Array.isArray(matcher.headsCounts)) {
    const hs = matcher.headsCounts;
    if (coinCount === 1) return hs[0] === 1 ? 'Heads' : 'Tails';
    if (hs.length === 1 && int(coinCount, 1)) {
      if (hs[0] === coinCount) return 'All Heads (' + coinCount + 'H)';
      if (hs[0] === 0) return 'All Tails (0H)';
      if (coinCount % 2 === 0 && hs[0] === coinCount / 2) return 'Tie (' + hs[0] + 'H/' + hs[0] + 'T)';
    }
    if (int(coinCount, 2)) {
      const maj = Math.floor(coinCount / 2) + 1;
      if (hs.length === coinCount - maj + 1 && hs[0] === maj && hs[hs.length - 1] === coinCount) {
        return 'Majority Heads (' + maj + '+H)';
      }
      if (hs.length === coinCount - maj + 1 && hs[0] === 0 && hs[hs.length - 1] === coinCount - maj) {
        return 'Majority Tails (' + maj + '+T)';
      }
    }
    return hs.map(h => h + 'H').join(' or ');
  }
  return '';
}

function describeBranchEffect(effect) {
  if (!isObject(effect)) return '';
  if (effect.kind === 'damage') {
    const type = Array.isArray(effect.damageTypes) && effect.damageTypes.length ? ' ' + effect.damageTypes.join('/') : '';
    return effect.formula + type + ' damage';
  }
  if (effect.kind === 'healing') {
    return effect.formula + ' healing';
  }
  return '';
}

function describeOutcomeSpec(outcomeTable) {
  if (!isObject(outcomeTable) || !isObject(outcomeTable.spec)) return '';
  if (outcomeTable.mechanic === 'dice') return '1d' + outcomeTable.spec.sides;
  if (outcomeTable.mechanic === 'coin') {
    const c = outcomeTable.spec.count;
    return c + ' fair coin' + (c === 1 ? '' : 's');
  }
  return outcomeTable.mechanic || '';
}

function describeOutcomeTable(outcomeTable) {
  if (!isObject(outcomeTable)) return '';
  const coinCount = outcomeTable.spec && outcomeTable.spec.count;
  const parts = (outcomeTable.branches || []).map(b =>
    describeMatcher(b.matcher, outcomeTable.mechanic, coinCount) + ': ' + b.label + ' (' + describeBranchEffect(b.effect) + ')'
  );
  return describeOutcomeSpec(outcomeTable) + ' — ' + parts.join(' | ');
}

function canonicalOutcomeCheck(a, b) {
  return canonical(a) === canonical(b);
}

module.exports = {
  CAPABILITY,
  COMPILER,
  SCHEMA_VERSION,
  OUTCOME_ENVELOPE_VERSION,
  MECHANICS,
  SETTLED_MECHANICS,
  MODES,
  DICE_SIDES,
  DAMAGE_TYPES,
  SUITS,
  SUIT_SYMBOLS,
  RANKS,
  CARD_UNSETTLED_REASON,
  WEIGHTED_COIN_REFUSAL,
  isOutcome,
  isSettledMechanic,
  readBranchFormula,
  fromDiceRoll,
  fromCoinFlip,
  fromCardDraw,
  readOutcome,
  validateSettledOutcome,
  parseCoinPattern,
  compileOutcomeTable,
  validOutcomeTable,
  resolveBranch,
  outcomeFacts,
  matchesOutcomeEvidence,
  describeMatcher,
  describeBranchEffect,
  describeOutcomeSpec,
  describeOutcomeTable,
  canonicalOutcomeCheck
};
