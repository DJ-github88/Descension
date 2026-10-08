import {
  SCOPE_KINDS,
  GUEST_SCOPE_ID,
  DEV_SCOPE_ID,
  createUserScope,
  guestScope,
  devScope,
  validateScope,
  isValidScope,
  scopesEqual,
  deriveScopeFromAuthUser
} from '../scopeModel';
import {
  createAccountContext,
  captureAccountContext,
  isSameOperationContext,
  contextsEqual,
  assertSameOperationContext,
  ACCOUNT_PHASES
} from '../accountContext';
import {
  createDraftEnvelope,
  validateDraftEnvelope,
  bumpLocalRevision,
  confirmRevision,
  ENVELOPE_CODES,
  DRAFT_ENVELOPE_SCHEMA_VERSION
} from '../draftEnvelope';

describe('P5 Slice 1 — scope model', () => {
  it('S1-03 scope validation: verified user, guest, dev, invalid/missing', () => {
    const user = createUserScope('firebase-uid-1');
    expect(user).toEqual({ scopeKind: SCOPE_KINDS.USER, scopeId: 'firebase-uid-1' });
    expect(guestScope()).toEqual({ scopeKind: SCOPE_KINDS.GUEST, scopeId: GUEST_SCOPE_ID });
    expect(devScope()).toEqual({ scopeKind: SCOPE_KINDS.DEV, scopeId: DEV_SCOPE_ID });

    expect(isValidScope(user)).toBe(true);
    expect(isValidScope(guestScope())).toBe(true);
    expect(isValidScope(devScope())).toBe(true);

    expect(validateScope(null).ok).toBe(false);
    expect(validateScope({ scopeKind: 'admin', scopeId: 'x' }).ok).toBe(false);
    expect(validateScope({ scopeKind: SCOPE_KINDS.USER, scopeId: '' }).ok).toBe(false);
    expect(validateScope({ scopeKind: SCOPE_KINDS.GUEST, scopeId: 'other-guest' }).ok).toBe(false);
    expect(validateScope({ scopeKind: SCOPE_KINDS.DEV, scopeId: 'someone' }).ok).toBe(false);
    expect(() => createUserScope('')).toThrow();
    expect(() => createUserScope(undefined)).toThrow();

    expect(scopesEqual(user, createUserScope('firebase-uid-1'))).toBe(true);
    expect(scopesEqual(user, guestScope())).toBe(false);
  });

  it('S1-04 guest UID independence: anonymous UID churn never changes guest scope', () => {
    const firstGuest = deriveScopeFromAuthUser({ user: { uid: 'anon-111', isAnonymous: true } });
    const secondGuest = deriveScopeFromAuthUser({ user: { uid: 'anon-222', isAnonymous: true } });
    expect(firstGuest).toEqual(guestScope());
    expect(secondGuest).toEqual(guestScope());
    expect(scopesEqual(firstGuest, secondGuest)).toBe(true);

    // Guest wrapper and raw anonymous users share the one stable scope.
    expect(deriveScopeFromAuthUser({ user: { uid: 'wr-1', isGuest: true } })).toEqual(guestScope());

    // Verified users get a user scope; bypass states get dev scope; no
    // principal yields null (gate clears to signed out).
    expect(deriveScopeFromAuthUser({ user: { uid: 'real-user' } })).toEqual(
      createUserScope('real-user')
    );
    expect(deriveScopeFromAuthUser({ user: null, isDevelopmentBypass: true })).toEqual(devScope());
    expect(deriveScopeFromAuthUser({ user: null, isAdminBypass: true })).toEqual(devScope());
    expect(deriveScopeFromAuthUser({ user: null })).toBeNull();
  });
});

