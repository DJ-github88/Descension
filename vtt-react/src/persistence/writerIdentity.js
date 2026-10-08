/**
 * Project 5 Wave A (S3/B6) — per-runtime writer identity.
 *
 * Coordination metadata ONLY. Never account ownership, never cloud
 * authorization, never persisted (a duplicated/reloaded tab receives a fresh
 * realm and therefore a fresh identity; it cannot inherit a stale writer's
 * active claim).
 */

let writerInstanceId = null;

export function getWriterInstanceId() {
  if (!writerInstanceId) {
    writerInstanceId = `writer_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
  return writerInstanceId;
}

/** Test-only reset; a real reload creates a new module realm automatically. */
export function resetWriterIdentityForTests() {
  writerInstanceId = null;
}
