import React, { useMemo } from 'react';
import useGameStore from '../../../../store/gameStore';
import { explainExecution, STATES } from '../../utils/executionCompatibility';
import './ExecutionCompatibility.css';

const ICON = { [STATES.EXECUTABLE]: 'fa-check', [STATES.PARTIAL]: 'fa-adjust', [STATES.BLOCKED]: 'fa-hourglass-half', [STATES.UNSUPPORTED]: 'fa-hand-paper' };

/**
 * Read-only explanation of whether a saved Wizard ability can run through Prism and what stops it.
 * Presentation only: no handlers, no stores, no payment, no cast. One shared component for the Wizard review
 * and the library card, so both explain the same record the same way.
 *
 * variant "draft": the unsaved Wizard state (the saved copy is checked again in the library, and that result counts).
 * variant "saved": the stored library record.
 */
export default function ExecutionCompatibility({ record, draft, context, variant = 'saved' }) {
  // Display context only (read-only selectors). Callers may override each value.
  const storeShared = useGameStore(s => s.isInMultiplayer), storeGm = useGameStore(s => s.isGMMode), storeRoom = useGameStore(s => s.multiplayerRoom?.id);
  const roomId = context?.roomId ?? storeRoom, classId = context?.classId, shared = context?.shared ?? storeShared === true, gm = context?.gm ?? storeGm === true, definitionVersion = context?.definitionVersion;
  const view = useMemo(() => {
    // An unsaved Wizard state is wrapped exactly as the save path wraps it: authoredDraft is a plain copy of the state.
    const subject = record || (draft ? { ...draft, authoredDraft: JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(draft).filter(([key]) => key !== 'authoredDraft')))) } : null);
    return explainExecution(subject, { roomId, classId, shared, gm, definitionVersion });
  }, [record, draft, roomId, classId, shared, gm, definitionVersion]);
  return <section className={`exec-compat exec-compat-${view.state}`} aria-label="Execution compatibility" data-state={view.state}>
    <p className="exec-compat-title" role="status"><i className={`fas ${ICON[view.state]}`} aria-hidden="true" /> {view.title}</p>
    <p>{view.summary}</p>
    {variant === 'draft' && <p className="exec-compat-note">Draft check. The saved library copy is checked again, and that result is the one that counts.</p>}
    {view.reasons.length > 0 && <dl className="exec-compat-reasons">{view.reasons.map(r => <React.Fragment key={r.label}><dt>{r.label}</dt><dd>{r.text}</dd></React.Fragment>)}</dl>}
    {view.automated.length > 0 && <><p className="exec-compat-head">Prism runs</p><ul>{view.automated.map(t => <li key={t}>{t}</li>)}</ul></>}
    {view.confirm.length > 0 && <><p className="exec-compat-head">Still confirmed by people</p><ul>{view.confirm.map(t => <li key={t}>{t}</li>)}</ul></>}
    {view.manual.length > 0 && <><p className="exec-compat-head">Played by hand</p><ul>{view.manual.map(t => <li key={t}>{t}</li>)}</ul></>}
    {view.preserved.length > 0 && <details className="exec-compat-preserved"><summary>Authored sections kept in this spell ({view.preserved.length})</summary>
      <ul>{view.preserved.map(item => <li key={item.key}>{item.label}</li>)}</ul></details>}
    {view.next.length > 0 && <><p className="exec-compat-head">What to do</p><ul>{view.next.map(t => <li key={t}>{t}</li>)}</ul></>}
    {view.notes.map(t => <p key={t} className="exec-compat-note">{t}</p>)}
  </section>;
}
