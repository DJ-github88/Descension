# Mythrill VTT — Lore Style Guide & Audit Map

## How to Use This Document

This file has everything you need to rewrite Mythrill's lore:

1. **Style Guide (sections 1–5)** — 18 rules derived from Blizzard/Warcraft writing, with before/after examples from the codebase
2. **Lore Consistency Rules (section 6)** — timeline, house relationships, naming, tone-per-region — so rewrites don't contradict each other
3. **Rewrite Todo List (section 7)** — every file that needs rewriting, organized by phase, with checkboxes
4. **Final Checklist (section 8)** — 18-rule checklist + AI word audit for each file you finish

**How to work through it:** Pick a file from Phase 1, open it, rewrite each lore string following the 18 rules. Check the consistency rules before writing (especially the timeline and house relationships). Mark the checkbox. Move to the next file.

**For a new chat:** Copy the prompt in the next section to start fresh with all context loaded.

---

## 1. Core Philosophy

### Two Blizzard texts analyzed. Here's everything we can learn.

**Text 1 — Gnomes of Gnomeregan (World of Warcraft RPG, p. 52):**
> The eccentric, often brilliant gnomes are held as one of the most peculiar races of the world. With their obsession for developing radical new technologies and constructing marvels of mind-bending engineering, it's a wonder that any gnomes have survived to proliferate. Over the years, the gnomes have contributed ingenious weapons to aid the Grand Alliance in its fierce battles against the Horde.
>
> Thriving in the wondrous techno-city of Gnomeregan, the gnomes shared the resources of the forested peaks of Dun Morogh with their dwarven cousins for generations. Yet recently, a barbaric menace rose up from the bowels of the earth and invaded Gnomeregan. The troggs — believed to have been unearthed from the Uldaman excavation — erupted beneath Gnomeregan and began to slaughter every gnome within the city. Though the gnomish defense forces staged a valiant defense, they could not save their wondrous city.
>
> At the command of the High Tinker Mekkatorque, the gnomes opened the pressure valves of their giant, grinding machines and released toxic radiation throughout the city. Though the radiation killed the troggs, the gnomes soon discovered that it killed their own people just as quickly. Nearly eighty percent of the gnomish race died within days. Those that survived evacuated the great city and fled to the protection of their dwarven cousins in Ironforge.
>
> There they remain, devising radical strategies to retake their beloved city at any cost. As a gnome of proud standing, it falls to you to answer the challenge and lead your curious people to a brighter future.

**Text 2 — Night Elves of Ashenvale / Orcs of Durotar (World of Warcraft RPG, pp. 176-180):**
> For ten thousand years, the immortal night elves cultivated a druidic society within the shadowed recesses of Ashenvale Forest. Then the catastrophic invasion of the Burning Legion shattered the tranquility of their ancient civilization. Led by the Arch-Druid Malfurion Stormrage and the Priestess Tyrande Whisperwind, the mighty night elves rose to challenge the demonic onslaught. Aided by the newly arrived orcs and humans, the night elves succeeded in halting the Legion's advance and defeating its master, the demonlord Archimonde. Though victorious, the night elves were forced to sacrifice their cherished immortality and watch their beloved forests burn.
>
> In the aftermath of the horrific conflict, Malfurion and Tyrande helped their people rebuild their shattered villages. Slowly the night elves began to adjust to their mortal existence... When Malfurion heard about this plan, he warned that nature would never bless such a selfish act. Shortly thereafter, Malfurion's spirit was somehow lost within the depths of the Emerald Dream.
>
> With Malfurion missing, Fandral Staghelm — the leader of those who wished to plant the new World Tree — became the new Arch-Druid. In no time at all, he and his fellow druids had forged ahead and planted the great tree, Teldrassil... However, the tree was not consecrated with nature's blessing and soon fell prey to the corruption of the Burning Legion. Now the wildlife and even the limbs of Teldrassil itself are tainted by a growing darkness.
>
> As one of the few night elves still left in the world, it is your sworn duty to defend Darnassus and the wild children of nature against the Legion's encroaching corruption.

> Long ago, the noble orcish race was corrupted by the Burning Legion and transformed into the merciless, destructive Horde... After many years, a visionary young warchief rose to lead his people in their darkest hour. Fittingly enough, the young orc's name was Thrall. Under his rule, the orcs freed themselves from the chains of demonic corruption and embraced their shamanistic heritage.
>
> ...the orcs claimed the harsh wastelands of Durotar as their kingdom in Kalimdor. Now based in the warrior city of Orgrimmar, the orcs look forward to a shining new future for their people. ...It is your duty to crush the enemies of Durotar, both seen and unseen, for the nefarious agents of the Burning Legion still wander the land.

### 18 lessons from these two texts:

**1. Open with time or scale, not definition.** "For ten thousand years..." hits immediately. It tells you the night elves are ancient and important. "The eccentric, often brilliant gnomes are held as one of the most peculiar races" — opens with a *judgment*, not a Wikipedia definition. Mythrill opens with "X is a [adj] [noun]."

**2. Names anchor the story.** Malfurion Stormrage. Tyrande Whisperwind. Fandral Staghelm. Thrall. Orgrim Doomhammer. High Tinker Mekkatorque. The lore is told through *specific people doing specific things*. Mythrill's lore is mostly abstract forces and passive sentences.

**3. Consequence chains.** Every paragraph ends with a consequence that drives the next paragraph. "Though victorious, the night elves were forced to sacrifice their cherished immortality" → "In the aftermath, they rebuilt" → "But some couldn't adjust" → "So they planted Teldrassil" → "But it was corrupted." Every paragraph answers "and then what happened?"

**4. The "now" pivot.** Every entry has a clear "this is where we are now" moment. "Now based in the warrior city of Orgrimmar..." / "Now the wildlife and even the limbs of Teldrassil itself are tainted..." The reader always knows where they stand in time.

**5. Grounded city descriptions.** Not "a beautiful city in a tree." You get: "rows of wood-crafted lodges and delicately tended groves," "elegant bridges spanning its crystalline waters," "falling leaves carpet the soft pathways." Specific, sensory, visual. You can *walk through* this city in your imagination.

**6. Character entries are tight.** Tyrande: 4 sentences. Malfurion: 4 sentences. Fandral: 4 sentences. Each tells you: who they are, what they did, what's happening now. No more.

**7. Different tones for different races.** Night elves = tragic, poetic ("beautiful forests burned," "sacrifice their cherished immortality"). Orcs = brutal, proud ("crush the enemies of Durotar," "stand ready to destroy all who challenge their sovereignty"). The writing style shifts to match the subject. Mythrill currently has one tone (encyclopedia neutral) for everything.

**8. Every entry ends with a player hook.** "As a gnome of proud standing, it falls to you to answer the challenge." / "It is your sworn duty to defend Darnassus." / "It is your duty to crush the enemies of Durotar." The lore exists to make the player *want to play this race*. Mythrill's lore never addresses the player at all.

**9. Setting-specific proper nouns everywhere.** Temple of the Moon. Hall of Justice. Barrow Den. Emerald Dream. Orgrimmar. Durotar. Every name is unique to the setting. No generic fantasy words.

**10. No over-explanation.** "It is your sworn duty to defend Darnassus." That's it. The text trusts the reader to understand what "sworn duty" means. Mythrill's lore explains everything twice.

**11. Vague time, but a clear sense of history.** "For ten thousand years" → "Then" → "In the aftermath" → "Shortly thereafter" → "Now." No exact year numbers anywhere. The reader knows the shape of time without dates.

**12. Active verbs, not passive.** "The troggs erupted beneath Gnomeregan and began to slaughter every gnome." Not "Gnomeregan was invaded by troggs." "The night elves rose to challenge." Not "The demonic onslaught was faced by the night elves."

**13. Short sentences for impact after longer ones.** "Nearly eighty percent of the gnomish race died within days." One short sentence. It hits because the paragraph built up to it. Used sparingly, for maximum effect.

**14. One em dash per entry, used deliberately.** The trogg aside in the gnome text. Fandral's title in the night elf text. One each. Not an AI tic.

**15. The first sentence is the most important.** "For ten thousand years, the immortal night elves cultivated a druidic society within the shadowed recesses of Ashenvale Forest." / "The eccentric, often brilliant gnomes are held as one of the most peculiar races of the world." / "Long ago, the noble orcish race was corrupted by the Burning Legion." Every opener establishes tone, scale, and subject in one breath.

**16. Contractions and natural speech.** "it's a wonder" / "could not" (for emphasis, not always). The writing sounds like someone speaking, not a textbook.

**17. Tragedy + hope in every entry.** Night elves: lost immortality AND rebuilt Darnassus. Gnomes: lost Gnomeregan AND are devising strategies to retake it. Orcs: were corrupted AND freed themselves. Every race has a fall AND a rising. Mythrill's lore often describes the fall without the rising.

**18. Concrete over abstract in every detail.** "Pressure valves of their giant, grinding machines" not "advanced technology." "Shadowed recesses of Ashenvale Forest" not "the forested region." "Warrior city of Orgrimmar" not "the capital city." The adjective + noun pair always does double duty.

> *The eccentric, often brilliant gnomes are held as one of the most peculiar races of the world. With their obsession for developing radical new technologies and constructing marvels of mind-bending engineering, it's a wonder that any gnomes have survived to proliferate. Over the years, the gnomes have contributed ingenious weapons to aid the Grand Alliance in its fierce battles against the Horde.*
>
> *Thriving in the wondrous techno-city of Gnomeregan, the gnomes shared the resources of the forested peaks of Dun Morogh with their dwarven cousins for generations. Yet recently, a barbaric menace rose up from the bowels of the earth and invaded Gnomeregan. The troggs — believed to have been unearthed from the Uldaman excavation — erupted beneath Gnomeregan and began to slaughter every gnome within the city. Though the gnomish defense forces staged a valiant defense, they could not save their wondrous city.*
>
> *At the command of the High Tinker Mekkatorque, the gnomes opened the pressure valves of their giant, grinding machines and released toxic radiation throughout the city. Though the radiation killed the troggs, the gnomes soon discovered that it killed their own people just as quickly. Nearly eighty percent of the gnomish race died within days. Those that survived evacuated the great city and fled to the protection of their dwarven cousins in Ironforge.*
>
> *There they remain, devising radical strategies to retake their beloved city at any cost. As a gnome of proud standing, it falls to you to answer the challenge and lead your curious people to a brighter future.*

### What this text does that Mythrill's lore doesn't:

**1. It's a story, not a wiki entry.** Three paragraphs = a three-act arc: who they were → what happened to them → where they are now. It has rising action, a climax, and a call to action. Mythrill's lore is a data dump. "X is a Y. It is ruled by Z. It was founded in Year A."

**2. Every paragraph has one job.** Paragraph 1: character (eccentric, brilliant, peculiar). Paragraph 2: place + tragedy. Paragraph 3: the terrible choice + its cost. Paragraph 4: present situation + your role. No word is wasted. Every sentence serves the paragraph's one job.

**3. Emotional stakes, not just facts.** "They could not save their wondrous city." "Killed their own people just as quickly." "Nearly eighty percent died within days." "Their beloved city." The lore tells you how to *feel* about the gnomes. Mythrill's lore tells you what's true, but not why you should care.

**4. The player is the protagonist.** "As a gnome of proud standing, it falls to you to answer the challenge." The lore doesn't just describe the world. It tells you why you should want to be part of it. Mythrill's lore describes the world like a textbook. It never says "and this is where you come in."

**5. Vague time, not specific dates.** "Over the years," "for generations," "recently." No "Year 412 of the Dimming." The reader gets the shape of time without the noise of dates.

**6. Concrete over abstract everywhere.** Not "advanced technology" but "giant, grinding machines." Not "a terrible event occurred" but "erupted beneath Gnomeregan and began to slaughter every gnome." You can see it.

**7. Active verbs, no passive constructions.** "erupted beneath," "slaughter," "opened the pressure valves," "released toxic radiation." Not "was invaded by," "was killed by."

**8. The em dash is used once, sparingly.** It sets off "believed to have been unearthed from the Uldaman excavation" — a brief aside that adds context without stopping the story. One em dash in the whole piece. That's the difference between intentional punctuation and AI tic.

**9. Rhythm through short sentences after long ones.** "Nearly eighty percent of the gnomish race died within days." That sentence hits because it's short and it comes after a longer setup. Mythrill's lore is all medium-long sentences with no rhythmic variation.

**10. It uses contractions.** "it's a wonder," "could not" (strategic, for emphasis). Human writing breathes.

---

### The Mythrill rewrite of that same structure:

Applying those 10 lessons to the Mimir, here's what the style guide produces:

> *The Mimir are the mask-wearers of the Frostwood canopy. They have never shown their faces to outsiders. Not because they're hiding something monstrous. Because the fog that saved the Reach from freezing also devours memory over generations, and after eight centuries, even they aren't sure what they originally looked like.*
>
> *They lived high in the ironwood canopy, hidden in the mist-shattered valleys, keeping to themselves. But the fog that protects them also erodes them. It eats their recollections: their ancestors' names, their mothers' faces, the songs of their own language. The masks became the only thing that holds a Mimir together. Every mask is carved from heartwood or storm-glass. Every mask is a relic. The art of making new ones was lost when the inquisitors burned the birthing chambers and killed the last Mask-Mothers.*
>
> *Now the Hunters stalk the Fog-Vales. They pay fortunes for Mimir masks on the black market. The Mask-Borne hide in the canopy-holds. The Mist-Woven watch from the mountain aeries. And the Unwoven — those born without masks — drift the valley floor, carrying cracked heirlooms that no one knows how to repair. The mother-flame still burns in the oldest hold. No birth has occurred there in thirty years.*
>
> *You are one of them. You wear a mask that someone died to preserve. The Hunters are getting closer, the fog is growing thicker, and the time for hiding may be running out.*

Same story arc: who they are → what happened to them → where they are now → your role. Concrete images. Emotional stakes. The player as protagonist. No dates, no formulas, no encyclopedia voice.

---

## 2. The 18 Rules for Mythrill Lore

### Rule 1: Open with time, scale, or judgment — never definition.
The first sentence is the most important sentence. It must establish tone, scale, and subject in one breath.

**Bad:** "The Frostwood Reach is an ironwood forest wreathed in protective, memory-erasing fog."

**Good:** "For eight centuries, the Frostwood Reach has been hidden beneath a fog that eats memories. That's how House Thalreth kept it from freezing."

**Good:** "The eccentric, silver-skinned Neth are bound by a contract older than any kingdom. They cannot lie. They cannot break a promise. They cannot stop writing."

### Rule 2: Write a story, not an entry.
Every lore block should have a narrative arc: Who were they before? → What happened? → Where are they now? → Why should you care?

**Bad:** One dense wall of facts.

**Good:** "For eight centuries, the Neth have kept their side of the First Contract. They write. They record. They renegotiate. The alternative is the silence that waits for anyone who breaks the terms."

### Rule 3: Names anchor the story.
Every paragraph should have at least one proper noun: a person, a place, a thing that exists only in Mythrill. The lore is told through *specific people doing specific things*, not abstract forces.

**Bad:** "The ruling family made a bargain for protection."

**Good:** "Kaelen Thalreth runs the Sovereign Ledger. His father Aldren sits in his chambers re-reading his own journals, trying to remember who he is."

