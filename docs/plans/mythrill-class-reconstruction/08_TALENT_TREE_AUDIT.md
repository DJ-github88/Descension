# Talent-tree audit — current registration

> **AUTHORED** census of the working tree on 2026-10-17T17:58:33.651Z. Source hashes: [current-census.json](evidence/current-census.json). Counts do not establish execution.

## Registered trees

| Class | Tree ID | Nodes | Total max ranks | Invalid local prerequisite refs |
| --- | --- | --- | --- | --- |
| Arcanoneer | prism_mage | 18 | 50 | [] |
| Arcanoneer | entropy_weaver | 19 | 50 | [] |
| Arcanoneer | sphere_architect | 20 | 50 | [] |
| Berserker | savage | 18 | 50 | [] |
| Berserker | juggernaut | 18 | 50 | [] |
| Berserker | warlord | 18 | 50 | [] |
| Shaper | flow-master | 19 | 50 | [] |
| Shaper | iron-dancer | 19 | 50 | [] |
| Shaper | primal-shadow | 19 | 50 | [] |
| Harbinger | wild_prophet | 19 | 50 | [] |
| Harbinger | deaths_seer | 19 | 50 | [] |
| Harbinger | fate_rift | 19 | 50 | [] |
| Chronarch | stasis | 19 | 50 | [] |
| Chronarch | displacement | 19 | 50 | [] |
| Chronarch | rewinding | 19 | 50 | [] |
| Inquisitor | witch_hammer | 19 | 50 | [] |
| Inquisitor | iron_verdict | 19 | 50 | [] |
| Inquisitor | hollow_saint | 19 | 50 | [] |
| Revenant | sanguine_harvest | 19 | 50 | [] |
| Revenant | frost_sovereign | 19 | 50 | [] |
| Revenant | phylactery_anchor | 19 | 50 | [] |
| False Prophet | silence_speaker | 19 | 50 | [] |
| False Prophet | deceiver | 19 | 50 | [] |
| False Prophet | cultist | 19 | 50 | [] |
| Gambit | probability_savant | 18 | 50 | [] |
| Gambit | high_roller | 18 | 50 | [] |
| Gambit | karmic_weaver | 18 | 50 | [] |
| Apex | shadowblade | 19 | 50 | [] |
| Apex | bladestorm | 19 | 50 | [] |
| Apex | beastmaster | 19 | 50 | [] |
| Animist | thornwarden | 19 | 50 | [] |
| Animist | spirit_binder | 19 | 50 | [] |
| Animist | stormscribe | 19 | 50 | [] |
| Lunarch | hollow-sentinel | 18 | 50 | [] |
| Lunarch | silence-speaker | 18 | 50 | [] |
| Lunarch | sanguine-warden | 18 | 50 | [] |
| Martyr | redemption | 18 | 50 | [] |
| Martyr | zealot | 18 | 50 | [] |
| Martyr | ascetic | 18 | 50 | [] |
| Martyr | ironclad | 19 | 50 | [] |
| Minstrel | soulsinger | 19 | 50 | [] |
| Minstrel | battlechoir | 19 | 50 | [] |
| Minstrel | dissonance | 19 | 50 | [] |
| Plaguebringer | virulent_spreader | 19 | 50 | [] |
| Plaguebringer | torment_weaver | 19 | 50 | [] |
| Plaguebringer | decay_harbinger | 19 | 50 | [] |
| Pyrofiend | inferno | 18 | 50 | [] |
| Pyrofiend | wildfire | 18 | 50 | [] |
| Pyrofiend | apostate | 18 | 50 | [] |
| Spellguard | arcane_warden | 20 | 50 | [] |
| Spellguard | spell_breaker | 19 | 50 | [] |
| Spellguard | mana_reaver | 19 | 50 | [] |
| Toxicologist | venomancer | 18 | 50 | [] |
| Toxicologist | gadgeteer | 18 | 50 | [] |
| Toxicologist | saboteur | 18 | 50 | [] |
| Warden | shadowblade | 20 | 50 | [] |
| Warden | jailer | 19 | 50 | [] |
| Warden | vengeance-seeker | 19 | 50 | [] |
| Warden | monolith | 19 | 50 | [] |
| Augur | auspex | 19 | 50 | [] |
| Augur | harbinger | 19 | 50 | [] |
| Augur | hierophant | 19 | 50 | [] |
| Crusader | solar_justiciar | 19 | 50 | [] |
| Crusader | dawn_bastion | 19 | 50 | [] |
| Crusader | harmonic_inquisitor | 19 | 50 | [] |

## Authority and limitations

Registration is data/talentTreeData.js:305–413, with getTalentsForSpec at :416–425 and a Coming Soon fallback at :428–447. Martyr and Warden have four trees; all others have three. The imported node definitions are retained in current-census.json trees[].nodes, including spell configuration. Total rank capacity does not prove a valid 50-point path, affordable prerequisites or applied passives.

Berserker and Lunarch export legacy-named aliases; inspect object identity before calling them six distinct trees. The census found only the placeholder export as an unwired independent array in the current talentTrees modules.

## Displacement review queue

| Current home | Candidate new home | Preserve | Required review |
| --- | --- | --- | --- |
| Gambit High Roller | Gambler | Wager and high-stakes interactions | Rebuild around real declared stakes and outcomes |
| Gambit Karmic Weaver | Fate Weaver / Chaos Weaver | Fate links and consequence redirection | Separate deterministic links from uncertainty; no automatic split by name |
| Gambit Probability Savant | Chaos Weaver / Gambler | Distribution/risk choice | Per-node ownership map required |
| Revenant Frost Sovereign | Lichborne | Rime personal mastery | Avoid Death-Toll recolor |
| Revenant Phylactery Anchor | Lichborne | Finite anchor survival | No free or unlimited resurrection |
| Revenant Sanguine Harvest | Deathcaller or archived/rebuilt | Any genuine dead-entity command | Do not force HP-predator mechanics into summoning |
| Inquisitor Witch Hammer | Covenbane candidate | Cold-iron countermeasure craft | Preserve Inquisitor compatibility allocations |
| Martyr Ironclad | Dreadnaught candidate | Furnace/armor method and Skald path | Fourth tree remains until approved transfer |
| Apex Shadowblade / Bladestorm | Hunter stalker / glaive paths | Mobility, glaives and pursuit | Companion-independent core required |
| Shaper Iron Dancer | Transformation or Bladedancer review | Motion/form mechanics with exact IDs | Martial discipline alone cannot define transformation |
| Animist Stormscribe / Spirit Binder | Inscriptor / Animist review | Substrate and spirit-anchor interactions | Do not move every Storm spell to Inscriptor |
| Augur Harbinger | Rename tree, not class merge by label | Negative-omen path | Proposed name: Ill Omen; preserve legacy spec ID alias |
| Warden Iron Jailer | Warden, pending investigation | Territorial confinement | Not automatically a Dreadnaught merely because armored |

All placements are **PROPOSED**. Per-node behavior, overlap, advancement/capstone and three-turn specialization demonstrations remain incomplete.
