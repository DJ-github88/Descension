import * as gate from '../../../src/persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../../src/persistence/scopeModel';
import { createScopedStorageConfig } from '../../../src/persistence/scopedStoreStorage';
import { COMPACTION_CONFIRMATION } from '../../../src/persistence/recoveryCompaction';
import { createDraftEnvelope } from '../../../src/persistence/draftEnvelope';
import { buildScopedKey } from '../../../src/persistence/keyFormat';
import { forkScopedRecord } from '../../../src/persistence/localCoordination';
window.__w = { gate, createUserScope, createScopedStorageConfig, COMPACTION_CONFIRMATION, createDraftEnvelope, buildScopedKey, forkScopedRecord };
