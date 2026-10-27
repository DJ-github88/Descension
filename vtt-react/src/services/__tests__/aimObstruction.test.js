import { queryAimObstruction, sightSegmentContact } from '../aimObstruction';

const gridSystem = {
  getGridState: () => ({ gridType: 'square', gridSize: 50, gridOffsetX: 10, gridOffsetY: -20 }),
  gridToWorldCorner: (x, y) => ({ x: x * 50 + 10, y: y * 50 - 20 })
};
const endpoint = (x, y, mapId = 'map') => ({ ref: { kind: 'creature', roomId: 'room', mapId, tokenId: `${x},${y}`, instanceId: 'exact' }, position: { x, y } });
const base = { unrestrictedGM: true, mapId: 'map', source: endpoint(35, 5), target: endpoint(135, 5), gridSystem,
  wallTypes: { solid: { blocksLineOfSight: true }, glass: { blocksLineOfSight: false, blocksMovement: true }, door: { blocksLineOfSight: true, interactive: true } } };
const query = delta => queryAimObstruction({ ...base, ...delta });

test('clear modeled sight is never attack clearance; movement/edits recompute without a cache', () => {
  expect(query().status).toBe('clear');
  const wallData = { '1,0,1,1': { type: 'solid' } };
  expect(query({ wallData })).toMatchObject({ status: 'blocked', trajectory: 'unknown', advisory: true });
  expect(query({ wallData, target: endpoint(35, 105) }).status).toBe('clear');
  wallData['1,0,1,1'].type = 'glass';
  expect(query({ wallData }).status).toBe('clear');
});
test('configured rotated sight rectangle; decorative assets supply no blocking rule', () => {
  const object = { type: 'tree_image', worldX: 85, worldY: 5, blocksLineOfSight: true, rotation: 45, width: 1, height: 1, scale: 1 };
  expect(query({ environmentalObjects: [object] }).status).toBe('blocked');
  expect(query({ environmentalObjects: [{ ...object, blocksLineOfSight: false }] }).status).toBe('clear');
  expect(query({ environmentalObjects: [{ ...object, blocksLineOfSight: undefined }] }).status).toBe('unknown');
  expect(query({ environmentalObjects: [{ ...object, scale: NaN }] }).status).toBe('unknown');
  expect(query({ environmentalObjects: [{ ...object, state: 'open' }] }).status).toBe('unknown');
  expect(query({ objectTypes: { tree_image: { interactive: true } }, environmentalObjects: [object] }).status).toBe('unknown');
});
test('explicit editor door states only; no legacy state inference or overlay assumptions', () => {
  const door = state => ({ '1,0,1,1': { type: 'door', state } });
  expect(query({ wallData: door('open') }).status).toBe('clear');
  for (const state of ['closed', 'locked']) expect(query({ wallData: door(state) }).status).toBe('blocked');
  expect(query({ wallData: door(undefined) }).status).toBe('unknown');
  expect(query({ wallData: { '1,0,1,1': { type: 'door', state: 'open', isOpen: false } } }).status).toBe('unknown');
  expect(query({ wallData: door('closed'), windowOverlays: { '1,0': {} } }).status).toBe('unknown');
});
test('privacy gate does not inspect hidden geometry or retain GM results', () => {
  const secret = new Proxy({}, { ownKeys: () => { throw Error('secret read'); }, get: () => { throw Error('secret read'); } });
  const safe = query({ unrestrictedGM: false });
  expect(query({ unrestrictedGM: false, wallData: secret, environmentalObjects: secret })).toEqual(safe);
  query({ wallData: { '1,0,1,1': { type: 'solid' } } });
  expect(query({ unrestrictedGM: false, wallData: secret })).toEqual(safe);
  expect(JSON.stringify(safe)).not.toMatch(/count|tokenId|instanceId|wallData/);
});
test('exact same-map finite endpoints and supported grid required', () => {
  for (const delta of [{ source: null }, { source: { ...endpoint(35, 5), ref: { mapId: 'map' } } }, { target: endpoint(135, 5, 'other') }, { target: endpoint(NaN, 5) },
    { target: endpoint(35, 5) }, { ready: false }, { gridSystem: null }, { wallData: { legacyId: { type: 'solid' } } }]) {
    expect(query(delta).status).toBe('unknown');
  }
});
test('boundary, collinear overlap, degenerate and bbox false positives', () => {
  const a = { x: 0, y: 0 }, b = { x: 10, y: 0 };
  expect(sightSegmentContact(a, b, { x: 5, y: -1 }, { x: 5, y: 1 })).toBe('crossing');
  expect(sightSegmentContact(a, b, { x: 10, y: 0 }, { x: 10, y: 5 })).toBe('contact');
  expect(sightSegmentContact(a, b, { x: 5, y: 0 }, { x: 15, y: 0 })).toBe('contact');
  expect(sightSegmentContact(a, b, { x: 5, y: 0 }, { x: 5, y: 0 })).toBe('contact');
  expect(sightSegmentContact(a, { x: 10, y: 10 }, { x: 0, y: 5 }, { x: 2, y: 8 })).toBe('clear');
  expect(query({ wallData: { '1,0.5,1,1': { type: 'solid' } } }).status).toBe('unknown');
});
test('hex stored endpoints use the same world-space narrow phase', () => {
  const hex = { getGridState: () => ({ ...gridSystem.getGridState(), gridType: 'hex' }) };
  expect(query({ gridSystem: hex, wallData: { '0,0,1,0': { type: 'solid', hexEndpoints: [{ x: 85, y: -20 }, { x: 85, y: 30 }] } } }).status).toBe('blocked');
});
