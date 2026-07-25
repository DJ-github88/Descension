# COSMOLOGY & COSMIC ENTITIES — LORE CAPTURE & AUDIT

**Category:** Cosmology, Cosmic Entities, Meta-Mechanics
**Source of truth:** `D:\VTT\.lore-audit-work\CANON_REFERENCE.md` (distilled from `docs/CORE_LORE_FRAMEWORK.md`)
**Data file audited:** `D:\VTT\vtt-react\public\data\lore.json` (4666 lines, 273 entries)
**Cross-checks:** `D:\VTT\public\data\lore.json` (byte-identical to vtt-react copy — MD5 `C57D02CE61AAD33716565DBED1B7CF28` for both; **NO divergence**), `docs/GM_WORLD_GUIDE.md`, `LORE_STYLE_GUIDE.md`, prior `docs/LORE_CONSISTENCY_AUDIT_v3_FINDINGS.md`

---

## A. COMPLETE LORE PICTURE (every entity/concept, structured)

### A.1 — THE SIX PRINCIPAL COSMIC ENTITIES (+ Dead Moon)

| # | Key in lore.json | Display term | Type | Region | One-line identity |
|---|---|---|---|---|---|
| 1 | `the_warden` | **Aethil** | entity | sundale | "Universe's mechanism of consequence" — every bargain has a price; the price simply IS |
| 2 | `keth_amar` | **Keth-Amar** | entity | sundale | Cosmic star-predator; pressed against the Partial Seal, leeching through cracks |
| 3 | `sol` | **Sol** | entity | sundale | Dying star in forced torpor beneath Sundale; cannot rebirth/die/scream |
| 4 | `aex` | **Aex** | entity | sundale | Sol's firstborn; willingly flayed at the Binding, hide woven into the seal; now "lynched," silent, listening |
| 5 | `the_watcher` + `watcher_in_the_mist` + `keeper_of_the_last_threshold` + `morvane` | **The Watcher in the Mist / Morvane / Keeper of the Last Threshold** | entity / entity / concept / concept | frostwood-reach + bryngloom-forest | Boundary between life/death, memory/oblivion; world's conscience; fracturing under Keth-Amar's pressure |
| 6 | `scathrach` | **Scathrach, the Ashen Sovereign** | entity | sundale | Fragment of Aex's hide fallen DURING the Binding; corrupted, grew sentient, REJECTED Keth-Amar, now its enemy |
| 7 | `dead_moon` | **The Dead Moon (Vael)** | entity | frostwood-reach | A dormant star; largest fragment fell in Frostwood; lunar parasites hatched from it |
| — | `the_wyrd` + `wyrd` | **The Wyrd** | entity + concept | sundale | Keth-Amar's corruption bleeding through seal-cracks; 4-tier hierarchy |

### A.2 — TIMELINE / META-EVENTS

| Key | Display | Type | Position | Core claim |
|---|---|---|---|---|
| `the_deepening` | The Deepening | event | Pre-Year 3 | Sol's vulnerability cycle that Keth-Amar exploited; Augurs now know pulses = Aex screaming (40%→0% across 65 pulses), NOT Sol rekindling |
| `the_corruption_years` | The Corruption Years | event | Years 3–11 | Keth-Amar whispered to each house for 8 yrs, offered Sol's warmth deceptively |
| `the_breach` | The Breach | event | Year 11 | 6 of 7 heirs consumed as vessel-keys; Viridane fled; seal cracked but did not shatter; Emberspire erupted; Wyrd bled through; seal split into 7 Monoliths (6 true + 1 false) |
| `the_partial_seal` | The Partial Seal | concept | Year 11 → present (~Year 800) | Seal neither whole nor broken; Keth-Amar presses against it; 6 houses erased Viridane to prevent Keth-Amar tracking them via memory |
| `sundered_monoliths` | Sundered Monoliths | concept | Year 11 → present | 7 fragments of Aex's body (Fog-Hand, Ice-Crown, Wind-Bone, Depth-Breath, Grass-Spine, Still-Heart) + False Monolith (Viridane); now waking |
| `memory_fog_mechanics` | Memory Fog Mechanics | concept | Ongoing | Frostwood fog eats memory on two schedules; Moss-Wax trade mitigates |

### A.3 — FAITH SCHISM (Sundale)

