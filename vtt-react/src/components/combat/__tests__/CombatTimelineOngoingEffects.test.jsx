import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import CombatTimeline from '../CombatTimeline';
import useCombatStore from '../../../store/combatStore';
import useCreatureStore from '../../../store/creatureStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useGameStore from '../../../store/gameStore';
import useSettingsStore from '../../../store/settingsStore';
import useAuthStore from '../../../store/authStore';
import useCharacterStore from '../../../store/characterStore';
import { registerStore } from '../../../store/storeRegistry';
import {
  makeAttributeRecord,
  makeDefendingRecord,
  makePeriodicRecord,
  canonical
} from '../../../services/sharedConditionProfile';
import { instanceKey, positionKey } from '../../../services/sharedEffectTiming';
import { key as cooldownKey, TYPE as COOLDOWN_TYPE } from '../../../services/authoredCooldown';
import { replaceAuthoredRegistry } from '../../../services/authoredAbilityRegistry';
import { useSharedConditionStore, conditionPrincipal } from '../../../services/sharedConditionService';
import { applyRoomSnapshot } from '../../../services/silentRoomHydration';

const ROOM_ID = 'room-ongoing-1';
const MAP_ID = 'arena';
const COMBAT_ID = 'c0000000-0000-4000-8000-000000000010';
const DEF_ID = 'd0000000-0000-4000-8000-000000000020';

const pcRef = {
  kind: 'character',
  roomId: ROOM_ID,
  mapId: MAP_ID,
  tokenId: 'pc-1',
  instanceId: 'pc-inc-1',
  ownerUid: 'user-1',
  characterId: 'char-1'
};

const wolfRef = {
  kind: 'creature',
  roomId: ROOM_ID,
  mapId: MAP_ID,
  tokenId: 'wolf-1',
  instanceId: 'wolf-inc-1'
};

const allyRef = {
  kind: 'creature',
  roomId: ROOM_ID,
  mapId: MAP_ID,
  tokenId: 'ally-1',
  instanceId: 'ally-inc-1'
};

function setupStores({ isGMMode = false, combat = null, pcConditions = [], wolfConditions = [], pcCooldowns = {}, wolfHidden = false } = {}) {
  registerStore('combatStore', useCombatStore);
  registerStore('creatureStore', useCreatureStore);
  registerStore('characterTokenStore', useCharacterTokenStore);
  registerStore('gameStore', useGameStore);
  registerStore('settingsStore', useSettingsStore);
  registerStore('authStore', useAuthStore);
  registerStore('characterStore', useCharacterStore);

  useAuthStore.setState({ user: { uid: pcRef.ownerUid } });
  useCharacterStore.setState({ currentCharacterId: pcRef.characterId });
  useSettingsStore.setState({ windowScale: 1 });
  useGameStore.setState({
    isInMultiplayer: true,
    isGMMode,
    multiplayerRoom: { id: ROOM_ID }
  });

  const pcToken = {
    id: pcRef.tokenId,
    mapId: MAP_ID,
    name: 'Lyra',
    ownerUserId: pcRef.ownerUid,
    character: {
      id: pcRef.characterId,
      name: 'Lyra',
      health: { current: 20, max: 30 },
      mana: { current: 10, max: 10 },
      actionPoints: { current: 4, max: 4 }
    },
    state: {
      actorContract: { ...pcRef, version: 1, primary: true, revision: 1 },
      conditions: pcConditions,
      authoredCooldowns: pcCooldowns
    }
  };

  const wolfToken = {
    id: wolfRef.tokenId,
    mapId: MAP_ID,
    name: 'Dire Wolf',
    ...(wolfHidden ? { hiddenFromPlayers: true } : {}),
    state: {
      actorContract: { ...wolfRef, version: 1, revision: 1 },
      currentHp: 30,
      currentMana: 0,
      currentActionPoints: 4,
      conditions: wolfConditions
    }
  };

  useCharacterTokenStore.setState({ characterTokens: [pcToken] });
  useCreatureStore.setState({ creatureTokens: [wolfToken], creatures: [] });

  replaceAuthoredRegistry(ROOM_ID, [
    {
      definitionRef: { definitionId: `authored:${DEF_ID}:1:${'a'.repeat(64)}`, definitionHash: 'a'.repeat(64) },
      canonicalDefinition: {
        definitionId: DEF_ID,
        name: 'Wasting Brand',
        cooldown: { cooldownType: COOLDOWN_TYPE, cooldownValue: 2 }
      }
    }
  ]);

  const activeCombat = combat || {
    isActive: true,
    round: 1,
    currentTurnIndex: 0,
    turnOrder: [
      { tokenId: pcRef.tokenId, name: 'Lyra', isCharacterToken: true, initiative: 18, actorRef: pcRef },
      { tokenId: wolfRef.tokenId, name: 'Dire Wolf', isCharacterToken: false, initiative: 12, actorRef: wolfRef }
    ],
    effectLifecycle: null,
    retiredPeriodicTicks: null
  };

  useCombatStore.setState({
    isInCombat: activeCombat.isActive,
    round: activeCombat.round,
    currentTurnIndex: activeCombat.currentTurnIndex,
    turnOrder: activeCombat.turnOrder,
    effectLifecycle: activeCombat.effectLifecycle || null,
    retiredPeriodicTicks: activeCombat.retiredPeriodicTicks || null
  });

  useSharedConditionStore.setState({
    principal: conditionPrincipal(),
    clockPhase: 'ready',
    combat: activeCombat,
    views: {},
    saved: { entries: {} }
  });
}

