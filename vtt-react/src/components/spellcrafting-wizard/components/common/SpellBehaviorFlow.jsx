import React, { useMemo } from 'react';
import { buildSpellBehaviorModel } from './spellBehaviorPresentation';
import './SpellBehaviorFlow.css';

export default function SpellBehaviorFlow({ record, context, compact = false }) {
  const model = useMemo(() => buildSpellBehaviorModel(record, context), [record, context]);
  if (!model) return null;

  return (
    <section
      className={`spell-behavior-flow spell-behavior-${model.supportBadge.status}${compact ? ' spell-behavior-compact' : ''}`}
      aria-label="Spell behavior flow"
      data-behavior-status={model.supportBadge.status}
    >
      <div className="spell-behavior-header">
        <span className="spell-behavior-support-badge" data-behavior-support={model.supportBadge.status}>
          {model.supportBadge.label}
        </span>
        <span className="spell-behavior-support-detail">{model.supportBadge.detail}</span>
      </div>

      <div className="spell-behavior-live" data-behavior-live="static-only">
        <span className="spell-behavior-live-label">{model.liveState.label}:</span>{' '}
        <span>{model.liveState.detail}</span>
      </div>

      {model.steps.length > 0 && (
        <ol className="spell-behavior-steps">
          {model.steps.map((step) => (
            <li
              key={step.id}
              className="spell-behavior-step"
              data-behavior-step={step.id}
              {...(step.scopeKind ? { 'data-behavior-scope': step.scopeKind } : {})}
            >
              <div className="spell-behavior-step-row">
                <span className="spell-behavior-step-label">{step.label}</span>
                <span className="spell-behavior-step-summary">{step.summary}</span>
              </div>
              {step.scopeBadge && (
                <div className="spell-behavior-scope-badge" data-behavior-scope-badge={step.scopeKind}>
                  {step.scopeBadge}
                </div>
              )}
              {step.branches && step.branches.length > 0 && (
                <ul className="spell-behavior-branches">
                  {step.branches.map((branch) => (
                    <li key={branch.outcome} className="spell-behavior-branch">
                      <span className="spell-behavior-branch-outcome">{branch.outcome}:</span>{' '}
                      <span>{branch.text}</span>
                    </li>
                  ))}
                </ul>
              )}
              {step.details && step.details.length > 0 && (
                <ul className="spell-behavior-details">
                  {step.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}

      {(model.manualSections.length > 0 || model.disclaimer) && (
        <div className="spell-behavior-manual" data-behavior-manual="true">
          {model.manualSections.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="spell-behavior-manual-item">
              <span className="spell-behavior-manual-label">{item.label}:</span>{' '}
              <span>{item.text}</span>
            </div>
          ))}
          {model.disclaimer && (
            <div className="spell-behavior-disclaimer">{model.disclaimer}</div>
          )}
        </div>
      )}
    </section>
  );
}
