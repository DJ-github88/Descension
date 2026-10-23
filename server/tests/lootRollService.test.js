/**
 * Loot Roll Service tests (need / greed / pass, d20, tie reroll-offs)
 * Run: npx mocha tests/lootRollService.test.js
 */

const { expect } = require('chai');
const { LootRollManager, TIEBREAK_DURATION_MS } = require('../services/lootRollService');

const makeHarness = (rolls = []) => {
  const queue = [...rolls];
  const timers = [];
  const events = [];
  const resolved = [];
  let clock = 1000;
  const manager = new LootRollManager({
    rollD20: () => {
      if (queue.length === 0) {throw new Error('roll queue exhausted');}
      return queue.shift();
    },
    now: () => clock,
    setTimer: (fn, ms) => {
      const t = { fn, at: clock + ms, cleared: false };
      timers.push(t);
      return t;
    },
    clearTimer: (t) => {if (t) {t.cleared = true;}},
    hooks: {
      broadcast: (session, event, payload) => events.push({ event, payload }),
      onItemResolved: (session, item) => resolved.push({ dropId: item.dropId, winner: item.winner, outcome: item.outcome })
    }
  });
  const advance = (ms) => {
    clock += ms;
    timers.filter(t => !t.cleared && !t.fired && t.at <= clock).forEach(t => {
      t.fired = true;
      t.fn();
    });
  };
  return { manager, events, resolved, advance, pending: () => queue.length };
};

const start = (manager, eligible = ['a', 'b', 'c'], itemCount = 1) => manager.startSession({
  sessionId: 's1',
  roomId: 'room',
  mapId: 'default',
  creatureName: 'Goblin',
  durationMs: 30000,
  items: Array.from({ length: itemCount }, (_, i) => ({ gridItemId: `grid-item-${i}`, name: `Item ${i}`, quality: 'rare' })),
  eligible: eligible.map(id => ({ playerId: id, name: id.toUpperCase() }))
});

