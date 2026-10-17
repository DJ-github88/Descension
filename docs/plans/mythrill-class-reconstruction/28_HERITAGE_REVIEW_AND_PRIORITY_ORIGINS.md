# All-25 heritage review and proposed priority origins

**Naming update — DESIGN INTENT:** Druid is the creator-approved player-facing transformation name. Only the name is approved; the four proposed native pairings and anatomical mechanics below remain under HeadQ review. No conventional Druid/nature-worship/companion/heritage package is imported, and Shaper IDs/compatibility stay intact pending explicit migration approval.

**HeadQ review milestone:** the bounded cultural/access investigation is complete across all25 current heritage records and all102 native pairings. This means current origins, effective access, raw variants, typed advantages/costs and reachable consumers have been examined for this design decision. It does **not** mean every stale world-lore sentence has been canonically repaired or every historical vocation has received a full class dossier.

## Completed research cohorts

- [CR0-H1: five human cultures](heritage/CR0-H1-humans.md).
- [CR0-H2: four stellar/industrial heritages](heritage/CR0-H2-stellar-industrial.md).
- [CR0-H3: six grove/body heritages](heritage/CR0-H3-body-and-grove.md).
- [CR0-H4: five threshold heritages](heritage/CR0-H4-threshold.md).
- [CR0-H5: five fire/water heritages](heritage/CR0-H5-fire-and-water.md).

Each report has an exact pairing table with a bounded advantage, genuine paired limitation, condition, original class-source location and effective native list. Full reviewed records, raw/effective restrictions, native variant fields, free authored heritage cards, acquisition requirements, institutions and source hashes: [headq-heritage-reviewed.json](evidence/headq-heritage-reviewed.json). First human contract output: [heritage-human-audit.json](evidence/heritage-human-audit.json). The earlier extracts/census remain intact.

## Authority and execution conclusions

**CONFIRMED access:** registry rows and wrapped class index own normal access; raw allowedSubraces/hardBlocks do not independently veto it. All102 native pairings resolve normal-tradition in the reviewed baseline. This path presumes training: the function returns acquisition requirements but does not independently prove that a native completed an apprenticeship. Non-native access requires recorded verified/source/every requirement; it is not a blanket race prohibition. A class-specific method and current body incompatibility can still reject access.

**AUTHORED culture/history:** a Bedel vocation named Inscriptor or Witch Doctor, an old Skald Animist practice, a Nereid “Oracle”, or a raw subrace restriction is valuable evidence, not automatic current native class registration. Historical self-return, spirit communion and commanding dead actors are different facts.

**AUTHORED edge ≠ executed benefit/cost:** `heritageEdgeContract` stores conditions and paired costs; the adapter returns bounded modifier/capability bundles; `heritageCapabilityConsumers` returns routing metadata. Current live sheet `handleCastSpell:1296–1315` posts an advisory notice. It does not apply these named benefits, resource-loss/self-damage costs or obligations. `applySpellEffects` is an isolated helper; current call search finds test invocations, not a production executor. Free class-racial cards are granted through `getClassRacialTraits`/`raceDisciplineSpellUtils`, but a granted card is still not proof of passive execution.

**Additional inspected seam:** the adapter rechecks qualification for non-native edges only. The source probe [native incompatible example](evidence/headq-heritage-access-probe.json) returns `incompatible-state` from access for an Arch Shaper with fixed-body/no-interface, while the native edge adapter can still return applies=true when the heirloom context is supplied. That currently produces at most an advisory notice; any future effect executor must call full access/method/body validation for **both** native and rare routes.

## Complete culture-to-priority decision matrix

All assignments in the third column are **PROPOSED**, not source changes or creator approval. All other priority classes use a genuine rare acquisition route if compatible; “not recommended native” is not “hard blocked”.