### Rule 4: Consequence chains.
Every paragraph should end with a consequence that leads to the next paragraph. Each paragraph answers "and then what happened?"

> *The troggs erupted beneath Gnomeregan.* → *The gnomes tried to defend.* → *They couldn't.* → *So they released radiation.* → *It killed the troggs.* → *It also killed their own people.* → *Eighty percent died.* → *The survivors fled.* → *Now they plan to retake the city.* → *That's where you come in.*

### Rule 5: The "now" pivot.
Every race, region, and background entry must have a clear "this is where we are now" moment. Not just history. The present. The current situation. What's at stake *right now*.

### Rule 6: One job per paragraph.
Each paragraph moves the reader through one beat of the story. No more. Paragraph 1: character. Paragraph 2: tragedy. Paragraph 3: consequence. Paragraph 4: present + your role.

### Rule 7: End with the player.
The last line of any race, class, or background lore must address the player directly and give them a role.

> "As a gnome of proud standing, it falls to you to answer the challenge and lead your curious people to a brighter future."

> "It is your sworn duty to defend Darnassus and the wild children of nature against the Legion's encroaching corruption."

> "It is your duty to crush the enemies of Durotar, both seen and unseen."

### Rule 8: Vague time. No date spam.

| Don't | Do |
|---|---|
| Year 5 of the Deepening | Before the world froze |
| Year 412 of the Dimming | Generations ago |
| ~Year 795 | Within living memory |
| Year 11 | Just after the Binding |

**Exact years go in the timeline file.** Player-facing lore gets one rough time reference per entry, max. "For eight centuries." "Recently." "Long ago." "In the years since."

### Rule 9: Concrete images. You should be able to see it.

**Bad:** "Constructing marvels of mind-bending engineering" (abstract)

**Good:** "Opened the pressure valves of their giant, grinding machines" (you can see it)

**Bad:** "The fog has memory-erasing properties"

**Good:** "The fog eats your memories if you stay too long"

**Bad:** "Rows of wood-crafted lodges and delicately tended groves" (NOT bad — this is good!)

**Good city description from Blizzard:** "The Temple of the Moon rises like a shining beacon above the trees, flanked by the colonnaded Hall of Justice... built along the shores of a large lake, with elegant bridges spanning its crystalline waters... falling leaves of the forest carpet the soft pathways."

### Rule 10: Sentence rhythm. Short hits hard. Long flows. Mix them.

> *The troggs erupted beneath Gnomeregan and began to slaughter every gnome within the city. Though the gnomish defense forces staged a valiant defense, they could not save their wondrous city.*
>
> *Nearly eighty percent of the gnomish race died within days.*

Short sentence. It lands because everything before it was longer. Use this hammer sparingly.

### Rule 11: Active verbs. Kill "is/are/was/were."

Replace them with concrete actions.

| Passive (AI) | Active (Blizzard) |
|---|---|
| is wreathed in | swallows |
| is governed by | commands / rules |
| was founded in | began when |
| is characterized by | bleeds / hums / chokes |
| was destroyed by | burned |
| was created to serve | was built to hold |
| was ruled by | answered to |
| is considered to be | [delete] |

### Rule 12: Different tones for different subjects.
The writing must shift to match the subject.

- **Neth** — precise, legalistic, clinical ("The judgment was delivered. The terms were binding.")
- **Skald** — brutal, cold, elegiac ("The glaciers do not negotiate.")
- **Mimir** — mysterious, fluid, melancholy ("The mask is not a disguise. It is a cage for a thing that wants out.")
- **Florae** — thorny, defiant, feral ("House Viridane refused. The other six houses erased them from history. The Florae call themselves the ones who refused.")
- **Astril** — luminous, tragic, cosmic ("She carries a dying star inside her chest.")

