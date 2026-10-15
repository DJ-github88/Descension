const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict');
const app = 'D:/VTT/vtt-react', out = __dirname, json = x => JSON.parse(JSON.stringify(x));
const receipt = JSON.parse(fs.readFileSync(path.join(out, 'invariants.json'))).originalReceipt;
receipt.receipt.acceptedAt = Date.now();
const context = { version: '1.4.0', uid: 'reviewer', roomId: receipt.receipt.roomId, generation: 1 };
const notes = [], saved = new Map(), saveCalls = [], nativeKey = ids => JSON.stringify([context.uid, ...ids]);
const game = { isInMultiplayer: true, multiplayerRoom: { id: context.roomId } };
const stores = { authStore: { getState: () => ({ user: { uid: context.uid } }) }, gameStore: { getState: () => game }, chatStore: { getState: () => ({ notifications: { combat: notes }, addNotification: (_, note) => notes.push(note) }) } };
const plannerContext = vm.createContext({ DATA_VERSIONS: { get abilities() { return context.version; } } });
const plannerSource = fs.readFileSync(path.join(app, 'src/services/featherSlash.js'), 'utf8');
vm.runInContext(plannerSource.replace(/^import .*;\r?\n/gm, '').replace(/\bexport /g, '') + '\nthis.api={featherReceipt,FEATHER_ID};', plannerContext);
const seam = vm.createContext({ featherReceipt: plannerContext.api.featherReceipt, FEATHER_ID: plannerContext.api.FEATHER_ID,
  createScopedNativeFamily: () => ({ load: ids => saved.get(nativeKey(ids)), save: (record, ids) => { saved.set(nativeKey(ids), json(record)); saveCalls.push(json(record)); return { status: 'OK' }; } }),
  captureOwnerGuard: uid => { const generation = context.generation; return { ok: true, isCurrent: () => context.uid === uid && context.generation === generation }; },
  resolveActiveScope: () => ({ scopeKind: 'user' }), getStore: name => stores[name]
});
const source = fs.readFileSync(path.join(app, 'src/services/featherSlashCustody.js'), 'utf8');
vm.runInContext(source.replace(/^import .*;\r?\n/gm, '').replace(/\bexport /g, '') + '\nthis.api={featherContext,loadLatestFeather,retainLatestFeather,consumeFeatherReceipt};', seam);
const api = seam.api, command = { version: 1, roomId: context.roomId, commandId: receipt.receipt.commandId, actors: json(receipt.receipt.actors), source: json(receipt.receipt.source), target: json(receipt.receipt.target), adjudication: json(receipt.receipt.adjudication) };
const draft = { raw: JSON.parse(JSON.parse(command.adjudication.chosenResult).rawDefinition), faces: ['2','7'], roll: { mode:'physical',faces:[2,7],total:14 }, command, phase: 'unknown' };
const ownerContext = api.featherContext(); api.retainLatestFeather(ownerContext, json(draft));
const unknownBefore = JSON.stringify(api.loadLatestFeather()), commandBefore = JSON.stringify(api.loadLatestFeather().command);
context.version = '1.5.0'; assert.equal(JSON.stringify(api.loadLatestFeather()), unknownBefore);
assert.throws(() => api.retainLatestFeather(ownerContext, { ...draft, command: { ...command, commandId: 'other-command' } }), /unresolved latest/);
const stranger = json(receipt); stranger.receipt.commandId = 'other-receipt';
api.consumeFeatherReceipt(stranger); assert.equal(api.loadLatestFeather().phase, 'unknown'); assert.equal(JSON.stringify(api.loadLatestFeather().command), commandBefore);
api.consumeFeatherReceipt(receipt); assert.equal(api.loadLatestFeather().phase, 'accepted'); assert.equal(JSON.stringify(api.loadLatestFeather().command), commandBefore);
const count = notes.length; api.consumeFeatherReceipt(receipt); assert.equal(notes.length, count);
const receiptBefore = JSON.stringify(receipt), acceptedBefore = JSON.stringify(api.loadLatestFeather());
context.version = '1.6.0'; assert.equal(api.consumeFeatherReceipt(receipt), null); assert.equal(JSON.stringify(api.loadLatestFeather()), acceptedBefore); assert.equal(JSON.stringify(receipt), receiptBefore);
context.version = '1.5.0'; context.generation++; assert.equal(ownerContext.current(), false);
assert.throws(() => api.retainLatestFeather(ownerContext, draft), /Retired owner/);
context.uid = 'other-owner'; assert.equal(api.loadLatestFeather(), null);
context.uid = 'reviewer'; game.multiplayerRoom.id = 'other-room'; assert.equal(api.loadLatestFeather(), null);
const result = { passed: true, command: process.argv, cwd: process.cwd(), method: 'Real featherSlash and featherSlashCustody function bodies execute in VM. Only imported storage/auth/store dependencies replaced with explicit synchronous in-memory seams; no device storage/reload durability claim.', unknownDraftByteIdenticalAcrossVersions: true, commandByteIdenticalAfterAcceptance: true, unresolvedReplacementRefused: true, unrelatedReceiptDidNotReplaceUnknown: true, repeatedReceiptNotificationDeduplicated: true, unreviewedVersionDidNotConsumeOrRewrite: true, ownerGenerationAndRoomIsolation: true, saveCalls: saveCalls.length, notifications: notes.map(n => n.id) };
fs.writeFileSync(path.join(out, 'custody-probe.json'), JSON.stringify(result, null, 2), { flag: 'wx' });
console.log('PASS: unchanged unknown draft/command across 1.4→1.5; same-command custody; receipt-only acceptance; dedup; scope isolation.');
