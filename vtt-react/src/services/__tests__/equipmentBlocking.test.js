/** P12B pure rules and GM command planning (frozen contract revision 4 §3.4–3.5). */
import { deriveWear, stepDown, firstAvailable, buildAttack, planBlockCommand, acceptedBlockText, blockReceipt, recordBlockFace, declarationEntry, requiredManual, DEFINITION_HASH } from '../equipmentBlocking';

const ref = (kind, tokenId) => ({ kind, roomId: 'room', mapId: 'map', tokenId, instanceId: `${tokenId}-inc`, ...(kind === 'character' ? { ownerUid: 'owner', characterId: 'ilsa' } : {}) });
const pcRef = ref('character', 'pc'), foeRef = ref('creature', 'foe');
const equipment = { chest: { id: 'weathered-hide', name: 'Weathered Hide', type: 'armor' }, offHand: { id: 'buckler', name: 'Oak Buckler', type: 'armor', subtype: 'SHIELD' } };
const declaration = { version: 1, revision: 3, mode: 'block', pieces: [
  { slot: 'chest', itemId: 'weathered-hide', name: 'Weathered Hide', kind: 'armor', currentDie: 'd8', broken: false },
  { slot: 'offHand', itemId: 'buckler', name: 'Oak Buckler', kind: 'shield', currentDie: 'd8', broken: false }] };
const attack = (extra = {}) => buildAttack({ source: foeRef, target: pcRef, sourceRevision: 4, ability: { name: 'Raking Claw' }, roll: { mode: 'physical', dice: '1d10', faces: '7' },
  outcome: 'hit', damageType: 'slicing', proposedDamage: 7, apCost: 2, ...extra });
const offerOf = a => ({ commandId: '11111111-1111-4111-8111-111111111111', attack: a, attackHash: 'a'.repeat(64) });
const entryOf = (offer, face, blocking = { revision: 3, slot: 'chest', itemId: 'weathered-hide', die: 'd8' }) => ({ contentHash: 'c'.repeat(64),
  approval: { approvalId: '22222222-2222-4222-8222-222222222222', source: foeRef, target: pcRef, attack: { commandId: offer.commandId, attackHash: offer.attackHash }, blocking, roll: { mode: 'physical', faces: [face] } } });
const sourceToken = { state: { currentActionPoints: 3, tempActionPoints: 1, actorContract: { revision: 4 } } };
const targetToken = (conditions = []) => ({ character: { equipment, health: { current: 30 }, tempHealth: 2 }, state: { conditions, actorContract: { revision: 9 } } });