| Key | Display | Type | Faction identity |
|---|---|---|---|
| `dawn_vigil` | Dawn Vigil | faction | Fanatic militarized theocracy under Hierophant Aethelgard; hunts Monolith shards |
| `the_risen` | The Risen | faction | Old Emberth faith (Korr); patience/vigil; hide Shards |
| `the_sunderers` | The Sunderer | faction | Heretics; believe Solbrand is Keth-Amar's feeding line; want to extinguish it |
| `the_scoured` | The Scoured | faction | Cut their forge-marks; hunt Shards to seal Breach permanently / let Sol die gently |
| `cult_of_forgotten_shadow` | Cult of Forgotten Shadow | faction | "Shadow-state of Vreken exiles and heretical animists based in Over-Shanty" (per its own entry); "merger of bog-cult + Dawn Vigil defectors" (per keth_amar entry) |

### A.4 — REGIONAL / FACTION LEADERS (cosmology-adjacent)

| Key | Display | Type | Role |
|---|---|---|---|
| `grum` | Grum Bloodhammer | historical_figure | Berserker founder; Sundale forge-blacksmith who ignited Blood-Heat |
| `sera` | Sera Solvan | historical_figure | Martyr founder; carved child's name into her flesh |
| `scathrach` | (see A.1) | entity | Pyrofiend patron |
| `mimir` | Mimir | race | Made by Sereth; mask-wearers |
| `rite-of-masks` | Rite of Masks | cultural_practice | Mimir mask-anchoring ritual |
| `emberspire` | Emberspire | location | World-heart volcano of Sundale; Sol's tomb |
| `vault_breath` | Vault-Breath | concept | Emberth stillness discipline |
| `solbrand` | Solbrand | resource | Residual Sol warmth radiating through basalt |
| `deep_alchemists` | Deep Alchemists | faction | Fexric research sect; created Groven from Thrumm |
| `vat_breakers_guild` | Vat-Breakers' Guild | faction | Groven self-governance after the revolt |
| `dawn-vigil-commander` | The First Dawn | character | Secret commander of Dawn Vigil |
| `deep-alchemist-prime` | The Prime Alchemist | character | Leader of Deep Alchemists |
| `vat-breaker-foreman` | The First Foreman | character | Leader of Vat-Breakers' Guild |
| `thorn-speaker` | The Thorn-Speaker | character | Voice of Trueborn Briaran |
| `the-first-liar` | The First Liar | character | Leader of the Unlit Veil (Nordhalla) |
| `keeper_of_the_last_threshold` | (see A.1) | concept | Neth-contract facet of Morvane |
| `morvane` | (see A.1) | concept | Neth-daily-name facet of the Watcher |
| `frost_tithe` | Frost-Tithe | concept | Skalvyr Bargain's per-birth death-price |
| `silt_tide` | Silt-Tide | concept | Ordavan-Bargain-induced gravitational anomaly |
| `blood_heat` | Blood-Heat | resource | Berserker rage mechanic |
| `inferno_veil` | Inferno Veil | resource | Pyrofiend corruption mechanic |
| `devotion_gauge` | Devotion Gauge | resource | Martyr suffering-absorption mechanic |
| `the_forgotten` | The Forgotten | concept | Undocumented Frostwood underclass |

### A.5 — RELATIONSHIP MAP (compact)

```
                AETHIL ("The Warden" — non-canon name in lore.json)
                  │  (rule of price; framework all bargains operate within)
                  │
                  ▼
   KETH-AMAR ──pressed against──► PARTIAL SEAL ──woven from──► AEX (flayed hide)
       │                            │                            │
       │ Wyrd leaks through         │ 6 houses erased VIRIDANE   │ 6 true MONOLITHS + 1 FALSE
       ▼                            ▼                            ▼
      WYRD ──────► SCATHRACH     WATCHER/MORVANE/KEEPER      (Aex listens; scream 40%→0%, 65 pulses)
   (4-tier              ▲         (ONE entity — but lore.json   │
   hierarchy)           │          splits into 3+ entries)      │
       │                │                  │                     │
       │                └── hid the        │ boundary:           │
       │                   FALSE MONOLITH   │ life/death,         │
       │                                    │ memory/oblivion     │
       ▼                                    │                     ▼
   Cult of Forgotten                   VIRIDANE ──► BRIARAN   DEAD MOON ("Vael" — non-canon)
   Shadow (3 different                  (erased)              ▲
   origin stories in lore.json)                              │
                                                  lore.json theorizes
                                                  Watcher = Dead Moon's dreaming mind
                                                  (CANON EXPLICITLY FORBIDS THIS LINK)
```

