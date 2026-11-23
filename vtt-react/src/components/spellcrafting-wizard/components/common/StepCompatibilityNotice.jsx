import React from 'react';
import { STATES } from '../../utils/executionCompatibility';
import './ExecutionCompatibility.css';

const ICON = {
  [STATES.EXECUTABLE]: 'fa-check',
  [STATES.PARTIAL]: 'fa-adjust',
  [STATES.BLOCKED]: 'fa-hourglass-half',
  [STATES.UNSUPPORTED]: 'fa-hand-paper'
};

/**
 * Read-only inline compatibility callout rendered beside relevant Wizard controls.
 * Displays only the single shared `explainExecution` view model (zero local support rules).
 */
export default function StepCompatibilityNotice({ view, readySummary, dataControl }) {
  if (!view) return null;
  const isReady = view.state === STATES.EXECUTABLE || view.state === STATES.PARTIAL;
  const readyHeading = readySummary || view.outcomeSummary || view.title;
  const manualItems = Array.isArray(view.manual) && view.manual.length > 0
    ? view.manual
    : (view.summary ? [view.summary] : []);

  return (
    <div
      className={`exec-compat exec-compat-${view.state} exec-compat-inline`}
      role="status"
      data-state={view.state}
      data-compat-control={dataControl || view.stepGuidance?.controlId || ''}
    >
      {isReady ? (
        <>
          <p className="exec-compat-title">
            <i className={`fas ${ICON[view.state]}`} aria-hidden="true" /> {readyHeading}
          </p>
          {(readySummary || view.outcomeSummary) && (
            <p className="exec-compat-note">{view.title}</p>
          )}
        </>
      ) : (
        <>
          <p className="exec-compat-title">
            <i className={`fas ${ICON[view.state]}`} aria-hidden="true" /> {view.title}
          </p>
          <p className="exec-compat-inline-reason">
            {view.reasons?.[0]?.text || view.summary}
          </p>
          {view.stepGuidance?.alternative && (
            <p className="exec-compat-inline-alternative">
              <strong>Supported alternative:</strong> {view.stepGuidance.alternative}
            </p>
          )}
          <div className="exec-compat-inline-manual">
            <p className="exec-compat-head">
              Keeping it manual? Your draft stays intact when you save. What the GM will handle:
            </p>
            {manualItems.length > 0 && (
              <ul>
                {manualItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
