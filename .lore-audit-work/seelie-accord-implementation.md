# Seelie Accord — Implementation Drafts (Direction B: Splintered)

**User direction confirmed:**
- Direction B: Original unified court shattered during Breach into competing factions
- Bri-Yrn = apolitical hermit (authority from age/craft, not political position)
- Revel entry: tighten to reference Seelie by name
- Author new seelie_accord top-level lore.json entry

---

## NEW ENTRY — `seelie_accord` (faction)

```json
"seelie_accord":  {
    "id":  "seelie_accord",
    "term":  "The Seelie Accord",
    "type":  "faction",
    "region":  "frostwood-reach",
    "summary":  "The unified fae court that governed the Frostwood Reach before the Breach. It shattered during the cataclysm into competing factions, each claiming to be the rightful heir to the old Accord — and each preserving a different piece of what the Accord used to mean.",
    "fullEntry":  "Before the fog, before the Breach, the fae of the Frostwood Reach were one people under the Seelie Accord. The Accord was not a throne and not a crown; it was a contract — a set of mutual obligations between the fae-blooded powers that kept the deep ironwood in balance and the moonlit groves in trust. The Pooka guarded the hedgerows under it. The storm-glass weavers kept the high aeries. The mask-carvers set the rites that turned the seasons. And the accord-broker, when one was needed, walked the deepest groves with authority no throne could give. The system held for as long as anyone could remember.\n\nThe Breach broke the contract. When the Wyrd seeped into the ironwood and the Fog Compact fell across the Reach, the obligations that held the fae together stopped binding. The Accord did not die — it shattered, the way a mirror shatters, and each splinter faction took with it a fragment of the old reflection. Now there is no single Seelie court. There are the factions that claim its name.\n\nThe Hedgerow claims the guardianship. The Pooka and their kin keep the old mandate of watching the wild places, and they will tell you, with some authority, that they alone still do what the Accord was for. The Revel Court claims the rites — the seasonal celebrations, the turning songs, the moonlit dancing — except the Wyrd got into their rites long ago, and what they preserve is the shape of the celebration without the joy. The Solitary Ones claim nothing. They are the fae who refused to join any splinter: the hermits, the crones, the ancient craft-brokers who pre-date the Accord and outlasted it. They do not call themselves Seelie. They do not call themselves anything. The Accord they remember is the one nobody else does.\n\nWalk the Frostwood Reach and ask which faction holds the true Seelie heritage, and each will give you a different answer with absolute certainty. The Thalren ledger-wards mark them all as 'fae — political affiliation: contested' and decline to arbitrate. The Florae, who made their own bargain outside the Accord's frame, do not ask.",
    "relatedTerms":  [
                         "pooka",
                         "the_revel",
                         "bri-yrn",
                         "frostwood-reach",
                         "grimmwood",
                         "ironwood_heart",
                         "briaran",
                         "house_viridane",
                         "the_breach",
                         "the_wyrd",
                         "memory_fog_mechanics"
                     ]
}
```

---

## PATCH — `the_revel` (tighten "fae courts" → reference Seelie Accord by name)

**Current fullEntry paragraph 1:**
> Before the fog, before the Breach, the deep ironwood groves rang with the music of the fae courts when the seasons turned. The Revel is what is left of that music when the Wyrd got into it. ...

**New fullEntry paragraph 1:**
> Before the fog, before the Breach, the deep ironwood groves rang with the music of the Seelie Accord when the seasons turned. The Revel is what is left of that music when the Wyrd got into it — the rites of the Accord's celebration, trapped mid-turn and weaponized. The Revel Court is one of the splinters that survived the Breach shattering of the Seelie, and it is the only one that still dances. ...

**Cross-reference:** Add `seelie_accord` to the_revel.relatedTerms.

---

## PATCH — `bri-yrn` (clarify apolitical stance)

**Current bri-yrn.fullEntry already says:** "She is Fair Folk — not Florae, not thorn-blood, not timber-born, but one of the originals who walked the paths before the Wyrd seeped in."

**Append one clarifying paragraph (or insert in paragraph 2):**
> "She never sat in the Seelie Accord. The Solitary Ones — the hermits and craft-brokers who pre-date the courts and outlast them — answer to no faction. Bri-Yrn's authority comes from her age and her craft, not from any claim of Seelie heritage. The Hedgerow Pooka will tell you she is one of them in spirit; she will not confirm it. The Revel Court calls her a traitor to the celebration; she does not dignify that with a response. The Thalren ledger-wards list her as 'fae — political affiliation: none' which, for once, is correct."

**Cross-reference:** Add `seelie_accord` to bri-yrn.relatedTerms.

---

## Pooka — light touch (no entry revision needed)

The Pooka entry already establishes them as "guardians of the hedgerows" pre-Wyrd. The new Seelie Accord entry references them as the Hedgerow faction. No prose change needed to Pooka; optionally add `seelie_accord` to its relatedTerms.

---

## CANON_REFERENCE.md updates

Add a new line under §8.1 or §14 ratifying:
- ✓ **DONE — Seelie Accord direction locked 25 Jul 2026.** Direction B (Splintered): unified pre-Breach court shattered during the Breach into competing factions. Three named splinters: (1) The Hedgerow (Pooka-led, guardianship claim); (2) The Revel Court (Wyrd-corrupted rites); (3) The Solitary Ones (hermits like Bri-Yrn, claim nothing). Bri-Yrn confirmed apolitical. New `seelie_accord` lore.json entry added. `the_revel` and `bri-yrn` entries updated.

---

## Voice/style notes

- Seelie Accord entry: ~370 words (longer than gref's 120 but justified — it's a major faction with three sub-factions to introduce). Three-paragraph structure: past / shattering / present.
- Tone matches the world's melancholic post-Breach voice ("The system held for as long as anyone could remember" / "what they preserve is the shape of the celebration without the joy").
- Punch line: "the Thalren ledger-wards mark them all as 'fae — political affiliation: contested' and decline to arbitrate"
- Bri-Yrn's apolitical clarification lands a small joke at the Thalrens' expense ("which, for once, is correct")
- The Revel revision connects the existing entry more tightly to the new faction lore (the Revel Court is named as one of the splinters)

## Decision points

1. **The Solitary Ones as a named sub-faction** — does the draft naming work? Or should the third group just be "unaffiliated fae" without a capitalized name? (Naming them gives story hooks; leaving them unnamed preserves Bri-Yrn's solitude more strongly.)
2. **Length of Seelie Accord entry** — 370 words is longer than other faction entries. Trim or keep?
3. **Pooka touch** — add `seelie_accord` to pooka's relatedTerms, or leave the cross-reference one-directional?
