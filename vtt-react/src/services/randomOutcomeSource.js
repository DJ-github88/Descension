/**
 * Client-side bridge that resolves outcome-branched spells by reusing existing VTT sources
 * (spellConsequence dice rolling, useDiceStore.startCoinFlip, read-only cardDraw normalization).
 *
 * Never invents deck, reshuffle, or face-down reveal rules for cards.
 */
import useDiceStore from '../store/diceStore';
import { digitalRoll, recordRoll } from './spellConsequence';
import {
  CARD_UNSETTLED_REASON,
  DICE_SIDES,
  fromCardDraw,
  fromCoinFlip,
  fromDiceRoll,
  readBranchFormula
} from './randomOutcome';

function outcomeError(code, message) {
  const err = Error(message || code);
  err.code = code;
  return err;
}

/** Resolves a single outcome die (d4..d100) using existing spell dice rolling, normalized as random-outcome:v1. */
export function rollOutcomeDie(sides, { mode = 'digital', face = null } = {}) {
  if (!DICE_SIDES.includes(sides)) {
    throw outcomeError('invalid_outcome', `Unsupported outcome die d${sides}.`);
  }
  const reading = { dice: [{ count: 1, sides }], constant: 0, reading: `1d${sides}` };
  const roll = mode === 'digital'
    ? digitalRoll(reading)
    : recordRoll('physical', reading, [[Number(face)]]);
  return fromDiceRoll(roll, 'spellDice');
}

/**
 * Resolves `count` fair 50/50 coins using the existing `useDiceStore.startCoinFlip` / `finishCoinFlip` source
 * for digital flips, or validates manual table results for physical flips.
 */
export function flipOutcomeCoins(count = 1, { mode = 'digital', flips = null } = {}) {
  if (!Number.isSafeInteger(count) || count < 1 || count > 10) {
    throw outcomeError('invalid_outcome', 'Coin flip count must be between 1 and 10.');
  }
  if (mode === 'physical') {
    if (!Array.isArray(flips) || flips.length !== count) {
      throw outcomeError('invalid_outcome', `Enter ${count} physical coin result${count === 1 ? '' : 's'} (heads or tails).`);
    }
    return fromCoinFlip(flips.map(f => String(f || '').trim().toLowerCase()), 'physical', 'diceStore');
  }
  const store = useDiceStore.getState();
  const started = store.startCoinFlip(count);
  if (!started) {
    throw outcomeError('coin_flip_busy', 'A coin flip is already in progress; finish or clear it before flipping again.');
  }
  const flipState = useDiceStore.getState().coinFlip;
  const results = (flipState?.coins || []).map(c => c.result);
  try {
    store.finishCoinFlip(results);
    return fromCoinFlip({ coinType: 'standard', coins: flipState.coins }, 'digital', 'diceStore');
  } finally {
    useDiceStore.getState().clearCoinFlip();
  }
}

/** Read-only normalizer over `useDiceStore.cardDraw` shape; refuses execution because card rules are unsettled. */
export function normalizeCardOutcome(cardDrawOrCards, mode = 'digital') {
  return fromCardDraw(cardDrawOrCards, mode, 'diceStore');
}

export function cardExecutionRefusal() {
  return CARD_UNSETTLED_REASON;
}

/** Rolls (or constructs deterministic payload for) the chosen outcome branch's damage/healing formula. */
export function rollBranchEffect(branch, { mode = 'digital', faces = null } = {}) {
  if (!branch?.effect?.formula) {
    throw outcomeError('invalid_outcome', 'Select and resolve an outcome branch first.');
  }
  const reading = readBranchFormula(branch.effect.formula);
  if (reading.dice.length === 0) {
    return {
      mode: 'deterministic',
      dice: [],
      constant: reading.constant,
      total: reading.constant,
      reading: reading.reading
    };
  }
  if (mode === 'digital') {
    return digitalRoll(reading);
  }
  return recordRoll('physical', reading, faces || reading.dice.map(g => Array(g.count).fill(NaN)));
}