---

## B. INCONSISTENCY MAP

> Severity key: **CRITICAL** = directly contradicts CANON_REFERENCE / CORE_LORE_FRAMEWORK, or internal contradiction that breaks the world model. **MAJOR** = significant drift, misleading, or missing canonical distinction. **MINOR** = wording, spelling, style, or unattested embellishment.

### B.1 — CRITICAL

| ID | Location | CANON says | lore.json says | Notes |
|---|---|---|---|---|
| **COS-C1** | `lore.json:4440` (`watcher_in_the_mist` fullEntry) | CANON_REFERENCE §1 (Dead Moon): "Keth-Amar NESTED in the corpse-star (perch to study Sol), not laid by it / NOT connected." CANON §1 (Watcher): "Older than Keth-Amar's interest." The Watcher and the Dead Moon are **distinct** entities. | "some Briaran theologians believe it is the **dreaming consciousness of the dead moon**, whose shattered fragments became the lunar parasites; others believe it is the collective voice of the fae court" — and `dead_moon` (L4456) lists `watcher_in_the_mist` as a relatedTerm, reinforcing the link. | **This is exactly the conflation CANON forbids.** The Dead Moon is a dormant star; the Watcher is the life/death boundary. Linking them collapses the cosmology. The `dead_moon` ↔ `watcher_in_the_mist` cross-link must be severed. |
| **COS-C2** | `lore.json:1839` (`memory_fog_mechanics`) vs `lore.json:768` (`the_watcher`) vs CANON §4 | CANON §4 (Houses table): "Thalreth \| Frostwood \| Clarity \| Insulating fog \| Memory erasure" — i.e. the fog is the price of Thalreth's **Dark Bargain with KETH-AMAR**. CORE_FRAMEWORK §1.5: "The fog is **not the Warden's doing**. The fog is the Warden's grief. Or it's the Watcher's protection. Or it's just what happens when a star's warmth fails. **Scholars disagree.**" | `memory_fog_mechanics`: "House Thalreth claims the fog as the price of their bargain **with Aethil**" (misattributes to Warden; CANON says the bargain was with Keth-Amar). `the_watcher`: "The fog that eats memory is **both the Watcher's protection and the first symptom of its collapse**." | Three-way contradiction: (1) CANON = Keth-Amar bargain; (2) lore.json Thalreth = Warden/Aethil bargain; (3) lore.json Watcher = Watcher's protection/collapse. Plus "Aethil" itself is non-canonical (see COS-M1). |
| **COS-C3** | `lore.json:4655` (`cult_of_forgotten_shadow`) vs `lore.json:728` (`keth_amar`) vs CANON §7 | CANON §7: "Cult of Forgotten Shadow (if exists) = **a Vigil splinter that went too far**, openly **worshipping Keth-Amar as inevitable**." | `cult_of_forgotten_shadow` entry: "**shadow-state of Vreken exiles, coven-mages, and heretical animists** based at Over-Shanty... rejects the Neth-Vreken Reincarnation Bargain... argues the deep silence is not a disease but the natural return to a primordial, starless dark." `keth_amar` entry (L728): "**organized merger between the Over-Shanty bog-cult and disillusioned Dawn Vigil defectors** who learned that Monolith reassembly summons Keth-Amar." | **Triple inconsistency.** (a) Canon = Sundale Vigil splinter, Keth-Amar-worshipping; (b) cult entry = Bryngloom Vreken-exile nihilist/animist faction that rejects ancestor-veneration (NOT Keth-Amar worshippers); (c) keth_amar entry = merger of bog-cult + Vigil defectors. The cult entry also doesn't mention Monolith reassembly at all, while the keth_amar entry makes it central. The cult entry's founding year "Year 412 of the Dimming" also has no canonical basis. |
| **COS-C4** | `lore.json:2097` and `lore.json:2098` (`dawn_vigil` summary + fullEntry) | CANON §7 (Dawn Vigil): "Public doctrine: reassemble Monoliths to restart Sol. **Truth: reassembling SUMMONS Keth-Amar; leadership KNOWS and believes they can bind Keth-Amar as Aex was bound.**" | `dawn_vigil` summary: "publicly to relight Sol, **privately to keep anyone from summoning Keth-Amar back**." fullEntry: "Reassembling the Monoliths will not bring Sol back. It will summon Keth-Amar... **They keep marching anyway, because if they do not assemble the fragments first, someone else will.**" | **Motivation is REVERSED.** Canon = leadership WANTS to assemble (knowing it summons Keth-Amar, because they believe they can bind it). Lore.json = leadership marches to PREVENT others from assembling (defensive). These are opposite characterizations of the same faction. |
| **COS-C5** | `lore.json:706` (`the_warden` fullEntry) | CANON §1.1: "**Keth-Amar operates WITHIN the Warden's framework. Every Dark Bargain was legal under the Warden's system. Keth-Amar has never broken a bargain.**" CANON §13: "All magic flows from the Warden's bargain-framework + consequences of Binding/Breach. Noble house contracts... = bargains under the framework." | "The Dark Bargains, the capitulation to Keth-Amar and the sacrifice of the firstborn heirs, **were struck with Keth-Amar directly. Aethil had no part in them.** Confusion arises because both entities deal in exchange, but they are not the same." | Directly contradicts "Every Dark Bargain was legal under the Warden's system." Lore.json severs the Dark Bargains from the Warden's framework, which undermines CANON's core thesis that all magic/debt flows through one grammar. |
| **COS-C6** | `lore.json:2043-2060` (`keeper_of_the_last_threshold`) and `lore.json:2061-2078` (`morvane`) | CANON §1: "**The Watcher in the Mist / The Morvane (the Keeper) — ONE entity perceived differently.**" Perception-by-culture: Frostwood = the Watcher; Bryngloom = the Keeper. | Both entries treat "Morvane / Keeper" narrowly as **just a Neth-contract enforcer / death-boundary guardian**. Neither entry references `the_watcher`, the Frostwood fae facet, the broader cosmic role (world's conscience, fracturing under Keth-Amar, hid the false Monolith, etc.). The `morvane` entry says only "Morvane is the name the Neth use in daily speech for the entity formally called the Keeper of the Last Threshold" — linking the two Neth-side names but NOT linking to `the_watcher`. | This is exactly the "treating them as separate without the perception-by-culture explanation" the audit scope flagged. Only `the_watcher` (L762-778) carries the unification correctly. The other two facets present a narrow, de-cosmologized Neth-contract-deity. |

### B.2 — MAJOR

| ID | Location | CANON says | lore.json says | Notes |
|---|---|---|---|---|
| **COS-M1** | All `the_warden` references (16 occurrences); canonical sources have **zero** "Aethil" | CANON_REFERENCE, CORE_LORE_FRAMEWORK, GM_WORLD_GUIDE all use **"The Warden"** exclusively for this entity. | The cosmic entity `the_warden` has display term **"Aethil"** and uses "Aethil" 16× across entries (the_warden, aex, keth_amar, the_deepening, etc.). "The Warden" appears **0×** as the entity's name. The name "Warden" is reserved for the **class** (`warden` entry, Alaric's tradition). | **Non-canonical rename.** "Aethil" appears nowhere in CANON_REFERENCE, CORE_LORE_FRAMEWORK, GM_WORLD_GUIDE, or LORE_STYLE_GUIDE. The class/entity disambiguation is reasonable in principle but the chosen name is invented. Either canon must adopt "Aethil" or lore.json must revert to "The Warden" with disambiguation via context (e.g., "the Warden entity" vs "the Warden class"). |
| **COS-M2** | `lore.json:4479-4493` (`the_sunderers`); also `the_risen` L4475 cross-reference | CANON §7: "Faith Schism (Embers of Sol → **3 factions**): Dawn Vigil / The Risen (Korr faithful) / The Scoured." No "Sunderer" faction. | lore.json contains a fourth faction, `the_sunderers` (term: "The Sunderer"), 7 occurrences. Their agenda overlaps with Scoured (both want Sol dead) but Sunderer specifically wants to extinguish the **Solbrand** as Keth-Amar's "feeding line." `the_risen` entry explicitly distinguishes Sunderer from Scoured. | GM_WORLD_GUIDE L504 also lists Sunderer as one of three Emberth factions (Risen / Sunderer / Scoured), so this faction exists in non-CANON sources. CANON_REFERENCE's "3 factions" list (Dawn Vigil + Risen + Scoured) does not include Sunderer. **Either CANON must be amended to include Sunderer, or Sunderer must be folded into Scoured.** |
| **COS-M3** | `lore.json:1990-2008` (`root_veil`) vs `GM_WORLD_GUIDE:410` | GM_WORLD_GUIDE L410: "An entity called the **Morvane (distinct from the Root-Veil the Vreken commune with)** decides what the Gloom preserves." Explicitly distinct. CANON does not mention Root-Veil at all. | `root_veil`: "**Whether the Root-Veil and Morvane are the same entity viewed through different lenses, or two distinct intelligences sharing the same substrate, is a matter of bitter dispute** between the Vreken and the Neth that has never been resolved." | Direct conflict: GM_WORLD_GUIDE asserts they are distinct; lore.json says it's disputed/unresolved. CANON is silent. Needs canonical decision. |
| **COS-M4** | `lore.json:475` (`rite-of-masks`) vs `lore.json:452` (`mimir` summary) vs CANON §8 | CANON §8 (Mimir): mask-bound shapeshifters who wear "**carved heartwood or storm-glass masks**" (two materials). | `rite-of-masks`: masks made of "heartwood, storm-glass, or **black birch**." `mimir` summary: "heartwood, storm-glass, or **pine** masks." | **Two internal inconsistencies** (black birch vs pine vs canon's two materials). Three different material lists across two entries in the same file. |
| **COS-M5** | `lore.json:453` (`mimir` fullEntry) | CANON §8 (Mimir): "Created by Sereth (ancient world-bound deity of creation/perfection); shaped across centuries; **Sereth died of its own contradictions.**" CORE_FRAMEWORK §5: identical, pronoun **"it/its."** | "They were made by Sereth, the dead creator-deity of perfection and form, **whose shame at his imperfect creation drove him to hide his people** from the world itself." Pronoun **"he/his/him."** | Death cause changed ("shame" vs "contradictions"); new motivation added ("hide his people"); pronoun drift (he vs it). All three are non-canonical alterations. |
| **COS-M6** | `lore.json:728` (`keth_amar` fullEntry) vs `lore.json:554` (`astril`) | CANON §8 (Astril): arrived "before Binding." Astril know Keth-Amar devoured their sun Lumia. CANON §6 (Dead Moon): "The oldest Astril songs are laments for a voice they never heard but somehow remember." | `keth_amar`: "Every civilization that named Keth-Amar in writing was destroyed before the word could spread. That is why **it has no name in any living language older than eight centuries**." `astril`: "When **Keth-Amar** devoured Lumia, the Astril's original sun, the survivors brought the echo of their homeworld's life with them across the void." | Astril use the name "Keth-Amar" and pre-date the Binding (>800 yrs). If their songs are pre-Binding and name the predator, the claim "no name older than eight centuries" is internally inconsistent with the Astril entry. Either Astril arrived within the last 800 yrs (contradicts CANON), or they didn't name the predator (contradicts astril entry), or the keth_amar claim is wrong. |
| **COS-M7** | `lore.json:397-412` (`grum`) | CANON §9: "**Berserker (Grum Bloodhammer, Hunger Pact; Nordhalla cold + Sundale heat fused)**." | `grum`: region = **sundale** only; "forge-blacksmith of Emberspire in Sundale"; no mention of Nordhalla, no mention of **Hunger Pact** (the Berserker ancestor-trauma core mechanic). The Berserker's defining fusion (cold+heat) is missing. | Grum's entry deserts the canonical Nordhalla half of the Berserker's origin. The Hunger Pact is the entire Berserker hook (per the v3 audit's note about Hunger Pact being central). Either the lore.json entry is missing the Nordhalla half, or the Berserker is being silently re-anchored to Sundale only — which would contradict CANON §9. |
| **COS-M8** | `lore.json:745-761` (`the_wyrd`) vs `lore.json:4337-4355` (`wyrd`) | CANON §2: Wyrd = a corruption **hierarchy** (Taint/Wisp/Spawn/Channel), "Keth-Amar's agriculture." Not classified as an entity. | `the_wyrd` is type **"entity"** (term "The Wyrd"). `wyrd` is type **"concept"** (term "Wyrd"). Two separate entries with different types and slightly different framings. | Internal classification inconsistency. The Wyrd is not an entity in CANON; it's Keth-Amar's leakage. Classifying it as "entity" is ontologically wrong and creates a duplicate entry problem. The `the_wyrd` entry is the shorter, less canonical one; the `wyrd` entry has the full 4-tier hierarchy. Recommend consolidating into one "concept" entry. |
| **COS-M9** | `lore.json:4434-4447` (`watcher_in_the_mist`) | CANON §1 (Watcher): "**QUIESCENT (rarely acts)**." "It did not outmaneuver Keth-Amar — acted at the **last possible moment** for Viridane, **didn't know if it would work**." "Did NOT choose Viridane" — answered because total imbalance is the one thing it cannot permit. | `watcher_in_the_mist`: "it offered the fleeing family a **counter-bargain**: protection from the Sun-Eater's sight in exchange for a permanent bond to the groves... the Watcher is still there, still patient, and **still offering its bargain to anyone who carries the blood to hear it**." | Reframes the Watcher's act as a **transactional counter-bargain** (CANON says principled boundary-defense). Also implies ongoing bargain-offers to any Viridane-blooded person, contradicting "rarely acts." The transactional framing also conflicts with `the_watcher` (L768) which correctly captures the principled "answered because total imbalance is the one thing it cannot permit." |

