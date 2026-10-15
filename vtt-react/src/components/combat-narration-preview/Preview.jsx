import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import NarrationPresenter, { PublicDetails, useNarration } from './NarrationPresenter';
import { phaseLabel } from './narrationQueue';
import { scenarios } from './fixtures';
import './preview.css';

function ScenarioPreview({ scenario }) {
  const narration = useNarration();
  const [cursor, setCursor] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [countdown, setCountdown] = useState('8 s');
  const [selection, setSelection] = useState('');
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [importantOnly, setImportantOnly] = useState(false);
  const send = (all = false) => {
    const frames = scenario.frames.slice(cursor, all ? undefined : cursor + 1);
    if (!frames.length) return;
    narration.publish(frames.flatMap(item => item.events));
    const nextReaction = frames[frames.length - 1].reaction;
    setReaction(nextReaction);
    if (nextReaction) setCountdown(nextReaction.countdown);
    setSelection('');
    setCursor(cursor + frames.length);
  };
  const restart = () => {
    narration.reset(); setCursor(0); setReaction(null); setSelection('');
  };
  const history = narration.state.history.filter(item => !importantOnly || item.important).slice().reverse();
  return (
    <>
      <div className="np-workspace">
        <section className="np-stage" aria-label="Isolated tabletop preview">
          <header className="np-stage-header"><h2>At the table</h2><span>Public text only</span></header>
          <div className="np-narration-slot">
            <NarrationPresenter state={narration.state} onAdvance={narration.advance} autoAdvance={autoAdvance} />
          </div>
          <div className="np-table-space">
            <div className="np-party" aria-label="Fixture participants">
              {['Ilsa', 'Marcus', 'Rocko', 'Goblin'].map(name => <span key={name}>{name}</span>)}
            </div>
            <p>A little space for the story.</p>
            <span>The announcement stays above the reaction area.</span>
          </div>
          <section className="np-reactions" aria-label="Fixture reaction controls">
            <div className="np-reaction-heading"><h3>{reaction?.title || 'Reaction area'}</h3>
              {reaction && <span className="np-countdown">{countdown || '—'} <small>supplied</small></span>}</div>
            {reaction ? <>
              <div className="np-reaction-buttons">{reaction.options.map(option => <button type="button" key={option}
                onClick={() => setSelection(`${option} selected in the preview. No combat action was submitted.`)}>{option}</button>)}</div>
              <p>{selection || 'Fixture controls only. Choose one to check that it stays accessible.'}</p>
            </> : <p>No reaction opportunity supplied by this fixture step.</p>}
          </section>
        </section>
        <aside className="np-director" aria-label="Preview controls">
          <h2>{scenario.title}</h2>
          <p>{scenario.description}</p>
          <div className="np-step-controls">
            <button type="button" className="np-primary" disabled={cursor === scenario.frames.length} onClick={() => send()}>Next fixture step</button>
            <button type="button" disabled={cursor === scenario.frames.length} onClick={() => send(true)}>Send remaining fixtures</button>
            <button type="button" onClick={restart}>Restart scenario</button>
          </div>
          <p className="np-progress">{cursor} of {scenario.frames.length} fixture steps supplied</p>
          <label className="np-check"><input type="checkbox" checked={autoAdvance} onChange={e => setAutoAdvance(e.target.checked)} /> Auto-advance banners</label>
          <p className="np-help">Off by default. Hover, focus or expand details to pause reading. History keeps the full text.</p>
          <label className="np-countdown-input">Supplied countdown text
            <input type="text" value={countdown} maxLength={60} onChange={e => setCountdown(e.target.value)} />
          </label>
          <p className="np-help">Display only, even at “0 s”. This value never ticks or resolves a window.</p>
          <div className="np-key"><h3>Reading the announcement</h3>
            <dl>
              <dt>Declaration</dt><dd>An action is announced.</dd>
              <dt>Reaction opportunity</dt><dd>A supplied chance to respond.</dd>
              <dt>Response</dt><dd>A commitment, not a result.</dd>
              <dt>Outcome pending / unknown</dt><dd>Still unconfirmed.</dd>
              <dt>Accepted outcome</dt><dd>An explicitly confirmed public result.</dd>
            </dl>
          </div>
        </aside>
      </div>
      <section className="np-history" aria-label="Preview history">
        <header><div><h2>The unfolding exchange</h2><p>Session-only history · newest first · {narration.state.history.length} supplied announcements</p></div>
          <label className="np-check"><input type="checkbox" checked={importantOnly} onChange={e => setImportantOnly(e.target.checked)} /> Priority only</label></header>
        {history.length ? <ol>{history.map(item => <li key={item.id} className={`mn-phase-${item.phase}`}>
          <span className="mn-phase">{phaseLabel(item)}</span><div><p>{item.text}</p>
            {(item.arithmetic || item.source) && <details><summary>Arithmetic &amp; source</summary><PublicDetails event={item} /></details>}</div>
        </li>)}</ol> : <p className="np-history-empty">{importantOnly ? 'No priority announcements supplied yet.' : 'Send the first fixture step to begin the exchange.'}</p>}
      </section>
    </>
  );
}

function Preview() {
  const [scenarioId, setScenarioId] = useState('routine');
  const scenario = scenarios.find(item => item.id === scenarioId);
  return <div className="np-page">
    <header className="np-masthead"><span className="np-wordmark">Mythrill</span><span>Combat narration</span><span className="np-preview-label">Isolated preview</span></header>
    <main>
      <div className="np-intro"><div><h1>Let the exchange breathe.</h1><p>One announcement at a time. The full exchange close at hand.</p></div>
        <label>Preview scenario<select value={scenarioId} onChange={e => setScenarioId(e.target.value)}>
          {scenarios.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title}</option>)}
        </select></label></div>
      <ScenarioPreview key={scenario.id} scenario={scenario} />
      <footer className="np-footer">All names, arithmetic and outcomes are authored preview fixtures. Nothing here executes combat or defines a server contract.</footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<Preview />);