| Stable ID / current display | Current native classes retiring | Recommended priority natives | Specific reason / important exclusion |
|---|---|---|---|
| thalren_human — Tallyn | none | none | Journal/countermeasure institutions do not by themselves grant destiny or transformation |
| skald_human — Skald | none | Hunter | Existing preserved-ice forensic hunt; glacier burial alone is not lich training |
| tessen_human — Tessic | Revenant | Lichborne | Maintained finite keystone and dynastic preservation; no whole-keep immortality |
| merryn_human — Merryn | Gambit, Revenant | Gambler | Actual maritime wager/House tradition; mortuary ink is not dead-command doctrine |
| ordan_human — Ordu | none | Hunter | Actual steppe scent/vibration pursuit; public herders, not all secret noble mages |
| vashir_astril — Lumian | none | none | Charts/finite stellar witness are real, but generic magic is insufficient for new natives |
| silath_astril — Kordak | none | none | Trained echo/breach contacts can qualify individually; no automatic chaos inheritance |
| kethrin_fexric — Brasskin | none | none | Certified machinery is not an anatomical shaping interface or anomaly initiation |
| drall_fexric — Alchemite | Gambit | Gambler, Chaos Weaver | House wager and variance-containment schools are distinct acquisitions/institutions |
| viridian_florae — Briaren | none | none | Thorn/pact biology does not establish a transformation school; Viridane ≠ Unwritten |
| florae_unified — Oaken | none | none | Timber adaptation possible through actual co-sculpting qualification, not automatic ancestry |
| morgh_groven — Morgh | Shaper | Druid | Torin/Shaping Hall: deliberate reclamation of vat-derived mineral interface |
| ithran_groven — Amordjin | Shaper | Druid | Trained reach/motion and load-bearing body adaptation; load guarantees are not fate sight |
| veiled_mimir — Arch | Shaper | Hunter, Druid | Archive-stabilized tracking and body forms have independent evidence; mask not life support |
| tethered_mimir — Broken | Shaper | Hunter, Druid | Actual sentinel tracking and voluntary plasticity with self/Mote anchors; unmasked |
| velun_neth — Nethien | Revenant | Deathcaller, Lichborne | Filed dead-pattern command and Vesper self-anchor frost rite are different disciplines |
| kessen_neth — Weft | Gambit, Revenant | Fate Weaver | Actual visible obligation web, not automatic House credit or undead mastery |
| drun_neth — Riven | Revenant | none | Severed signature does not establish undeath/eternal life or a trained anchor school |
| clean_vreken — Bedel | Revenant | Deathcaller | Named ancestral lights, crypt instruction, Kora covenant and actual preserved witnesses |
| marked_vreken — Cromyx | none | Hunter | Connected-substrate moving quarry; the proposed Druid route still requires a qualified interface/regrowth path |
| korr_solari — Korr | none | none | Vault-Breath informs independent Monk investigation, not compulsory body transformation |
| thrask_solari — Anhur | none | Hunter | Ash-Stalker thermal traces/companions; baseline flesh not a lava form |
| deepling_myrathil — Nereid | none | Hunter | Explicit current-shear/trench hunt and supported companion care; drowned memory not command |
| shoreling_myrathil — Corali | Revenant | none | Tidal return/mediation do not alone establish Rime lichdom, Fate Weaver or House initiation |
| riverling_myrathil — Ondine | none | none | Exploration/retractable webbing not a full hunting or anatomical school |

## Positive acquisition records proposed for the seven