describe('P5 Slice 1 — draft envelope', () => {
  const scope = createUserScope('user-a');

  const baseEnvelope = (overrides = {}) =>
    createDraftEnvelope({
      scope,
      draftId: 'draft_abc',
      payload: { campaigns: [] },
      ...overrides
    });

  it('S1-05 envelope validation: accepts valid, rejects invalid fields', () => {
    const envelope = baseEnvelope();
    expect(envelope.schemaVersion).toBe(DRAFT_ENVELOPE_SCHEMA_VERSION);
    expect(validateDraftEnvelope(envelope).ok).toBe(true);
    expect(Object.isFrozen(envelope)).toBe(true);

    expect(validateDraftEnvelope(null).code).toBe(ENVELOPE_CODES.NOT_OBJECT);
    expect(validateDraftEnvelope({ ...envelope, schemaVersion: 999 }).code).toBe(
      ENVELOPE_CODES.SCHEMA_UNSUPPORTED
    );
    expect(validateDraftEnvelope({ ...envelope, scopeKind: 'admin' }).code).toBe(
      ENVELOPE_CODES.SCOPE_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, draftId: '' }).code).toBe(
      ENVELOPE_CODES.DRAFT_ID_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, localRevision: 0 }).code).toBe(
      ENVELOPE_CODES.REVISION_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, localRevision: 1.5 }).code).toBe(
      ENVELOPE_CODES.REVISION_INVALID
    );
    expect(
      validateDraftEnvelope({ ...envelope, localRevision: Number.MAX_SAFE_INTEGER + 1 }).code
    ).toBe(ENVELOPE_CODES.REVISION_INVALID);
    expect(validateDraftEnvelope({ ...envelope, confirmedRevision: 5 }).code).toBe(
      ENVELOPE_CODES.CONFIRMED_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, dirty: 'yes' }).code).toBe(
      ENVELOPE_CODES.DIRTY_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, payload: undefined }).code).toBe(
      ENVELOPE_CODES.PAYLOAD_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, sourceProvenance: 5 }).code).toBe(
      ENVELOPE_CODES.PROVENANCE_INVALID
    );
    expect(validateDraftEnvelope({ ...envelope, cloudBinding: 'nope' }).code).toBe(
      ENVELOPE_CODES.CLOUD_BINDING_INVALID
    );
  });

  it('S1-05b revision helpers: monotonic edits; confirmation is metadata-only', () => {
    const first = baseEnvelope();
    const second = bumpLocalRevision(first, { campaigns: [{ id: 'c1' }] });
    expect(second.localRevision).toBe(first.localRevision + 1);
    expect(second.dirty).toBe(true);
    expect(second.payload).toEqual({ campaigns: [{ id: 'c1' }] });

    const newer = bumpLocalRevision(second, { campaigns: [] });
    expect(newer.localRevision).toBe(3);

    const staleConfirm = confirmRevision(newer, 2);
    expect(staleConfirm.confirmedRevision).toBe(2);
    expect(staleConfirm.dirty).toBe(true); // newer revision still pending
    expect(staleConfirm.payload).toEqual(newer.payload);
    expect(() => confirmRevision(newer, 99)).toThrow();

    const exactConfirm = confirmRevision(newer, 3);
    expect(exactConfirm.confirmedRevision).toBe(3);
    expect(exactConfirm.dirty).toBe(false);
  });

  it('S1-06 business IDs never substitute for ownership', () => {
    const otherScope = createUserScope('user-b');
    const envelope = createDraftEnvelope({
      scope,
      draftId: 'draft_business',
      payload: { campaignId: 'campaign_123', roomId: 'room_9', characterId: 'char_5' }
    });

    // Payload IDs matching nothing does not make the envelope visible to B.
    const mismatch = validateDraftEnvelope(envelope, { expectedScope: otherScope });
    expect(mismatch.ok).toBe(false);
    expect(mismatch.code).toBe(ENVELOPE_CODES.WRONG_SCOPE);

    // A user scope built from a campaignId string is still just a UID; it does
    // not prove ownership of a campaign created under another scope.
    expect(validateDraftEnvelope(envelope, { expectedScope: createUserScope('campaign_123') }).ok).toBe(false);
    expect(validateDraftEnvelope(envelope, { expectedScope: scope }).ok).toBe(true);
  });
});

describe('P5 Slice 1 — account context foundation', () => {
  it('S1-14 captured context equality/refusal primitives', () => {
    const scope = createUserScope('user-a');
    const context = createAccountContext({
      scope,
      phase: ACCOUNT_PHASES.ACTIVE,
      accountGeneration: 3,
      documentInstanceId: 'doc-instance-1'
    });

    const captured = captureAccountContext(context);
    expect(Object.isFrozen(captured)).toBe(true);
    expect(contextsEqual(captured, context)).toBe(true);
    expect(assertSameOperationContext(captured, context).ok).toBe(true);

    // Same UID, new generation: a different operation context.
    const sameUidNewGeneration = createAccountContext({
      scope,
      phase: ACCOUNT_PHASES.ACTIVE,
      accountGeneration: 4,
      documentInstanceId: 'doc-instance-1'
    });
    expect(isSameOperationContext(captured, sameUidNewGeneration)).toBe(false);
    expect(assertSameOperationContext(captured, sameUidNewGeneration)).toEqual({
      ok: false,
      reason: 'context-generation-or-scope-changed'
    });

    // Different document instance is also a different operation context.
    const newDocument = createAccountContext({
      scope,
      phase: ACCOUNT_PHASES.ACTIVE,
      accountGeneration: 3,
      documentInstanceId: 'doc-instance-2'
    });
    expect(isSameOperationContext(captured, newDocument)).toBe(false);

    // Phase-only changes keep operation identity; signed-out context is valid.
    const retiring = createAccountContext({
      scope,
      phase: ACCOUNT_PHASES.RETIRING,
      accountGeneration: 3,
      documentInstanceId: 'doc-instance-1'
    });
    expect(isSameOperationContext(captured, retiring)).toBe(true);
    expect(contextsEqual(captured, retiring)).toBe(false);

    const signedOut = createAccountContext({
      scope: null,
      phase: ACCOUNT_PHASES.SIGNED_OUT,
      accountGeneration: 5,
      documentInstanceId: null
    });
    expect(signedOut.scope).toBeNull();

    expect(() =>
      createAccountContext({ scope: null, phase: ACCOUNT_PHASES.ACTIVE })
    ).toThrow();
    expect(() =>
      createAccountContext({ scope, phase: ACCOUNT_PHASES.SIGNED_OUT })
    ).toThrow();
  });
});