describe('CombatTimeline — Ongoing Effects & Cooldowns display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders counted effects, periodic ticks, due ticks, and supported cooldowns with next occurrence vs final expiry', () => {
    const attrRecord = makeAttributeRecord(wolfRef, '11111111-1111-4111-8111-111111111111', {
      sourceOccurrence: 'authored-effect:11111111-1111-4111-8111-111111111111',
      timing: 'authored-target-start-count',
      occurrences: 3,
      authoredDuration: 'Until 3 starts',
      attribute: 'agility',
      amount: -2,
      label: 'Frostbite',
      sourceActor: pcRef,
      effectDefinition: `authored:${DEF_ID}:1:${'a'.repeat(64)}`
    });

    const periodicRecord = makePeriodicRecord(wolfRef, '22222222-2222-4222-8222-222222222222', {
      sourceOccurrence: 'authored-effect:22222222-2222-4222-8222-222222222222',
      timing: 'authored-target-end-count',
      occurrences: 3,
      authoredDuration: '3 burns',
      label: 'Wasting Brand',
      sourceActor: pcRef,
      effectDefinition: `authored:${DEF_ID}:1:${'a'.repeat(64)}`,
      tick: { kind: 'damage', formula: '1d4', damageType: 'blight' }
    });

    const turnOrder = [
      { tokenId: pcRef.tokenId, name: 'Lyra', isCharacterToken: true, initiative: 18, actorRef: pcRef },
      { tokenId: wolfRef.tokenId, name: 'Dire Wolf', isCharacterToken: false, initiative: 12, actorRef: wolfRef }
    ];
    const baseCombat = { isActive: true, round: 1, currentTurnIndex: 0, turnOrder };
    const combat = {
      ...baseCombat,
      effectLifecycle: {
        version: 1,
        id: COMBAT_ID,
        sequence: 0,
        positionKey: positionKey(baseCombat),
        schedules: {
          [instanceKey(wolfRef, attrRecord.recordId)]: {
            combatId: COMBAT_ID,
            ref: wolfRef,
            recordId: attrRecord.recordId,
            recordKey: canonical(attrRecord),
            dueSequence: 5,
            occurrences: 3,
            period: 2,
            boundary: 'start'
          },
          [instanceKey(wolfRef, periodicRecord.recordId)]: {
            combatId: COMBAT_ID,
            ref: wolfRef,
            recordId: periodicRecord.recordId,
            recordKey: canonical(periodicRecord),
            dueSequence: 6,
            occurrences: 3,
            period: 2,
            boundary: 'end'
          }
        },
        dueTicks: {
          'tick-1': {
            tickId: 'tick-1',
            combatId: COMBAT_ID,
            ref: wolfRef,
            recordId: periodicRecord.recordId,
            label: 'Wasting Brand',
            occurrence: 1,
            of: 3,
            sequence: 2,
            final: false,
            tick: { kind: 'damage', formula: '1d4', damageType: 'blight' }
          }
        }
      }
    };

    const cdKey = cooldownKey(pcRef, DEF_ID);
    setupStores({
      isGMMode: false,
      combat,
      wolfConditions: [attrRecord, periodicRecord],
      pcCooldowns: {
        [cdKey]: {
          combatId: COMBAT_ID,
          startSequence: 0,
          dueSequence: 4,
          occurrences: 2,
          period: 2,
          commandId: 'cmd-1'
        }
      }
    });

    render(<CombatTimeline />);

    const section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).getByText('Turn boundary 0')).toBeInTheDocument();

    // Counted effect distinguishes next occurrence from final expiry, no rounds/seconds conversion
    expect(within(section).getByText('Frostbite')).toBeInTheDocument();
    expect(within(section).getByText('3 of 3 target-turn starts remaining')).toBeInTheDocument();
    expect(within(section).getByText('Next occurrence: target turn start (boundary 1)')).toBeInTheDocument();
    expect(within(section).getByText('Final expiry: target turn start (boundary 5)')).toBeInTheDocument();

    // Periodic effect + due tick
    expect(within(section).getAllByText('Wasting Brand').length).toBeGreaterThanOrEqual(1);
    expect(within(section).getByText('3 of 3 target-turn ticks remaining')).toBeInTheDocument();
    expect(within(section).getByText('Next tick: target turn end (boundary 2)')).toBeInTheDocument();
    expect(within(section).getByText('Final expiry: target turn end (boundary 6)')).toBeInTheDocument();
    expect(within(section).getByText('Tick 1 of 3')).toBeInTheDocument();
    expect(within(section).getByText('Awaiting GM resolution')).toBeInTheDocument();

    // Supported cooldown availability
    expect(within(section).getByText('Cooldown: Wasting Brand')).toBeInTheDocument();
    expect(within(section).getByText('2 of 2 caster-turn starts remaining')).toBeInTheDocument();
    expect(within(section).getByText('Next caster-turn start: boundary 2')).toBeInTheDocument();
    expect(within(section).getByText('Releases: caster-turn start (boundary 4)')).toBeInTheDocument();
    expect(section.textContent).not.toMatch(/seconds/i);
  });

  test('renders Manual duration for manual conditions and Timing unavailable for unscheduled/unsupported conditions', () => {
    const manualRecord = makeDefendingRecord(pcRef, '33333333-3333-4333-8333-333333333333');
    const unscheduledCounted = makeAttributeRecord(wolfRef, '44444444-4444-4444-8444-444444444444', {
      sourceOccurrence: 'authored-effect:44444444-4444-4444-8444-444444444444',
      timing: 'authored-target-start-count',
      occurrences: 3,
      authoredDuration: '3 starts',
      attribute: 'spirit',
      amount: -2,
      label: 'Weakened',
      sourceActor: pcRef,
      effectDefinition: `authored:${DEF_ID}:1:${'a'.repeat(64)}`
    });
    const legacyUnsupported = {
      id: 'legacy-1',
      name: 'Legacy Curse',
      durationType: 'rounds',
      duration: 3
    };

    setupStores({
      isGMMode: false,
      pcConditions: [manualRecord],
      wolfConditions: [unscheduledCounted, legacyUnsupported]
    });

    render(<CombatTimeline />);

    const section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).getAllByText('Timing unavailable').length).toBeGreaterThanOrEqual(2);
    expect(within(section).getByText('Manual duration')).toBeInTheDocument();
    expect(within(section).getByText('Weakened')).toBeInTheDocument();
    expect(within(section).getByText('Legacy Curse')).toBeInTheDocument();
    // Never converts legacy rounds into a promised expiry
    expect(section.textContent).not.toMatch(/3 rounds/i);
    expect(section.textContent).not.toMatch(/18 seconds/i);
  });

  test('updates on authenticated turn advance, roster re-anchoring, effect removal, and checkpoint hydration', () => {
    const attrRecord = makeAttributeRecord(wolfRef, '55555555-5555-4555-8555-555555555555', {
      sourceOccurrence: 'authored-effect:55555555-5555-4555-8555-555555555555',
      timing: 'authored-target-start-count',
      occurrences: 2,
      authoredDuration: '2 starts',
      attribute: 'agility',
      amount: -2,
      label: 'Chill',
      sourceActor: pcRef,
      effectDefinition: `authored:${DEF_ID}:1:${'a'.repeat(64)}`
    });

    const turnOrder2 = [
      { tokenId: pcRef.tokenId, name: 'Lyra', isCharacterToken: true, initiative: 18, actorRef: pcRef },
      { tokenId: wolfRef.tokenId, name: 'Dire Wolf', isCharacterToken: false, initiative: 12, actorRef: wolfRef }
    ];
    const base2 = { isActive: true, round: 1, currentTurnIndex: 0, turnOrder: turnOrder2 };
    const combat0 = {
      ...base2,
      effectLifecycle: {
        version: 1,
        id: COMBAT_ID,
        sequence: 0,
        positionKey: positionKey(base2),
        schedules: {
          [instanceKey(wolfRef, attrRecord.recordId)]: {
            combatId: COMBAT_ID,
            ref: wolfRef,
            recordId: attrRecord.recordId,
            recordKey: canonical(attrRecord),
            dueSequence: 3,
            occurrences: 2,
            period: 2,
            boundary: 'start'
          }
        }
      }
    };

    setupStores({ isGMMode: false, combat: combat0, wolfConditions: [attrRecord] });
    render(<CombatTimeline />);

    const section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).getByText('2 of 2 target-turn starts remaining')).toBeInTheDocument();

    // 1. Authenticated turn advance to sequence 1 (Dire Wolf's 1st turn start)
    const baseTurn1 = { isActive: true, round: 1, currentTurnIndex: 1, turnOrder: turnOrder2 };
    act(() => {
      applyRoomSnapshot({
        scope: 'section',
        sections: {
          combat: {
            ...baseTurn1,
            effectLifecycle: {
              ...combat0.effectLifecycle,
              sequence: 1,
              positionKey: positionKey(baseTurn1)
            }
          }
        }
      });
    });

    expect(within(section).getByText('Turn boundary 1')).toBeInTheDocument();
    expect(within(section).getByText('1 of 2 target-turn start remaining')).toBeInTheDocument();
    expect(within(section).getByText('Final expiry: this next occurrence (boundary 3)')).toBeInTheDocument();

    // 2. Roster join + schedule re-anchoring (period changes from 2 to 3, dueSequence re-anchored to 4)
    const allyToken = {
      id: allyRef.tokenId,
      mapId: MAP_ID,
      name: 'Stone Golem',
      state: { actorContract: { ...allyRef, version: 1, revision: 1 }, conditions: [] }
    };
    const turnOrder3 = [...turnOrder2, { tokenId: allyRef.tokenId, name: 'Stone Golem', isCharacterToken: false, initiative: 10, actorRef: allyRef }];
    const baseRoster3 = { isActive: true, round: 1, currentTurnIndex: 1, turnOrder: turnOrder3 };
    act(() => {
      useCreatureStore.setState(s => ({ creatureTokens: [...s.creatureTokens, allyToken] }));
      applyRoomSnapshot({
        scope: 'section',
        sections: {
          combat: {
            ...baseRoster3,
            effectLifecycle: {
              version: 1,
              id: COMBAT_ID,
              sequence: 1,
              positionKey: positionKey(baseRoster3),
              schedules: {
                [instanceKey(wolfRef, attrRecord.recordId)]: {
                  combatId: COMBAT_ID,
                  ref: wolfRef,
                  recordId: attrRecord.recordId,
                  recordKey: canonical(attrRecord),
                  dueSequence: 4,
                  firstSequence: 4,
                  firstOccurrence: 2,
                  occurrences: 2,
                  period: 3,
                  boundary: 'start'
                }
              }
            }
          }
        }
      });
    });

    expect(within(section).getByText('Next occurrence: target turn start (boundary 4)')).toBeInTheDocument();
    expect(within(section).getByText('Final expiry: this next occurrence (boundary 4)')).toBeInTheDocument();

    // 3. Effect removal / expiry
    act(() => {
      useCreatureStore.setState(s => ({
        creatureTokens: s.creatureTokens.map(t => (t.id === wolfRef.tokenId ? { ...t, state: { ...t.state, conditions: [] } } : t))
      }));
    });
    expect(within(section).getByText('No active tracked effects or cooldowns.')).toBeInTheDocument();
  });

  test('does not expose private GM metadata or hidden GM tokens to non-GM players', () => {
    const secretRecord = {
      id: 'secret-1',
      name: 'GM Secret Curse',
      sharedTiming: 'manual',
      gmNote: 'SECRET_GM_NOTE_DO_NOT_LEAK',
      privateNotes: 'PRIVATE_GM_ONLY',
      evidence: 'HIDDEN_EVIDENCE'
    };

    setupStores({
      isGMMode: false,
      wolfHidden: true,
      pcConditions: [secretRecord],
      wolfConditions: [{ id: 'hidden-cond', name: 'Ambush Ready', sharedTiming: 'manual' }]
    });

    render(<CombatTimeline />);

    const section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).getByText('GM Secret Curse')).toBeInTheDocument();
    expect(section.textContent).not.toContain('SECRET_GM_NOTE_DO_NOT_LEAK');
    expect(section.textContent).not.toContain('PRIVATE_GM_ONLY');
    expect(section.textContent).not.toContain('HIDDEN_EVIDENCE');
    expect(section.textContent).not.toContain('Ambush Ready');
  });

  test('hides due ticks for hidden or stripped tokens from non-GM players while GM still sees them', () => {
    const turnOrder = [
      { tokenId: pcRef.tokenId, name: 'Lyra', isCharacterToken: true, initiative: 18, actorRef: pcRef },
      { tokenId: wolfRef.tokenId, name: 'Dire Wolf', isCharacterToken: false, initiative: 12, actorRef: wolfRef }
    ];
    const baseCombat = { isActive: true, round: 1, currentTurnIndex: 0, turnOrder };
    const combat = {
      ...baseCombat,
      effectLifecycle: {
        version: 1,
        id: COMBAT_ID,
        sequence: 2,
        positionKey: positionKey(baseCombat),
        schedules: {},
        dueTicks: {
          'tick-hidden': {
            tickId: 'tick-hidden',
            combatId: COMBAT_ID,
            ref: wolfRef,
            recordId: '22222222-2222-4222-8222-222222222222',
            label: 'Hidden Poison',
            occurrence: 1,
            of: 3,
            sequence: 2,
            final: false,
            tick: { kind: 'damage', formula: '1d4', damageType: 'poison' }
          }
        }
      }
    };

    setupStores({ isGMMode: false, combat, wolfHidden: true });
    // Simulate server stripping hidden creature token from player's creatureTokens
    useCreatureStore.setState({ creatureTokens: [] });

    const { unmount } = render(<CombatTimeline />);
    let section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).queryByText('Hidden Poison')).not.toBeInTheDocument();
    unmount();

    setupStores({ isGMMode: true, combat, wolfHidden: true });
    render(<CombatTimeline />);
    section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).getByText('Hidden Poison')).toBeInTheDocument();
  });

  test('renders retired clock ticks and cooldowns honestly and falls back to sharedCombat when combatStore.effectLifecycle is null', () => {
    const turnOrder = [
      { tokenId: pcRef.tokenId, name: 'Lyra', isCharacterToken: true, initiative: 18, actorRef: pcRef },
      { tokenId: wolfRef.tokenId, name: 'Dire Wolf', isCharacterToken: false, initiative: 12, actorRef: wolfRef }
    ];
    const baseCombat = { isActive: true, round: 1, currentTurnIndex: 0, turnOrder };
    const cdKey = cooldownKey(pcRef, DEF_ID);
    const retiredTick = {
      tickId: 'tick-retired-1',
      combatId: 'c0000000-0000-4000-8000-000000000099',
      ref: wolfRef,
      recordId: '22222222-2222-4222-8222-222222222222',
      label: 'Old Burn',
      occurrence: 2,
      of: 3,
      sequence: 4,
      final: false,
      tick: { kind: 'damage', formula: '1d4', damageType: 'fire' }
    };
    const combat = {
      ...baseCombat,
      effectLifecycle: {
        version: 1,
        id: COMBAT_ID,
        sequence: 1,
        positionKey: positionKey(baseCombat),
        schedules: {}
      },
      retiredPeriodicTicks: {
        'tick-retired-1': retiredTick
      }
    };

    setupStores({
      isGMMode: false,
      combat,
      pcCooldowns: {
        [cdKey]: {
          combatId: 'c0000000-0000-4000-8000-000000000099',
          startSequence: 0,
          dueSequence: 4,
          occurrences: 2,
          period: 2,
          commandId: 'cmd-old'
        }
      }
    });

    // Clear combatStore.effectLifecycle to verify sharedCombat fallback works
    useCombatStore.setState({ effectLifecycle: null });

    render(<CombatTimeline />);
    const section = screen.getByRole('region', { name: 'Ongoing effects and cooldowns' });
    expect(within(section).getByText('Turn boundary 1')).toBeInTheDocument();
    expect(within(section).getByText('Old Burn')).toBeInTheDocument();
    expect(within(section).getByText('Timing unavailable — retired clock (GM resolves by hand)')).toBeInTheDocument();
    expect(within(section).getByText('Cooldown: Wasting Brand')).toBeInTheDocument();
    expect(within(section).getByText('Turn clock retired or unavailable; GM manual adjudication required.')).toBeInTheDocument();

    // Disconnect sets clockPhase to unavailable -> live clock no longer promised
    act(() => {
      useSharedConditionStore.setState({ clockPhase: 'unavailable' });
    });
    expect(within(section).getAllByText('Timing unavailable').length).toBeGreaterThanOrEqual(2);
  });
});
