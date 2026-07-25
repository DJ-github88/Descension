# Florae Schism — DRAFT ENTRIES (for review before merge)

Decisions respected:
- D5 (7 houses hard canon): both subraces descend from House Viridane; no "8th house" as narrator fact.
- D6 (Bri-Yrn / "The Grimm-Mother" name locked).
- v4 Monolith myth (6 true + 1 false shard + 1 true seventh fragment in moonlit groves, cleansing key in Briaran thorn-blood).
- "subrace" introduced as a new type value (parallel to existing `subfolk`, `subculture` one-offs).
- All em-dashes written as literal `\u2014` in the JSON to avoid the mojibake artifact seen elsewhere in lore.json.

---

## NEW ENTRY 1 — `viridian` (subrace)

```json
"viridian":  {
                  "id":  "viridian",
                  "term":  "Viridian",
                  "type":  "subrace",
                  "region":  "frostwood-reach",
                  "summary":  "The thorn-blooded subrace of the Florae, whose forearms bristle with the living barbs of the old fae-contract and who reject the Fog Compact as surrender.",
                  "fullEntry":  "When the contract came for House Viridane, it took two prices, and the bloodline split around them. The Viridian paid the first price in thorns. Their forearms bristle with living barbs \u2014 the physical mark of the old fae-contract, grown out of the skin in the deep ironwood groves where the bargain was struck. They are the Trueborn, the ones who kept the refusal in their flesh. The Thorn-Speaker is the voice they elected to speak for them, and every word that one says is a thorn.\n\nThe Viridian reject the Fog Compact entirely. Where House Thalreth traded the Reach\u0027s clarity for insulating mist, the Viridian believe the fog itself is the enemy, slowly erasing everything that made the forest sacred. They tend the moonlit groves where House Viridane\u0027s uncorrupted Monolith fragment was hidden, and the cleansing key the scholars speak of runs in their thorn-blood, waiting for the day Sol must be washed of Keth-Amar\u0027s taint. They carry the Unwritten Word, a truth-sense that hears a spoken lie the way a foot feels a false step.\n\nWalk the deep groves with thorns on your arms and the Viridian will recognize you. Walk them without, and the fog will reach you before they do.",
                  "relatedTerms":  [
                                       "briaran",
                                       "bramble_heath",
                                       "greythorn_copse",
                                       "grimmwood",
                                       "house_viridane",
                                       "house_thalreth",
                                       "ironwood_heart",
                                       "oken",
                                       "thorn-speaker",
                                       "bri-vessela",
                                       "bri-yrn",
                                       "house_morrath"
                                  ]
              }
```

---

## NEW ENTRY 2 — `oken` (subrace)

```json
"oken":  {
              "id":  "oken",
              "term":  "Oken",
              "type":  "subrace",
              "region":  "frostwood-reach",
              "summary":  "The treanty subrace of the Florae, whose crude branch-arms of oak, birch, and willow carry the second price of the fae-contract: a body woven into living timber.",
              "fullEntry":  "When the contract came for House Viridane, the Oken paid the second price. Where the Viridian grew thorns, the Oken grew wood. Their arms are crude, natural tree boughs \u2014 oak, birch, willow, pine, or mountain rowan \u2014 that split into flexible twig-fingers sprouting fresh green leaf-buds when hydrated. Sap runs in their veins where the Viridian carry barbs. They are the tree-born, the charming and resilient treant-kin whose coarse-barked faces and amber eyes still carry the warm heartwood core of a house the world tried to erase.\n\nThe Oken did not refuse the Fog Compact \u2014 they endure it. Where the Viridian retreated into the deep groves to keep the refusal alive, the Oken moved through the Ledgered towns, pruning themselves neat and walking under high-collared coats with the unstitched Viridane crest patch at the breast. A Shorn Oken can pass in Drunhold or Greymark Keep long enough to trade; a Wild Oken stays in the canopy villages where the Sapling-Sprouts are planted in mossy soil and sung into shape by elders with copper water-flasks at their belts.\n\nBring fresh water to an Oken and they will share what they have. Bring a lie, and they will hear it \u2014 the truth-sense runs in both bloodlines, thorn and timber alike \u2014 but they are slower to anger than their thorned kin, and more likely to forgive the fog for falling.",
              "relatedTerms":  [
                                   "briaran",
                                   "drunhold",
                                   "frostwood-reach",
                                   "grimmwood",
                                   "greythorn_copse",
                                   "house_viridane",
                                   "ironwood_heart",
                                   "viridian",
                                   "bri-yrn"
                              ]
          }
```

---

## NEW ENTRY 3 — `bri-yrn` (character)

