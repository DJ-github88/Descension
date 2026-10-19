import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import { useCombatFeedStore, advanceNarration, resetCombatFeed } from '../../services/acceptedResultFeed';
import { PublicDetails } from '../combat-narration-preview/NarrationPresenter';
import './AcceptedResultNarration.css';

/**
 * P13A accepted-result narration (MYTHRILL_PROJECT_13A_CONTRACT.md §4–5): one compact in-flow banner,
 * one polite announcement per live accepted result and a collapsible session history. Every event was
 * already filtered to what this viewer may see; historical results enter history only.
 */
function useReadingPause() {
  const [paused, setPaused] = useState(false), [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return { paused: paused || hidden, setPaused };
}
export default function AcceptedResultNarration() {
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const narration = useCombatFeedStore(s => s.narration);
  const [open, setOpen] = useState(false), [expanded, setExpanded] = useState(false);
  const { paused, setPaused } = useReadingPause();
  const current = narration.current;
  // Review 7: reset only when the room actually changes (a remount keeps session history).
  useEffect(() => { if (useCombatFeedStore.getState().roomId !== (roomId || null)) resetCombatFeed(roomId || null); }, [roomId]);
  useEffect(() => {
    if (!current || paused || expanded) return undefined;
    // Reading pace only; never a gameplay timer.
    const timer = setTimeout(advanceNarration, Math.max(6500, current.text.split(/\s+/).length * 320));
    return () => clearTimeout(timer);
  }, [current, paused, expanded]);
  const history = narration.history.filter(item => item.phase === 'outcome').slice(-20).reverse();
  if (!roomId) return null;
  // Review 3/4: an own fixed region (never inside or above the consequence controls); the polite live region
  // stays mounted so the first announcement is not lost.
  return createPortal(
    <section className="arn" aria-label="Accepted combat results">
      <div className="arn-sr" role="status" aria-live="polite" aria-atomic="true">{current && current.phase === 'outcome' ? `Accepted result. ${current.text}` : ''}</div>
      {current && <article className={`arn-banner arn-${current.phase}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
        <p className="arn-label">{current.phase === 'summary' ? 'Grouped results' : 'Accepted result'}</p>
        <p className="arn-text">{current.text}</p>
        {current.arithmetic && <details onToggle={e => setExpanded(e.currentTarget.open)}><summary>Details</summary><PublicDetails event={current} /></details>}
        <button type="button" className="arn-dismiss" onClick={advanceNarration}>{narration.waiting.length ? `Next (${narration.waiting.length})` : 'Dismiss'}</button>
      </article>}
      {history.length > 0 && <details className="arn-history" open={open} onToggle={e => setOpen(e.currentTarget.open)}>
        <summary>Result history ({history.length})</summary>
        <ol>{history.map(item => <li key={item.id}>{item.text}</li>)}</ol>
      </details>}
    </section>, document.body);
}