describe('LootRollManager', () => {
  it('need beats a higher greed roll', () => {
    const h = makeHarness([3, 20]);
    start(h.manager, ['a', 'b']);
    h.manager.choose('s1', 'a', '0', 'need');
    h.manager.choose('s1', 'b', '0', 'greed');
    expect(h.resolved).to.have.length(1);
    expect(h.resolved[0].winner.playerId).to.equal('a');
    expect(h.resolved[0].winner.category).to.equal('need');
  });

  it('highest greed wins when nobody needs', () => {
    const h = makeHarness([7, 15]);
    start(h.manager, ['a', 'b', 'c']);
    h.manager.choose('s1', 'a', '0', 'greed');
    h.manager.choose('s1', 'b', '0', 'greed');
    h.manager.choose('s1', 'c', '0', 'pass');
    expect(h.resolved[0].winner.playerId).to.equal('b');
    expect(h.resolved[0].winner.roll).to.equal(15);
  });

  it('everyone passing leaves the item without a winner', () => {
    const h = makeHarness([]);
    start(h.manager, ['a', 'b']);
    h.manager.choose('s1', 'a', '0', 'pass');
    h.manager.choose('s1', 'b', '0', 'pass');
    expect(h.resolved[0].winner).to.equal(null);
    expect(h.resolved[0].outcome).to.equal('all_passed');
    expect(h.events.map(e => e.event)).to.include('loot_roll_ended');
  });

  it('undecided players auto-pass when the timer runs out', () => {
    const h = makeHarness([9]);
    start(h.manager, ['a', 'b', 'c']);
    h.manager.choose('s1', 'a', '0', 'greed');
    expect(h.resolved).to.have.length(0);
    h.advance(30000);
    expect(h.resolved[0].winner.playerId).to.equal('a');
  });

  it('hides d20 results until the item is decided', () => {
    const h = makeHarness([12, 4]);
    start(h.manager, ['a', 'b']);
    h.manager.choose('s1', 'a', '0', 'need');
    const live = h.events.filter(e => e.event === 'loot_roll_updated').pop().payload.item;
    expect(live.choices.find(c => c.playerId === 'a').choice).to.equal('need');
    expect(live.choices.find(c => c.playerId === 'a').roll).to.equal(null);
    h.manager.choose('s1', 'b', '0', 'need');
    const final = h.events.filter(e => e.event === 'loot_roll_item_resolved').pop().payload.item;
    expect(final.choices.map(c => c.roll)).to.deep.equal([12, 4]);
  });

  it('tied top rollers reroll against each other only', () => {
    // a:17 need, b:17 need, c:5 need → a & b tie; reroll a:8 b:14 → b wins
    const h = makeHarness([17, 17, 5, 8, 14]);
    start(h.manager, ['a', 'b', 'c']);
    h.manager.choose('s1', 'a', '0', 'need');
    h.manager.choose('s1', 'b', '0', 'need');
    h.manager.choose('s1', 'c', '0', 'need');
    expect(h.resolved).to.have.length(0);
    const tie = h.events.filter(e => e.event === 'loot_roll_updated').pop().payload.item;
    expect(tie.phase).to.equal('tiebreak');
    expect(tie.tiebreak.playerIds).to.deep.equal(['a', 'b']);
    expect(h.manager.reroll('s1', 'c', '0').ok).to.equal(false);
    h.manager.reroll('s1', 'a', '0');
    h.manager.reroll('s1', 'b', '0');
    expect(h.resolved[0].winner.playerId).to.equal('b');
  });

  it('keeps rerolling while the tie persists, and auto-rolls for slow players', () => {
    const h = makeHarness([10, 10, 6, 6, 3, 19]);
    start(h.manager, ['a', 'b']);
    h.manager.choose('s1', 'a', '0', 'greed');
    h.manager.choose('s1', 'b', '0', 'greed');
    h.manager.reroll('s1', 'a', '0');
    h.manager.reroll('s1', 'b', '0'); // 6 vs 6 → round 2
    const round2 = h.events.filter(e => e.event === 'loot_roll_updated').pop().payload.item;
    expect(round2.tiebreak.round).to.equal(2);
    h.manager.reroll('s1', 'a', '0'); // a: 3
    h.advance(TIEBREAK_DURATION_MS); // b auto-rolls 19
    expect(h.resolved[0].winner.playerId).to.equal('b');
    expect(h.pending()).to.equal(0);
  });

  it('rejects double choices and non-eligible players', () => {
    const h = makeHarness([11]);
    start(h.manager, ['a', 'b']);
    expect(h.manager.choose('s1', 'a', '0', 'need').ok).to.equal(true);
    expect(h.manager.choose('s1', 'a', '0', 'greed').error).to.equal('already_chosen');
    expect(h.manager.choose('s1', 'gm', '0', 'need').error).to.equal('not_eligible');
    expect(h.manager.choose('s1', 'b', '0', 'loot-it-all').error).to.equal('invalid_choice');
  });

  it('frees every item at once when there is nobody to roll', () => {
    const h = makeHarness([]);
    const result = start(h.manager, [], 2);
    expect(result.noRollers).to.equal(true);
    expect(h.resolved).to.have.length(2);
    expect(h.resolved.every(r => r.winner === null)).to.equal(true);
  });

  it('resolves several items independently', () => {
    const h = makeHarness([5, 9, 2]);
    start(h.manager, ['a', 'b'], 2);
    h.manager.choose('s1', 'a', '0', 'need');
    h.manager.choose('s1', 'b', '0', 'need');
    expect(h.resolved).to.have.length(1);
    h.manager.choose('s1', 'a', '1', 'greed');
    h.manager.choose('s1', 'b', '1', 'pass');
    expect(h.resolved.map(r => r.winner.playerId)).to.deep.equal(['b', 'a']);
  });
});
