import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useLootRollStore, { LOOT_REVEAL_SETTLE_MS } from '../../store/lootRollStore';
import { getIconUrl } from '../../utils/assetManager';
import './LootRollManager.css';

const MAX_VISIBLE_FRAMES = 4;

const CHOICE_META = {
  need: { label: 'Need', icon: 'fas fa-dice-d20' },
  greed: { label: 'Greed', icon: 'fas fa-coins' },
  pass: { label: 'Pass', icon: 'fas fa-times' }
};

const secondsLeft = (deadline) => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

function TimerBar({ deadline, totalMs }) {
  const remaining = Math.max(0, deadline - Date.now());
  const pct = totalMs > 0 ? Math.max(0, Math.min(100, (remaining / totalMs) * 100)) : 0;
  return (
    <div className="loot-roll-timer" aria-label={`${secondsLeft(deadline)} seconds left`}>
      <div className={`loot-roll-timer-fill ${pct < 25 ? 'urgent' : ''}`} style={{ width: `${pct}%` }} />
      <span className="loot-roll-timer-text">{secondsLeft(deadline)}s</span>
    </div>
  );
}

// ---------------------------------------------------------------- dice reveal
// The server decides every roll instantly; on screen each d20 tumbles for a
// random moment and lands at an irregular time, so it feels like dice rolling.
const SPIN_MIN_MS = 550;
const SPIN_SPREAD_MS = 1900;

const revealTimes = new Map(); // dieKey -> timestamp the die lands