test('wear: armor 1–2, shield 1, none while Defending; ladder d20 → d12 … d4 → broken', () => {
  expect(deriveWear('armor', 'd8', 2, false)).toEqual({ afterDie: 'd6', broken: false });
  expect(deriveWear('armor', 'd8', 3, false).afterDie).toBe('d8');
  expect(deriveWear('shield', 'd8', 2, false).afterDie).toBe('d8');
  expect(deriveWear('shield', 'd8', 1, false).afterDie).toBe('d6');
  expect(deriveWear('armor', 'd8', 1, true).afterDie).toBe('d8');
  expect(stepDown('d20')).toBe('d12');
  expect(deriveWear('armor', 'd4', 1, false)).toEqual({ afterDie: 'broken', broken: true });
});
test('first available skips broken pieces and pieces no longer in their shared slot', () => {
  expect(firstAvailable(declaration, equipment).slot).toBe('chest');
  expect(firstAvailable({ ...declaration, pieces: [{ ...declaration.pieces[0], broken: true }, declaration.pieces[1]] }, equipment).slot).toBe('offHand');
  expect(firstAvailable(declaration, { offHand: equipment.offHand }).slot).toBe('offHand');
  expect(firstAvailable({ ...declaration, mode: 'none', pieces: [] }, equipment)).toBeNull();
  expect(() => declarationEntry(0, 'block', [])).toThrow();
  expect(declarationEntry(2, 'none', [{ slot: 'chest' }])).toEqual({ beforeRevision: 2, mode: 'none', pieces: [] });
});
test('block face recording: digital and physical within the die', () => {
  expect(recordBlockFace('digital', 'd8', null, () => 0.99)).toEqual({ mode: 'digital', faces: [8] });
  expect(recordBlockFace('physical', 'd8', '2')).toEqual({ mode: 'physical', faces: [2] });
  expect(() => recordBlockFace('physical', 'd8', '9')).toThrow();
});
test('plan: one command under the offer command ID — creature AP, target HP and the derived wear', () => {
  const offer = offerOf(attack());
  const plan = planBlockCommand({ offer, entry: entryOf(offer, 2), sourceToken, targetToken: targetToken(), declaration, names: { source: 'Grimmstalk', target: 'Ilsa' } });
  expect(plan.commandId).toBe(offer.commandId);
  expect(plan.entries[0]).toEqual({ ref: foeRef, expectedRevision: 4, finalResources: { ap: { current: 2, temp: 0 } } });
  expect(plan.entries[1]).toEqual({ ref: pcRef, expectedRevision: 9, finalResources: { hp: { current: 27, temp: 0 } },
    equipmentWear: { slot: 'chest', itemId: 'weathered-hide', blockingRevision: 3, beforeDie: 'd8', afterDie: 'd6', broken: false } });
  expect(plan.extra.adjudication).toMatchObject({ definitionVersionOrHash: DEFINITION_HASH, finalAmount: 5, adjustmentReason: '' });
  const chosen = JSON.parse(plan.extra.adjudication.chosenResult);
  expect(chosen.block).toEqual({ slot: 'chest', name: 'Weathered Hide', kind: 'armor', die: 'd8', face: 2, defending: false, reduction: 2 });
  expect(JSON.stringify(chosen).includes('weathered-hide')).toBe(false); // no item id in public adjudication text
});
test('plan: Defending doubles the face; adjustments need a reason; stale declarations are refused', () => {
  const offer = offerOf(attack());
  const defending = [{ version: 1, conditionKey: 'defending' }];
  const plan = planBlockCommand({ offer, entry: entryOf(offer, 1), sourceToken, targetToken: targetToken(defending), declaration, names: { source: 'G', target: 'I' } });
  expect(plan.preview).toMatchObject({ reduction: 2, afterBlock: 5, afterDie: 'd8' });
  expect(() => planBlockCommand({ offer, entry: entryOf(offer, 2), sourceToken, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' }, finalAmount: 4 })).toThrow(/Explain/);
  expect(() => planBlockCommand({ offer, entry: entryOf(offer, 2, { revision: 2, slot: 'chest', itemId: 'weathered-hide', die: 'd8' }), sourceToken, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' } })).toThrow(/recorded face is kept/);
});
test('P12B-r1: a changed piece is a GM ruling (never re-read or re-rolled); the creature plan uses its current revision', () => {
  const offer = offerOf(attack());
  const worn = { ...declaration, revision: 4, pieces: [{ ...declaration.pieces[0], currentDie: 'd6' }, declaration.pieces[1]] };
  let error;
  try { planBlockCommand({ offer, entry: entryOf(offer, 7), sourceToken, targetToken: targetToken(), declaration: worn, names: { source: 'G', target: 'I' } }); } catch (e) { error = e; }
  expect(error.code).toBe('block_revalidation_required');
  expect(error.message).toMatch(/face 7 on chest d8/);
  expect(error.message).not.toMatch(/roll again/);
  try { planBlockCommand({ offer, entry: entryOf(offer, 7), sourceToken, targetToken: targetToken(), declaration: { ...declaration, pieces: [] , mode: 'none' }, names: { source: 'G', target: 'I' } }); } catch (e) { error = e; }
  expect(error.code).toBe('block_piece_unavailable');
  const moved = { state: { ...sourceToken.state, currentActionPoints: 1, actorContract: { revision: 6 } } };
  const plan = planBlockCommand({ offer, entry: entryOf(offer, 3), sourceToken: moved, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' } });
  expect(plan.entries[0]).toEqual({ ref: foeRef, expectedRevision: 6, finalResources: { ap: { current: 0, temp: 0 } } });
  expect('revalidation' in JSON.parse(plan.extra.adjudication.chosenResult)).toBe(false);
  expect(() => planBlockCommand({ offer, entry: entryOf(offer, 3), sourceToken: moved, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' }, revalidation: { reason: '  ' } })).toThrow(/why/);
  const confirmed = planBlockCommand({ offer, entry: entryOf(offer, 3), sourceToken: moved, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' }, revalidation: { reason: 'Already swinging' } });
  expect(JSON.parse(confirmed.extra.adjudication.chosenResult).revalidation).toEqual({ fromRevision: 4, toRevision: 6, reason: 'Already swinging' });
  expect(() => planBlockCommand({ offer, entry: entryOf(offer, 3), sourceToken, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' }, revalidation: { reason: 'x' } })).toThrow(/no revalidation/);
});
test('GM-adjudicated branches: critical vs armor has no block; critical shield and non-physical need explicit rulings', () => {
  const crit = offerOf(attack({ outcome: 'critical' }));
  expect(() => planBlockCommand({ offer: crit, entry: entryOf(crit, 3), sourceToken, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' } })).toThrow(/around armor/);
  const shieldFirst = { ...declaration, pieces: [declaration.pieces[1], declaration.pieces[0]] };
  const entry = entryOf(crit, 1, { revision: 3, slot: 'offHand', itemId: 'buckler', die: 'd8' });
  expect(() => planBlockCommand({ offer: crit, entry, sourceToken, targetToken: targetToken(), declaration: shieldFirst, names: { source: 'G', target: 'I' } })).toThrow(/ruling/);
  expect(planBlockCommand({ offer: crit, entry, sourceToken, targetToken: targetToken(), declaration: shieldFirst, names: { source: 'G', target: 'I' }, manual: [{ category: 'critical-shield', note: '' }] }).preview.afterDie).toBe('d6');
  expect(requiredManual(attack({ damageType: 'ember' }))).toEqual(['non-physical']);
  expect(() => buildAttack({ source: foeRef, target: pcRef, sourceRevision: 1, ability: { name: 'x' }, roll: { dice: '1d6', faces: '3' }, outcome: 'miss', damageType: 'slicing', proposedDamage: 3, apCost: 0 })).toThrow();
});
test('accepted text states only committed values and names manual rulings', () => {
  const offer = offerOf(attack());
  const plan = planBlockCommand({ offer, entry: entryOf(offer, 2), sourceToken, targetToken: targetToken(), declaration, names: { source: 'Grimmstalk', target: 'Ilsa' }, manual: [{ category: 'flat-dr', note: '' }] });
  const result = { success: true, receipt: { version: 1, roomId: 'room', commandId: offer.commandId, acceptedAt: 1, adjudication: plan.extra.adjudication,
    actors: [{ ref: foeRef }, { ref: pcRef, equipmentWear: { slot: 'chest', name: 'Weathered Hide', kind: 'armor', beforeDie: 'd8', afterDie: 'd6', broken: false, naturalFace: 2, defending: false, blockingRevision: 3 } }] } };
  expect(blockReceipt(result).wear.afterDie).toBe('d6');
  expect(acceptedBlockText(result)).toBe("Accepted: Ilsa takes 5 HP from Grimmstalk's Raking Claw (AP −2). Weathered Hide blocked 2; worn d8 → d6. GM rulings: flat-dr.");
});

test('P12B-r1: the public result names a GM revalidation', () => {
  const offer = offerOf(attack());
  const moved = { state: { ...sourceToken.state, actorContract: { revision: 6 } } };
  const plan = planBlockCommand({ offer, entry: entryOf(offer, 3), sourceToken: moved, targetToken: targetToken(), declaration, names: { source: 'G', target: 'I' }, revalidation: { reason: 'Already swinging' } });
  const result = { success: true, receipt: { version: 1, adjudication: plan.extra.adjudication, actors: [{ ref: foeRef }, { ref: pcRef, equipmentWear: { name: 'Weathered Hide', beforeDie: 'd8', afterDie: 'd8', broken: false } }] } };
  expect(acceptedBlockText(result)).toMatch(/GM confirmed the recorded rolls after the attacker changed: Already swinging\./);
});
