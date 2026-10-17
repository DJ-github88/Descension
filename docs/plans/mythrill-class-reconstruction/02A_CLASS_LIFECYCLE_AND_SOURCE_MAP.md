# Class lifecycle — source map and authority seams

**CONFIRMED source reachability** unless marked AUTHORED/PROPOSED. Paths below are under `vtt-react/src/` unless prefixed server/docs. Source reading and the six focused suites establish only the stated boundaries.

| Lifecycle stage | Owner / actual consumer | Current behavior and reconstruction implication |
|---|---|---|
| Base definition | `data/classes/*Data.js` | Identity, lore, equipment, pool IDs, specializations, variants and spells. Full raw metadata retained in census |
| Registered class view | `data/classes/index.js:52–85` | 21 base records + three narrow Nereid aliases. Wrapped metadata overrides raw access restrictions |
| Access/provenance | `data/classHeritageRegistry.js:158–220` | Method/body checks, native/adopted qualification; central owner over stale raw class restrictions |
| Creation validation | `utils/characterClassAccess.js`; wizard Step1, Step9 and `CharacterWizardContext.js:474` | Qualification and original-calling distinction; legacy warnings aren't a general incompatibility bypass |
| Race class paths | `data/raceData.js`, `data/races/*.js` | Aggregator derives native paths from registry; race prose can be stale and must not become a second mechanical gate |
| Class change | `store/characterSlices/infoSlice.js:224–264+` | Reinitializes resource on a changed class and assigns class starting spells. Migration must not call this as if it were lossless |
| Resource initialization | `data/classResources.js:850+` | Class config lookup + stats/level factory, then domain normalization. Census includes real level1 initialization at all stats10 separately from metadata normalization |
| Existing character load | `store/characterSlices/coreSlice.js:883,918–925` | Restores acquisition, known spells, talents/spec and normalizes saved resource; factory fallback if absent |
| Level-up choice | `components/modals/LevelUpChoiceModal.jsx:305+,617+` | Prefers current-level spellPools, fallback lower pool/array; selectedSpell is singular. Actual random subset and confirmation need full review |
| Talent allocation | `components/talent-tree/TalentTreeContent.jsx:474–535,602–623` | Budget min(level×5,50), tree/tier/prerequisite checks, first invested tree sets primary specialization |
| Talent spell materialization | same `:478–512` | Stable `talent-spell-${talent.id}` copied to spellbook and library at rank; grant/removal is not proof that passive effects execute |
| Library/card class view | `data/classSpellGenerator.js:38–65,75–164` and wizard normalizer | Separate class map plus class-specific flattening/spec categorization. Must stay synchronized with base registration |
| Sheet cast producer | `components/character-sheet/SpellActionBar.jsx:950+` | Routes weapon strike/P9 supported shared spells first; otherwise local bookkeeping path remains |
| Authoritative spell support | `services/spellConsequence.js:69–73,130–181,258–279` | Resolves original definition, refuses altered copies, strict shape/payer/formula; wizard/custom/talent copies are not automatically admitted |
| Owner/GM workflow | `services/spellConsequenceService.js:48–105,190–207`; server `spellPayments.js` | Exact primary attachment, typed home sync, private approval/roll, GM final, accepted receipt application |
| Local resource mutation | `store/characterSlices/resourceSlice.js:167–253` | Normalizes per-domain writes, autosaves/syncs; rest/reset has class branches, not one universal reset |
| Party view/manual resource control | `components/hud/PartyHUD.jsx:1372+,2490–2592` | Full resource prop to renderer; separate nested direct-set and socket emit path can bypass normalized result |
| SVG dispatch | `components/hud/ClassResourceBar.jsx` | Large visual-type switch delegates current/legacy bars; historic imports/demo local state are not proof of active class support |
| Tooltip | `components/hud/ResourceTooltip.jsx`, per-class bars | Mixed shared/self-owned tooltip paths; legacy concepts remain. New domain presenters must not extend giant prop list indefinitely |
| Personal snapshot | `store/characterHelpers.js:190–215` | Acquisition, talents/spec and full classResource serialized into snapshot |
| Cloud codec | `services/firebase/characterPersistenceService.js:106–245` | Acquisition/body states explicit basicInfo; unmapped fields such as classResource preserved through preservedFields; shape codec remains authoritative |
| Room identity/recovery | `services/actorConsequenceService.js`, server `actorConsequences.js`, P5/P6/P7 codecs | Separate room revision/attachment from personal save. Room authority cannot be replaced with a newer-looking sheet timestamp |
| Player Laws | `public/data/rules.json`, RulesPage/ClassDetailDisplay and generated class data views | Multiple consumers; rule text must distinguish actual execution from authored mechanics |

## Important verified gaps

- A class has at least four distinct registration surfaces: base records, provenance/access, resource configuration and spell/talent display maps. A new data file alone does not complete a class.
- Specialization passives are displayed and talent spells are copied into libraries; this does not prove a general passive modifier engine executes every authored sentence.
- `utils/spellEffects.js` has a heritage hook, but the search for `applySpellEffects(` found test calls only. The live sheet hook posts an advisory notice. Do not cite the unused helper as production combat proof.
- PartyHUD nested writes call updateClassResource, then overwrite full state with a precomputed object (`:2521–2528`), then emit; structured domains need a single typed mutation path. This is an inspected normalization-bypass risk, not a reproduced corruption incident.
- resourceSlice's reset branches must be reviewed against each class's intended rest rules; a menu reset is not evidence of an authoritative shared rest command.

## Remaining lifecycle work

Read every class-specific initializer/turn/rest consumer in full; trace both wizard save/load routes and schema validation; inspect all HUD entry points/menus; reconcile talent passive execution and character-switch isolation; map every Laws/lore consumer; verify real save/reload/room authority with bounded browser/server fixtures. The table is a current map, not a claim that all these paths were functionally exercised.
