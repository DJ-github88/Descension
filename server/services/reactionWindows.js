/** Frozen P13B-W: private, live-only declaration collection. No actor/resource writes or execution. */
const crypto = require('crypto');
const { performance } = require('perf_hooks');
const actors = require('./actorConsequences');
const MOMENTS = ['targeting', 'before_roll', 'after_roll', 'on_hit', 'after_damage', 'follow_up'];
const EVENTS = ['reaction_window_open', 'reaction_window_list', 'reaction_window_change', 'reaction_window_interrupt'];
const DURATION = 8000, OWNER_BYTES = 32768;
const fail = code => actors.fail(code);
const clone = actors.clone;
const id = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const text = (value, max = 120, empty = false) => typeof value === 'string' && value.length <= max && (empty || !!value.trim());
const shape = (value, keys) => { try { actors.keys(value, keys); } catch (_) { fail('invalid_window_request'); } };
const refKey = actors.hash;

function createCollector({ now = Date.now, elapsed = () => performance.now() } = {}) {
  const rooms = new WeakMap(); // Never place these secrets in shared snapshots/checkpoints.
  function state(room) {
    const identity = `${actors.epoch(room)}:${room.gmId}`;
    let s = rooms.get(room);
    if (!s || s.identity !== identity) {
      s = { identity, epoch: crypto.randomUUID(), windows: new Map(), opens: new Map(), causes: new Map(), sequences: new Map() };
      rooms.set(room, s);
    }
    return s;
  }
  function gm(room, viewer) { if (!viewer.gm || viewer.uid !== room.gmId) { fail('forbidden'); } }
  function bound(room, ref) {
    try { return actors.locate(room, ref); } catch (_) { fail('window_binding_unavailable'); }
  }
  function touch(room, w) {
    if (w.status !== 'open') { return; }
    // Ref retirement interrupts collection, not the underlying action or any manual payment.
    try { bound(room, w.source); for (const ref of w.invited) { bound(room, ref); } }
    catch (_) { w.status = 'interrupted'; return; }
    if (elapsed() >= w.cutoff) { w.status = 'closed'; }
  }
  function ownRef(room, viewer, w) {
    if (viewer.gm) { return null; }
    return w.invited.find(ref => ref.ownerUid === viewer.uid && (() => { try { bound(room, ref); return true; } catch (_) { return false; } })());
  }
  function visible(room, viewer, w) { return viewer.gm && room.gmId === viewer.uid && w.gmUid === viewer.uid || !!ownRef(room, viewer, w); }
  function project(room, viewer, w) {
    touch(room, w);
    const own = ownRef(room, viewer, w), owner = own && w.owners.get(viewer.uid);
    const view = { windowId: w.id, epoch: state(room).epoch, moment: w.moment, openedAt: w.openedAt,
      deadlineAt: w.deadlineAt, remainingMs: Math.max(0, w.cutoff - elapsed()), status: w.status,
      // This revision does not change when another player declares, edits or withdraws.
      viewRevision: (w.status === 'open' ? 0 : w.status === 'closed' ? 1000000 : 2000000) + (owner?.revision || 0),
      mode: 'GM-attested moment; declaration only', manual: true };
    if (viewer.gm) {
      Object.assign(view, { trigger: clone(w.trigger), source: clone(w.source), invited: clone(w.invited),
        parentWindowId: w.parentWindowId, openRequestId: w.openRequestId, gmCommit: clone(w.gmCommit) });
      if (w.status === 'closed') { view.review = [...w.owners.values()].flatMap(o => [...o.intents.values()].map(intent => clone(intent)))
        .sort((a, b) => refKey([a.reactor, a.cardKey]).localeCompare(refKey([b.reactor, b.cardKey]))); }
      // Even interrupted windows do not reveal incomplete private choices.
    } else {
      view.reactor = clone(own);
      view.intents = owner ? [...owner.intents.values()].map(clone).sort((a, b) => a.cardKey.localeCompare(b.cardKey)) : [];
    }
    return view;
  }
  function snapshot(room, viewer) {
    const s = state(room), windows = [...s.windows.values()].filter(w => visible(room, viewer, w));
    // Unrelated observers need no retained counter; invited/GM counters are bounded by window audiences.
    const retain = viewer.gm || windows.length > 0 || s.sequences.has(viewer.uid);
    const sequence = retain ? (s.sequences.get(viewer.uid) || 0) + 1 : 0;
    if (retain) { s.sequences.set(viewer.uid, sequence); }
    return { success: true, roomId: room.id, viewerRole: viewer.gm ? 'gm' : 'owner', epoch: s.epoch, sequence, serverNow: now(), durability: 'live-only',
      windows: windows.map(w => project(room, viewer, w)) };
  }
  function envelope(data, allowed) {
    shape(data, allowed);
    if (!text(data.roomId, 200) || !id(data.requestId) || actors.bytes(data) > 8192) { fail('invalid_window_request'); }
  }
  function open(room, viewer, data) {
    gm(room, viewer);
    envelope(data, ['roomId', 'requestId', 'epoch', 'trigger', 'source', 'invited', 'gmCommit', 'parentWindowId']);
    shape(data.trigger, ['causeId', 'moment', 'occurrence', 'basis']);
    if (!text(data.trigger.causeId) || !text(data.trigger.occurrence) || !MOMENTS.includes(data.trigger.moment) ||
      !['authored-attested', 'gm-manual'].includes(data.trigger.basis)) { fail('invalid_window_request'); }
    if (!Array.isArray(data.invited) || data.invited.length < 1 || data.invited.length > 16) { fail('invalid_window_request'); }
    shape(data.gmCommit, ['refs', 'note']);
    if (!Array.isArray(data.gmCommit.refs) || data.gmCommit.refs.length > 16 || !text(data.gmCommit.note, 500, true) ||
      (data.gmCommit.refs.length === 0) !== (data.gmCommit.note.length === 0)) { fail('invalid_window_request'); }
    const s = state(room), hash = actors.hash(data), prior = s.opens.get(data.requestId);
    if (data.epoch !== s.epoch) { fail('window_unavailable'); }
    if (prior) {
      if (prior.hash !== hash) { fail('window_request_conflict'); }
      return { result: snapshot(room, viewer), window: s.windows.get(prior.id), fresh: false };
    }
    const cause = actors.hash([data.trigger.causeId, data.trigger.moment, data.trigger.occurrence]);
    if (s.causes.has(cause)) { fail('trigger_occurrence_exists'); }
    if (s.windows.size >= 64) { fail('window_capacity_manual'); }
    bound(room, data.source);
    const owners = new Set();
    for (const ref of data.invited) {
      bound(room, ref);
      if (ref.kind !== 'character' || !ref.ownerUid || ref.ownerUid === room.gmId || owners.has(ref.ownerUid)) { fail('invalid_window_audience'); }
      owners.add(ref.ownerUid);
    }
    for (const ref of data.gmCommit.refs) {
      bound(room, ref);
      if (ref.kind === 'character' && ref.ownerUid !== viewer.uid) { fail('forbidden'); }
    }
    const parent = data.parentWindowId && s.windows.get(data.parentWindowId);
    if (data.parentWindowId && (!parent || (touch(room, parent), parent.status !== 'closed'))) { fail('parent_window_unavailable'); }
    const openedAt = now(), w = { id: crypto.randomUUID(), openRequestId: data.requestId, gmUid: viewer.uid, trigger: clone(data.trigger),
      moment: data.trigger.moment, source: clone(data.source), invited: clone(data.invited), gmCommit: clone(data.gmCommit),
      parentWindowId: data.parentWindowId || null, openedAt, deadlineAt: openedAt + DURATION, cutoff: elapsed() + DURATION,
      status: 'open', owners: new Map() };
    // Commit the immutable GM bundle before this record can be observed by any player.
    s.windows.set(w.id, w); s.causes.set(cause, w.id); s.opens.set(data.requestId, { hash, id: w.id });
    return { result: snapshot(room, viewer), window: w, fresh: true };
  }
  function change(room, viewer, data) {
    envelope(data, ['roomId', 'requestId', 'windowId', 'epoch', 'reactor', 'cardKey', 'expectedRevision', 'withdrawn', 'label', 'note']);
    const s = state(room), w = s.windows.get(data.windowId);
    if (!w || data.epoch !== s.epoch || viewer.gm || !visible(room, viewer, w)) { fail('window_unavailable'); }
    const ref = ownRef(room, viewer, w);
    if (refKey(ref) !== refKey(data.reactor)) { fail('forbidden'); }
    if (!text(data.cardKey) || !/^[a-zA-Z0-9_.:/-]+$/.test(data.cardKey) || !text(data.label) || !text(data.note, 500, true) ||
      !Number.isSafeInteger(data.expectedRevision) || data.expectedRevision < 0 || typeof data.withdrawn !== 'boolean') { fail('invalid_window_request'); }
    let owner = w.owners.get(viewer.uid);
    const hash = actors.hash(data), prior = owner?.requests.get(data.requestId);
    if (prior) {
      if (prior !== hash) { fail('window_request_conflict'); }
      return snapshot(room, viewer); // Exact retry remains valid after cutoff, no second revision.
    }
    touch(room, w);
    if (w.status !== 'open') { fail(w.status === 'closed' ? 'window_closed_manual' : 'window_interrupted_manual'); }
    const previous = owner?.intents.get(data.cardKey);
    if ((previous?.revision || 0) !== data.expectedRevision) { fail('intent_revision_conflict'); }
    if (data.withdrawn && !previous) { fail('intent_not_recorded'); }
    const bytes = actors.bytes(data);
    if ((owner?.bytes || 0) + bytes > OWNER_BYTES) { fail('private_capacity_manual'); }
    owner = owner || { bytes: 0, revision: 0, requests: new Map(), intents: new Map() };
    const revision = data.expectedRevision + 1;
    const event = { requestId: data.requestId, revision, withdrawn: data.withdrawn, label: data.label, note: data.note };
    const intent = { reactor: clone(ref), cardKey: data.cardKey, revision, withdrawn: data.withdrawn,
      history: [...(previous?.history || []), event] };
    owner.intents.set(data.cardKey, intent); owner.requests.set(data.requestId, hash); owner.bytes += bytes; owner.revision += 1;
    w.owners.set(viewer.uid, owner);
    return snapshot(room, viewer);
  }
  function interrupt(room, viewer, data) {
    gm(room, viewer);
    envelope(data, ['roomId', 'requestId', 'windowId', 'epoch']);
    const s = state(room), w = s.windows.get(data.windowId);
    if (!w || data.epoch !== s.epoch) { fail('window_unavailable'); }
    touch(room, w);
    if (w.status === 'open') { w.status = 'interrupted'; }
    return { result: snapshot(room, viewer), window: w };
  }
  // Internal execution bridge only: no new public collection permission or payload field.
  function followup(room, { epoch, windowId, parryId, source }) {
    const s = state(room);
    if (epoch !== s.epoch) { fail('window_unavailable'); }
    const matches = [...s.windows.values()].filter(w => w.moment === 'follow_up' && (parryId === undefined || w.trigger.causeId === parryId) && refKey(w.source) === refKey(source));
    const w = windowId ? s.windows.get(windowId) : matches.length === 1 ? matches[0] : null;
    if (windowId && !matches.includes(w) || matches.length > 1 && !windowId) { fail('riposte_wrong_followup'); }
    if (!w) { return null; }
    touch(room, w);
    if (w.invited.length !== 1 || refKey(w.invited[0]) !== refKey(source)) { fail('riposte_wrong_followup'); }
    const intent = w.owners.get(source.ownerUid)?.intents.get('universal_riposte');
    return { windowId: w.id, causeId: w.trigger.causeId, status: w.status, openedAt: w.openedAt, deadlineAt: w.deadlineAt,
      intent: intent ? clone(intent) : null, epoch: s.epoch };
  }
  return { open, change, interrupt, snapshot, followup };
}
const collector = createCollector();
module.exports = { collector, createCollector, MOMENTS, EVENTS, DURATION };
