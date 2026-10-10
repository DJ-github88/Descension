import { syncBestiaryCreatureNames } from '../bestiaryNameSync';

describe('syncBestiaryCreatureNames', () => {
  it('migrates by bestiary id first (kappa => Kappura)', () => {
    const out = syncBestiaryCreatureNames([{ id: 'kappa', name: 'Sump-Scrabs' }]);
    expect(out[0].name).toBe('Kappura');
  });

  it('migrates legacy names when id is absent (Rusalka => Rusalya)', () => {
    const out = syncBestiaryCreatureNames([{ id: 'custom-uuid-1', name: 'Rusalka' }]);
    expect(out[0].name).toBe('Rusalya');
  });

  it('migrates intermediate-refinement names (Skervhal => Rabengast)', () => {
    const out = syncBestiaryCreatureNames([{ id: 'custom-uuid-2', name: 'Skervhal' }]);
    expect(out[0].name).toBe('Rabengast');
  });

  it('returns the same array reference when nothing needs migration', () => {
    const input = [{ id: 'custom', name: 'Bespoke Beast' }];
    expect(syncBestiaryCreatureNames(input)).toBe(input);
  });

  it('is safe for empty / non-array input', () => {
    expect(syncBestiaryCreatureNames([])).toEqual([]);
    expect(syncBestiaryCreatureNames(null)).toBe(null);
  });
});
