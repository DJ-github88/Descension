/**
 * Unit tests for server/services/conflictPolicies.
 *
 * These policies are plugged into the DeltaSyncEngine's resolveConflict choke
 * point to override the default Last-Write-Wins on a per-field basis. Each
 * test exercises one policy plus a couple of "wire-format" edge cases (missing
 * leaves, type mismatches, non-finite numbers) that the policy must defer to
 * the engine's default fallback.
 */

const { expect } = require('chai');
const {
  isPrimitiveLeaf,
  unwrap,
  wrap,
  lastWriter,
  minValue,
  maxValue,
  sumValue,
  clamped,
  boundedMin,
  boundedMax,
  defaultPolicies
} = require('../services/conflictPolicies');

const PRIMITIVE = (v) => ({ __value: v, __type: 'primitive' });

describe('conflictPolicies', () => {
  describe('wire format helpers', () => {
    it('isPrimitiveLeaf recognises the primitive wire format', () => {
      expect(isPrimitiveLeaf(PRIMITIVE(5))).to.equal(true);
      expect(isPrimitiveLeaf({ __value: 'x', __type: 'primitive' })).to.equal(true);
    });

    it('isPrimitiveLeaf rejects non-primitive shapes', () => {
      expect(isPrimitiveLeaf(null)).to.equal(false);
      expect(isPrimitiveLeaf(undefined)).to.equal(false);
      expect(isPrimitiveLeaf(5)).to.equal(false);
      expect(isPrimitiveLeaf({ __type: 'array' })).to.equal(false);
      expect(isPrimitiveLeaf({ __deleted: true })).to.equal(false);
      expect(isPrimitiveLeaf({})).to.equal(false);
    });

    it('unwrap returns the inner value or undefined for non-primitives', () => {
      expect(unwrap(PRIMITIVE(7))).to.equal(7);
      expect(unwrap(PRIMITIVE('hello'))).to.equal('hello');
      expect(unwrap(null)).to.equal(undefined);
      expect(unwrap({ __deleted: true })).to.equal(undefined);
    });

    it('wrap re-emits the primitive envelope', () => {
      expect(wrap(7)).to.deep.equal({ __value: 7, __type: 'primitive' });
      expect(wrap(0)).to.deep.equal({ __value: 0, __type: 'primitive' });
    });

    it('wrap normalises non-finite numbers to zero', () => {
      expect(wrap(NaN)).to.deep.equal({ __value: 0, __type: 'primitive' });
      expect(wrap(Infinity)).to.deep.equal({ __value: 0, __type: 'primitive' });
      expect(wrap(-Infinity)).to.deep.equal({ __value: 0, __type: 'primitive' });
    });
  });

  describe('lastWriter', () => {
    it('returns value2 (LWW) for two primitive numerics', () => {
      const r = lastWriter(PRIMITIVE(7), PRIMITIVE(9), { path: 'hp' });
      expect(r).to.deep.equal(PRIMITIVE(9));
    });

    it('defers to the default fallback when either value is not a primitive', () => {
      expect(lastWriter(PRIMITIVE(7), { __deleted: true }, { path: 'hp' })).to.equal(undefined);
      expect(lastWriter({ x: 1 }, PRIMITIVE(9), { path: 'hp' })).to.equal(undefined);
    });
  });

  describe('minValue', () => {
    it('takes the smaller number', () => {
      expect(minValue(PRIMITIVE(7), PRIMITIVE(9), { path: 'hp' })).to.deep.equal(PRIMITIVE(7));
      expect(minValue(PRIMITIVE(9), PRIMITIVE(7), { path: 'hp' })).to.deep.equal(PRIMITIVE(7));
    });

    it('handles equal values', () => {
      expect(minValue(PRIMITIVE(5), PRIMITIVE(5), { path: 'hp' })).to.deep.equal(PRIMITIVE(5));
    });

    it('defers when one value is non-numeric', () => {
      expect(minValue(PRIMITIVE(7), PRIMITIVE('x'), { path: 'hp' })).to.equal(undefined);
    });
  });

  describe('maxValue', () => {
    it('takes the larger number', () => {
      expect(maxValue(PRIMITIVE(7), PRIMITIVE(9), { path: 'ap' })).to.deep.equal(PRIMITIVE(9));
      expect(maxValue(PRIMITIVE(9), PRIMITIVE(7), { path: 'ap' })).to.deep.equal(PRIMITIVE(9));
    });

    it('defers when one value is non-numeric', () => {
      expect(maxValue(PRIMITIVE(7), PRIMITIVE('x'), { path: 'ap' })).to.equal(undefined);
    });
  });

  describe('sumValue', () => {
    it('adds the two values', () => {
      expect(sumValue()(PRIMITIVE(3), PRIMITIVE(4), { path: 'count' })).to.deep.equal(PRIMITIVE(7));
      expect(sumValue()(PRIMITIVE(-2), PRIMITIVE(5), { path: 'count' })).to.deep.equal(PRIMITIVE(3));
    });
  });

  describe('clamped', () => {
    it('clamps value2 into [min, max]', () => {
      const c = clamped(0, 10);
      expect(c(PRIMITIVE(7), PRIMITIVE(9), { path: 'mp' })).to.deep.equal(PRIMITIVE(9));
      expect(c(PRIMITIVE(7), PRIMITIVE(-3), { path: 'mp' })).to.deep.equal(PRIMITIVE(0));
      expect(c(PRIMITIVE(7), PRIMITIVE(50), { path: 'mp' })).to.deep.equal(PRIMITIVE(10));
    });

    it('ignores value1 (LWW) and only clamps the incoming value', () => {
      const c = clamped(0, 10);
      expect(c(PRIMITIVE(99), PRIMITIVE(-5), { path: 'mp' })).to.deep.equal(PRIMITIVE(0));
    });
  });

  describe('boundedMin', () => {
    it('takes the min and clamps to bounds', () => {
      const bm = boundedMin(0, 100);
      expect(bm(PRIMITIVE(7), PRIMITIVE(9), { path: 'hp' })).to.deep.equal(PRIMITIVE(7));
      expect(bm(PRIMITIVE(-50), PRIMITIVE(9), { path: 'hp' })).to.deep.equal(PRIMITIVE(0));
      expect(bm(PRIMITIVE(7), PRIMITIVE(150), { path: 'hp' })).to.deep.equal(PRIMITIVE(7));
      expect(bm(PRIMITIVE(150), PRIMITIVE(200), { path: 'hp' })).to.deep.equal(PRIMITIVE(100));
    });
  });

  describe('boundedMax', () => {
    it('takes the max and clamps to bounds', () => {
      const bm = boundedMax(0, 5);
      expect(bm(PRIMITIVE(2), PRIMITIVE(3), { path: 'ap' })).to.deep.equal(PRIMITIVE(3));
      expect(bm(PRIMITIVE(-10), PRIMITIVE(7), { path: 'ap' })).to.deep.equal(PRIMITIVE(5));
      expect(bm(PRIMITIVE(2), PRIMITIVE(99), { path: 'ap' })).to.deep.equal(PRIMITIVE(5));
    });
  });

  describe('defaultPolicies()', () => {
    it('returns a fresh object on every call', () => {
      const a = defaultPolicies();
      const b = defaultPolicies();
      expect(a).to.not.equal(b);
      // Compare key sets and the SHAPE of each entry (it is a function).
      expect(Object.keys(a).sort()).to.deep.equal(Object.keys(b).sort());
      for (const k of Object.keys(a)) {
        expect(a[k]).to.be.a('function');
        expect(b[k]).to.be.a('function');
      }
    });

    it('covers every documented default field', () => {
      const p = defaultPolicies();
      const expectedKeys = [
        'hp', 'health', 'currentHp', 'currentHealth',
        'mp', 'mana', 'currentMp', 'currentMana',
        'ap', 'actionPoints', 'currentAp',
        'ammo', 'currentAmmo', 'rounds',
        'xp', 'experience', 'currentXp',
        'x', 'y'
      ];
      for (const k of expectedKeys) {
        expect(p, `expected default policy for "${k}"`).to.have.property(k);
        expect(p[k], `"${k}" should be a function`).to.be.a('function');
      }
    });

    it('applies boundedMin semantics to HP fields', () => {
      const p = defaultPolicies();
      // Two concurrent damage events: 30 and 50 from a base of 80.
      // The lower number (50) should NOT win — the lower damage result is 30
      // (taking min). The point is that boundedMin(0, 99999) takes the
      // smaller NUMBER (i.e. the more damaging outcome).
      expect(p.hp(PRIMITIVE(80), PRIMITIVE(30), { path: 'hp' }))
        .to.deep.equal(PRIMITIVE(30));
      expect(p.health(PRIMITIVE(10), PRIMITIVE(0), { path: 'health' }))
        .to.deep.equal(PRIMITIVE(0));
    });

    it('clamps HP at zero even when one value is deeply negative', () => {
      const p = defaultPolicies();
      expect(p.currentHp(PRIMITIVE(20), PRIMITIVE(-99), { path: 'currentHp' }))
        .to.deep.equal(PRIMITIVE(0));
    });

    it('applies boundedMax semantics to AP fields', () => {
      const p = defaultPolicies();
      expect(p.ap(PRIMITIVE(1), PRIMITIVE(2), { path: 'ap' }))
        .to.deep.equal(PRIMITIVE(2));
      expect(p.actionPoints(PRIMITIVE(5), PRIMITIVE(200), { path: 'actionPoints' }))
        .to.deep.equal(PRIMITIVE(99));
    });

    it('treats position fields as LWW', () => {
      const p = defaultPolicies();
      expect(p.x(PRIMITIVE(10), PRIMITIVE(20), { path: 'x' }))
        .to.deep.equal(PRIMITIVE(20));
    });
  });
});
