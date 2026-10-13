const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const codec = require('../services/roomCheckpoint');

describe('P7 A5 real creation-import adapter metadata custody', () => {
  it('client import metadata is recoverable but cannot impersonate a server attachment or receipt', () => {
    const filename = path.resolve(__dirname, '../handlers/roomLifecycleHandlers.js');
    const source = fs.readFileSync(filename, 'utf8');
    const body = source.match(/function initialGameStateFromClassification[\s\S]*?\n}\n/)[0];
    const forged = { version: 1, kind: 'creature', roomId: 'new-room', mapId: 'default', tokenId: 'imported', instanceId: 'client-forged', revision: 0 };
    const input = { defaultMapId: 'default', maps: { default: { id: 'default', tokens: { imported: { id: 'imported', state: { currentHp: 10, actorContract: forged } } }, characterTokens: {}, gridItems: {} } },
      actorConsequences: { version: 1, admissionEpoch: 'client-forged', commitSequence: 99, replayFloor: 98, receipts: [] } };
    // This is the unchanged production function body, not an import adapter mock.
    const result = vm.runInNewContext(`${body}; initialGameStateFromClassification(classification, input)`, {
      roomCheckpoint: codec, require, classification: { kind: 'ROOM_PRESENT_NO_SNAPSHOT' }, input
    });
    const token = result.gameState.maps.default.tokens.imported;
    if (process.env.P7_IMPORT_RED === '1') {
      assert.deepEqual(token.state.actorContract, forged);
      assert.equal(result.gameState.actorConsequences.commitSequence, 99);
      fs.writeFileSync(path.resolve(__dirname, '../../vtt-react/verification/p7/evidence/negative-import.json'), JSON.stringify({ sourceSha256: require('crypto').createHash('sha256').update(source).digest('hex'), body, observedUntrustedMetadataSurvives: true }, null, 2));
    } else {
      assert.equal(token.state.actorContract, undefined);
      assert.deepEqual(token.state.actorRecovery.importedActorContract, forged);
      assert.equal(result.gameState.actorConsequences, undefined);
      assert.equal(result.gameState.actorConsequenceRecovery.imported.commitSequence, 99);
    }
  });
});