### B.3 — MINOR

| ID | Location | Issue |
|---|---|---|
| **COS-m1** | `lore.json:4450` (`dead_moon` term) | Dead Moon display term is "**The Dead Moon (Vael)**" — "Vael" appears nowhere in CANON, CORE_FRAMEWORK, or GM_WORLD_GUIDE. Non-canonical name. |
| **COS-m2** | `lore.json:4448-4462` (`dead_moon`) | Entry omits CANON's claim that "**Keth-Amar NESTED in the corpse-star**" (perch to study Sol). This is a key cosmological detail (explains why Keth-Amar is "around"). Also the phrasing "When it shattered" implies total fragmentation, while CANON implies the corpse-star is still in orbit (Keth-Amar's perch) with only the largest fragment fallen. |
| **COS-m3** | `lore.json:800-818` (`aex`) | CANON's explicit distinction "Consented to the clean Binding... agony started at the BREACH, not the Binding" is **not captured**. Lore.json says "Aex offered itself willingly. This is settled... consented" (good) and separately "perpetual agony" — but never connects the agony to the Breach specifically. The canonical nuance "consented to a cage; did not consent to being eaten through" is missing. Not a contradiction, but a missing canonical distinction the audit specifically asked to verify. |
| **COS-m4** | lore.json global | "**Diming**" (missing one 'm') appears 7× — should be "**Dimming**." Spelling consistency issue. |
| **COS-m5** | `lore.json:4655` (`cult_of_forgotten_shadow`) | "Founded in **Year 412 of the Dimming**" — only exact-year date in lore.json; violates LORE_STYLE_GUIDE Rule 8 (vague time, no date spam). Also the year itself is non-canonical. |
| **COS-m6** | `lore.json:1942` (`emberspire` fullEntry) | "the Dawn Vigil preaches that the magma-chamber connects to the Sundered Monolith fragments... reassembling them would reignite the star inside the caldera. **Whether that would be a rebirth or a second catastrophe, no one alive can say.**" CANON §7: Vigil **leadership KNOWS** reassembly summons Keth-Amar. The emberspire entry softens this to "no one can say," undercutting the canonical secret. |
| **COS-m7** | `lore.json:418` (`sera` summary) | "**Solvarn** mother who carved her sacrificed child's name" — uses adjective "Solvarn" while term is "Sera **Solvan**." House is "House Solvan" per CANON. Mixed Solvan/Solvarn spelling within the same entry. |
| **COS-m8** | `lore.json:805` (`aex` fullEntry) | "had protected the sun through **every Deepening since the first star learned to burn**" — embellishment not in CANON. CANON just says "Sol's firstborn, being of pure stellar radiance." Compatible but unattested. |
| **COS-m9** | `lore.json:4530` (`the_fredlose`) | "Fredløse is **Old Nord** for 'the lawless,'" and `the_deck_born` etc. use "**De Hesteborne**" / "**De Hestelose**" (Old Norse-style). Real-world language analogs; LORE_STYLE_GUIDE §6.5B warns against real-world myth/linguistic references. |
| **COS-m10** | `lore.json:2098` (`dawn_vigil`) | "A monastic order of **Martyrs**, they tracked the scattered Sundered Monoliths in secret" — implies Dawn Vigil was founded by/for Martyrs. CANON §7: "Dawn Vigil broke from Emberth ~300 years later." The Dawn Vigil is an **Emberth schism** (with surface-human converts), not a Martyr order. Martyr is a separate class founded by Sera Solvan. Conflating Vigil's early membership with "Martyrs" specifically is loose. |
| **COS-m11** | `lore.json:805` (`aex` fullEntry) | "No coerced binding could hold the metaphysical weight of a **god**" — calls Aex a "god." LORE_STYLE_GUIDE §6.5B: "Don't use real-world religions or mythologies. No 'gods,' 'heaven,' 'hell'..." Also CANON §1: Aex is "a being of pure stellar radiance," not a god. |
| **COS-m12** | `lore.json:4655` (`cult_of_forgotten_shadow`) and elsewhere | Several entries use real-world-mythology comparisons for the Wyrd (e.g., `the_wyrd` L751 is clean, but GM_WORLD_GUIDE L119 says "Wyrd draws from Germanic and Celtic traditions" and L332 mentions "Yuki-Onna," "Tengu-Crows," "Yokai"). LORE_STYLE_GUIDE Phase 13 flags note some of these were resolved in loreDictionary.js but may persist in lore.json's flavor. |

