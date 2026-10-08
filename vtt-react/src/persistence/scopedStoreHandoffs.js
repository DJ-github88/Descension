/**
 * Project 5 Wave B — central handoff registration for scoped persisted stores.
 *
 * The migrated stores persist through `scopedStoreStorage`. This module binds
 * each store to the account handoff lifecycle (flush → reset → rehydrate) so
 * A's private working state is retired before B can see it and B's records are
 * hydrated only after destination activation.
 */

import { registerScopedStoreHandoff } from './scopedStoreStorage';
import { registerHandoffParticipant } from './handoff/accountHandoffCoordinator';
import { resolveActiveScope } from './scopedConsumer';
import { resetCharacterScopedStorageState } from './characterScopedStorage';

import useBookStore from '../store/bookStore';
import useInteractiveMapStore from '../store/interactiveMapStore';
import useFamilyTreeStore from '../store/familyTreeStore';
import useCustomLineageStore from '../store/customLineageStore';
import useFactionStore from '../store/factionStore';
import useTimelineStore from '../store/timelineStore';
import useQuestStore from '../store/questStore';
import useWorldStore from '../store/worldStore';
import useDeityStore from '../store/deityStore';
import useLanguageStore from '../store/languageStore';
import useInventoryStore from '../store/inventoryStore';
import useCharacterTokenStore from '../store/characterTokenStore';
import useConditionStore from '../store/conditionStore';
import useCraftingStore from '../store/craftingStore';
import useCustomSummonStore from '../store/customSummonStore';
import useDiceStore from '../store/diceStore';
import useEffectPresetStore from '../store/effectPresetStore';
import useSpellStore from '../store/spellStore';
import useShareableStore from '../store/shareableStore';
import useCharacterStore from '../store/characterStore';
import useMapStore from '../store/mapStore';
import useChatStore from '../store/chatStore';
import useItemStore from '../store/itemStore';
import useSpellbookStore from '../store/spellbookStore';
import useTagRegistryStore from '../store/tagRegistryStore';
import usePartyStore, { reloadPartyHudPositionsFromScope } from '../store/partyStore';
import useWindowManagerStore, { reloadWindowPositionsFromScope } from '../store/windowManagerStore';
import { resetGeometryToPublicSeeds, hydrateGeometryForActiveOwner } from '../data/geometryScopeHydration';
import { flushGeometryWrites } from './mapGeometryScopedStorage';

let registered = false;

export const SCOPED_STORE_HANDOFFS = Object.freeze([
  ['worldbuilding.books', useBookStore, 'books'],
  ['worldbuilding.interactiveMaps', useInteractiveMapStore, 'interactiveMaps'],
  ['worldbuilding.familyTrees', useFamilyTreeStore, 'familyTrees'],
  ['worldbuilding.lineages', useCustomLineageStore, 'lineages'],
  ['worldbuilding.factions', useFactionStore, 'factions'],
  ['worldbuilding.timelines', useTimelineStore, 'timelines'],
  ['worldbuilding.quests', useQuestStore, 'quests'],
  ['worldbuilding.worlds', useWorldStore, 'worlds'],
  ['worldbuilding.deities', useDeityStore, 'deities'],
  ['worldbuilding.languages', useLanguageStore, 'languages'],
  ['core.inventory', useInventoryStore, 'inventory'],
  ['core.characterTokens', useCharacterTokenStore, 'characterTokens'],
  ['core.conditions', useConditionStore, 'conditions'],
  ['character.crafting', useCraftingStore, 'crafting'],
  ['library.summons', useCustomSummonStore, 'summons'],
  ['dice.history', useDiceStore, 'dice'],
  ['library.effectPresets', useEffectPresetStore, 'effectPresets'],
  ['library.spells', useSpellStore, 'spells'],
  ['journal.shareable', useShareableStore, 'journal'],
  ['core.mapWorking', useMapStore, 'mapWorking'],
  ['core.chat', useChatStore, 'chat'],
  ['library.items', useItemStore, 'items'],
  ['library.spellbook', useSpellbookStore, 'spellbook'],
  ['campaign.tagRegistry', useTagRegistryStore, 'tagRegistry']
]);

export function registerAllScopedStoreHandoffs() {
  if (registered) return;
  registered = true;
  for (const [familyId, store, label] of SCOPED_STORE_HANDOFFS) {
    try {
      registerScopedStoreHandoff({ familyId, store, label });
    } catch (error) {
      // A registration failure must not break startup; the store keeps its
      // scoped persistence and Wave-A reset of known projections still runs.
      console.warn(`[P5] scoped store handoff registration failed for ${familyId}:`, error?.message || error);
    }
  }
  registerCharacterHandoff();
  registerClosureHandoffs();
}

/**
 * Wave B closure: in-memory private hints whose backing records are scoped
 * (party HUD positions, window positions) must be retired on handoff and
 * rehydrated only for the destination owner.
 */
function registerClosureHandoffs() {
  try {
    registerHandoffParticipant({
      id: 'scoped-native:uiPositionHints',
      stopNewWork: async () => {
        const results = await flushGeometryWrites();
        const failed = results.find(result => !['OK', 'FORKED'].includes(result.status));
        return failed ? { ok: false, reason: `geometry-preservation-${failed.status}` } : { ok: true };
      },
      resetProjection: () => {
        try {
          usePartyStore.setState({ memberPositions: {} });
          useWindowManagerStore.setState({ positions: {} });
          // B7: retire authored map geometry before B activates.
          resetGeometryToPublicSeeds();
        } catch (_error) {
          // best-effort; backing records remain owner-scoped
        }
        return { ok: true };
      },
      activate: () => {
        try {
          if (resolveActiveScope()) {
            reloadPartyHudPositionsFromScope();
            reloadWindowPositionsFromScope();
            // B7: rebuild the destination owner's authored geometry.
            hydrateGeometryForActiveOwner();
          }
        } catch (_error) {
          // hydrate failures are non-fatal; positions/geometry default to empty/seed
        }
        return { ok: true };
      }
    });
  } catch (error) {
    console.warn('[P5] closure handoff registration failed:', error?.message || error);
  }
}

/**
 * The character store is a plain (non-persist) store with manual scoped
 * persistence. On handoff it must retire A's roster/active projection before
 * B activates, then reload B's scoped roster.
 */
export function registerCharacterHandoff() {
  const initialCharacterState = useCharacterStore.getState();
  try {
    registerHandoffParticipant({
      id: 'scoped-store:characterStore',
      stopNewWork: () => ({ ok: true }),
      resetProjection: () => {
        try {
          useCharacterStore.setState(initialCharacterState, true);
        } catch (_error) {
          // best-effort reset; rehydration loads only the destination owner
        }
        resetCharacterScopedStorageState();
        return { ok: true };
      },
      activate: async () => {
        if (!resolveActiveScope()) return { ok: true };
        try {
          await useCharacterStore.getState().loadCharacters();
          return { ok: true };
        } catch (error) {
          return { ok: false, reason: `character-rehydrate-failed:${error?.message || 'error'}` };
        }
      }
    });
  } catch (error) {
    console.warn('[P5] character handoff registration failed:', error?.message || error);
  }
}