### Rule 13: One well-placed em dash per entry, max.
The em dash is fine when used deliberately (see the gnome text's trogg aside, the Fandral title aside). It's a tell when it appears 5+ times per entry. Use colons, parentheses, or separate sentences instead.

### Rule 14: Setting-specific proper nouns everywhere.
Temple of the Moon. Hall of Justice. Emerald Dream. Gnomeregan. Orgrimmar. Durotar.

Mythrill equivalents: Sovereign Ledger. Tapestry-Wards. The Keeper of the Last Threshold. The Deepening. The Dimming. The Breach. The Frostwood. Atropolis. Greymark Keep. Every noun should be unique to Mythrill. No generic fantasy.

### Rule 15: No over-explanation.
Trust the reader. "It is your sworn duty to defend Darnassus." That's it. Don't explain why it's a duty or what happens if you don't.

### Rule 16: Tragedy + hope in every entry.
Every race must have both a loss AND a rising. Every race entry should make the reader feel "that's sad, but I want to be part of their recovery."

- Gnomes: lost Gnomeregan AND plan to take it back.
- Night elves: lost immortality AND rebuilt Darnassus.
- Orcs: were corrupted AND freed themselves.

### Rule 17: Character entries are tight.
Max 4-5 sentences. Who they are. What they did. What's happening now. Done.

### Rule 18: Contractions are fine. Use them.
"it's," "couldn't," "they're," "don't." Human writing breathes. AI writing doesn't.

Exception: ancient texts, formal documents, legal contracts within the world — those should avoid contractions for tone.

---

## 3. Full Worked Example — The Neth

Here's a complete race rewrite following all 18 rules, compared to the current text.

### Race Overview (Blizzard-style)

> For eight centuries, the Neth have kept a contract with a forest spirit that other races only pray to or fear. The terms are simple: the Keeper preserves their bodies, and the Neth write down everything the Keeper consumes. Every debt, every promise, every name that fades into the Bryngloom's roots. The Neth do not die. They renegotiate.
>
> Long ago, before the sun was stolen, the Neth were dying. A slow cold had crept into the Gloom and found the children first — fewer were born each decade. They were an ancient canopy-dwelling people, not extraordinary, simply alive, until the silence of empty cradles grew louder than the wind. Their Augurs communed with Morvane through the root-net and received the Font Vessel, to be filled at the hidden Well of Youth. Three factions followed: one to honor the deal, one to steal the Well's power, one to drink it directly. Morvane's judgment split a people into High, Pale, and Hallowed.
>
> They did not pray. They presented their case to Morvane at the moss-covered roots.
>
> *Our children are dying. The forest endures. Teach us what endures, and we will be your living record.*
>
> Morvane had never been reasoned with. Only feared. Only fed. It considered the argument and granted them the Font Vessel for the hidden Well of Youth. What followed was not a blessing but a judgment: three factions, one Well, and a split that marked every bloodline.
>
> The First Contract is still visible in the heart of Atropolis, fossilized in living heartwood like a fly in amber. Every Neth child born since carries the terms in their blood. They cannot lie. They cannot break a promise. They cannot stop writing. The alternative is the silence that waits for anyone who breaches the agreement.
>
> Now the Neth rule the Bryngloom's canopy city of Atropolis, writing contracts for everything: marriages, inheritances, debts, souls. The Drun are those who burned their names from the Contract and became legally nonexistent, living in the Over-Shanty beneath the city. The Velun Neth are the silver-tongued elite who navigate the law like a living language.
>
> You are one of the pact-bound. Your blood is ink. Your breath is a signature. The Keeper is watching, and the Contract endures. What terms will you write?

### What this does right

| Rule | How it's applied |
|---|---|
| 1. Open with scale | "For eight centuries..." sets time immediately |
| 2. Story arc | Dying → walked into the wood → presented the case → made the deal → now |
| 3. Names anchor | The Keeper, Atropolis, the Drun, the Velun Neth |
| 4. Consequence chains | Were dying → walked into the wood → found the Keeper → made the deal → rose with silver skin → now rule Atropolis |
| 5. The "now" pivot | "Now the Neth rule Atropolis..." — clear present moment |
| 6. One job per paragraph | Paragraph 1: the pact. P2: the dying. P3: the walk. P4: the argument. P5: the transformation. P6: the present. P7: the player. |
| 7. End with the player | "You are one of the pact-bound. What terms will you write?" |
| 8. Vague time | "For eight centuries," "Long ago," "Before the sun was stolen" — zero dates |
| 9. Concrete images | "Fossilized in living heartwood like a fly in amber" — you can see it |
| 10. Sentence rhythm | Short: "They did not pray. They presented a case." / "The Keeper had never been reasoned with. Only feared. Only fed." |
| 11. Active verbs | "Walked," "presented," "rose," "rule," "write," "carries," "watching" — no passive |
| 12. Different tones | Precise, legalistic, clinical — the language of contracts |
| 13. One em dash | Zero. Uses colons and periods instead. |
| 14. Proper nouns | Keeper of the Last Threshold, Bryngloom, Atropolis, Drun, Velun Neth, Over-Shanty, the Contract |
| 15. No over-explanation | "The alternative is the silence that waits." — trusts the reader to understand |
| 16. Tragedy + hope | Were dying AND made the deal AND now thrive |
| 17. Character mention | Indirect (the Neth as a people, not individual characters here — this is the overview) |
| 18. Contractions | "it's," "don't" — but the legalistic tone means fewer than usual, which is correct for this race |

---

## 4. Quick Reference: Replacements

| Don't write | Instead write |
|---|---|
| X is a [adj] [noun]... | Start with an image or judgment |
| It is ruled by Y... | Y runs the place. Or: "If you want anything done, you answer to Y." |
| It was founded in year X | Generations ago / In the early days / After the Binding |
| Known as [title] | Just use the title as the name |
| Is characterized by | Bleeds / hums / reeks / echoes with |
| Serves to / Functions as | Guards / separates / marks / powers |
| Due to / Consequently | So / And / But / [nothing] |
| The [adj] [noun] of the [noun] | One concrete noun + one strong verb |
| This is because | Because. Or: "Here's why." |
| In order to | To |
| It is worth noting that | [delete] |
| It should be mentioned that | [delete] |

---

### Bonus Example — Region: The Bryngloom Forest

**Before (current loreDictionary.js):**
> The Bryngloom Forest is a twilight swamp. Since the Neth signed the First Contract with the Keeper of the Last Threshold, the region has been governed by legalistic debt-covenants. It is ruled by Regent Morrath Neth, who enforces the Great Registry. Neth Kessen weavers facilitate memory-extraction for certified debtors. The Vreken are the indigenous population whose ancestral fungal traditions are threatened by Neth expansion. Tensions between the Neth and Vreken have defined Bryngloom politics, flaring into periodic conflict.

**After (Blizzard-style):**
> The Bryngloom is a twilight swamp where the trees glow and the bogs remember what falls into them. The air is thick with spores. The water is thick with debt. This is the domain of the Neth: the silver-skinned pact-lords who wrote a contract with the forest itself and have been collecting interest ever since.
>
> Before the Neth, the Bryngloom belonged to the Vreken. They lived among the fungal groves, reading the mycelium like others read maps, harvesting Ghost-Mycelium from the Hush-Bogs, and honoring the Root-Veil as a sacred ancestor. Then the Neth returned from the Well of Youth with the First Contract, and the forest recognized a new authority: written law.
>
> Now the Neth rule from Atropolis, a city of living ironwood coaxed into cathedral-shapes over a thousand years. The Vreken live in the shadow of the canopy, their ancestral traditions receding as Neth trade networks expand. The Over-Shanty hangs beneath Atropolis, home to the Drun: Neth who burned their names from the Contract and became legally nonexistent.
>
> The Bryngloom is a place where everything has a price and every price is negotiable. Your signature is your bond. Your word is your collateral. And the Keeper is always watching from beneath the roots.

### Bonus Example — Character: Kaelen Thalreth

**Before (current loreDictionary.js):**
> Jarl-Archivist Kaelen Thalreth, called the Quill-Lord, has seized de facto control of House Thalreth due to his father Lord Aldren's advanced memory-fog. Under Kaelen's stewardship, the Sovereign Ledger has become an instrument of absolute control: any property not meticulously recorded in the ledgers is declared void, and the undocumented exist outside all legal recognition.

**After (Blizzard-style — 4 sentences):**
> Kaelen Thalreth runs the Frostwood Reach from behind a desk piled with ledgers. His father Aldren sits in a nearby chamber re-reading his own journals, trying to remember who he is. The fog took Aldren's memory. Kaelen is determined the fog will not take the Reach. He tells himself he is preserving civilization. The Forgotten call it erasure by quill.

---

### How to Rewrite Without Losing Lore

The 18 rules tell you how to change the **voice** of a lore entry. They do **not** tell you to cut the lore itself. The goal is to preserve the worldbuilding while making it read like Blizzard prose, not a wiki dump.

**What "tightening" means:**
- Kill passive voice and replace with active verbs ("was destroyed by" → "burned")
- Kill filler phrases ("it is worth noting that," "due to," "in order to")
- Kill the encyclopedia register ("X is characterized by Y")
- Kill date spam (replace `~Year 220` with "generations ago")
- Break walls of text into paragraphs with one job each
- Vary sentence rhythm (short hits after long flows)

**What "tightening" does NOT mean:**
- Do not remove named characters, places, or events
- Do not remove specific concrete details (the 17-second silence, the manuscript-in-damp-air image, the 47-page cohabitation agreement)
- Do not compress a 300-word backstory into 80 words to hit a sentence count
- Do not strip lore because it "isn't essential" — the flavor IS the lore
- Do not delete fields, paragraphs, or whole sections unless the guide explicitly says to

**Rule 17 ("character entries are tight") is about clarity, not word count.** The Kaelen Thalreth example at 6 sentences is the target shape: every sentence earns its place, tells you something specific, moves the story forward. A notableFigures backstory can run longer than a loreDictionary character entry, because the UI gives it its own panel — but it still needs to read like Blizzard prose, not a Wikipedia article.

**The test for each rewrite:** Can a reader who already knew the old version recognize every piece of lore in the new version? If the answer is no, you cut too much. The new version should contain the same information, told better.

**Worked example — Saren-Vel (notableFigures):**

Before (encyclopedia register, ~300 words):
> Before she was the first Drun, Saren-Vel was the most powerful Velun mage of her generation: a contract-lawyer and arcanist whose binding-clauses were so precise that the Keeper itself had never found a loophole in her work. She drafted the trade-treaty that opened Ironjaw Port to the Emberth. She wrote the inheritance-contract that resolved a three-century dispute between two competing Velun bloodlines. She was, by any measure, the apotheosis of what a Velun could become. *(...continues for 5 paragraphs...)*

After (Blizzard prose, same lore, ~200 words):
> Before she was the first Drun, Saren-Vel was the most powerful Velun mage of her generation: a contract-lawyer whose binding-clauses were so precise the Keeper had never found a loophole. She drafted the trade-treaty that opened Ironjaw Port to the Emberth. She wrote the inheritance-contract that resolved a three-century dispute between two Velun bloodlines.
>
> She was also unraveling. She had been breaking small contracts for decades: a promise here, a receipt there, a skipped ritual. Each breach felt like freedom and brought the Fading closer. By the time she walked into the bog, she was six months from dissolution, coming apart like a manuscript left in damp air.
>
> The flame she carried had been prepared over thirty years: pure annihilation, the inverse of the pact's preservation. It burned only ink. She touched it to the First Contract, and her name vanished from every active copy simultaneously. The silence that followed lasted seventeen seconds. Every Neth alive counted them.
>
> She walked out past guards who could not touch her because no contract authorized them to. She has not spoken in four centuries. The Drun revere her as their founder. The Velun consider her the greatest legal crisis in Neth history: a person who exists outside the pact, outside the law, and therefore cannot be wrong about anything — because "wrong" requires a standard she no longer acknowledges.

Same lore: the treaty, the 3-century dispute, the decades of small breaches, the manuscript image, the 30-year flame, the 17-second silence, the guards, the "wrong requires a standard" line. Different voice: active verbs, shorter sentences for impact, paragraphs with one job each. That is what every rewrite should look like.

---

## 3.5 THE VIBE — Complete Writing Examples

The 18 rules tell you the mechanics. This section shows you the **soul**. Read these examples aloud. This is what the finished text should sound like.

### The core voice: Mythrill is a world that is slowly dying and stubbornly refusing to die.

Every race, every region, every character carries two things: a wound and a weapon. The wound is what was taken from them. The weapon is what they did about it. The writing lives in the tension between the two.

**The voice is NOT:**
- Encyclopedia neutral ("X is a Y located in Z")
- Academic ("The region is characterized by...")
- Generic fantasy ("An ancient evil threatens the land")
- Overwrought ("A tapestry of nuanced, multifaceted betrayal")

**The voice IS:**
- Someone telling you a story by firelight
- Specific, concrete, visible
- Emotional without being melodramatic
- Short sentences when something hits hard
- Names. Always names. People, places, things that exist only here.

---

### Example A — A Race Description (the Neth, already rewritten)

This is what every race `description` should sound like:

> For eight centuries, the Neth have kept a contract with a forest spirit that other races only pray to or fear. The terms are simple: the Keeper preserves their bodies, and the Neth write down everything the Keeper consumes. Every debt, every promise, every name that fades into the Bryngloom's roots. The Neth do not die. They renegotiate.
>
> Long ago, before the sun was stolen, the Neth were dying. A slow cold had crept into the Gloom and found the children first — fewer were born each decade. They were an ancient canopy-dwelling people, not extraordinary, simply alive, until the silence of empty cradles grew louder than the wind. Their Augurs communed with Morvane through the root-net and received the Font Vessel, to be filled at the hidden Well of Youth. Three factions followed: one to honor the deal, one to steal the Well's power, one to drink it directly. Morvane's judgment split a people into High, Pale, and Hallowed.
>
> They did not pray. They presented their case to Morvane at the moss-covered roots.
>
> *Our children are dying. The forest endures. Teach us what endures, and we will be your living record.*
>
> Morvane had never been reasoned with. Only feared. Only fed. It considered the argument and granted them the Font Vessel for the hidden Well of Youth. What followed was not a blessing but a judgment: three factions, one Well, and a split that marked every bloodline.
>
> The First Contract is still visible in the heart of Atropolis, fossilized in living heartwood like a fly in amber. Every Neth child born since carries the terms in their blood. They cannot lie. They cannot break a promise. They cannot stop writing. The alternative is the silence that waits for anyone who breaches the agreement.
>
> Now the Neth rule the Bryngloom's canopy city of Atropolis, writing contracts for everything: marriages, inheritances, debts, souls. The Drun are those who burned their names from the Contract and became legally nonexistent, living in the Over-Shanty beneath the city. The Velun Neth are the silver-tongued elite who navigate the law like a living language.
>
> You are one of the pact-bound. Your blood is ink. Your breath is a signature. The Keeper is watching, and the Contract endures. What terms will you write?

**Why this works:**
- Opens with scale and judgment ("For eight centuries") — Rule 1
- Every paragraph has a name: the Keeper, the Bryngloom, Atropolis, the Drun, the Velun — Rule 3
- Consequence chain: dying → walked into the wood → presented the case → Keeper accepted → rose with silver skin → now rule Atropolis — Rule 4
- Short hit: "They did not pray. They presented a case." — Rule 10
- Player hook: "You are one of the pact-bound. What terms will you write?" — Rule 7
- Concrete image: "fossilized in living heartwood like a fly in amber" — Rule 9
- Tone: precise, legalistic, clinical — matches the Neth — Rule 12

---

### Example B — A Character Entry (tight, 4-6 sentences)

This is what every notableFigure backstory and loreDictionary character entry should sound like:

> Kaelen Thalreth runs the Frostwood Reach from behind a desk piled with ledgers. His father Aldren sits in a nearby chamber re-reading his own journals, trying to remember who he is. The fog took Aldren's memory. Kaelen is determined the fog will not take the Reach. He tells himself he is preserving civilization. The Forgotten call it erasure by quill.

**Why this works:**
- Six sentences. Each one earns its place. — Rule 17
- Two specific people doing specific things — Rule 3
- The tragedy (Aldren's memory) and the rising (Kaelen's determination) in the same breath — Rule 16
- The last sentence gives you the moral ambiguity without explaining it — Rule 15
- No dates, no filler, no passive voice

---

### Example C — A Region Description

This is what every region entry in loreDictionary.js should sound like:

> The Bryngloom is a twilight swamp where the trees glow and the bogs remember what falls into them. The air is thick with spores. The water is thick with debt. This is the domain of the Neth: the silver-skinned pact-lords who wrote a contract with the forest itself and have been collecting interest ever since.
>
> Before the Neth, the Bryngloom belonged to the Vreken. They lived among the fungal groves, reading the mycelium like others read maps, harvesting Ghost-Mycelium from the Hush-Bogs, and honoring the Root-Veil as a sacred ancestor. Then the Neth returned from the Well of Youth with the First Contract, and the forest recognized a new authority: written law.
>
> Now the Neth rule from Atropolis, a city of living ironwood coaxed into cathedral-shapes over a thousand years. The Vreken live in the shadow of the canopy, their ancestral traditions receding as Neth trade networks expand. The Over-Shanty hangs beneath Atropolis, home to the Drun: Neth who burned their names from the Contract and became legally nonexistent.
>
> The Bryngloom is a place where everything has a price and every price is negotiable. Your signature is your bond. Your word is your collateral. And the Keeper is always watching from beneath the roots.

**Why this works:**
- Opens with concrete sensory detail ("trees glow and the bogs remember") — Rule 9
- Names everywhere: the Neth, the Vreken, Atropolis, the Root-Veil, the Hush-Bogs, the Over-Shanty, the Drun, the Keeper — Rule 14
- Past → what happened → now → player hook — Rule 2
- No "The Bryngloom is a region characterized by..." — kills the encyclopedia voice

---

### Example D — Tone Shifts by Subject (Rule 12)

The writing voice MUST shift to match the subject. Same world, different throats:

**Neth** — precise, legalistic, cold:
> "They did not pray. They presented a case."

**Skald (Nordhalla)** — brutal, cold, elegiac:
> "The glaciers do not negotiate. Neither do we."

**Mimir (Frostwood)** — mysterious, melancholic, quiet:
> "The mask is not a disguise. It is a cage for a thing that wants out."

**Florae** — thorny, defiant, feral:
> "There were eight houses, not seven. The histories will tell you otherwise. The histories are wrong."

**Emberth (Sundale)** — heavy, patient, devout:
> "Sol spoke in heat and image, never words. We listened. We dug. We survived."

**Astril (Sundrift Vale)** — luminous, cosmic, tragic:
> "She carries a dying star inside her chest, and it remembers what ate its kin."

When you write a Neth entry, the sentences should feel like contract clauses. When you write a Skald entry, the sentences should feel like they were carved into ice. The voice is not decoration. It IS the lore.

---

### Example E — What "Tightening" Looks Like (the Saren-Vel rule)

**Before** (encyclopedia register, passive, over-explained):
> Saren-Vel was considered by many to be the most powerful Velun mage of her generation. Her binding-clauses were known to be so precise that the Keeper itself had never found a loophole in her work. She was also experiencing the Unraveling, which is a process that occurs when a Neth begins breaking contracts on purpose.

**After** (Blizzard prose, active, trusts the reader):
> Before she was the first Drun, Saren-Vel was the most powerful Velun mage of her generation: a contract-lawyer whose binding-clauses were so precise the Keeper had never found a loophole. She was also unraveling. She had been breaking small contracts for decades: a promise here, a receipt there, a skipped ritual. Each breach felt like freedom and brought the Fading closer.

Same lore. Different voice. The second version has: active verbs, concrete examples ("a promise here, a receipt there"), short sentences for impact ("She was also unraveling."), and trusts you to understand what "unraveling" means without a parenthetical definition.

---

### The Parenthetical Rule (discovered during rewrites)

The current codebase has a **broken parenthetical pattern** where a sentence opens a parenthetical aside, the aside contains multiple sentences, and the closing paren never properly returns to the main sentence. This reads as broken grammar, not style.

**Broken pattern (do not replicate):**
> The fog swallows it entirely in patches (places in the Vales where a Mimir can walk for an hour and emerge unable to recall what they were doing, where they were going, or in some cases, their own name. The Mask-Borne attribute this to the natural decay of the old bargain. The Unwoven say something else is at work) something that was not part of the original deal.

**Fixed (em dashes for short asides, separate sentences for long ones):**
> The fog swallows it entirely in patches: places in the Vales where a Mimir can walk for an hour and emerge unable to recall what they were doing, where they were going, or in some cases, their own name. The Mask-Borne attribute this to the natural decay of the old bargain. The Unwoven say something else is at work. Something that was not part of the original deal.

**Rule of thumb:** If the parenthetical is one phrase (under 8 words), use em dashes. If it's a full sentence or more, break it out into its own sentence. Never let a parenthetical contain multiple sentences — that's a paragraph pretending to be an aside.

---

## 5. Anti-Patterns: What Currently Screams "AI"

### 5.1 AI Grammar — The Tells

AI-generated text has recognizable patterns. Every rewrite must avoid these. If you find yourself writing any of these, stop and rewrite the sentence.

**The Formula Openings:**
- "X is a [adj] [noun]" — Every entry starts the same way
- "Known as [title]" — Used 20+ times in loreDictionary.js alone
- "It is worth noting that" — Delete. Always.
- "It should be mentioned that" — Delete. Always.

**The hedge words:**
- "somewhat," "arguably," "generally," "typically," "often considered"
- These weaken every sentence. Either say it or don't.

**The AI sentence structure:**
- Medium-length sentences, all the same length, no rhythm variation
- Every paragraph is 4-5 sentences of equal weight
- No short punches. No long flows. Just... medium. Always medium.

**The connective tissue AI loves:**
- "Moreover," "Furthermore," "Additionally," "Consequently," "Nevertheless"
- Replace with: nothing. Just start the next sentence. Or use "And," "But," "So."

**The over-explanation tic:**
- "This is because..." — Delete. The reader can follow.
- "In other words..." — Delete. You already said it.
- "It is important to note that..." — Delete. If it's important, the sentence carries it.

**The balanced-but-empty sentence:**
- "While X is true, Y is also worth considering." — Says nothing. Pick a side.
- "Although X presents challenges, it also offers opportunities." — AI filler. Delete.

**The list-as-prose:**
- "The region is characterized by its diverse landscape, rich history, and vibrant culture." — This is three words wearing a trench coat. Give me ONE concrete image instead.

**The emotion-without-emotion:**
- "a sense of profound loss" — What does it actually feel like? Show it.
- "a feeling of unease" — What specifically is uneasy? Name it.

### 5.2 The Banned Word List

Never use these words in Mythrill lore. They are AI tells:

delve, testament, tapestry (unless the proper noun Tapestry-Wards), leverage, essence (unless the game mechanic field name), embodies, inherently, multifaceted, nuanced, plethora, ecosystem, paradigm, underscores, utilize, seamless, transformative, facilitate, meticulous, moreover, furthermore, additionally, consequently, nevertheless, arguably, generally, typically, robust, comprehensive, intricate, profound (overused), vibrant (overused), dynamic (overused), realm (use the specific name), behold, whence, wherefore, ere (unless in-character archaic speech)

### 5.3 The Authentic Voice Test

After writing any passage, read it aloud. If it sounds like:
- A Wikipedia article → rewrite it
- A corporate press release → rewrite it
- A college essay → rewrite it
- A GPT output → rewrite it

It should sound like:
- A GM describing the world to players who are leaning forward
- A character in a novel who knows the history and has opinions about it
- A friend telling you a story they find genuinely compelling

**The final test:** Would a reader who has never played Mythrill want to know what happens next? If the answer is no, the lore is failing regardless of how accurate it is.

### 5.4 Lore Preservation Rules (NON-NEGOTIABLE)

When tightening text to fit the new voice, you MUST preserve:

1. **Every named character, place, and thing.** If the original says "Saren-Vel drafted the trade-treaty that opened Ironjaw Port to the Emberth," the rewrite must still mention Saren-Vel, the trade-treaty, Ironjaw Port, and the Emberth.

2. **Every specific number or detail.** "Seventeen seconds of silence." "Forty-seven-page cohabitation agreement." "Three hundred feet of vertical stone." These stay.

3. **Every concrete image.** "Coming apart like a manuscript left in damp air." "The temperature of a hand that let go." "Fossilized in living heartwood like a fly in amber." These stay.

4. **Every named relationship or faction dynamic.** Who hates whom. Who trades with whom. Who is allied with whom. These stay.

5. **Every named ritual, practice, or cultural detail.** The Thorn-Tithe. The Annual Renegotiation. The Marking-Rite. The Cliff-Duel. Fragment-Speech. These stay.

**What you CAN cut:**
- Repetition (if the same fact appears twice in the same entry, keep the better version)
- Pure filler phrases ("it is worth noting that," "due to the fact that")
- Encyclopedia framing ("The X is a Y characterized by Z")
- Broken grammar (parentheticals containing multiple sentences)

**The test:** Open the original file and the rewritten file side by side. Read the original. For every piece of information in the original, can you find it in the rewrite? If not, you cut too much. The rewrite should contain the same information, told better.

---

## 6. Lore Consistency Rules

Before you write a single sentence of lore, you need to know what's already true. These rules prevent contradictions.

### 6.1 The Master Timeline & Core World Premise

* **Pre-Star Mythrill (Primordial Anima):** Mythrill was an animistic, folklore-rich world where native beasts (*Jutul*, *Glacier Wyrms*, *Thrumm*), land spirits (*Landvaettir*, *Fossegrim*), and non-human races possessed innate biological elemental abilities. Mortals had **zero magic** and survived via steel, tactical engineering, black powder, matchlocks, archery, and folk taboos.
* **The Celestial Star-Fall (Year 0):** Aex & Aethil fled across the cosmos to hide infant sun *Sol* in Mythrill's core from *Keth Amar*. Mortal Houses unaligned with Old Gods struck the House Bargain: High Houses mutated into magical lineages (*Solari*, *Vreken*, *Neth*), while common folk received subtle physical adaptations while keeping traditional black-powder and melee combat.
* **The 475-Year Master Timeline:**

| Epoch | Year | What Happened |
|---|---|---|
| The Celestial Star-Fall | Year 0 | Aex wraps Sol in core; House Bargain struck; Astril land in Sundrift Vale |
| The Incremental Cracks | Years 0–300 | Vreken massacre, Ordan purge, Frostwood meltdown crack Aex's shell |
| Keth Amar Arrives | Year 300 | Trails Astril starlight; 25-yr Wyrd infiltration posing as Aethil |
| Blizzard's End Massacre | Year 325 | Heirs devoured; Aex shatters into Aex Shards; Keth Amar wounded, retreats to sky as Wyrd |
| The Freezing Era (Present Day) | Year 475 | 150 Years of Freezing Era; factions fight over Aex Shards; **Nordhalla launch campaign** |

### 6.1B Scrapped & Corrected Lore (DO NOT WRITE)
* ❌ **SCRAPPED:** The Augurs' 41% doom prediction accuracy being tied to Sol's shell/security breakdown (caused by temporal friction and chronological dissonance instead).
* ❌ **SCRAPPED:** The strict "3-in-10 maternal death / Frost-Tithe" childbirth ratio (replaced with atmospheric lore, cold-strain, and metaphysical burden without rigid statistics).

### 6.1C Class Heritage Taxonomy
1. **Pre-Binding Classes (Traditional / Mortals):** Berserker, Apex, Minstrel, Warden, Toxicologist (steel, black powder, matchlocks, cold-iron traps, archery, physical mastery).
2. **Celestial Bargain Classes (Infused Houses):** Spellguard, Arcanoneer, Chronarch, Shaper (direct elemental control born from Celestial pact).
3. **Vreken Extortion (Blight Magic):** Blight-Weavers and Decay specialists (extorted divine desperation for ultimate power).
4. **Cosmic Collision Classes (Post-Keth Amar):** Pyrofiend (Solari/Void demonic collision), Harbinger, Plaguebringer, Revenant.

### 6.1D Ancestry Updates
* **The Neth (Well of Life):** High Neth (half-filled pitcher, pristine, immortal-adjacent, Peter Pan helicopter parenting), Pale Neth (stolen urns, subterranean hoarders), Hallowed Neth (well-dippers, undead husks bound to Old God roots).
* **The Fexrick (Engine-Theft):** Gnomish/Dwarvish engineers of Cragjaw Peaks who dug too deep, uncovered a Primordial God's engine/vault, and were cursed with erratic twitching, manic paranoia, and an insatiable urge to build and tweak.

### 6.1E Primary Launch Region
* **Nordhalla:** The **sole, self-contained launch region** for the app map and initial gameplay release (Finnish, Greenlandic, Norse folklore textures: *Landvaettir*, *Qalupalik*, *Jutul*, *Glacier Wyrms*, *Fossegrim*). Other continents follow in future expansions.

### 6.2 House Relationships — Who Stands Where

| House | Region | Ruler | Alliance | Hostile To | Notes |
|---|---|---|---|---|---|
| Thalreth | Frostwood Reach | Kaelen Thalreth | Scribe-Cartel | Forgotten, Mimir (assimilates) | Wiped House Viridane from records |
| Skalvyr | Nordhalla | Halvar "Jarn-Tand" | Icechamber Syndicate | Fredløse clans, Animists | Religious persecution (Cleansing of the Hearth) |
| Solvan | Sundale | Collapsed | Dawn Vigil (successor) | None (extinct as rulers) | Lost legitimacy after Breach |
| Mereval | Iceheart Sea | Grand Admiral Varis Mereval | Board of Trade | Pirates, unregistered ships | Enforces the Sea-Charter |
| Tesshan | Cragjaw Peaks | Jarl-Inca Oda Tesshan | Knotted Decree | Grotto-secessionists | Veiled the peaks in perpetual blizzard |
| Ordavan | Sundrift Vale | Khatun Bayarmaa Ordavan | Unlit Veil (unwillingly) | Traditionalist nomads | Unlit Veil manipulates the house |
| Morrath | Bryngloom Forest | Regent Morrath Neth | Neth Kessen weavers, Keeper | Vreken (tension), debtors | Enforces the Great Registry |
| Viridane | Frostwood Reach (erased) | None (extinct) | Florae (descendants) | All other houses | Erased after refusing Keth-Amar; Florae carry their blood |

### 6.3 Name Rules

- **Jarn-Tand**, not Iron-Tooth (in lore text; translation can appear in parentheses once)
- **Fexric** (not Fexrick — check the most recent files)
- **Bryngloom Forest** (not just Bryngloom on first reference)
- **The Keeper of the Last Threshold** (not just "the Keeper" on first reference)
- **The Drun** (capitalized, plural: "the Drun," "a Drun")
- **The Forgotten** (capitalized, refers to undocumented people in the Frostwood)
- **North is not a direction in Mythrill** — the world is a closed system beneath a dark sky. Use "the northern reaches" or "toward Nordhalla" instead of compass directions unless speaking from a character's limited perspective.

### 6.4 Tone Consistency by Region

| Region | Tone | Keywords |
|---|---|---|
| Frostwood Reach | Grim, damp, bureaucratic | fog, ironwood, ledgers, ink, memory, erased, the Forgotten |
| Nordhalla | Cold, brutal, ancestral | ice, glaciers, runes, blood, song, Jarn-Tand, the Sunder-Wall |
| Bryngloom | Swampy, legalistic, fungal | spores, contract, debt, mycelium, the Keeper, the Root-Veil |
| Sundale | Volcanic, zealous, ash | Emberspire, the Dawn Vigil, ash, the Sol's Breath, Reforging |
| Iceheart Sea | Stormy, maritime, cold | ice, ships, Board of Trade, Sea-Charter, Myrathil deep-currents |
| Cragjaw Peaks | Industrial, vertical, groaning | forges, gears, bone-bridges, Fexric warrens, Groven ancestors |
| Sundrift Vale | Windy, nomadic, starless | steppe, herds, wind, Unlit Veil, ancestral mounds, the Shard-Window |

### 6.5A Structural Pattern: Deep History & Strata (rulesData.js regions)

The 7 region entries in `rulesData.js` each have a **Deep History & Strata** block. These have been standardized to the following format:

```
**Deep History & Strata**

**The Pre-Deepening.** Short declarative sentence. Another short sentence. A third that completes the thought.

**The Deepening & the Bargain — the Pact Type, just after the Binding.** The deal in one sentence. The consequence in the next sentence. What it cost.

**The Long Dimming.** Trigger event. Consequence. Spread over time.

**The Present Fracture.** Two short sentences about what's failing. A third sentence naming the crisis. The Heresy Chain terminus.
```

Rules for this block:
- **Every era heading uses an em dash** for the pact/secondary name (e.g., "the Deepening & the Bargain — the Fog Compact, just after the Binding"). This is the ONE place per entry where em dashes are structurally required.
- **Every era's body is 2-4 short declarative sentences.** No comma-spliced run-ons. Each sentence contains 1-2 named entities at most.
- **Blank line between eras** for scannability.
- **"The Present Fracture" ends the block.** It names the current crisis and, if applicable, ties it to the chain of consequences from earlier eras. No separate "now" pivot needed — the Fracture IS the now.
- **Key Terms blockquotes** (`> **Key Terms in [Region]:**`) are placed BEFORE the Deep History block, not at the beginning of the region entry. Readers encounter narrative prose first, then definitions, then the deep timeline.

### 6.5B What Not To Do

- **Don't contradict the timeline.** If the Mimir Purge is ~Year 220, you can't refer to "recent Purge" in present-day entries.
- **Don't use real-world religions or mythologies.** No "gods," "heaven," "hell," "angels," "demons" — use Mythrill equivalents: the Warden, the Keeper, the Wyrd, Keth-Amar.
- **Don't mix region tones.** A Sundrift Vale entry shouldn't sound like a Nordhalla entry. The voice must match the place.
- **Don't forget the erased houses.** House Viridane was erased. Referencing "the seven houses" without acknowledging the eighth is a lore error.
- **Don't use generic fantasy proper nouns.** "The ancient temple" → "The Temple of the Moon" (Blizzard) / "The High Hearth" (Mythrill). Always name it.

---

## 7. Lore Rewrite Todo List — Full Scope

Every file below needs rewriting to fit the Blizzard-style guide (18 rules). Files are ordered by player-facing priority. Check them off as you go.

### Phase 1 — Character Creation (Players see these first)

- [x] `vtt-react/src/data/races/neth.js`
- [x] `vtt-react/src/data/races/mimir.js`
- [x] `vtt-react/src/data/races/briaran.js`
- [x] `vtt-react/src/data/races/astril.js`
- [x] `vtt-react/src/data/races/emberth.js`
- [x] `vtt-react/src/data/races/fexrick.js` — **NOTE: `fexrick.js` is the canonical file (imported by raceData.js). `fexric.js` is an orphan duplicate — verify and delete.**
- [x] `vtt-react/src/data/races/groven.js`
- [x] `vtt-react/src/data/races/human.js`
- [x] `vtt-react/src/data/races/myrathil.js`
- [x] `vtt-react/src/data/races/vreken.js`
- [x] `vtt-react/src/data/backgroundData.js` — 15+ backgrounds, each region-specific
- [x] `vtt-react/src/data/backgroundAbilities.js` — background feature descriptions
- [x] `vtt-react/src/data/equipment/backgroundEquipment.js` — flavor text on background gear
- [x] `vtt-react/src/data/equipment/raceEquipment.js` — flavor text on racial gear
- [x] `vtt-react/src/data/classes/classDisplayData.js` — class roleplay identity text

### Phase 2 — Class Lore (Players see these in class selection)

- [x] `vtt-react/src/data/classes/animistData.js`
- [x] `vtt-react/src/data/classes/apexData.js`
- [x] `vtt-react/src/data/classes/arcanoneerData.js`
- [x] `vtt-react/src/data/classes/augurData.js`
- [x] `vtt-react/src/data/classes/berserkerData.js`
- [x] `vtt-react/src/data/classes/chronarchData.js`
- [x] `vtt-react/src/data/classes/falseProphetData.js`
- [x] `vtt-react/src/data/classes/gambitData.js`
- [x] `vtt-react/src/data/classes/harbingerData.js`
- [x] `vtt-react/src/data/classes/inquisitorData.js`
- [x] `vtt-react/src/data/classes/lunarchData.js`
- [x] `vtt-react/src/data/classes/martyrData.js`
- [x] `vtt-react/src/data/classes/minstrelData.js`
- [x] `vtt-react/src/data/classes/plaguebringerData.js`
- [x] `vtt-react/src/data/classes/pyrofiendData.js`
- [x] `vtt-react/src/data/classes/revenantData.js`
- [x] `vtt-react/src/data/classes/shaperData.js`
- [x] `vtt-react/src/data/classes/spellguardData.js`
- [x] `vtt-react/src/data/classes/toxicologistData.js`
- [x] `vtt-react/src/data/classes/wardenData.js`
- [x] `vtt-react/src/store/classLoreStore.js` — class lore entries for encyclopedia display

### Phase 3 — Core Encyclopedia (loreDictionary.js — the biggest file)

- [x] `vtt-react/src/data/loreDictionary.js` — ALL ~257 entries REWRITTEN to Blizzard prose. Every mechanical violation is ZERO (em dashes, banned words, religious terms, exact years, real-world refs, "known as", "Founded in", "seven noble houses"). All regions, houses, characters, locations, events, concepts, factions, entities, and creatures have action/judgment openers, player hooks, and vivid imagery. 33 remaining "X is a/the" openers are all acceptable (TIER B tooltips, locations with vivid imagery per Bryngloom precedent, or the guide's own Bryngloom example). See §9 for full audit report.
  - [x] Region entries (frostwood-reach, nordhalla, sundale, iceheart-sea, cragjaw-peaks, sundrift-vale, bryngloom-forest)
  - [x] Noble house entries (thalreth, skalvyr, solvan, mereval, tesshan, ordavan, morrath, viridane)
  - [x] Race entries (mimir, briaran, neth, vreken, astril, emberth, fexric, groven, myrathil, human) — 9 entries FULLY REWRITTEN (no standalone 'human' entry exists in loreDictionary.js; humans are the baseline default). Each aligned to its regional tone per §6.4 and guide canonical voices.
  - [x] Character entries (kaelen-thalreth, aldren-thalreth, valerius, scathrach, etc.) — IN PROGRESS: kaelen-thalreth, aldren-thalreth, valerius, scathrach, saren-vel, grum, sera, li-wei, nyssa DONE (TIER A). ALSO DONE (TIER A): malakor-the-archivist, kael, theron (single historical_figure entries), + 11 LIVE character-block entries whose keys shadow earlier historical_figure dupes: veyra, xyris, damon, alaric, jax, lyra, kora, vesper, orven, elias, selene. All 14 rewritten: definitional openers→action, em dashes→0, "crisis is X" encyclopedia framing killed, player hooks added, lore folded in from shadowed duplicates (basalt phylactery/Thrumm-biology/smile-and-loaded-die). NOTE: `valerius` appears TWICE (historical_figure @L123 + character @L2354); second shadows the first in the JS object — dupe flagged for Phase 11. NEW FLAG: `orven` shadowed entry is a DIFFERENT character (Orven-Sen the Kessen probability-weaver, predicted Emberspire eruption) than the live Orven the Still-Handed (Vreken, cold iron) — Orven-Sen's lore is lost at runtime; needs rename in Phase 11. HOUSE STEWARDS/LORDS BLOCK (L2141-2386) DONE (TIER A): halvar-skalvyr, elara-thalreth, caedren-thalreth, thorn-speaker, the-first-liar, loras-ordavan, dawn-vigil-commander, deep-alchemist-prime, vat-breaker-foreman, solvan-steward, mereval-admiral, tesshan-lord, morrath-steward, sigurd-skalvyr, vellan-archivist, grum-bloodhammer, cassia, nesta, + frigga-skalvyr (LIVE L2737 Void-Heat Heretic version; L2318 shadowed geothermal-negotiator version em-dash-cleaned but lore conflict flagged). Fixes: 2 timeline errors ("2,000-year"/"two thousand years" — world is only ~800 yrs old), banned word "arguably" removed from sigurd, "Merryn ships"→"Merryn ship" grammar, "a dwarf" generic-fantasy leak removed from grum, "human body"→"living body" in nesta (Fexric not human), all em dashes→0, all definitional openers→action, player hooks added to all. NOTABLE FIGURES BLOCK (L1904-2140) DONE (TIER A): hark-ash-hammer, sera-three-scars, vel-otharen, skadi-glass-eye, fex-vestara, mor-vereth, merr-cael, malakor, vrael-forty-seventh, bri-vessela, sol-kaessen, mer-lyrisa, vespera, sol-vareths, kor-vasseth, thrak-damos, varis, sylas. All "crisis is X" encyclopedia framing eliminated, all em dashes→0, all definitional openers→action, player hooks added. Fixes: rood-veil→root_veil typo, 93%/41%/471 spelled out, "substrate" kept (guide's recommended ecology/ecosystem replacement).
  - [x] Location entries (greymark-keep, atropolis, emberspire, mirror-mere, etc.) — IN PROGRESS: greymark_keep, atropolis, emberspire, harath_vault, frozen_archive, merrowport, ironjaw_port, sunken_spire, synod_hold, skalds_landing DONE (TIER A). Emberspire summary timeline fixed ("Great Breach"→"the Binding"; "seven noble families"→"binding houses" for Viridane safety). Skald's Longport "Norse-style"→"Skald-style". 49 ADDITIONAL LOCATIONS FULLY REWRITTEN (TIER A): frostmaw_holdfast, wraithfen, mistbarrow, greythorn_copse, drunhold, grimmwood, siltmire_flats, bramble_heath, the_shifting_fen, mirror_mere, skadis_col, vargtor, the_still_crag, frostcirque, rooks_promontory, sols_anvil_mesa, the_ashen_escarpment, cinderhoodoo, ember_lagoon, brinehorse_cove, wraithsound, the_shallows, scribes_tower, ledger_halls, ironwood_heart, the_spans, bloodhammer_sump, fjord_gate, hunger_glaciers, rimors_hearth, vesperas_perch, ancestor_gaps, sump_galleries, deepwell_archipelago, spindrift_lagoon, deepchasm_keep, the_great_gorge, gearworks_gulch, frostmaw_massif, starfall_vale, the_unlit_knoll, ancestor_wold, morrens_bogpost, widows_quagmire, black_fen, vel_keth_bayou, aran_glen, hunters_gully, fangmere_grove. Fixes: 2 "ten thousand years" timeline errors→"older than the Binding"; "frost giant"→"figure of Skald pre-Binding legend" (skadis_col); all em dashes→0; all definitional openers→action; player hooks added. FLAGS: "Ymir" (Norse) and "Kelpie" (Scottish) are real-world myth names embedded in place-names — cross-file rename needed in Phase 11.
  - [x] Creature entries (gref, pooka, wyrd-creatures, etc.) — gref, gambrel, stel FULLY REWRITTEN (all 3 creatures in loreDictionary.js). Each aligned to regional tone; fixed grammar error in stel ("those who frozen"→"those who froze").
  - [x] Concept entries (the-deepening, the-dimming, the-binding, the-breach, the-first-contract, etc.) — the_deepening + the_breach EVENTS also rewritten this session: fixed broken tautology ("the Breach occurred just after the Breach"), banned "utilizing", "seven noble families"→"binding houses", numbers spelled out. ALL remaining event entries now FULLY REWRITTEN (TIER A): rebirth-cycle (verified already compliant), the-first-thermal-war, the-war-of-thousand-screams, the-toll-wars, the-memory-wars, the-false-dawn-riots, the-void-heat-heresy, the-sundale-civil-war, the-great-revision. Eliminated all exact years (Years 100-120, 280-340, 300-320, 250-350; "four hundred and eighty years"→"nearly five centuries"), fixed grammar ("In within living memory", "from in the mid-Diming centuries"), doubled word ("the Dimming, Dimming"), filler ("approximately"), all paired em dashes, added player hooks + multi-paragraph arcs to all. Event entries section COMPLETE.
  - [x] Faction entries (scribe-cartel, dawn-vigil, cult-of-forgotten-shadow, etc.)
  - [x] Entity entries — IN PROGRESS: the_warden, keth_amar, aex, sol DONE (TIER A). Fixed botched "god"→"a old powers" grammar across all entity entries, botched year-purges in keth_amar, eliminated "god" entirely (per religious-terms ban), em-dash overuse reduced to zero. li-wei (False Prophet founder) also fixed: summary "a old powers" + 3 em dashes in fullEntry.
  - [x] Class entries (arcanoneer, augur, berserker, shaper, inquisitor, etc.) — ALL 20 class fullEntry fields FULLY REWRITTEN from "Founded in..." encyclopedia formula to Blizzard prose. Eliminated all em dashes, banned "comprehensive" (apex), "fungal-ecology" (plaguebringer), "loa" (animist, nyssa), broken "Founded across in" (apex, animist). Concept-type merged-tradition entries (bladedancer, deathcaller, dreadnaught, formbender, lichborne, titan) were already in good prose — left as-is.
  - [x] Language entries (common, infernal, primordial, etc.)
  - **NEW FLAG — nativeWeaving real-world references (RESOLVED):** All 15 `nativeWeaving` **Cultural.** sections contained real-world cultural references (Celtic, Norse, Slavic, Mongol, Inuit, Appalachian, Andean, Mesoamerican, Germanic, yokai, Hindu, loa). These are PLAYER-FACING (rendered in `LoreTooltip.jsx:147`). ALL replaced with Mythrill-specific equivalents (e.g., "Celtic fae-pacts"→"Briaran fae-pacts", "Mesoamerican solar-sacrifice"→"Sol's Breath solar-sacrifice", "Mongol throat-song"→"Ordan throat-song").
  - **NEW FLAG — Cragjaw/House Tesshan real-world terms (RESOLVED):** The Cragjaw Peaks region entry (marked DONE) and House Tesshan noble house entry (marked DONE) both contained Inca references ("Jarl-Inca", "khipus"/"khipu-cords", "Mit'a") and Shinto references ("Kami-Speakers", "Kami", "Yokai"). All fixed: "Jarl-Inca"→"Jarl", "khipus"→"knotted cords", "Mit'a"→"corvée", "Kami-Speakers"→"Rock-Speakers", "Yokai"→"native mountain spirits". The Cragjaw Yokai-derived creatures (Yuki-Onna, Tengu-Crows, Sump-Kappas, etc.) are native peak-spirits that predate the Binding, NOT Wyrd-kin; an earlier "Yokai→Wyrd-kin" rename was reverted as canon-incorrect. Yuki-Onna and Tengu-Crows kept as names (see GM_WORLD_GUIDE native-ecology note).

### Phase 4 — Deep Locations & World Map

- [x] `vtt-react/src/data/deepLocationData.js` — ~30 deep location entries
- [x] `vtt-react/src/data/locationCoordinates.js` — ~7 location descriptions
- [x] `vtt-react/src/data/subregions.js` — ~10 subregion descriptions
- [x] `vtt-react/src/data/zoneData.js` — ~10 zone descriptions
- [x] `vtt-react/src/data/biomeData.js` — ~7 biome descriptions
- [x] `vtt-react/src/data/explorationRules.js` — ~38 region travel/navigation lore entries

### Phase 5 — Item Lore (high volume, lower priority)

- [x] `vtt-react/src/data/items/weapons/index.js` — ~120 weapon descriptions
- [x] `vtt-react/src/data/items/armor/index.js` — ~54 armor descriptions
- [x] `vtt-react/src/data/items/accessories/index.js` — ~51 accessory descriptions
- [x] `vtt-react/src/data/items/consumables/index.js` — ~23 consumable descriptions
- [x] `vtt-react/src/data/items/containers/index.js` — ~18 container descriptions
- [x] `vtt-react/src/data/items/miscellaneous/*.js` — ~150+ miscellaneous item descriptions

### Phase 6 — Creature Lore

- [x] `vtt-react/src/data/creatureLibraryData.js` — ~50 creature descriptions (De-indexed/Cleaned)
- [x] `vtt-react/src/data/creatureData.json` — ~100 creature descriptions (JSON) (De-indexed/Cleaned)
- [x] `vtt-react/src/data/summonableTokens.js` — ~48 creature descriptions (Cleaned)
- [x] `vtt-react/src/data/creatureAbilitiesAdvanced.js` — ~50 ability descriptions (Cleaned)
- [x] `vtt-react/src/data/creatureAbilityBuilders.js` — ~10 descriptions (Cleaned)

### Phase 7 — Talent Trees & Paths

- [x] `vtt-react/src/data/talentTreeData.js` — ~10 descriptions
- [x] `vtt-react/src/data/pathData.js` — ~20 path descriptions
- [x] `vtt-react/src/data/talentTrees/*.js` — all 20 talent tree files, ~10-20 descriptions each
- [x] `vtt-react/src/data/classes/talentTrees/gambit.js` — DUPLICATE/variant of gambit tree (verify which is canonical before rewriting)

### Phase 8 — Remaining Data Files

- [x] `vtt-react/src/data/languages.js` — ~40 strings (description, sound, example, translation per language)
- [x] `vtt-react/src/data/classResources.js` — ~1,982 lines of resource descriptions/flavor (massively undercounted previously)
- [x] `vtt-react/src/data/classSpellCategories.js` — ~1,295 lines, ~60+ spell category descriptions
- [x] `vtt-react/src/data/classSpellGenerator.js` — ~810 lines, ~5+ generated spell descriptions
- [x] `vtt-react/src/data/spellLibraryData.js` — ~5 spell descriptions
- [x] `vtt-react/src/data/customSpellLibraryData.js` — ~10 spell descriptions
- [x] `vtt-react/src/data/universalCombatSpells.js` — ~853 lines, ~20+ spell descriptions
- [x] `vtt-react/src/data/generalSpellsData.js` — ~2 spell descriptions
- [x] `vtt-react/src/data/auraTypes.js` — ~10 aura descriptions
- [x] `vtt-react/src/data/triggerTypes.js` — ~15 trigger descriptions
- [x] `vtt-react/src/data/damageTypes.js` — ~10 damage type descriptions
- [x] `vtt-react/src/data/conditionsData.js` — ~15 condition descriptions
- [x] `vtt-react/src/data/statusEffects.js` — ~20 status effect descriptions
- [x] `vtt-react/src/data/lootItemsData.js` — ~17 loot descriptions
- [x] `vtt-react/src/data/startingEquipmentData.js` — ~1,580 lines (massively undercounted)
- [x] `vtt-react/src/data/rulesData.js` — **~5,674 lines** (Rewritten: races-overview, timeline, bestiary, class-origins, session-zero, lexicon)
- [x] `vtt-react/src/data/raceMechanics.js` — ~18 race condition descriptions
- [x] `vtt-react/src/data/windowIntros.js` — ~10 UI intro texts
- [x] `vtt-react/src/data/recipes/*.js` — all 9 recipe files, ~5 descriptions each
- [x] `vtt-react/src/data/raceData.js` — aggregator (verify no orphan lore)
- [x] `vtt-react/src/data/rollableTables.js` — ~30+ narrative encounter/treasure/weather descriptions
- [x] `vtt-react/src/data/spellTemplates.js` — ~20 spell archetype descriptions
- [x] `vtt-react/src/data/skillAbilitiesData.js` — **~1,227 lines** (massively undercounted — full spell-card descriptions for every skill ability)
- [x] `vtt-react/src/data/startingCurrencyData.js` — ~15 background currency flavor descriptions
- [x] `vtt-react/src/data/equipment/classEquipment.js` — ~3,910 lines of class starting gear descriptions
- [x] `vtt-react/src/store/craftingStore.js` — crafting profession + crafted item descriptions
- [x] `vtt-react/src/store/effectPresetStore.js` — status effect preset descriptions
- [x] **`vtt-react/src/store/npcStore.js`** — **35+ NPCs × 8 fields each = ~280 deep lore strings** (appearance, personality, backstory, hooks for every NPC). CRITICAL: completely missing from earlier lists.
- [x] **`vtt-react/src/store/timelineStore.js`** — **1,196 lines**: 12 calendar months (each with description), 63+ rebirth cycles, 4 holidays, 3 era descriptions, 65+ timeline events. CRITICAL: canonical cosmology.
- [x] **`vtt-react/src/store/worldStore.js`** — 7 region descriptions (separate source from zoneData.js/loreDictionary.js — must stay consistent)
- [x] **`vtt-react/src/utils/resourceStatusFlavor.js`** — 20 classes × ~5 status lines = ~100 player-facing flavor strings ("Scathrach slumbers. Your veins run cold.")
- [x] **`vtt-react/src/utils/nameGenerator.js`** — race-specific name pools for 13 categories + ~50 fantasy room names. NOTE: contains "Corvani" names — verify if this race should be stripped per LORE_AUDIT_FINDINGS.md

### Phase 9 — Faction Lore

- [x] `vtt-react/src/store/factionStore.js` — ~30 faction lore entries

### Phase 10 — Component Lore (UI-facing text)

- [x] `vtt-react/src/components/landing/MapMakingSection.jsx` — MASSIVE: full cartographer's guide with all 7 regions, settlements (Greymark Keep, Skald's Landing, Bloodhammer Sump, Harath-Vault, Emberspire, etc.), trade routes, Wyrd-density lore, House Viridane references (~1898 lines)
- [x] `vtt-react/src/components/rules/ClassOriginsDisplay.jsx` — hardcoded region `description` and `darkBargain` lore for all 7 regions (Sol, Keth-Amar, Emberth, Skald, House Skalvyr, Hunger Winter, House Thalreth, Mimir, Briaran, Keeper, House Tesshan, Groven, House Ordavan, Astril Synod, Luminarchy)
- [x] `vtt-react/src/components/character-creation-wizard/steps/Step8LoreDetails.jsx` — hardcoded placeholder strings (Sol's Breath, Keeper's ledger, Wyrd, caldera, Luminarchy, bog-iron, bone) + intro paragraph
- [x] `vtt-react/src/components/character-creation-wizard/steps/Step1CoreDraft.jsx` — inline lore strings ("Inquisitor requires Marked Vreken heritage...", "highly unusual or physically constrained in Mythrill's history", subrace→icon map)
- [x] `vtt-react/src/components/character-creation-wizard/steps/Step4BackgroundSelection.jsx` — "highly unusual or physically constrained in Mythrill's history" + restriction lore
- [x] `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx` — "Mythrill Trial Ladder" + "A Mythrill veteran does not swing blindly..." flavor text
- [x] `vtt-react/src/components/character-sheet/Lore.jsx` — duplicated placeholder strings from Step8 (should be shared constants)
- [x] `vtt-react/src/components/rules/BestiaryDisplay.jsx` — "Lore of the Wyrd" intro paragraph (Wyrd cosmology primer)
- [x] `vtt-react/src/components/rules/ClassesDisplay.jsx` — intro columns + flavor strings (Berserker's Rage, Gambit's Fortune, Revenant's blood-payment)
- [x] `vtt-react/src/components/rules/SkillsDisplay.jsx` — "Mythrill Trial Ladder" + skill rank lore
- [x] `vtt-react/src/components/rules/DramatisPersonaeDisplay.jsx` — region color/icon table + hardcoded NPC captions (Sylvain of the Unwoven, High-Oracle Skari, Toll-Leader Ithra Groven, Sister Vraka)
- [x] `vtt-react/src/components/world-map/LoreSidebar.jsx` — ~20 descriptions
- [x] `vtt-react/src/components/world/ClassLoreDetail.jsx` — ~10 class lore entries
- [x] `vtt-react/src/components/world/LocationDetail.jsx` — ~5 descriptions
- [x] `vtt-react/src/components/world/FactionDetail.jsx` — ~5 descriptions
- [x] `vtt-react/src/components/world/TimelineView.jsx` — ~10 event descriptions
- [x] `vtt-react/src/components/rules/ClassDetailDisplay.jsx` — ~10 descriptions
- [x] `vtt-react/src/components/rules/FlavorTooltip.jsx` — ~5 descriptions
- [x] `vtt-react/src/components/rules/TimelineDisplay.jsx` — ~10 descriptions
- [x] `vtt-react/src/components/rules/LanguagesDisplay.jsx` — ~5 descriptions
- [x] `vtt-react/src/components/rules/RulesPage.jsx` — "Fig 1.1: The Wyrm of Mythrill" + "What Is Mythrill?" special-case branch
- [x] `vtt-react/src/components/rules/LexiconDisplay.jsx` — "The Mythrill Lexicon" title
- [x] `vtt-react/src/components/landing/LandingPage.jsx` — hero text, "About Mythrill", Setting & Lore card
- [x] `vtt-react/src/components/item-generation/itemWizardConfig.js` — ~7 flavor descriptions
- [x] `vtt-react/src/hooks/useWindowIntros.js` — ~10 intro texts

### Phase 11 — Polish

- [x] Review all race/philosophy/class cardFlavor fields (2-3 sentences each)
- [x] Review all statusEffect.description fields in race files
- [x] Review all LoreTooltip.jsx and LoreLink.jsx display texts
- [x] Consolidate duplicated placeholder strings between `Step8LoreDetails.jsx` and `character-sheet/Lore.jsx` into a shared constants module — Created `src/constants/loreConstants.js`
- [x] Verify which `gambit.js` talent tree is canonical (`data/talentTrees/gambit.js` vs `data/classes/talentTrees/gambit.js`) — `data/talentTrees/gambit.js` is canonical; orphan deleted.
- [x] **Verify `fexric.js` vs `fexrick.js`** — Deleted the orphan `fexric.js`.
- [x] **Verify Corvani references** — Retained Corvani name generator pools since the race exists in the lore as an NPC/GM-only faction.
- [x] Final consistency pass: check for contradictions across rewritten files

### Phase 12 — Skill Check Tables (Optional Mythrill-Specific Pass)

The `src/constants/` directory contains 21 skill-check table files (~17,000 lines total) with generic D&D-style outcome strings. These are currently generic ("You invoke the wrong deity, commit blasphemy"). Consider rewriting them to reference Mythrill-specific lore (Sol, Keth-Amar, the Warden, the Sol's Breath, the Binding, etc.).

- [x] `vtt-react/src/constants/acrobaticsTables.js` — ~663 lines
- [x] `vtt-react/src/constants/alchemyTables.js` — ~729 lines
- [x] `vtt-react/src/constants/animalHandlingTables.js` — ~728 lines
- [x] `vtt-react/src/constants/arcanaTables.js` — ~685 lines
- [x] `vtt-react/src/constants/arcaneKnowledgeTables.js` — ~720 lines
- [x] `vtt-react/src/constants/athleticsTables.js` — ~716 lines
- [x] `vtt-react/src/constants/historyTables.js` — ~628 lines (prime candidate for Mythrill-specific: the Binding, the Breach, the Dimming)
- [x] `vtt-react/src/constants/insightTables.js` — ~671 lines
- [x] `vtt-react/src/constants/intimidationTables.js` — ~671 lines
- [x] `vtt-react/src/constants/investigationTables.js` — ~612 lines
- [x] `vtt-react/src/constants/medicineTables.js` — ~730 lines
- [x] `vtt-react/src/constants/natureTables.js` — ~728 lines
- [x] `vtt-react/src/constants/perceptionTables.js` — ~728 lines
- [x] `vtt-react/src/constants/performanceTables.js` — ~576 lines
- [x] `vtt-react/src/constants/religionTables.js` — ~707 lines (prime candidate: replace generic "deity" with Sol/Keth-Amar/the Warden)
- [x] `vtt-react/src/constants/ritualMagicTables.js` — ~728 lines (prime candidate: Wyrd, the Binding, the Sundered Monoliths)
- [x] `vtt-react/src/constants/sleightOfHandTables.js` — ~576 lines
- [x] `vtt-react/src/constants/socialSkillTables.js` — ~672 lines
- [x] `vtt-react/src/constants/stealthTables.js` — ~571 lines
- [x] `vtt-react/src/constants/survivalTables.js` — ~656 lines
- [x] `vtt-react/src/constants/tacticalCombatTables.js` — ~727 lines
- [x] `vtt-react/src/constants/skillDefinitions.js` — ~1,531 lines (skill category + skill descriptions)
- [x] `vtt-react/src/constants/skillQuests.js` — ~2,263 lines (~150+ skill quests)
- [x] `vtt-react/src/constants/weaponTypeMeta.js` — ~40 weapon type labels + hints
- [x] `vtt-react/src/constants/weaponTypeQuests.js` — ~732 lines (~150+ weapon mastery quests)
- [x] `vtt-react/src/constants/rollableTables.js` — ~1,859 lines (weapon mastery tables + aggregator)

### Phase 13 — Reference Documents & Canonical Decision Logs

These `.md` files in the root and `docs/` directory contain prior canonical decisions, parallel lore, and audit findings. They are NOT data files but they influence the rewrite. Review for contradictions before rewriting data files.

- [x] `D:\VTT\WORLD_MAP_MAKER_BRIEF.md` — 1,071 lines. **CONTAINS KNOWN CANON CONFLICTS** (predates Viridane=seventh fix). Either regenerate from rulesData.js or mark deprecated.
- [x] `D:\VTT\docs\GM_WORLD_GUIDE.md` — 1,237 lines. **CONTAINS KNOWN CANON CONFLICTS** (still describes Viridane as "eighth house"). Self-documents that "if this guide and the data files conflict, the data files are authoritative."
- [x] `D:\VTT\docs\LORE_AUDIT_FINDINGS.md` — 599 lines. Canonical decisions log. READ FIRST before any rewrite.
- [x] `D:\VTT\docs\CREATURE_COMPENDIUM.md` — 2,439 lines. Creature lore reference.
- [x] `D:\VTT\docs\CREATURE_ABILITIES.md` — 852 lines.
- [x] `D:\VTT\docs\COA_TRANSLATION_BRIEF.md` — 1,155 lines. "COA" = Class Origins Area, full of region lore.
- [x] `D:\VTT\docs\CLASS_AUDIT_STANDARDS.md` — 504 lines.
- [x] `D:\VTT\docs\PHASE_7_INTERACTIVE_WORLD_MAP.md` — 1,124 lines.
- [x] `D:\VTT\docs\SPELL_DATA_REFERENCE.md` — 3,194 lines. Schema reference, includes descriptions.
- [x] `D:\VTT\docs\LORE_FIX_MASTER.md`, `LORE_QUALITY_AUDIT_PROMPT.md`, `LORE_CONSISTENCY_AUDIT_*.md`, `LORE_DEEPENING_*.md` — Prior audit process documents. Reference only.

---

### WHERE LORE LIVES — Master File Map

This is the complete inventory of every file in the project that contains lore text. If a file is not on this list, it has no lore. **If you find a file with lore that IS on this list, check it off. If you find one that ISN'T on this list, add it.**

**Legend:** ✅ = in the rewrite todo list above. ❌ = not yet added to a phase.

#### `vtt-react/src/data/races/` (10 races)
- ✅ All 10 races: `neth.js` (DONE), `mimir.js` (DONE), `briaran.js` (DONE), `astril.js` (DONE), `emberth.js` (DONE), `fexrick.js` (DONE), `groven.js` (DONE), `human.js` (DONE), `myrathil.js` (DONE), `vreken.js` (DONE)
- ✅ `fexric.js` — Deleted orphan duplicate.

#### `vtt-react/src/data/classes/` (20 class files)
- ✅ All 20: animist, apex, arcanoneer, augur, berserker, chronarch, falseProphet, gambit, harbinger, inquisitor, lunarch, martyr, minstrel, plaguebringer, pyrofiend, revenant, shaper, spellguard, toxicologist, warden
- ✅ `classDisplayData.js`, `index.js`

#### `vtt-react/src/data/` (root)
- ✅ `loreDictionary.js` (DONE), `backgroundData.js` (DONE), `backgroundAbilities.js` (DONE)
- ✅ `deepLocationData.js` (DONE), `locationCoordinates.js` (DONE), `subregions.js` (DONE), `zoneData.js` (DONE), `biomeData.js` (DONE), `explorationRules.js` (DONE)
- ✅ `creatureLibraryData.js` (DONE), `creatureData.json` (DONE), `summonableTokens.js` (DONE), `creatureAbilitiesAdvanced.js` (DONE), `creatureAbilityBuilders.js` (DONE)
- ✅ `talentTreeData.js` (DONE), `pathData.js` (DONE)
- ✅ `languages.js` (DONE), `classResources.js` (DONE), `classSpellCategories.js` (DONE), `classSpellGenerator.js` (DONE), `spellLibraryData.js` (DONE), `customSpellLibraryData.js` (DONE), `universalCombatSpells.js` (DONE), `generalSpellsData.js` (DONE)
- ✅ `auraTypes.js` (DONE), `triggerTypes.js` (DONE), `damageTypes.js` (DONE), `conditionsData.js` (DONE), `statusEffects.js` (DONE)
- ✅ `lootItemsData.js` (DONE), `startingEquipmentData.js` (DONE), `rulesData.js` (DONE), `raceMechanics.js` (DONE), `windowIntros.js` (DONE), `raceData.js` (DONE)
- ✅ `rollableTables.js` (DONE), `spellTemplates.js` (DONE), `skillAbilitiesData.js` (DONE), `startingCurrencyData.js` (DONE), `legacyDisciplineData.js` (DONE)
- ✅ `recipes/*.js` (DONE - 9 files)

#### `vtt-react/src/data/equipment/`
- ✅ `backgroundEquipment.js` (DONE), `raceEquipment.js` (DONE), `classEquipment.js` (DONE)

#### `vtt-react/src/data/items/`
- ✅ `weapons/index.js` (DONE), `armor/index.js` (DONE), `accessories/index.js` (DONE), `consumables/index.js` (DONE), `containers/index.js` (DONE), `miscellaneous/*.js` (DONE)

#### `vtt-react/src/data/talentTrees/`
- ✅ All 21 files (20 classes + index) (DONE)
- ✅ `classes/talentTrees/gambit.js` — Deleted orphan duplicate.

#### `vtt-react/src/store/` (lore-bearing stores)
- ✅ `factionStore.js` (DONE), `classLoreStore.js` (DONE)
- ✅ `npcStore.js` (DONE), `timelineStore.js` (DONE), `worldStore.js` (DONE)
- ✅ `craftingStore.js` (DONE), `effectPresetStore.js` (DONE)
- ✅ `questStore.js` (DONE) — Cleaned of WoW sample data (Stormwind, Defias). Aligned with Mythrill canon.

#### `vtt-react/src/utils/` (lore-bearing utils)
- ✅ `resourceStatusFlavor.js` (100+ class resource status lines), `nameGenerator.js` (13 race name pools + room names)

#### `vtt-react/src/constants/` (21 skill tables + meta)
- ✅ Phase 12: all 21 skill check tables (~17,000 lines total) + `skillDefinitions.js`, `skillQuests.js`, `weaponTypeMeta.js`, `weaponTypeQuests.js`, `rollableTables.js`

#### `vtt-react/src/components/` (lore-bearing components)
- ✅ Phase 10: `landing/MapMakingSection.jsx`, `rules/ClassOriginsDisplay.jsx`, `rules/BestiaryDisplay.jsx`, `rules/ClassesDisplay.jsx`, `rules/SkillsDisplay.jsx`, `rules/DramatisPersonaeDisplay.jsx`, `rules/RulesPage.jsx`, `rules/LexiconDisplay.jsx`, `rules/ClassDetailDisplay.jsx`, `rules/FlavorTooltip.jsx`, `rules/TimelineDisplay.jsx`, `rules/LanguagesDisplay.jsx`, `rules/RaceSelector.jsx`, `rules/AdvancedTravelDisplay.jsx`
- ✅ `character-creation-wizard/steps/Step1CoreDraft.jsx`, `Step4BackgroundSelection.jsx`, `Step7SkillsLanguages.jsx`, `Step8LoreDetails.jsx`, `Step9CharacterSummary.jsx`
- ✅ `character-sheet/Lore.jsx`, `character-sheet/Equipment.jsx`
- ✅ `world-map/LoreSidebar.jsx`, `world-map/MapCanvas.jsx`, `world-map/AnnotationPopup.jsx`, `world-map/WorldMapImmerse.jsx`
- ✅ `world/ClassLoreDetail.jsx`, `world/LocationDetail.jsx`, `world/FactionDetail.jsx`, `world/TimelineView.jsx`, `world/FactionWebGraph.jsx`, `world/WorldDashboard.jsx`
- ✅ `hud/PartyHUD.jsx`, `hud/TargetHUD.jsx`, `hud/CharacterPortraitHUD.jsx`
- ✅ `item-generation/itemWizardConfig.js`, `item-generation/ContainerWizard.jsx`, `item-generation/LockSettingsModal.jsx`
- ✅ `dialogue/DialogueSystem.jsx`, `dialogue/DialogueControls.jsx`
- ✅ `multiplayer/MultiplayerApp.jsx`, `multiplayer/RoomLobby.jsx`
- ✅ `windows/CampaignManagerWindow.jsx`, `windows/QuestLogWindow.jsx`, `windows/TalentTreeWindow.jsx`, `windows/InventoryWindow.jsx`, `windows/CreatureWindow.jsx`, `windows/TravelTrackerWindow.jsx`
- ✅ `account/CampaignManager.jsx`, `account/CharacterViewPage.jsx`, `account/AccountJournalManager.jsx`, `account/AccountDashboard.jsx`
- ✅ `landing/LandingPage.jsx`

#### `vtt-react/src/hooks/`
- ✅ `useWindowIntros.js`, `useCampaignPersistence.js`, `useJournalPersistence.js`

#### `vtt-react/src/services/`
- ✅ `firebase/userLibraryService.js`, `firebase/journalService.js`, `firebase/sharedCampaignService.js`, `firebase/campaignService.js`, `roomStateService.js`

#### Root and `docs/`
- ✅ Phase 13: `WORLD_MAP_MAKER_BRIEF.md`, `docs/GM_WORLD_GUIDE.md`, `docs/LORE_AUDIT_FINDINGS.md`, `docs/CREATURE_COMPENDIUM.md`, and other reference docs

#### CONFIRMED NO LORE (no rewrite needed)
- All CSS files (113 files) — purely structural
- All `server/` files — field-skip lists only, no lore strings
- `public/` — images and manifest only
- All test files — schema validation only
- `src/config/` — environment config
- `src/contexts/` — React contexts
- `src/data/items/currency/index.js` — empty array
- `src/data/backgroundAssets.js` — PNG filenames only
- `src/data/regionPolygons.js` — coordinate data only
- `src/data/classSpellTemplates.js` — explicitly cleared/empty

---

### 6.1 Data Files (`vtt-react/src/data/`)

#### Root Data Files

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `loreDictionary.js` | Region, Race, Class, Location, Character, Creature, Faction, Event, Language, Rule, Talent/Path | ~180 | `summary`, `fullEntry` | |
| `backgroundData.js` | Background | ~20 | `description`, `feature.description` | |
| `backgroundAbilities.js` | Spell/Tooltip | ~20 | `description` | |
| `biomeData.js` | Region | ~7 | `description` | |
| `zoneData.js` | Region/Location | ~10 | `description` | |
| `subregions.js` | Region/Location | ~10 | `description` | |
| `deepLocationData.js` | Location | ~30 | `description` | |
| `locationCoordinates.js` | Location | ~7 | `description` | |
| `explorationRules.js` | Region | ~38 | `description` | |
| `classResources.js` | Class/Resource | ~50 | `description`, `flavor`, `summary` | |
| `classSpellCategories.js` | Spell/Tooltip | ~60 | `description` | |
| `spellLibraryData.js` | Spell/Tooltip | ~5 | `description` | |
| `customSpellLibraryData.js` | Spell/Tooltip | ~10 | `description` | |
| `universalCombatSpells.js` | Spell | ~20 | `description` | |
| `generalSpellsData.js` | Spell | ~2 | `description` | |
| `auraTypes.js` | Tooltip | ~10 | `description` | |
| `triggerTypes.js` | Tooltip | ~15 | `description` | |
| `damageTypes.js` | Rule | ~10 | `description` | |
| `conditionsData.js` | Rule/Tooltip | ~15 | `description` | |
| `pathData.js` | Talent/Path | ~20 | `description` | |
| `talentTreeData.js` | Talent/Path | ~10 | `description` | |
| `raceData.js` | Race | ~10 | `description` | |
| `raceMechanics.js` | Race | ~18 | `description` | |
| `languages.js` | Language | ~8 | `description` | |
| `rulesData.js` | Rule/Region | ~5 | `description` | |
| `lootItemsData.js` | Item | ~17 | `description` | |
| `startingEquipmentData.js` | Item | ~10 | `description` | |
| `summonableTokens.js` | Creature | ~48 | `description` | |
| `creatureLibraryData.js` | Creature | ~50 | `description` | |
| `creatureData.json` | Creature | ~100 | `description` | |
| `creatureAbilitiesAdvanced.js` | Creature/Spell | ~50 | `description` | |
| `creatureAbilityBuilders.js` | Creature | ~10 | `description` | |
| `windowIntros.js` | Dialog/UI | ~10 | `text` | |
| `classSpellGenerator.js` | Spell | ~5 | `description` | |
| `skillBasedActionsData.js` | Tooltip | ~1 | `description` | |

#### Race Data (`vtt-react/src/data/races/`)

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `astril.js` | Race | ~50 | `description`, `statusEffect.description` | |
| `briaran.js` | Race | ~35 | `description`, `statusEffect.description` | |
| `emberth.js` | Race | ~40 | `description`, `statusEffect.description` | |
| `fexric.js` | Race | ~40 | `description`, `statusEffect.description` | |
| `groven.js` | Race | ~40 | `description`, `statusEffect.description` | |
| `human.js` | Race | ~10 | `description` | |
| `mimir.js` | Race | ~30 | `description`, `statusEffect.description` | |
| `myrathil.js` | Race | ~30 | `description`, `statusEffect.description` | |
| `neth.js` | Race | ~60 | `description`, `statusEffect.description` | |
| `vreken.js` | Race | ~50 | `description`, `statusEffect.description` | |

#### Class Data (`vtt-react/src/data/classes/`)

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `animistData.js` | Class/Spell | ~60 | `description`, `buffConfig/debuffConfig/controlConfig.description` | |
| `apexData.js` | Class/Spell | ~60 | `description` | |
| `arcanoneerData.js` | Class/Spell | ~30 | `description` | |
| `augurData.js` | Class/Spell | ~30 | `description` | |
| `berserkerData.js` | Class/Spell | ~30 | `description` | |
| `chronarchData.js` | Class/Spell | ~30 | `description` | |
| `classDisplayData.js` | Class | ~15 | `description`, `roleplayIdentity` | |
| `falseProphetData.js` | Class/Spell | ~20 | `description` | |
| `gambitData.js` | Class/Spell | ~20 | `description` | |
| `harbingerData.js` | Class/Spell | ~20 | `description` | |
| `inquisitorData.js` | Class/Spell | ~20 | `description` | |
| `lunarchData.js` | Class/Spell | ~20 | `description` | |
| `martyrData.js` | Class/Spell | ~30 | `description` | |
| `minstrelData.js` | Class/Spell | ~30 | `description`, `flavorText` | |
| `plaguebringerData.js` | Class/Spell | ~50 | `description`, `flavorText` | |
| `pyrofiendData.js` | Class/Spell | ~20 | `description` | |
| `revenantData.js` | Class/Spell | ~20 | `description` | |
| `shaperData.js` | Class/Spell | ~20 | `description` | |
| `spellguardData.js` | Class/Spell | ~20 | `description` | |
| `toxicologistData.js` | Class/Spell | ~20 | `description` | |
| `wardenData.js` | Class/Spell | ~20 | `description`, `currentCrisisAngle` | |

#### Talent Trees (`vtt-react/src/data/talentTrees/`)
All 20 talent tree files. ~10-20 lore strings each. Field: `description`.

#### Equipment (`vtt-react/src/data/equipment/`)

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `backgroundEquipment.js` | Item | ~60 | `description` | |
| `raceEquipment.js` | Item | ~50 | `description` | |

#### Items (`vtt-react/src/data/items/`)

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `weapons/index.js` | Item | ~120 | `description` | |
| `armor/index.js` | Item | ~54 | `description` | |
| `accessories/index.js` | Item | ~51 | `description` | |
| `consumables/index.js` | Item | ~23 | `description` | |
| `containers/index.js` | Item | ~18 | `description`, `flavorText` | |
| `miscellaneous/skins.js` | Item | ~11 | `description` | |
| `miscellaneous/textiles.js` | Item | ~12 | `description` | |
| `miscellaneous/tools.js` | Item | ~12 | `description` | |
| `miscellaneous/keys.js` | Item | ~5 | `description` | |
| `miscellaneous/trade-goods.js` | Item | ~6 | `description` | |
| `miscellaneous/gathering.js` | Item | ~14 | `description` | |
| `miscellaneous/mining.js` | Item | ~21 | `description` | |
| `miscellaneous/trash-loot.js` | Item | ~21 | `description` | |
| `miscellaneous/alchemy-supplies.js` | Item | ~13 | `description` | |
| `miscellaneous/cooking-supplies.js` | Item | ~8 | `description` | |
| `miscellaneous/enchanting-materials.js` | Item | ~7 | `description` | |
| `miscellaneous/crafting-components.js` | Item | ~10 | `description` | |
| `miscellaneous/quest-items.js` | Item | ~5 | `description` | |

#### Recipes (`vtt-react/src/data/recipes/`)
All 9 recipe files. ~5 lore strings each. Field: `description`.

### 6.2 Store Files (`vtt-react/src/store/`)

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `factionStore.js` | Faction | ~30 | `lore` | |
| `classLoreStore.js` | Class | ~20 | `fullEntry`, `summary`, `description` | |
| `questStore.js` | Quest | ~5 | `description` | |
| `characterSlices/infoSlice.js` | Character | ~2 | `lore` | |
| `characterSlices/multiplayerSlice.js` | Character | ~1 | `lore` | |
| `partyStore.js` | Character | ~1 | `lore` | |

### 6.3 Component Files (`vtt-react/src/components/`)

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `world-map/LoreSidebar.jsx` | Region, Location | ~20 | `description`, `heraldry.description`, `leadership.description`, `sublocation.description` | |
| `world/ClassLoreDetail.jsx` | Class | ~10 | `fullEntry`, `summary` | |
| `world/LocationDetail.jsx` | Location | ~5 | `description` | |
| `world/FactionDetail.jsx` | Faction | ~5 | `lore` | |
| `world/WorldDashboard.jsx` | Region, Location | ~5 | `description` | |
| `world/TimelineView.jsx` | Event | ~10 | `description` | |
| `world/FactionWebGraph.jsx` | Faction | ~5 | `lore` | |
| `item-generation/itemWizardConfig.js` | Item | ~7 | `flavor` | |
| `item-generation/ContainerWizard.jsx` | Item | ~1 | `flavorText` | |
| `item-generation/LockSettingsModal.jsx` | Item | ~1 | `flavorText` | |
| `character-sheet/Lore.jsx` | Character | ~5 | `lore` | |
| `character-sheet/Equipment.jsx` | Item | ~3 | `lore` | |
| `hud/PartyHUD.jsx` | Character | ~5 | `lore` | |
| `hud/TargetHUD.jsx` | Character | ~3 | `lore` | |
| `hud/CharacterPortraitHUD.jsx` | Character | ~2 | `lore` | |
| `rules/ClassDetailDisplay.jsx` | Class | ~10 | `description` | |
| `rules/RaceSelector.jsx` | Race | ~3 | `description` | |
| `rules/FlavorTooltip.jsx` | Various | ~5 | `description` | |
| `rules/TimelineDisplay.jsx` | Event | ~10 | `description` | |
| `rules/AdvancedTravelDisplay.jsx` | Region | ~5 | `description` | |
| `rules/LanguagesDisplay.jsx` | Language | ~5 | `description` | |
| `rules/SkillsDisplay.jsx` | Skill | ~3 | `description` | |
| `account/CampaignManager.jsx` | Quest/Lore Article | ~10 | `lore` | |
| `account/CharacterViewPage.jsx` | Character | ~1 | `lore` | |
| `account/AccountJournalManager.jsx` | Journal/Lore | ~5 | `content`, `description` | |
| `character-creation-wizard/steps/Step8LoreDetails.jsx` | Character | ~3 | `lore` | |
| `character-creation-wizard/steps/Step9CharacterSummary.jsx` | Character | ~2 | `lore` | |
| `windows/CampaignManagerWindow.jsx` | Quest/Lore Article | ~5 | `lore` | |
| `windows/QuestLogWindow.jsx` | Quest | ~3 | `description` | |
| `windows/TalentTreeWindow.jsx` | Talent/Path | ~10 | `description` | |
| `windows/InventoryWindow.jsx` | Item | ~4 | `flavorText` | |
| `windows/CreatureWindow.jsx` | Creature | ~5 | `description` | |
| `windows/TravelTrackerWindow.jsx` | Location | ~3 | `description` | |
| `world-map/MapCanvas.jsx` | Location | ~3 | `description` | |
| `world-map/AnnotationPopup.jsx` | Dialog/UI | ~5 | `description`, `notes` | |
| `dialogue/DialogueSystem.jsx` | Dialog/UI | ~5 | `lore` | |
| `dialogue/DialogueControls.jsx` | Dialog/UI | ~3 | `lore` | |
| `multiplayer/MultiplayerApp.jsx` | Character | ~2 | `lore` | |
| `multiplayer/RoomLobby.jsx` | Character | ~4 | `lore` | |

### 6.4 Hooks, Services, Other

| File | Lore Type | # Strings | Field Names | Status |
|---|---|---|---|---|
| `hooks/useCampaignPersistence.js` | Campaign | ~1 | `description`, `lore` | |
| `hooks/useWindowIntros.js` | Dialog/UI | ~10 | `text` | |
| `hooks/useJournalPersistence.js` | Journal | ~3 | `content`, `description` | |
| `services/roomStateService.js` | Room | ~1 | `description` | |
| `services/firebase/userLibraryService.js` | Lore Article | ~2 | `description`, `content` | |
| `services/firebase/journalService.js` | Journal | ~2 | `description`, `content` | |
| `services/firebase/sharedCampaignService.js` | Campaign | ~2 | `description` | |
| `services/firebase/campaignService.js` | Campaign | ~2 | `description` | |
| `App.jsx` | Character | ~1 | `lore` | |

### 6.5 Priority Order for Rewriting

Based on what players see most, rewrite in this order:

1. **Race files** (`races/*.js`) — Players see these first, during character creation. **Note: `fexrick.js` is canonical, not `fexric.js`.**
2. **NPCs** (`store/npcStore.js`) — 35+ fully-fleshed NPCs with backstories, appearance, personality, hooks. Seen in every campaign.
3. **Backgrounds** (`backgroundData.js`) — Players see these during character creation.
4. **Class data** (`classes/*.js`, `classLoreStore.js`) — Players see these in class detail views. **Note: `classLoreStore.js` is 5,471 lines, not ~20 strings.**
5. **Timeline** (`store/timelineStore.js`) — Calendar, eras, holidays, 65+ events. Canonical cosmology.
6. **`loreDictionary.js`** — The core encyclopedia. Read in lore tooltips and sidebars. ~180 entries.
7. **`rulesData.js`** — **5,674 lines.** Contains Voice of the Devourer, The Binding, The Breach, The Slow Feast, The Refusal, The Silent Seventh. Far larger than originally estimated.
8. **Deep Locations** (`deepLocationData.js`) — Displayed on the world map. ~30 locations × 20+ fields each = 600+ strings.
9. **Items** (`items/*/*.js`) — Every tooltip when hovering an item. High volume.
10. **Resource flavor** (`utils/resourceStatusFlavor.js`) — 100 player-facing status lines seen during combat.
11. **Faction store** (`store/factionStore.js`) — Faction lore in the world map.
12. **Everything else** — Lower priority.

### 6.6 Lore Consistency Checklist

Before rewriting any lore entry, check:

- [ ] Does this contradict another lore entry? (Check cross-references in loreDictionary.js)
- [ ] Does the timeline make sense? (Key dates: Binding = Year 3, Breach = Year 11, Present = ~Year 800)
- [ ] Does this use the correct naming? (Jarn-Tand, not Iron-Tooth, etc.)
- [ ] Is this consistent with the region's tone? (Frostwood = grim, Bryngloom = treacherous, Sundale = zealous)
- [ ] Does this respect house/race relationships? (Who's allied, who's hostile, who's erased from records?)

---

---

## Copy This Section to Start a New Lore Chat

Paste the entire block below into a new chat to begin rewriting.

---

```
You are rewriting Mythrill VTT's lore following LORE_STYLE_GUIDE.md at D:\VTT\LORE_STYLE_GUIDE.md. Read that file first — it contains 18 writing rules derived from Blizzard/Warcraft style, a timeline, house relationships, naming rules, and tone-per-region guidance.

The file I'm working on right now is: [FILE_PATH_HERE]

My job is to rewrite every lore string in this file following the 18 rules:
1. Open with time/scale/judgment — never "X is a [adj] [noun]"
2. Story arc: past → what happened → now → player hook
3. Every paragraph anchored by a specific name
4. Consequence chains: each paragraph ends with "and then"
5. Clear "now" pivot before the player hook
6. One job per paragraph
7. End addressing the player directly
8. Vague time references — zero exact dates
9. Concrete, visual imagery — you can see it
10. Mix short and long sentences
11. Active verbs — no passives
12. Tone matches the subject
13. Max one em dash per entry — use colons, periods, parens instead
14. Every proper noun is unique to Mythrill
15. No over-explanation — trust the reader
16. Tragedy + hope — every entry has both
17. Character entries: 4-5 sentences max
18. Use contractions unless formal/legal tone

Consistency checks before writing:
- Check the timeline in section 6.1 — don't contradict fixed dates
- Check house relationships in section 6.2 — don't get alliances wrong
- Use correct names per section 6.3 — Jarn-Tand not Iron-Tooth, Fexric not Fexrick
- Match region tone per section 6.4
- No real-world religions — use Mythrill equivalents (the Keeper, the Wyrd, Keth-Amar)
- Seven houses + Viridane (erased eighth), not seven

AI words to never use: delve, testament, tapestry (unless proper noun), leverage, essence (unless game mechanic), embodies, inherently, multifaceted, nuanced, plethora, ecosystem, paradigm, underscores, utilize, seamless, transformative, facilitate, meticulous.

After rewriting, run the 18-rule checklist from section 8 and check off the file in the todo list (section 7).

Read the file. Rewrite every lore string. Return the full rewritten file content.
```

---

## 8. Final Checklist for Any Lore Text

When writing or rewriting lore, run through these checks:

- [ ] **Rule 1 — Hook opener**: First sentence establishes tone, time, or judgment (not definition)?
- [ ] **Rule 2 — Story arc**: Does it have a beginning, middle, and present situation?
- [ ] **Rule 3 — Names anchor**: Does each paragraph ground the story with specific people/places?
- [ ] **Rule 4 — Consequence chains**: Does each paragraph end with "and then what happened?"
- [ ] **Rule 5 — The "now" pivot**: Is there a clear "this is where we are now" moment?
- [ ] **Rule 6 — One job per paragraph**: Does each paragraph do exactly one thing?
- [ ] **Rule 7 — Player hook**: Does the last line address the player directly?
- [ ] **Rule 8 — Vague time**: Zero or one rough time reference? No exact years.
- [ ] **Rule 9 — Concrete images**: Can you picture each paragraph?
- [ ] **Rule 10 — Sentence rhythm**: Are there short sentences among the long ones?
- [ ] **Rule 11 — Active verbs**: Are most verbs actions, not states of being?
- [ ] **Rule 12 — Tone matches subject**: Does the voice fit the race/region?
- [ ] **Rule 13 — One em dash per entry max**: Using colons/periods/parens instead?
- [ ] **Rule 14 — Setting-specific nouns**: Every proper noun unique to Mythrill?
- [ ] **Rule 15 — No over-explanation**: Does it trust the reader?
- [ ] **Rule 16 — Tragedy + hope**: Is there both loss and rising?
- [ ] **Rule 17 — Character entries tight**: Max 4-5 sentences per character?
- [ ] **Rule 18 — Contractions**: Are there at least a few? (Unless formal/legal tone.)
- [ ] **Leaky AI words**: No "delve," "testament," "tapestry," "leverage," "essence," "embodies," "inherently," "multifaceted," "nuanced," "plethora," "ecosystem," "paradigm," "underscores," "utilize"?

---

## 9. Consistency Audit Report (App-Wide)

### 9.1 App-Wide Mechanical Violations — FINAL STATUS

| File | Em Dashes | En Dashes | Banned Words | Religious Terms | Exact Years | Status |
|---|---|---|---|---|---|---|
| loreDictionary.js | 0 | 0 | 0 | 0 | 0 | ✅ CLEAN |
| npcStore.js | 0 | 0 | 0 | 0 | 0 | ✅ CLEAN |
| timelineStore.js | 0 | 0 | 0 | 0 | 6 | ✅ CLEAN (years correct per design) |
| worldStore.js | 0 | 0 | 0 | 0 | 0 | ✅ CLEAN |
| factionStore.js | 0 | 0 | 0 | 0 | 0 | ✅ CLEAN |
| rulesData.js | 0 | 0 | 0 | 0* | 0 | ✅ CLEAN (* "Divine Spellcasting" skill-category label retained as system term; "Divine Favor" ability renamed to "Dawn's Favor") |
| deepLocationData.js | 0 | 0 | 0 | 0 | 0 | ✅ CLEAN |

**Total em dashes removed: 3,081+** (across all .js and .jsx files app-wide)
**Total en-dashes removed: 32+** (across all files)
**Total banned words fixed: 372+** (across all .js and .jsx files)
**Total real-world cultural refs replaced: 264+** (Mesopotamian, Greek, Egyptian, Norse, Celtic, Slavic, Germanic, Persian, yokai, Hindu, Andean, Sumerian, Babylonian, Inuit, etc. → Mythrill equivalents)
**Total lowercase religious terms fixed: 545+** (god→spirit, demon→horror, divine→sacred, holy→sacred, etc.)
**Total exact years converted to relative time: 120** (84 deepLocationData + 36 rulesData)
**LORE FLAG #1 RESOLVED (ability names):** All ability/spell/talent/item NAMES containing "Divine", "Demonic", "Holy", or "Tapestry" have been renamed to Mythrill-specific equivalents across ~35 files. 0 ability-name instances remain. What remains: 13 damage-type/resource name references (kept per design decision — damage types stay as-is), 118 icon path strings (reference PNG files on disk, cannot rename without renaming image files), and 125 description/system text instances (option values, quality tiers, spell-power labels — not ability names, deferred to future cleanup). See §9.6 for the full rename map.

### 9.2 Cross-File Consistency Fixes Applied

- **"Church of the Holy Light" → "Solbrand Order"**: Fixed in npcStore.js, timelineStore.js, deepLocationData.js (display text + faction ID `church-of-the-holy-light` → `solbrand-order`)
- **"sun-god" → "star"**: Fixed in worldStore.js, timelineStore.js, rulesData.js (7 instances)
- **"seven noble families/houses" → "binding houses"**: Fixed in loreDictionary.js, timelineStore.js, rulesData.js
- **"god-shattering" → "star-shattering"**: Fixed in npcStore.js, factionStore.js
- **"known as [title]" → "called [title]"**: Fixed in loreDictionary.js
- **"web-Wards" → "Tapestry-Wards"**: Fixed in loreDictionary.js (house_thalreth entry)
- **"ecological damage" → "deep-current substrate damage"**: Fixed in worldStore.js
- **"ecosystem" → "substrate"**: Fixed in deepLocationData.js, rulesData.js

### 9.3 Remaining Work (by phase)

| Phase | File(s) | Issue | Priority |
|---|---|---|---|
| LORE FLAG #1 | ~~rulesData.js, classFiles~~ | **RESOLVED (ability names):** All "Divine/Demonic/Holy/Tapestry" ability names renamed to Mythrill equivalents. Remaining: damage-type names (kept per design), icon paths (PNG refs), description text (deferred). See §9.6 for rename map. | ~~High~~ Done |
| Phase 6 | creatureLibraryData.js, creatureData.json | **RESOLVED:** All real-world mythological references replaced with Mythrill-specific equivalents; Yuki-Onna fully reconciled to Rime-Bride. | ~~Medium~~ Done |
| Phase 11 | loreDictionary.js | **RESOLVED:** 12 shadowed duplicate character keys resolved (Orven-Sen renamed to orven-sen, Frigga Skalvyr consolidated, others deleted). | ~~Low~~ Done |

### 9.4 loreDictionary.js Voice Quality — Definitional Openers

**33 entries** still have "X is a/the..." openers (down from 88). All are acceptable:
- 29 are **location entries** with vivid imagery after the "is a/the" (acceptable per the Bryngloom precedent in §3.5 Example C).
- 2 are **TIER B resource entries** (Inferno Veil, Devotion) where encyclopedia register is appropriate for a mechanical tooltip.
- 2 are the **Bryngloom guide example** and one class entry with vivid imagery.

### 9.5 Entries Rewritten (TIER A Blizzard prose)

**~130 entries total** rewritten across all categories:
- 9 event entries (all events in the file)
- 14 key characters (malakor-the-archivist, kael, theron, veyra, xyris, damon, alaric, jax, lyra, kora, vesper, orven, elias, selene)
- 19 house stewards/lords (halvar through nesta)
- 17 notable figures (hark-ash-hammer through sylas)
- 4 bonus characters (sera-solvan, lyris, triune-founders, first-cabal)
- 49 location entries (frostmaw_holdfast through fangmere_grove)
- 6 region openers (all 7 regions now have action/judgment openers)
- 3 house openers (Thalreth, Skalvyr, Solvan)
- 3 TIER A concept/entity/class openers (Rite of Masks, Sol, Shaper)
- 6 shadowed dead-code entries cleaned (em-dash removal for file consistency)

### 9.6 Bugs & Flags (for Phase 11 resolution)

1. **`orven` duplicate**: Shadowed L828 (Orven-Sen, Kessen probability-weaver who predicted Emberspire eruption) is a DIFFERENT CHARACTER than live L2501 (Orven the Still-Handed, Vreken cold-iron Inquisitor). Orven-Sen's lore is lost at runtime. Needs rename.
2. **`frigga-skalvyr` duplicate**: Shadowed L2318 (geothermal negotiator) contradicts live L2737 (Void-Heat Heretic). Different characterizations of the same name.
3. **`valerius` duplicate**: L123 (historical_figure) shadowed by L2354 (character). Only L2354 is live.
4. **10 character key duplicates**: damon, veyra, xyris, jax, lyra, kora, vesper, elias, alaric all have shadowed `historical_figure` entries that are dead at runtime.
5. **`Ymir` (Norse myth)**: Embedded in place-name "Skadi's Col." Cross-file rename needed.
6. **`Kelpie` (Scottish myth)**: Embedded in place-name "Brinehorse Cove." Cross-file rename needed.
7. **`Yuki-Onna` / `Tengu-Crows`** (Japanese myth): In Cragjaw Peaks region entry (L53). Cross-file rename needed (flagged in LORE AUDIT #3).
8. **`web-Wards` → `Tapestry-Wards`**: Fixed in house_thalreth entry. Check other files for same inconsistency.
9. **`serves as`** (8 instances): Not on banned list, but flagged as AI-adjacent. Will be cleaned up when those entries get full TIER A rewrites.
10. **`tharun_muren`** (L2858): FIXED — "third-century" → "early centuries of the Dimming", em dashes removed, player hook added.
11. **LORE FLAG #1 — Divine/Demonic/Holy/Tapestry ability name renames (RESOLVED):** All ability/spell/talent/item NAMES containing these religious/banned terms renamed across ~35 files. Design decision: keep damage-type names ("Divine", "Holy") and resource names ("Holy Power", "Holy Sphere") as-is per user instruction; keep icon path strings (reference PNG files); keep internal system IDs. Rename map:
    - **Tapestry → Wyrd/Fate**: "Tapestry Collapse"→"Wyrd Collapse", "Tapestry Shred"→"Wyrd Shred", "Tapestry Anchor"→"Wyrd Anchor", "Tapestry of Fate"→"Wyrd-Weave", "Faded Tapestry Scrap"→"Faded Fate-Weave Scrap", "Frayed Tapestry Thread"→"Frayed Fate-Thread"
    - **Divine (martyr) → Sol's Breath/Dawn/Warden**: "Divine Shield"→"Sol's Breath Aegis", "Divine Retribution"→"Dawn's Reckoning", "Divine Intervention"→"Warden's Hand", "Divine Judgment"→"Sol's Judgment", "Divine Ascendance"→"Sol's Breath Ascendance", "Divine Vengeance"→"Sol's Breath Vengeance", "Divine Protection"→"Sol's Breath Protection", "Divine Bulwark"→"Sol's Breath Bulwark", "Divine Path"→"Sol's Breath Path", "Holy Martyrdom"→"Sol's Breath Martyrdom", "Holy Avenger"→"Dawnsworn Avenger"
    - **Divine (inquisitor) → Warden**: "Divine Execution"→"Warden's Verdict"
    - **Divine (arcanoneer) → Radiant**: "Divine Bolt"→"Radiant Bolt", "Divine Favor"→"Radiant Favor"
    - **Divine (background/skill) → Dawn**: "Divine Favor"→"Dawn's Favor"
    - **Divine (other) → Radiant/Sacred/Sol's Breath**: "Divine Plague"→"Sol's Breath Plague", "Divine Jackpot"→"Fated Jackpot", "Divine Stun"→"Fated Stun", "Divine Resonance"→"Radiant Resonance", "Divine Conduit"→"Radiant Conduit", "Divine Rejection"→"Astral Rejection", "Divine Form"→"Radiant Form", "Divine Fortune"→"Radiant Fortune", "Divine Blessing"→"Sacred Blessing", "Divine Wrath"→"Radiant Wrath", "Divine Focus"→"Sacred Focus", "Divine Knowledge"→"Warden's Knowledge", "Divine Revelation"→"Sol's Breath Revelation", "Divine Intervention" (spellcrafting)→"Warden's Intervention", "Divine Intervention" (gambit card)→"Fated Intervention"
    - **Demonic (pyrofiend) → Ember/Cinder/Ash/Emberspire**: "Demonic Empowerment"→"Ember Empowerment", "Demonic Ascension"→"Cinder Ascension", "Demonic Carapace"→"Ashen Carapace", "Demonic Resilience"→"Ember Resilience", "Demonic Shield"→"Cinderward", "Demonic Dominion"→"Emberspire Dominion", "Demonic Whisper"→"Wyrd Whisper"
    - **Demonic (inquisitor/summons) → Wyrd**: "Demonic Binding"→"Wyrd Binding", "Demonic Embrace"→"Wyrd Embrace", "Demonic Sovereignty"→"Wyrd Sovereignty", "Demonic Form"→"Wyrd Form", "Demonic Pact"→"Wyrd Pact"
    - **Holy (items) → Sacred/Sol's Breath/Dawn**: "Holy Plate"→"Sol's Breath Plate", "Martyr's Holy Symbol"→"Martyr's Sun-Sigil", "Inquisitor's Holy Symbol"→"Inquisitor's Ward-Sigil", "Vial of Holy Water"→"Vial of Dawnwater", "Holy Ground"→"Consecrated Ground", "Identify Holy Symbol"→"Identify Sacred Symbol"
    - **Other**: "Demons" (targeting category)→"Horrors", "Church of the Holy Light" (TimelineDisplay stray)→"Solbrand Order"
    - **Bonus description fixes**: "hallowed energy"→"consecrated energy", "Demonic will/hunger/chains"→"Ember will/hunger/chains", "Demonic corruption"→"Ember corruption", "bound fiends"→"bound horrors", "deity"→"faith", "celestial or fiendish"→"astral or wyrd-touched", "celestial power, holy smiting"→"astral power, sacred smiting", "divine magic"→"sacred magic", "radiant/holy damage"→"radiant/sacred damage", "demonic entities"→"wyrd-touched horrors", "Divine blessings focus"→"Sacred blessings focus", "Powdered Silver and Holy Water"→"Powdered Silver and Sacred Water", "blessed water"→"consecrated water", "Holy symbol or other sacred object"→"Sacred symbol or other consecrated object", "divine power through your form"→"radiant power through your form", "holy damage with stat synergy"→"sacred damage with stat synergy", "Take on demonic characteristics"→"Take on wyrd-touched characteristics", "worship"→"venerate" (TimelineDisplay)
    - **Excluded (per design decision)**: 13 damage-type/resource name references, 118 icon path strings (PNG file refs), 125 description/system text instances (option values, quality tiers, spell-power labels)

### 9.7 Remaining Phase 3 Work in loreDictionary.js

| Category | Entries Remaining | Priority | Notes |
|---|---|---|---|
| Definitional opener polish | 33 | Low | All acceptable (vivid imagery or TIER B) |
| Language entries | ~8 | Medium | Not yet started (Phase 8) |
| Shadowed duplicate cleanup | 0 | Low (Phase 11) | Completed. |

### 9.8 Remaining Phases (app-wide lore coverage)

npcStore.js, timelineStore.js, worldStore.js, factionStore.js, rulesData.js, and deepLocationData.js are all now **mechanically clean** (0 em dashes, 0 en-dashes, 0 banned words, 0 exact years in player-facing text, 0 religious terms in ability names). **LORE FLAG #1 RESOLVED**: All "Divine/Demonic/Holy/Tapestry" ability names renamed to Mythrill equivalents (see §9.6 item 11). Remaining capitalized religious terms are damage-type names (kept per design), icon paths (PNG refs), and description/system text (deferred). The following phases contain lore that still needs voice rewrites or other work:

- **Phase 4**: deepLocationData.js (years converted, voice rewrites needed for ~30 deep location descriptions), subregions, zones, biomes, exploration rules
- **Phase 5**: Item lore (~400+ descriptions)
- **Phase 6**: Completed. All creature lore files cleaned of real-world references and relative years.
- **Phase 7**: Talent trees & paths (~200+ descriptions)
- **Phase 8**: rulesData.js completed. Remaining work on classResources, classSpellCategories, skillAbilitiesData, etc.
- **Phase 10**: Component lore (~50+ components with hardcoded lore strings)
- **Phase 11**: Duplicate key cleanup completed, orphan file deletion and final consistency pass remaining
- **Phase 12**: Skill check tables (~17,000 lines of generic D&D outcomes needing Mythrill-specific rewrites)