const reducedMotion = () => {
  try {
    return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
};

const getRevealAt = (dieKey) => {
  if (!revealTimes.has(dieKey)) {
    if (revealTimes.size > 400) {
      const cutoff = Date.now() - 60000;
      revealTimes.forEach((t, k) => { if (t < cutoff) revealTimes.delete(k); });
    }
    revealTimes.set(dieKey, Date.now() + (reducedMotion() ? 0 : SPIN_MIN_MS + Math.random() * SPIN_SPREAD_MS));
  }
  return revealTimes.get(dieKey);
};

function RollingDie({ value, revealAt, className = 'loot-roll-die', placeholder = '–', label }) {
  const [, setFrame] = useState(0);
  const landed = value === null || value === undefined || Date.now() >= revealAt;

  useEffect(() => {
    if (landed) return undefined;
    // Flicker faces quickly, then re-render exactly when the die lands.
    const flicker = setInterval(() => setFrame(n => n + 1), 75);
    const land = setTimeout(() => setFrame(n => n + 1), Math.max(0, revealAt - Date.now()) + 10);
    return () => {
      clearInterval(flicker);
      clearTimeout(land);
    };
  }, [landed, revealAt]);

  if (value === null || value === undefined) {
    return <span className={className} aria-label={label || 'roll hidden'}>{placeholder}</span>;
  }
  if (!landed) {
    return (
      <span key="rolling" className={`${className} rolling`} aria-label="rolling">
        {1 + Math.floor(Math.random() * 20)}
      </span>
    );
  }
  const fresh = Date.now() - revealAt < 700;
  const crit = value === 20 ? ' crit' : (value === 1 ? ' fumble' : '');
  return (
    <span key="landed" className={`${className} landed${fresh ? ' fresh' : ''}${crit}`} aria-label={`rolled ${value}`}>
      {value}
    </span>
  );
}

function LootRollFrame({ session, item }) {
  const choose = useLootRollStore(state => state.choose);
  const reroll = useLootRollStore(state => state.reroll);
  const dismissItem = useLootRollStore(state => state.dismissItem);
  const pending = useLootRollStore(state => state.pending);

  // Total time is fixed per phase; capture it the first time we see each phase.
  const [totals] = useState(() => ({}));
  const phaseKey = item.phase === 'tiebreak' ? `tb${item.tiebreak?.round}` : item.phase;
  if (item.phase === 'rolling' && totals.rolling === undefined) totals.rolling = Math.max(1, item.deadline - Date.now());
  if (item.phase === 'tiebreak' && item.tiebreak && totals[phaseKey] === undefined) {
    totals[phaseKey] = Math.max(1, item.tiebreak.deadline - Date.now());
  }

  const me = session.yourPlayerId;
  const myEntry = item.choices.find(c => c.playerId === me);
  const myChoice = myEntry?.choice || pending[`${session.sessionId}:${item.dropId}`] || null;
  const quality = (item.quality || 'common').toLowerCase();
  const iconUrl = getIconUrl(item.iconId || 'Container/Pouch/brown-tied-pouch', 'items', true);

  const tb = item.tiebreak;
  const iAmTied = !!(tb && tb.playerIds.includes(me));
  const iRerolled = !!(tb && (tb.rerolled.includes(me) || pending[`${session.sessionId}:${item.dropId}:reroll:${tb.round}`]));
  const nameOf = (pid) => item.choices.find(c => c.playerId === pid)?.name || 'Adventurer';

  const isDone = item.phase === 'done';
  const winnerId = item.winner?.playerId;

  // Dice still tumbling? Hold back the tie prompt / result until they land.
  const now = Date.now();
  const dieKey = (pid, round = 0) => `${session.sessionId}:${item.dropId}:${pid}:${round}`;
  let diceRolling = false;
  if (item.phase !== 'rolling') {
    item.choices.forEach(c => {
      if (c.roll !== null && c.roll !== undefined && now < getRevealAt(dieKey(c.playerId))) diceRolling = true;
    });
    (item.tiebreakHistory || []).forEach(h => {
      Object.keys(h.rolls || {}).forEach(pid => {
        if (now < getRevealAt(dieKey(pid, h.round))) diceRolling = true;
      });
    });
  }

  return (
    <div className={`loot-roll-frame quality-${quality} phase-${item.phase}`} role="group" aria-label={`Loot roll for ${item.name}`}>
      <div className="loot-roll-head">
        <div className={`loot-roll-icon ${quality}`}>
          <img
            src={iconUrl}
            alt=""
            onError={(e) => {
              const fallback = getIconUrl('Container/Pouch/brown-tied-pouch', 'items', true);
              if (e.currentTarget.dataset.fellBack) { e.currentTarget.style.visibility = 'hidden'; return; }
              e.currentTarget.dataset.fellBack = '1';
              e.currentTarget.src = fallback;
            }}
          />
          {item.quantity > 1 && <span className="loot-roll-qty">{item.quantity}</span>}
        </div>
        <div className="loot-roll-title">
          <div className={`loot-roll-name ${quality}`}>{item.name}</div>
          <div className="loot-roll-source">
            {session.creatureImage && (
              <img
                className="loot-roll-creature"
                src={session.creatureImage}
                alt=""
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            from {session.creatureName}
            {session.isLocal && <span className="loot-roll-local-tag" title="Rolled locally against test players">test</span>}
          </div>
        </div>
        <button
          type="button"
          className="loot-roll-close"
          onClick={() => {
            // Closing an undecided roll counts as Pass, like WoW.
            if (item.phase === 'rolling' && session.canRoll && !myChoice) {
              choose(session.sessionId, item.dropId, 'pass');
            }
            dismissItem(session.sessionId, item.dropId);
          }}
          title={isDone ? 'Close' : (session.canRoll && !myChoice ? 'Close (counts as Pass)' : 'Hide')}
          aria-label="Close"
        >
          <i className="fas fa-times" />
        </button>
      </div>

      {item.phase === 'rolling' && <TimerBar deadline={item.deadline} totalMs={totals.rolling} />}
      {item.phase === 'tiebreak' && tb && <TimerBar deadline={tb.deadline} totalMs={totals[phaseKey]} />}

      {/* Choice buttons */}
      {item.phase === 'rolling' && session.canRoll && !myChoice && (
        <div className="loot-roll-actions">
          {['need', 'greed', 'pass'].map(choice => (
            <button
              key={choice}
              type="button"
              className={`loot-roll-btn ${choice}`}
              onClick={() => choose(session.sessionId, item.dropId, choice)}
            >
              <i className={CHOICE_META[choice].icon} /> {CHOICE_META[choice].label}
            </button>
          ))}
        </div>
      )}
      {item.phase === 'rolling' && session.canRoll && myChoice && (
        <div className="loot-roll-status">
          You chose <strong className={`choice-${myChoice}`}>{CHOICE_META[myChoice]?.label}</strong>
          {myChoice !== 'pass' && ' — your d20 is revealed when everyone has chosen.'}
        </div>
      )}
      {item.phase === 'rolling' && !session.canRoll && (
        <div className="loot-roll-status">Players are choosing…</div>
      )}

      {/* Tie: only the tied players reroll */}
      {diceRolling && (
        <div className="loot-roll-status loot-roll-tumbling">
          <i className="fas fa-dice-d20" /> Rolling the dice…
        </div>
      )}

      {item.phase === 'tiebreak' && tb && !diceRolling && (
        <div className="loot-roll-tie">
          <div className="loot-roll-tie-text">
            <i className="fas fa-balance-scale" /> Tie at <strong>{tb.tiedAt}</strong>
            {tb.round > 1 ? ` (reroll ${tb.round})` : ''}: {tb.playerIds.map(nameOf).join(' vs ')}
          </div>
          {iAmTied && !iRerolled && (
            <button type="button" className="loot-roll-btn reroll" onClick={() => reroll(session.sessionId, item.dropId, tb.round)}>
              <i className="fas fa-dice-d20" /> Reroll d20
            </button>
          )}
          {iAmTied && iRerolled && <div className="loot-roll-status">Rolled — waiting for the others…</div>}
          {!iAmTied && <div className="loot-roll-status">Waiting for the tied players to reroll…</div>}
        </div>
      )}

      {/* Everyone's choices and (once revealed) rolls */}
      <ul className="loot-roll-roster">
        {item.choices.map(entry => {
          // Show my own pick immediately, before the server echoes it back.
          const c = (entry.playerId === me && !entry.choice && myChoice) ? { ...entry, choice: myChoice } : entry;
          const won = isDone && !diceRolling && c.playerId === winnerId;
          return (
            <li key={c.playerId} className={`loot-roll-row ${won ? 'winner' : ''} ${c.playerId === me ? 'me' : ''}`}>
              <span className="loot-roll-player">{c.name}{c.playerId === me ? ' (you)' : ''}</span>
              <span className={`loot-roll-choice choice-${c.choice || 'none'}`}>
                {c.choice ? (
                  <>
                    <i className={CHOICE_META[c.choice].icon} /> {CHOICE_META[c.choice].label}
                    {c.auto ? ' (timed out)' : ''}
                  </>
                ) : (
                  <span className="loot-roll-waiting">choosing…</span>
                )}
              </span>
              <RollingDie
                value={c.roll}
                revealAt={c.roll !== null && c.roll !== undefined ? getRevealAt(dieKey(c.playerId)) : 0}
                placeholder={c.choice && c.choice !== 'pass' ? '?' : '–'}
              />
            </li>
          );
        })}
      </ul>

      {item.tiebreakHistory?.length > 0 && (
        <div className="loot-roll-rerolls">
          {item.tiebreakHistory.map(h => (
            <div key={h.round} className="loot-roll-reroll-line">
              <span className="loot-roll-reroll-label">Reroll {h.round}:</span>{' '}
              {Object.entries(h.rolls).map(([pid, roll], i) => (
                <React.Fragment key={pid}>
                  {i > 0 && ' · '}
                  {nameOf(pid)}{' '}
                  <RollingDie
                    className="loot-roll-die small"
                    value={roll}
                    revealAt={getRevealAt(dieKey(pid, h.round))}
                  />
                  {h.autoRolled?.includes(pid) ? '*' : ''}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      )}

      {isDone && !diceRolling && (
        <div className={`loot-roll-result ${item.winner ? 'won' : 'passed'}`}>
          {item.winner ? (
            <>
              <i className="fas fa-trophy" />{' '}
              {item.winner.playerId === me ? 'You win' : `${item.winner.name} wins`}
              {' '}({CHOICE_META[item.winner.category]?.label || 'Roll'} · {item.winner.roll})
              {item.winner.playerId === me ? ' — added to your inventory.' : ''}
            </>
          ) : (
            <>
              <i className="fas fa-hand-paper" />{' '}
              {item.outcome === 'no_rollers' ? 'No players to roll — left on the ground.' : 'Everyone passed — left on the ground.'}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Stack of WoW-style group loot frames (Need / Greed / Pass with a d20).
 * Mounted once on the game surface.
 */
export default function LootRollManager() {
  const sessions = useLootRollStore(state => state.sessions);
  const [, setTick] = useState(0);

  const frames = [];
  Object.values(sessions).forEach(session => {
    session.order.forEach(dropId => {
      const item = session.items[dropId];
      if (item) frames.push({ session, item });
    });
  });

  // Keep ticking while timers run or freshly revealed dice are still tumbling.
  const hasLiveTimer = frames.some(f => f.item.phase !== 'done' ||
    (f.item.resolvedAt && Date.now() - f.item.resolvedAt < LOOT_REVEAL_SETTLE_MS + 500));
  useEffect(() => {
    if (!hasLiveTimer) return undefined;
    const id = setInterval(() => setTick(t => t + 1), 250);
    return () => clearInterval(id);
  }, [hasLiveTimer]);

  if (frames.length === 0 || typeof document === 'undefined') return null;

  const visible = frames.slice(0, MAX_VISIBLE_FRAMES);
  const hidden = frames.length - visible.length;

  return createPortal(
    <div className="loot-roll-stack" aria-live="polite">
      {visible.map(({ session, item }) => (
        <LootRollFrame key={`${session.sessionId}:${item.dropId}`} session={session} item={item} />
      ))}
      {hidden > 0 && <div className="loot-roll-more">+{hidden} more item{hidden > 1 ? 's' : ''} waiting</div>}
    </div>,
    document.body
  );
}
