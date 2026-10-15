import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { emptyNarration, narrationReducer, overflowText, phaseLabel, QUEUE_LIMIT } from './narrationQueue';
import './narration.css';

export function useNarration() {
  const [state, dispatch] = useReducer(narrationReducer, undefined, emptyNarration);
  const publish = useCallback(events => dispatch({ type: 'publish', events }), []);
  const advance = useCallback(() => dispatch({ type: 'advance' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);
  return { state, publish, advance, reset };
}

export function PublicDetails({ event }) {
  if (!event.arithmetic && !event.source) return null;
  return (
    <dl className="mn-details">
      {event.arithmetic && <><dt>Arithmetic</dt><dd>{event.arithmetic}</dd></>}
      {event.source && <><dt>Public source</dt><dd>{event.source}</dd></>}
    </dl>
  );
}

function Banner({ event, autoAdvance, onAdvance }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!autoAdvance || hovered || focused || expanded || hidden) return undefined;
    // Reading pace only. Never a reaction-window deadline or gameplay callback.
    const duration = Math.max(6500, event.text.split(/\s+/).length * 320);
    const timer = setTimeout(onAdvance, duration);
    return () => clearTimeout(timer);
  }, [event.text, autoAdvance, hovered, focused, expanded, hidden, onAdvance]);
  return (
    <article className={`mn-banner mn-phase-${event.phase}`} aria-label="Current narration"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      <div className="mn-banner-meta"><span className="mn-phase">{phaseLabel(event)}</span>
        <span className="mn-reading">{autoAdvance ? 'Auto · pauses while reading' : 'Hold to read'}</span></div>
      <p className="mn-sentence">{event.text}</p>
      {(event.arithmetic || event.source) && <details onToggle={e => setExpanded(e.currentTarget.open)}>
        <summary>Arithmetic &amp; source</summary><PublicDetails event={event} />
      </details>}
    </article>
  );
}

/** Controlled, in-flow surface. The host reserves space away from reaction controls. */
export default function NarrationPresenter({ state, onAdvance, autoAdvance = false }) {
  const { current, waiting, grouped, archived } = state;
  return (
    <section className="mn-presenter" aria-label="Combat narration">
      {/* One stable polite region; history and ticking display values are not live. */}
      <div className="mn-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {current ? `${phaseLabel(current)}. ${current.text}` : ''}
      </div>
      {current ? <Banner key={current.id} event={current} autoAdvance={autoAdvance} onAdvance={onAdvance} />
        : <div className="mn-empty">The table is quiet. New public announcements will appear here.</div>}
      <div className="mn-queue-controls">
        <span>{waiting.length} / {QUEUE_LIMIT} queued</span>
        <button type="button" onClick={onAdvance} disabled={!current}>
          {waiting.length || grouped || archived ? 'Next banner' : 'Dismiss banner'}
        </button>
      </div>
      {(grouped > 0 || archived > 0) && <p className="mn-overflow">{overflowText(grouped, archived)} Full text is in history.</p>}
    </section>
  );
}
