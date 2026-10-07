import { ARCANONEER_DATA } from "./arcanoneerData";
import { BERSERKER_DATA } from "./berserkerData";
import { SHAPER_DATA } from "./shaperData";
import { HARBINGER_DATA } from "./harbingerData";
import { CHRONARCH_DATA } from "./chronarchData";
// 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
import { REVENANT_DATA } from "./revenantData";
// 'Dreadnaught' removed (absorbed into Martyr as Ironclad specialization)
// 'Covenbane' and 'Exorcist' merged into Inquisitor as Phase 1.9 consolidation
import { INQUISITOR_DATA } from "./inquisitorData";
import { FALSE_PROPHET_DATA } from "./falseProphetData";
import { GAMBIT_DATA } from "./gambitData";
import { APEX_DATA } from "./apexData";
import { LUNARCH_DATA } from "./lunarchData";
import { MARTYR_DATA } from "./martyrData";
import { MINSTREL_DATA } from "./minstrelData";
import { PLAGUEBRINGER_DATA } from "./plaguebringerData";
import { ANIMIST_DATA } from "./animistData";
import { PYROFIEND_DATA } from "./pyrofiendData";
import { SPELLGUARD_DATA } from "./spellguardData";

import { TOXICOLOGIST_DATA } from "./toxicologistData";
import { WARDEN_DATA } from "./wardenData";
import { AUGUR_DATA } from "./augurData";
import { CRUSADER_DATA } from "./crusaderData";
import { withClassHeritageMetadata } from '../classHeritageRegistry';

const createNereidClass = (baseData) => {
  const baseSlug = (baseData.name || '').toLowerCase().replace(/\s+/g, '_');
  return {
    ...baseData,
    // `name` stays the base class name so resource-system, illustration, and
    // origin lookups keep resolving; `variantName` carries the full identity.
    variantName: `Nereid Myrathil ${baseData.name}`,
    imageIcon: `/assets/icons/classes/${baseSlug}.png`,
    restrictions: {
      allowedSubraces: ["deepling_myrathil"],
      hardBlocks: [],
      narrativeUnlock: false,
      justification: "Nereid Myrathil cultural variant."
    },
    subraceVariants: baseData.subraceVariants?.deepling_myrathil
      ? { deepling_myrathil: baseData.subraceVariants.deepling_myrathil }
      : undefined,
  };
};

export const DEEPLING_MYRATHIL_APEX_DATA = createNereidClass(APEX_DATA);
export const DEEPLING_MYRATHIL_ANIMIST_DATA = createNereidClass(ANIMIST_DATA);
export const DEEPLING_MYRATHIL_AUGUR_DATA = createNereidClass(AUGUR_DATA);

const CLASS_TEMPLATES = {
  Arcanoneer: ARCANONEER_DATA,
  Berserker: BERSERKER_DATA,
  Shaper: SHAPER_DATA,
  Harbinger: HARBINGER_DATA,
  Chronarch: CHRONARCH_DATA,
  Inquisitor: INQUISITOR_DATA,
  Revenant: REVENANT_DATA,
  "False Prophet": FALSE_PROPHET_DATA,
  Gambit: GAMBIT_DATA,
  Apex: APEX_DATA,
  Animist: ANIMIST_DATA,
  Lunarch: LUNARCH_DATA,
  Martyr: MARTYR_DATA,
  Minstrel: MINSTREL_DATA,
  Plaguebringer: PLAGUEBRINGER_DATA,
  Pyrofiend: PYROFIEND_DATA,
  Spellguard: SPELLGUARD_DATA,
  Toxicologist: TOXICOLOGIST_DATA,
  Warden: WARDEN_DATA,
  Augur: AUGUR_DATA,
  Crusader: CRUSADER_DATA,
  "Nereid Myrathil Apex": DEEPLING_MYRATHIL_APEX_DATA,
  "Nereid Myrathil Animist": DEEPLING_MYRATHIL_ANIMIST_DATA,
  "Nereid Myrathil Augur": DEEPLING_MYRATHIL_AUGUR_DATA,
};

export const ALL_CLASSES_DATA = Object.fromEntries(
  Object.entries(CLASS_TEMPLATES).map(([name, data]) => [name, withClassHeritageMetadata(name, data)])
);

export const BASE_CLASSES_DATA = Object.fromEntries(
  Object.entries(ALL_CLASSES_DATA).filter(([, data]) => !data.isCompatibilityAlias)
);
