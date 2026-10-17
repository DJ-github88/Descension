/**
 * First-table baseline (Project 10; creator decision 1A, 2026-10-15).
 *
 * Owning values for the published Laws (public/data/rules.json) and the combat
 * tracker's default. Heritage AP values stay authored in race data but are set
 * aside for this baseline: every player character uses PC_BASE_ACTION_POINTS.
 * Creatures keep the AP on their stat blocks. Named spells and abilities keep
 * their own authored costs (e.g. Feather Slash 1 AP); there is no blanket cast cost.
 */
export const PC_BASE_ACTION_POINTS = 4;
export const HERITAGE_AP_DIFFERENCES_ACTIVE = false;
export const BASIC_WEAPON_STRIKE_AP = 2;
export const DEFEND_AP = 1;
export const ELIXIR_AP = 0;

/** 'max' refills to maximum each turn (first-table rule); 'set' and 'initiative' are optional table variants. */
export const DEFAULT_AP_RESTORATION_MODE = 'max';

const modeOf = config => config?.apRestorationMode || DEFAULT_AP_RESTORATION_MODE;

/** AP a combatant holds at the start of its turn under the table's restoration mode. */
export function restoredActionPoints(config, maxActionPoints, initiative) {
  const mode = modeOf(config);
  if (mode === 'set') return Math.min(config.apRestorationAmount, maxActionPoints);
  if (mode === 'initiative') {
    if (initiative >= 21) return 4;
    if (initiative >= 16) return 3;
    if (initiative >= 11) return 2;
    if (initiative >= 6) return 1;
    return 0;
  }
  return maxActionPoints;
}

/** Initiative is rolled once per fight; only the optional initiative-AP variant rerolls it each turn. */
export const rerollsInitiativeEachTurn = config => modeOf(config) === 'initiative';