```json
"bri-yrn":  {
                 "id":  "bri-yrn",
                 "term":  "Bri-Yrn, the Grimm-Mother",
                 "type":  "character",
                 "role":  "Fair Folk hermit and keeper of the Florae\u0027s founding contract",
                 "region":  "frostwood-reach",
                 "summary":  "A shunned Fair Folk hermit dwelling deep in Grimmwood, called the Grimm-Mother by those who will not speak her true name. She brokered the fae-contract that transformed House Viridane into the Florae.",
                 "fullEntry":  "Bri-Yrn is older than the Florae and older than the fog, and she lives where the Grimmwood is densest, in a stand of ironwood that the woodcutters of Drunhold will not mark and the Trueborn Florae will not enter. She is Fair Folk \u2014 not Florae, not thorn-blood, not timber-born, but one of the originals who walked the paths before the Wyrd seeped in. The locals call her the Grimm-Mother because they will not say Bri-Yrn aloud; they believe the name, spoken, is a summons.\n\nShe is the broker of the contract that split House Viridane. When the seventh house fled south through the Frostwood Reach while the sacrifice fires still burned for the other houses, it was Bri-Yrn who reached them in the moonlit groves with an offer that did not end in their children\u0027s blood on northern stone. The price was paid two ways: in thorns for the Viridian, in timber for the Oken. Both bloodlines flow from her word, and neither bloodline will thank her for it. The Viridian shun her for what the thorns cost. The Oken shun her for what the timber replaced. The Thalren ledger-wards mark the Grimmwood\u0027s edge and go no further.\n\nShe practices the old fae craft the woodcutters call witch-doctoring \u2014 the binding, the mending, and the hexwork that predates the runic academies and the Scribe-Cartel\u0027s ink. Those who fall out of the Ledgered world, the desperate, the dispossessed, and the dying, sometimes find their way to her stand of ironwood. What they pay for her help is not always coin. Walk into the Grimmwood looking for Bri-Yrn and you will find her, or you will find the Grimmstalks first; the wood does not care which, and neither, in the end, does she.",
                 "relatedTerms":  [
                                      "briaran",
                                      "viridian",
                                      "oken",
                                      "grimmwood",
                                      "house_viridane",
                                      "frostwood-reach",
                                      "thorn-speaker",
                                      "bri-vessela"
                                 ]
             }
```

---

## PATCH 1 — `briaran` (add subrace references; minimal touch)

**Insert two new relatedTerms:** `viridian`, `oken`, `bri-yrn`.

**Append one sentence to fullEntry** (after "...the way a foot feels a false step."):

> "Two subraces carry the contract\u0027s price in different flesh: the thorn-blooded Viridian, who keep the refusal in their forearms, and the timber-born Oken, whose crude branch-arms grew from the same bargain. The fae who brokered the pact \u2014 Bri-Yrn, called the Grimm-Mother \u2014 still dwells in the Grimmwood, shunned by both."

---

## PATCH 2 — `thorn-speaker` (clarify the Viridian link)

**Update summary** to: "The elected voice of the Viridian \u2014 the thorn-blooded Trueborn of the Florae \u2014 whose forearms bristle with living barbs. They reject the Fog Compact as surrender, and every word they speak is a thorn."

**Replace the phrase** "voice of the Trueborn Florae" → "voice of the Viridian, the Trueborn Florae".

**Add `viridian` to relatedTerms.**

---

## PATCH 3 — `grimmwood` (reference Bri-Yrn)

**Append to fullEntry** (after "...they do not care about your ledger or your name."):

> "Deep in the Grimmwood\u0027s oldest stand dwells Bri-Yrn, called the Grimm-Mother \u2014 the Fair Folk hermit who brokered the contract that split House Viridane into thorn and timber. The Florae claim the Grimmwood as rootland but will not walk where she walks; the Thalren ledger-wards mark the edge and go no further. The woodcutters of Drunhold say her name aloud only as a warning."

**Add `bri-yrn` to relatedTerms.**

---

## NOTES / QUESTIONS FOR REVIEW

1. **Voice consistency:** I matched the world's second-person declarative register (cf. thorn-speaker, grimmwood, gref). Happy to soften or sharpen.
2. **Origin story for the schism:** I framed it as "the contract took two prices, and the bloodline split around them" — Viridian paid in thorns, Oken paid in timber. This reconciles the existing race file (treanty) with the existing lore.json (thorny) cleanly. If you prefer a different origin (geographic split, ideological split, or a later schism post-transformation), I can rewrite.
3. **Bri-Yrn's moral alignment:** I wrote her as morally ambiguous — feared, not malevolent, but costly ("what they pay for her help is not always coin"). The "witch-doctor" framing fits. Can shift to outright menacing or more sympathetic if you prefer.
4. **"Bri-" prefix semantic:** I implicitly treated Bri-Yrn, Bri-Vessela, and Briaran as sharing a fae-contract semantic root (Bri-Vessela's role as Lunar Communion regent + Briaran race name + Bri-Yrn the broker). If you'd rather not tie Bri-Vessela to the witch-doctor, I can drop that implication.
5. **Type field:** I used `subrace` as a new type. Alternative: use `race` (matching how mimir/myrathil handle subdivisions). I recommend `subrace` for clarity but defer to your preference.
6. **Patches are minimal-touch.** I am NOT rewriting the existing briaran/thorn-speaker/grimmwood fullEntries wholesale — only targeted insertions to wire up the schism. This keeps blast radius small.
