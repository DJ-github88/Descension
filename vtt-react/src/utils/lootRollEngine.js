/**
 * Loot Roll Engine (client copy, used for LOCAL / test-player rolls only)
 *
 * Keep in sync with server/services/lootRollService.js - in multiplayer the
 * server runs that file and is the only one that rolls. CRA can't import files
 * outside src/, so the rules live here as a copy for offline play.
 */


const randomD20 = () => {
  try {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return (buf[0] % 20) + 1;
  } catch (e) {
    return Math.floor(Math.random() * 20) + 1;
  }
};
const randomId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const CHOICES = new Set(['need', 'greed', 'pass']);
const DEFAULT_DURATION_MS = 30000;
const MIN_DURATION_MS = 10000;
const MAX_DURATION_MS = 120000;
const TIEBREAK_DURATION_MS = 15000;
const MAX_ITEMS_PER_SESSION = 20;
const SESSION_LINGER_MS = 10000;

// Creature portrait for the roll frames: plain site paths or http(s) only.
const cleanImageUrl = (value) => {
  if (typeof value !== 'string') {return null;}
  const url = value.trim();
  if (!url || url.length > 2000 || /[<>"'\s]/.test(url)) {return null;}
  return (url.startsWith('/') || /^https?:\/\//i.test(url)) ? url : null;
};

const clampDuration = (ms) => {
  const n = Number(ms);
  if (!Number.isFinite(n)) {return DEFAULT_DURATION_MS;}
  return Math.max(MIN_DURATION_MS, Math.min(MAX_DURATION_MS, Math.round(n)));
};

const cleanText = (value, max = 80, fallback = '') => {
  if (typeof value !== 'string') {return fallback;}
  const trimmed = value.replace(/[<>]/g, '').trim();
  return trimmed ? trimmed.slice(0, max) : fallback;
};

export class LootRollEngine {
  /**
   * @param {Object} opts
   * @param {Object} opts.hooks
   * @param {Function} opts.hooks.broadcast  (session, event, payload) => void  - to everyone in the room
   * @param {Function} opts.hooks.onItemResolved (session, item) => void       - unlock orb / hand item to winner
   * @param {Function} [opts.rollD20] () => 1..20
   * @param {Function} [opts.now]
   * @param {Function} [opts.setTimer]
   * @param {Function} [opts.clearTimer]
   */
  constructor({ hooks, rollD20, now, setTimer, clearTimer } = {}) {
    this.hooks = hooks || {};
    this.rollD20 = rollD20 || randomD20;
    this.now = now || (() => Date.now());
    this.setTimer = setTimer || ((fn, ms) => setTimeout(fn, ms));
    this.clearTimer = clearTimer || ((t) => clearTimeout(t));
    this.sessions = new Map();
  }

  // ---------------------------------------------------------------- start

  /**
   * @param {Object} params
   * @param {string} params.sessionId
   * @param {string} params.roomId
   * @param {string} params.mapId
   * @param {string} params.creatureName
   * @param {string} params.startedBy
   * @param {number} params.durationMs
   * @param {Array}  params.items   [{ gridItemId, name, quality, iconId, quantity }]
   * @param {Array}  params.eligible [{ playerId, name }]
   */
  startSession(params) {
    const sessionId = cleanText(params.sessionId, 120) || `lootroll_${randomId()}`;
    if (this.sessions.has(sessionId)) {
      return { ok: false, error: 'duplicate_session' };
    }

    const rawItems = Array.isArray(params.items) ? params.items.slice(0, MAX_ITEMS_PER_SESSION) : [];
    const items = rawItems
      .filter(it => it && typeof it.gridItemId === 'string' && it.gridItemId)
      .map((it, index) => ({
        dropId: `${index}`,
        gridItemId: cleanText(it.gridItemId, 200),
        name: cleanText(it.name, 80, 'Unknown Item'),
        quality: cleanText(it.quality, 20, 'common').toLowerCase(),
        iconId: cleanText(it.iconId, 300, ''),
        quantity: Math.max(1, Math.min(9999, parseInt(it.quantity, 10) || 1)),
        phase: 'rolling', // rolling -> (tiebreak ->)* done
        choices: {},      // playerId -> { choice, roll, name, auto }
        tiebreak: null,   // { round, playerIds, rolls, deadline, timer }
        tiebreakHistory: [],
        winner: null,
        outcome: null     // 'won' | 'all_passed'
      }));

    if (items.length === 0) {
      return { ok: false, error: 'no_items' };
    }

    const eligible = new Map();
    (Array.isArray(params.eligible) ? params.eligible : []).forEach(p => {
      if (p && p.playerId && !eligible.has(p.playerId)) {
        eligible.set(p.playerId, { playerId: p.playerId, name: cleanText(p.name, 40, 'Adventurer') });
      }
    });

    const durationMs = clampDuration(params.durationMs);
    const session = {
      id: sessionId,
      roomId: params.roomId,
      mapId: params.mapId || 'default',
      creatureName: cleanText(params.creatureName, 80, 'creature'),
      creatureImage: cleanImageUrl(params.creatureImage),
      startedBy: cleanText(params.startedBy, 40, 'GM'),
      createdAt: this.now(),
      durationMs,
      deadline: this.now() + durationMs,
      eligible,
      items,
      timer: null,
      ended: false
    };

    this.sessions.set(sessionId, session);

    if (eligible.size === 0) {
      // Nobody to roll: every item goes straight back to free-for-all.
      items.forEach(item => this._finish(session, item, null, 'no_rollers'));
      this._maybeEnd(session);
      return { ok: true, session, noRollers: true };
    }

    session.timer = this.setTimer(() => this._onRollingTimeout(sessionId), durationMs);
    return { ok: true, session };
  }

  // ---------------------------------------------------------------- player actions

  choose(sessionId, playerId, dropId, choice, displayName) {
    const session = this.sessions.get(sessionId);
    if (!session || session.ended) {return { ok: false, error: 'session_not_found' };}
    if (!session.eligible.has(playerId)) {return { ok: false, error: 'not_eligible' };}
    if (!CHOICES.has(choice)) {return { ok: false, error: 'invalid_choice' };}

    const item = session.items.find(it => it.dropId === String(dropId));
    if (!item) {return { ok: false, error: 'item_not_found' };}
    if (item.phase !== 'rolling') {return { ok: false, error: 'item_closed' };}
    if (item.choices[playerId]) {return { ok: false, error: 'already_chosen' };}

    const name = cleanText(displayName, 40, '');
    if (name) {session.eligible.get(playerId).name = name;}

    item.choices[playerId] = {
      choice,
      roll: choice === 'pass' ? null : this.rollD20(),
      name: session.eligible.get(playerId).name,
      auto: false
    };

    this._emitItem(session, item);
    if (Object.keys(item.choices).length >= session.eligible.size) {
      this._evaluate(session, item);
    }
    return { ok: true };
  }

  reroll(sessionId, playerId, dropId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.ended) {return { ok: false, error: 'session_not_found' };}
    const item = session.items.find(it => it.dropId === String(dropId));
    if (!item || item.phase !== 'tiebreak' || !item.tiebreak) {return { ok: false, error: 'no_tiebreak' };}
    if (!item.tiebreak.playerIds.includes(playerId)) {return { ok: false, error: 'not_tied' };}
    if (item.tiebreak.rolls[playerId] !== undefined) {return { ok: false, error: 'already_rerolled' };}

    item.tiebreak.rolls[playerId] = this.rollD20();
    this._emitItem(session, item);
    if (item.tiebreak.playerIds.every(pid => item.tiebreak.rolls[pid] !== undefined)) {
      this._resolveTiebreak(session, item);
    }
    return { ok: true };
  }

  // ---------------------------------------------------------------- resolution

  _onRollingTimeout(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.ended) {return;}
    session.timer = null;
    session.items.forEach(item => {
      if (item.phase !== 'rolling') {return;}
      session.eligible.forEach(({ playerId, name }) => {
        if (!item.choices[playerId]) {
          item.choices[playerId] = { choice: 'pass', roll: null, name, auto: true };
        }
      });
      this._evaluate(session, item);
    });
  }

  _evaluate(session, item) {
    const entries = Object.entries(item.choices);
    const needers = entries.filter(([, c]) => c.choice === 'need');
    const greeders = entries.filter(([, c]) => c.choice === 'greed');
    const pool = needers.length > 0 ? needers : greeders;
    const category = needers.length > 0 ? 'need' : (greeders.length > 0 ? 'greed' : null);

    if (!category) {
      this._finish(session, item, null, 'all_passed');
      this._maybeEnd(session);
      return;
    }

    const best = Math.max(...pool.map(([, c]) => c.roll));
    const top = pool.filter(([, c]) => c.roll === best).map(([pid]) => pid);
    item.category = category;

    if (top.length === 1) {
      this._finish(session, item, top[0], 'won', best);
      this._maybeEnd(session);
      return;
    }
    this._startTiebreak(session, item, top, best, 1);
  }

  _startTiebreak(session, item, playerIds, tiedAt, round) {
    if (item.tiebreak?.timer) {this.clearTimer(item.tiebreak.timer);}
    item.phase = 'tiebreak';
    item.tiebreak = {
      round,
      playerIds,
      tiedAt,
      rolls: {},
      deadline: this.now() + TIEBREAK_DURATION_MS,
      timer: null
    };
    item.tiebreak.timer = this.setTimer(() => this._onTiebreakTimeout(session.id, item.dropId, round), TIEBREAK_DURATION_MS);
    this._emitItem(session, item);
  }

  _onTiebreakTimeout(sessionId, dropId, round) {
    const session = this.sessions.get(sessionId);
    if (!session || session.ended) {return;}
    const item = session.items.find(it => it.dropId === dropId);
    if (!item || item.phase !== 'tiebreak' || !item.tiebreak || item.tiebreak.round !== round) {return;}
    item.tiebreak.timer = null;
    item.tiebreak.playerIds.forEach(pid => {
      if (item.tiebreak.rolls[pid] === undefined) {
        item.tiebreak.rolls[pid] = this.rollD20();
        item.tiebreak.autoRolled = [...(item.tiebreak.autoRolled || []), pid];
      }
    });
    this._resolveTiebreak(session, item);
  }

  _resolveTiebreak(session, item) {
    const tb = item.tiebreak;
    if (tb.timer) {this.clearTimer(tb.timer);}
    item.tiebreakHistory.push({ round: tb.round, tiedAt: tb.tiedAt, rolls: { ...tb.rolls }, autoRolled: tb.autoRolled || [] });

    const best = Math.max(...tb.playerIds.map(pid => tb.rolls[pid]));
    const top = tb.playerIds.filter(pid => tb.rolls[pid] === best);
    if (top.length === 1) {
      item.tiebreak = null;
      this._finish(session, item, top[0], 'won', best);
      this._maybeEnd(session);
      return;
    }
    this._startTiebreak(session, item, top, best, tb.round + 1);
  }

  _finish(session, item, winnerId, outcome, winningRoll = null) {
    if (item.tiebreak?.timer) {this.clearTimer(item.tiebreak.timer);}
    item.phase = 'done';
    item.tiebreak = null;
    item.outcome = winnerId ? 'won' : outcome;
    item.winner = winnerId
      ? { playerId: winnerId, name: session.eligible.get(winnerId)?.name || 'Adventurer', roll: winningRoll, category: item.category || null }
      : null;

    try {
      this.hooks.onItemResolved?.(session, item);
    } catch (e) {
      // Hook failures must never wedge the roll state machine.
    }
    this._emit(session, 'loot_roll_item_resolved', { sessionId: session.id, item: this.publicItem(session, item) });
  }

  _maybeEnd(session) {
    if (session.ended || !session.items.every(it => it.phase === 'done')) {return;}
    session.ended = true;
    if (session.timer) {
      this.clearTimer(session.timer);
      session.timer = null;
    }
    this._emit(session, 'loot_roll_ended', { sessionId: session.id });
    this.setTimer(() => this.sessions.delete(session.id), SESSION_LINGER_MS);
  }

  // ---------------------------------------------------------------- views

  publicItem(session, item) {
    const revealed = item.phase !== 'rolling';
    const now = this.now();
    return {
      dropId: item.dropId,
      gridItemId: item.gridItemId,
      name: item.name,
      quality: item.quality,
      iconId: item.iconId,
      quantity: item.quantity,
      phase: item.phase,
      remainingMs: item.phase === 'rolling' ? Math.max(0, session.deadline - now) : 0,
      choices: [...session.eligible.values()].map(({ playerId, name }) => {
        const c = item.choices[playerId];
        return {
          playerId,
          name: c?.name || name,
          choice: c ? c.choice : null,
          auto: !!c?.auto,
          roll: revealed && c ? c.roll : null
        };
      }),
      tiebreak: item.tiebreak ? {
        round: item.tiebreak.round,
        tiedAt: item.tiebreak.tiedAt,
        playerIds: [...item.tiebreak.playerIds],
        rerolled: Object.keys(item.tiebreak.rolls),
        remainingMs: Math.max(0, item.tiebreak.deadline - now)
      } : null,
      tiebreakHistory: item.tiebreakHistory.map(h => ({ ...h, rolls: { ...h.rolls } })),
      winner: item.winner ? { ...item.winner } : null,
      outcome: item.outcome
    };
  }

  publicSession(session) {
    return {
      sessionId: session.id,
      mapId: session.mapId,
      creatureName: session.creatureName,
      creatureImage: session.creatureImage,
      startedBy: session.startedBy,
      durationMs: session.durationMs,
      remainingMs: Math.max(0, session.deadline - this.now()),
      eligible: [...session.eligible.values()].map(p => ({ ...p })),
      items: session.items.map(it => this.publicItem(session, it)),
      ended: session.ended
    };
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  // ---------------------------------------------------------------- emit helpers

  _emitItem(session, item) {
    this._emit(session, 'loot_roll_updated', { sessionId: session.id, item: this.publicItem(session, item) });
  }

  _emit(session, event, payload) {
    try {
      this.hooks.broadcast?.(session, event, payload);
    } catch (e) {
      // Transport errors are non-fatal for the state machine.
    }
  }
}

export { clampDuration, DEFAULT_DURATION_MS, TIEBREAK_DURATION_MS, MAX_ITEMS_PER_SESSION };
