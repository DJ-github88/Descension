/**
 * Project 5 Wave C (S8-B) — explicit local/cloud campaign reconciliation.
 *
 * Minimal, honest user-facing affordance for a preserved local/cloud campaign
 * divergence (`campaignService.pendingConflict`). It never merges, never
 * auto-resolves and never deletes a candidate: the user explicitly chooses to
 * continue with the cloud copy, keep the local alternative as a separate
 * draft, publish the local version through the existing safe campaign CAS, or
 * decide later.
 *
 * Reuses the existing Mythrill conflict-modal presentation classes. Campaign
 * scope only — character conflict UX belongs to P6 and is not implemented here.
 */

import React, { useEffect, useRef, useState } from 'react';
import campaignService from '../../services/campaignService';
import { subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import { captureConsumerContext, isConsumerContextCurrent } from '../../persistence/scopedConsumer';
import '../common/styles/ConflictResolutionModal.css';

const REASON_COPY = {
  'local-dirty-cloud-divergent':
    'Your local campaign edits and the cloud-backed copy have both changed. Neither copy has been deleted.',
  'local-dirty-cloud-divergent-preservation-failed':
    'Your local campaign copy could not yet be preserved as a separate draft, so the cloud copy was not adopted. Your local work is still your working copy.',
  'stale-collection-revision':
    'Another tab saved a newer campaign collection. Your losing edit was preserved as a separate draft; the newer collection is your working copy.',
  'cloud-baseline-changed':
    'The cloud campaign document changed since your last save, so your save was refused to protect the newer cloud version.'
};

const describeLocal = (conflict) => {
  if (!conflict) return '';
  const count = conflict.local.campaignCount;
  const names = conflict.local.campaignNames;
  const list = names && names.length ? `: ${names.join(', ')}` : '';
  return `${count} campaign${count === 1 ? '' : 's'}${list}`;
};

const CampaignConflictResolver = () => {
  const [conflict, setConflict] = useState(() => campaignService.getPendingConflict());
  const [hiddenPreservedAt, setHiddenPreservedAt] = useState(null);
  const [busy, setBusy] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const refresh = () => {
      setConflict(campaignService.getPendingConflict());
    };
    refresh();
    const unsubscribe = campaignService.subscribeConflict(refresh);
    const unbindGate = subscribeBootstrapGate(() => {
      setConflict(campaignService.getPendingConflict());
      setFeedback(null);
      setBusy(null);
      setHiddenPreservedAt(null);
    });
    return () => { unsubscribe(); unbindGate(); };
  }, []);

  const expectedRevision = conflict?.local?.revision ?? null;
  const dismissed = hiddenPreservedAt !== null && hiddenPreservedAt === conflict?.preservedAt;
  const isOpen = !!conflict && conflict.active !== false && !dismissed;
  const showResolved = !conflict && feedback?.ok === true;

  useEffect(() => {
    if (!isOpen && !showResolved) return undefined;
    const previous = document.activeElement;
    modalRef.current?.querySelector('button')?.focus();
    return () => previous?.focus?.();
  }, [isOpen, showResolved]);

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && !busy) {
      event.preventDefault();
      if (showResolved) setFeedback(null);
      else run('later', () => campaignService.deferConflict());
    }
    if (event.key !== 'Tab') return;
    const buttons = [...modalRef.current.querySelectorAll('button:not(:disabled), a[href]')];
    if (!buttons.length) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const run = async(action, operation) => {
    const captured = captureConsumerContext();
    if (!captured.ok) return;
    setBusy(action);
    setFeedback(null);
    let result;
    try {
      result = await operation();
    } catch (error) {
      result = { status: 'FAILED', reason: error?.message || 'unexpected-error' };
    }
    if (!isConsumerContextCurrent(captured.context)) return;
    setBusy(null);
    setConflict(campaignService.getPendingConflict());
    if (result.status === 'OK') {
      if (action === 'keep-local-draft') {
        setFeedback({
          ok: true,
          message: `Your local version is preserved as a separate draft (${result.forkDraftId || 'draft retained'}). The cloud-backed copy stays your working set.`
        });
      } else if (action === 'publish-local') {
        setFeedback({ ok: true, message: 'Your local version was published to the cloud and confirmed.' });
      } else {
        setFeedback({ ok: true, message: 'You are continuing with the cloud-backed copy. Your local alternative is retained.' });
      }
    } else if (result.status === 'DEFERRED') {
      setHiddenPreservedAt(conflict?.preservedAt ?? null);
      setFeedback(null);
    } else {
      setFeedback({ ok: false, message: failureMessage(result) });
    }
  };

  const failureMessage = (result) => {
    switch (result?.status) {
      case 'STALE_CONFIRMATION':
        return 'These campaigns changed while you were deciding (a newer edit landed). The conflict was kept — review it again before confirming.';
      case 'CAS_REFUSED':
        return 'The cloud changed since this conflict was recorded, so publishing your local version was refused to protect the newer cloud copy. Both versions are retained.';
      case 'LOCAL_PRESERVATION_REQUIRED':
        return 'Your local version could not be preserved as a separate draft, so nothing was changed. Your local work is still the working copy.';
      case 'CLOUD_ADOPTION_FAILED':
        return 'The cloud copy could not be adopted just now. Both candidates are retained; try again.';
      case 'CLOUD_CANDIDATE_UNAVAILABLE':
        return 'The cloud copy could not be verified. Your local candidates are retained; retry the cloud read later.';
      case 'CLOUD_ALTERNATIVE_PRESERVATION_FAILED':
        return 'The current working copy could not be preserved before publishing, so nothing was published. Both candidates are retained.';
      case 'NO_ACTIVE_SCOPE':
      case 'SUPERSEDED':
        return 'The account changed while you were deciding, so this resolution was cancelled. Nothing was lost.';
      case 'NO_CONFLICT':
        return 'This conflict was already resolved.';
      case 'NO_LOCAL_CANDIDATE':
        return 'The preserved local version could not be read, so nothing was changed.';
      default:
        return `The action did not complete (${result?.status || 'unknown'}). Both candidates are retained; you can try again.`;
    }
  };

  if (!isOpen && !showResolved) return null;

  if (showResolved) {
    return (
      <div ref={modalRef} onKeyDown={onKeyDown} className="conflict-modal-overlay" role="dialog" aria-modal="true" aria-label="Campaign conflict resolved">
        <div className="conflict-modal">
          <div className="conflict-modal-header">
            <h3>Campaign Conflict Resolved</h3>
            <button className="conflict-modal-close" onClick={() => setFeedback(null)} aria-label="Close">&times;</button>
          </div>
          <div className="conflict-modal-body">
            <div className="conflict-warning" style={{ background: '#e8f5e9', borderColor: '#a5d6a7', color: '#2e7d32' }}>
              <i className="fas fa-check-circle"></i>
              <span>{feedback.message}</span>
            </div>
          </div>
          <div className="conflict-modal-footer">
            <button className="btn btn-primary" onClick={() => setFeedback(null)}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const cloudKnown = conflict.cloud?.known;
  const forkAvailable = conflict.localAlternative?.available;

  return (
    <div ref={modalRef} onKeyDown={onKeyDown} className="conflict-modal-overlay" role="dialog" aria-modal="true" aria-label="Campaign conflict detected">
      <div className="conflict-modal">
        <div className="conflict-modal-header">
          <h3>Campaign Conflict Detected</h3>
          <button
            className="conflict-modal-close"
            onClick={() => run('later', () => campaignService.deferConflict())}
            aria-label="Decide later"
            disabled={!!busy}
          >&times;</button>
        </div>

        <div className="conflict-modal-body">
          <p className="conflict-description">
            {REASON_COPY[conflict.reason] || 'Local and cloud campaign data have diverged. Neither copy has been silently deleted.'}
          </p>

          <div className="conflict-details">
            <div className="conflict-option">
              <div className="option-header">
                <strong>Local copy (this browser)</strong>
                <span className="timestamp">{conflict.local.dirty ? 'pending changes' : 'no unsaved changes'}</span>
              </div>
              <div className="option-description">
                {describeLocal(conflict)} · local revision {conflict.local.revision ?? '—'}.
                {forkAvailable
                  ? ` Preserved as a separate draft (${conflict.localAlternative.draftId}).`
                  : ' Not yet preserved as a separate draft.'}
              </div>
            </div>

            <div className="conflict-option">
              <div className="option-header">
                <strong>Cloud-backed copy</strong>
                <span className="timestamp">
                  {cloudKnown
                    ? (conflict.cloud.candidateAdopted ? 'currently your working set' : 'not adopted yet')
                    : 'cloud state unknown'}
                </span>
              </div>
              <div className="option-description">
                {cloudKnown
                  ? `Cloud revision ${conflict.cloud.revision ?? '—'}${conflict.cloud.epoch ? ` (instance ${conflict.cloud.epoch})` : ''}.`
                  : 'The cloud copy could not be read; it is never treated as empty or deleted.'}
              </div>
            </div>
          </div>

          <div className="conflict-details">
            <div className="conflict-option">
              <div className="option-header"><strong>{conflict.reason === 'stale-collection-revision' ? 'Continue with the newer tab version' : 'Continue with the cloud version'}</strong></div>
              <div className="option-description">
                Keeps the cloud-backed campaigns as your working set. Your preserved local version stays available as a separate draft — nothing is deleted.
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
                disabled={!!busy}
                onClick={() => run('continue-cloud', () => campaignService.resolveConflictWithCloud({ expectedRevision }))}
              >
                {busy === 'continue-cloud' ? 'Continuing…' : conflict.reason === 'stale-collection-revision' ? 'Continue with current version' : 'Continue with cloud'}
              </button>
            </div>

            <div className="conflict-option">
              <div className="option-header"><strong>Keep the local version as a separate draft</strong></div>
              <div className="option-description">
                Accepts the current working set and keeps your local version recoverable as its own draft in this account.
              </div>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem' }}
                disabled={!!busy}
                onClick={() => run('keep-local-draft', () => campaignService.keepLocalAsSeparateDraft())}
              >
                {busy === 'keep-local-draft' ? 'Keeping…' : 'Keep local draft'}
              </button>
            </div>

            <div className="conflict-option">
              <div className="option-header"><strong>Publish my local version</strong></div>
              <div className="option-description">
                Explicitly sends your local version through the safe cloud save. If the cloud changed since this conflict, the save is refused and both versions are kept.
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
                disabled={!!busy}
                onClick={() => run('publish-local', () => campaignService.publishLocalCandidate({ expectedRevision }))}
              >
                {busy === 'publish-local' ? 'Publishing…' : 'Publish local version'}
              </button>
            </div>

            <div className="conflict-option">
              <div className="option-header"><strong>Decide later</strong></div>
              <div className="option-description">
                Closes this prompt for now. Both candidates stay preserved and the conflict returns after a reload until you resolve it.
              </div>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem' }}
                disabled={!!busy}
                onClick={() => run('later', () => campaignService.deferConflict())}
              >
                {busy === 'later' ? 'Closing…' : 'Resolve later'}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="conflict-warning" style={feedback.ok ? { background: '#e8f5e9', borderColor: '#a5d6a7', color: '#2e7d32' } : undefined}>
              <i className={feedback.ok ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}></i>
              <span>{feedback.message}</span>
            </div>
          )}

          {!feedback && (
            <div className="conflict-warning">
              <i className="fas fa-shield-alt"></i>
              <span>No copy is deleted by any choice above. Cloud writes only happen when you explicitly publish.</span>
            </div>
          )}
        </div>

        <div className="conflict-modal-footer">
          <button
            className="btn btn-secondary"
            disabled={!!busy}
            onClick={() => run('later', () => campaignService.deferConflict())}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignConflictResolver;