### B.4 — CROSS-FILE NOTES (not strictly inconsistencies, but flagged for awareness)

| ID | Note |
|---|---|
| **COS-X1** | `D:\VTT\public\data\lore.json` and `D:\VTT\vtt-react\public\data\lore.json` are **byte-identical** (MD5 `C57D02CE61AAD33716565DBED1B7CF28`). No divergence to report. One is a duplicate of the other; recommend canonical-path decision (which one is the source of truth?) to prevent future drift. |
| **COS-X2** | GM_WORLD_GUIDE L410 explicitly asserts "Morvane **(distinct from the Root-Veil the Vreken commune with)**." This contradicts lore.json `root_veil` (says disputed) and creates a three-way question (CANON silent / GM guide says distinct / lore.json says disputed). Needs canonical ruling. See COS-M3. |
| **COS-X3** | `rules.json:128` contains a separate entry `"id": "the-wyrd"` (hyphen, not underscore). Different ID convention than lore.json's `the_wyrd` / `wyrd`. Worth verifying these don't collide in any lookup index. |
| **COS-X4** | CANON §10 (era system) — verified **zero** era-label violations in lore.json (cleaned up since v3 audit A-13/A-14). Good. |
| **COS-X5** | The `the-first-liar` key in the task list ("the_first_liar") is actually `the-first-liar` (hyphenated) in lore.json. It is the Unlit Veil leader (Nordhalla information-freedom faction), not a cosmology entity per se — included for completeness. |
| **COS-X6** | CANON §11 says Dawn Vigil broke from Emberth ~300 yrs after Breach. lore.json `dawn_vigil` doesn't mention the Emberth-origin or the 300-yr gap; it presents the Vigil as quietly existing "for generations after the Dimming." Missing canonical lore, not a contradiction. |

