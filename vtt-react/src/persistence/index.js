/**
 * Project 5 — persistence foundation (Slice 1) barrel.
 *
 * Later slices import from './persistence' or the specific module. This is the
 * frozen contract surface for private-storage scoping and identity envelopes.
 */

export * from './scopeModel';
export * from './accountContext';
export * from './keyFormat';
export * from './draftEnvelope';
export * from './privateStorageRegistry';
export * from './globalAllowlist';
export * from './bootstrapPrivacyGate';
export * from './authBootstrapGateBinding';
export * from './safeRead';
export * from './safeWrite';
export * from './cleanupPolicy';
export * from './legacyClassification';
// Wave A — S2/S3/S4
export * from './cleanupAdapter';
export * from './protectedStorage';
export * from './writerIdentity';
export * from './localCoordination';
export * from './storageInvalidation';
export * from './preservation';
export * from './guestRetention';
export * from './handoff/accountHandoffCoordinator';
export * from './handoff/runtimeResetParticipant';
export * from './handoff/socketPrincipalRetirement';