| Candidate | Power source | Requirement IDs (proposed, not current registry) | Interface incompatibility |
|---|---|---|---|
| Gambler | Native probability-credit through actual wagers | `house_wager`, `initiation_survival`, `wager_discipline`, `finite_deck_training` | Current channel severed until a real reacquisition; no race stereotype |
| Fate Weaver | Actual perceivable obligation/consequence bonds | `bond_interface`, `thread_apprenticeship`, `consent_and_severance_training` | Missing/severed bond interface; knowingly false pact assertion remains incompatible with that method |
| Chaos Weaver | Bounded real anomaly/variance coupling | `anomaly_encounter`, `containment_training`, `stabilizing_interface` | Failed/broken stabilizer; not any Wyrd damage tag |
| Deathcaller | Real finite dead-pattern/remains/witness anchors | `mortuary_apprenticeship`, `named_dead_anchor`, `command_release_training` | Unavailable/invalid anchor; no imagined or arbitrary living-creature copy |
| Lichborne | Actual self-threshold transformation and finite anchor | `threshold_transition`, `finite_soul_anchor`, `cold_hearth_training` | Destroyed anchor, incompatible unresolved preservation covenant; not all preserved bodies are undead |
| Hunter | Learned field pursuit or actual Quiet Trade | Field: `field_apprenticeship`, `tracking_training`; Quiet adds `sensory_trade`, `sensory_training`; Beastmaster adds `bonded_companion`, `companion_training` | Actual mode/interface failure; missing companion disables companion actions only |
| Druid (name approved; provenance proposed) | Native plasticity/mineral reclamation or qualified co-sculpting | `shaping_interface`, `transformation_training`, `self_reference_training` | `fixed_body_without_shaping_interface`; reference loss removes only its edge, not every class action |

These records describe what makes acquisition real. Current normal-tradition resolver does not verify each step; a future registry/editor must carry evidence without changing existing legacy calling behavior. A heritage transition must preserve old classAcquisition maps and actual sensory sacrifices.

## Institution/origin recommendations

- **Gambler:** preserve Merrowport House/Merr-Cael's wagering discipline and Jax/Jix transmission; cosmic Mael-Zhul is distinct from the mortal school. Weft legacy House members remain compatible or qualified, not erased.
- **Fate Weaver:** propose a Weft Thread Court at Under-Ledger/Atropolis with Ironjaw contacts. Lyra is a historical modern transmitter and radical antagonist, not silently appointed the normal class's current leader. A rotating court steward is a proposed role, not a newly canonical NPC.
- **Chaos Weaver:** propose an Alchemite Variance Circle around the Roulette Manifold/Sump workshops. Jix is evidence of cross-school contact, not proof she already founded this exact class. Do not make Keth the universal origin of all probability.
- **Deathcaller:** propose a mortuary command fellowship within the existing Twice-Born coalition, taught by Bedel crypt keepers and Nethien filed-witness practitioners. Kora is dead/preserved voice; Kor-Vasseth may coordinate the coalition, not automatically own every dead entity.
- **Lichborne:** propose a distinct Cold Hearth discipline in that coalition, based on Vesper's finite frost-stasis and Tessic node practice. Use registry's female Vesper in frost-stasis; raw he/his and limitless keep text are discrepancies, not new canon.
- **Hunter:** preserve Sylas, living deaf Broken Mimir, and Silent Hunt's Quiet route. Add explicitly taught field methods from verified seven hunting cultures. The class name does not restore a sacrificed sense or require every field Hunter to buy a companion.
- **Druid:** proposed institutional continuity preserves living Veyra/Form-Convergence, Torin's reclamation and Shaping Hall at Frostmaw; Arch/Broken and Morgh/Amordjin remain materially distinct. The creator approved the name only, not these origins or a conventional Druid religion/companion package. Earlier Metamorph/Shapeshifter naming proposals are superseded.

Location/NPC dictionary existence was checked for referenced LoreLink IDs, with results in [reference audit](evidence/headq-lore-reference-audit.json). Existence is not proof of full semantic consistency: for example an Ordu label linked to `skald` is still wrong. Deep sites can have broader region headquarters IDs; no new precise map coordinates are invented.

## Remaining original-assignment cultural work

Full final native variant prose/quotations for every later candidate, historical-vocation restoration beyond the seven, canon remediation and actual heritage advantage/cost executors remain future work. Current review includes all25 records to justify this priority origin decision; it does not populate all175 possible priority pairings or silently approve any.