---

## C. SUMMARY METRICS

| Severity | Count |
|---|---|
| CRITICAL | 6 |
| MAJOR | 9 |
| MINOR | 12 |
| Cross-file notes | 6 |

### Top-priority fixes (recommended order)
1. **COS-C1** — Sever the Watcher ↔ Dead Moon link in `watcher_in_the_mist` and `dead_moon` relatedTerms.
2. **COS-C3** — Pick ONE origin story for the Cult of Forgotten Shadow and align all three descriptions (cult entry / keth_amar entry / CANON §7).
3. **COS-C4** — Restore Dawn Vigil's canonical motivation (leadership WANTS to assemble, knowing it summons Keth-Amar; they believe they can bind it).
4. **COS-C2** — Reattribute the Frostwood fog to Thalreth's Dark Bargain with **Keth-Amar** (not Aethil); make the fog's true origin ambiguous only per CORE_FRAMEWORK §1.5.
5. **COS-C5** — Restore the Warden's framework as the envelope that contains all bargains (including the Dark Bargains).
6. **COS-C6** — Either merge `keeper_of_the_last_threshold` + `morvane` + `the_watcher` + `watcher_in_the_mist` into one entry, or add explicit cross-links + the perception-by-culture note to each facet entry.
7. **COS-M1** — Decide: is the entity called "The Warden" (canonical) or "Aethil" (lore.json-only)? Align across all sources.
8. **COS-M2** — Decide: is Sunderer canonical? If yes, amend CANON §7; if no, fold into Scoured.

---

*End of Cosmology & Cosmic Entities audit.*
