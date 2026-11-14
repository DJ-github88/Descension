import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  companionRefusalText, listCompanions, listRecruitRecipients, readRecruitmentContext,
  readRelationship, readRoomAdmission, recruitCompanion, setRelationship
} from '../../services/companionRecruitment';

const panel = {
  background: 'linear-gradient(135deg, #fdfaf0 0%, #f4eee0 100%)',
  border: '2px solid #8b4513', borderRadius: '8px', color: '#3d2b1f',
  fontFamily: "'Cinzel', 'Bookman Old Style', serif", width: '460px', maxWidth: '92vw',
  maxHeight: '84vh', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 40px rgba(0,0,0,0.45)'
};
const row = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
  border: '1px solid #d4b896', borderRadius: '6px', background: 'rgba(255,255,255,0.55)' };
const button = { padding: '8px 12px', border: '1px solid #8b4513', borderRadius: '5px',
  background: '#f0e6d2', color: '#5a1e12', cursor: 'pointer', fontWeight: 600 };
const state = value => ({ placed: 'Placed', available: 'Available', inactive: 'Inactive' }[value] || value);

export default function RecruitCompanionDialog({ open, onClose, roomId, sourceRef, sourceName }) {
  const [phase, setPhase] = useState('loading');
  const [recipients, setRecipients] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const [relationship, setRelationshipState] = useState({ value: 'neutral', revision: null });
  const [relationshipRevision, setRelationshipRevision] = useState(null);
  const [rosterRevision, setRosterRevision] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [accepted, setAccepted] = useState(null);
  const alive = useRef(true);
  const pairEpoch = useRef(0);
  const selectedUidRef = useRef(null);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    if (!open) { return undefined; }
    let cancelled = false;
    pairEpoch.current += 1;
    selectedUidRef.current = null;
    setPhase('loading'); setRecipients([]); setSelectedUid(null); setRelationshipState({ value: 'neutral', revision: null });
    setRelationshipRevision(null); setRosterRevision(null); setBusy(false); setMessage(''); setAccepted(null);
    (async () => {
      const context = await readRecruitmentContext(roomId, sourceRef);
      if (cancelled) { return; }
      if (!context.success) {
        setPhase('error'); setMessage(companionRefusalText(context)); return;
      }
      const listed = await listRecruitRecipients(roomId);
      if (cancelled) { return; }
      if (!listed?.success) {
        setPhase('error'); setMessage(companionRefusalText(listed)); return;
      }
      setRecipients(listed.recipients || []);
      setRelationshipRevision(listed.relationshipRevision ?? 0);
      setRosterRevision(listed.rosterRevision ?? 0);
      setPhase('ready');
      if ((listed.recipients || []).length === 1) { selectRecipient(listed.recipients[0]); }
    })();
    return () => { cancelled = true; };
    // selectRecipient is stable for this dialog instance; the open/source identity is the effect input.
    // Depend on the stable exact identity, not on a freshly allocated ref object from a parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, roomId, sourceRef?.roomId, sourceRef?.mapId, sourceRef?.tokenId, sourceRef?.instanceId]);

  const selected = recipients.find(recipient => recipient.uid === selectedUid) || null;

  async function selectRecipient(recipient) {
    if (!recipient) { return; }
    const epoch = ++pairEpoch.current;
    selectedUidRef.current = recipient.uid;
    setSelectedUid(recipient.uid);
    setAccepted(null); setMessage('');
    // Never keep the previous recipient's pair state visible/enabled while the
    // newly selected pair is loading. The action stays disabled until its own
    // exact read resolves.
    setRelationshipState({ value: 'neutral', revision: null });
    setRelationshipRevision(null);
    const current = await readRelationship(roomId, sourceRef, recipient.actorRef);
    if (!alive.current || epoch !== pairEpoch.current || selectedUidRef.current !== recipient.uid) { return; }
    if (!current?.success) { setMessage(companionRefusalText(current)); return; }
    setRelationshipState({ value: current.value, revision: current.revision });
    setRelationshipRevision(current.revision);
  }

  async function applyRelationship(value) {
    if (!selected || busy) { return; }
    const target = selected;
    const epoch = pairEpoch.current;
    const currentSelection = () => alive.current && epoch === pairEpoch.current &&
      selectedUidRef.current === target.uid;
    setBusy(true); setMessage(''); setAccepted(null);
    try {
      const admission = await readRoomAdmission(roomId);
      if (!currentSelection()) { return; }
      if (!admission.success) { setMessage(companionRefusalText(admission)); return; }
      const current = await readRelationship(roomId, sourceRef, target.actorRef);
      if (!currentSelection()) { return; }
      if (!current?.success) { setMessage(companionRefusalText(current)); return; }
      const result = await setRelationship({
        roomId, actionEpoch: admission.actionEpoch, baseCommitSequence: admission.baseCommitSequence,
        pairs: [{ a: sourceRef, b: target.actorRef }], value,
        expectedRelationshipRevision: current.revision
      });
      if (!currentSelection()) { return; }
      if (!result?.success) { setMessage(companionRefusalText(result)); return; }
      const revision = Number.isSafeInteger(result.relationshipRevision) ? result.relationshipRevision : current.revision + 1;
      setRelationshipState({ value: result.relationshipValue || value, revision });
      setRelationshipRevision(revision);
      setMessage(`Exact relationship set to ${result.relationshipValue || value}.`);
    } finally {
      if (alive.current) { setBusy(false); }
    }
  }

  async function submitRecruit() {
    if (!selected || busy) { return; }
    const target = selected;
    const epoch = pairEpoch.current;
    const currentSelection = () => alive.current && epoch === pairEpoch.current &&
      selectedUidRef.current === target.uid;
    setBusy(true); setMessage(''); setAccepted(null);
    try {
      // Refresh the exact actor/revision, the exact relationship revision and the roster revision
      // immediately before the single recruitment command; stale values are refused, never guessed.
      const context = await readRecruitmentContext(roomId, sourceRef);
      if (!currentSelection()) { return; }
      if (!context.success) { setMessage(companionRefusalText(context)); return; }
      const current = await readRelationship(roomId, sourceRef, target.actorRef);
      if (!currentSelection()) { return; }
      if (!current?.success) { setMessage(companionRefusalText(current)); return; }
      const companions = await listCompanions(roomId);
      if (!currentSelection()) { return; }
      if (!companions?.success) { setMessage(companionRefusalText(companions)); return; }
      setRelationshipState({ value: current.value, revision: current.revision });
      setRelationshipRevision(current.revision);
      setRosterRevision(companions.rosterRevision);
      const result = await recruitCompanion({
        roomId, actionEpoch: context.actionEpoch, baseCommitSequence: context.baseCommitSequence,
        source: context.sourceRef, expectedSourceRevision: context.sourceRevision,
        recipientUid: target.uid, expectedRelationshipRevision: current.revision,
        expectedRosterRevision: companions.rosterRevision
      });
      if (!currentSelection()) { return; }
      if (!result?.success) { setMessage(companionRefusalText(result)); return; }
      setAccepted(result);
      const durability = result.status === 'checkpoint-confirmed'
        ? 'checkpoint-confirmed (reload-durable).'
        : 'accepted-live (checkpoint pending; reload-durable only after confirmation).';
      setMessage(`Recruitment ${durability}`);
    } finally {
      if (alive.current) { setBusy(false); }
    }
  }

  if (!open) { return null; }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 10020,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseDown={event => { if (event.target === event.currentTarget) { onClose(); } }}>
      <section role="dialog" aria-modal="true" aria-label="Recruit companion" style={panel}>
        <header style={{ padding: '18px 20px 10px', borderBottom: '1px double #8b4513' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#5a1e12' }}>Recruit {sourceName || 'creature'}</h2>
          <p style={{ margin: '6px 0 0', fontSize: '12px', fontStyle: 'italic', color: '#8b4513' }}>
            Transfer canonical ownership to one eligible party recipient. Give Control remains a separate delegation.
          </p>
        </header>
        <div style={{ padding: '14px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {phase === 'loading' && <div role="status">Loading the server-held recipient list…</div>}
          {phase === 'error' && <div role="alert" style={{ color: '#8b1a1a' }}>{message}</div>}
          {phase === 'ready' && (
            <>
              <div style={{ fontSize: '12px', color: '#6b4a32' }}>Eligible recipients (server-held party membership)</div>
              {recipients.length === 0 && <div role="status">No present party recipient has an exact bound primary actor.</div>}
              {recipients.map(recipient => (
                <button type="button" key={recipient.uid} style={{ ...row, cursor: 'pointer',
                  borderColor: recipient.uid === selectedUid ? '#8b4513' : '#d4b896',
                  textAlign: 'left', font: 'inherit', color: 'inherit' }}
                  aria-pressed={recipient.uid === selectedUid}
                  disabled={busy}
                  onClick={() => selectRecipient(recipient)}>
                  <span style={{ flex: 1 }}>
                    <strong>{recipient.characterName || recipient.name || recipient.uid}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#8b4513' }}>
                      exact actor {recipient.actorRef?.tokenId}:{recipient.actorRef?.instanceId?.slice(0, 8)}
                    </span>
                  </span>
                  <span style={{ fontSize: '11px' }}>{recipient.uid === selectedUid ? 'Selected' : 'Select'}</span>
                </button>
              ))}
              {selected && (
                <div style={{ borderTop: '1px solid #d4b896', paddingTop: '10px' }}>
                  <div style={{ fontSize: '12px', marginBottom: '6px' }}>
                    Source-relative relationship: <strong>{relationship.value}</strong>
                    {Number.isSafeInteger(relationship.revision) ? ` (revision ${relationship.revision})` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['enemy', 'neutral', 'ally'].map(value => (
                      <button type="button" key={value} style={{ ...button,
                        background: relationship.value === value ? '#d9c3a3' : '#f0e6d2' }}
                        disabled={busy} onClick={() => applyRelationship(value)}>
                        Mark {value[0].toUpperCase() + value.slice(1)}
                      </button>
                    ))}
                  </div>
                  {relationship.value !== 'enemy' && (
                    <p role="note" style={{ margin: '8px 0 0', fontSize: '12px', color: '#8b4513' }}>
                      Recruitment requires this exact source/recipient pair to be Enemy. A neutral or ally creature is refused.
                    </p>
                  )}
                  <button type="button" style={{ ...button, marginTop: '12px', width: '100%',
                    background: relationship.value === 'enemy' ? '#5a1e12' : '#c9b79c',
                    color: relationship.value === 'enemy' ? '#fff' : '#5a1e12' }}
                    disabled={busy || relationship.value !== 'enemy'} onClick={submitRecruit}>
                    {busy ? 'Working…' : 'Recruit companion'}
                  </button>
                  <div style={{ fontSize: '11px', color: '#6b4a32', marginTop: '6px' }}>
                    Roster revision {rosterRevision ?? 'unknown'}; relationship revision {relationshipRevision ?? 'unknown'}.
                  </div>
                </div>
              )}
              {accepted && (
                <div role="status" style={{ border: '1px solid #6b7c3a', borderRadius: '6px', padding: '10px',
                  background: 'rgba(107,124,58,0.12)', fontSize: '12px' }}>
                  <strong>{accepted.rosterEntry?.displayName || sourceName || 'Companion'}</strong> is in the recipient roster
                  ({accepted.rosterEntry?.state || 'placed'}). Status: {accepted.status || 'accepted-live'};
                  durability: {accepted.durability || 'checkpoint-eligible'}.
                </div>
              )}
              {message && <div role={accepted ? 'status' : 'alert'} style={{ fontSize: '12px' }}>{message}</div>}
            </>
          )}
        </div>
        <footer style={{ padding: '10px 20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" style={button} onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

