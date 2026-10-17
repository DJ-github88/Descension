# CR0-H4-threshold — bounded cultural reading

## Nethien / velun_neth

Source vtt-react/src/data/races/neth.js; subrace velun_neth.

**illustrationCaption:** “In Atropolis, every breath is notarized and every promise is recorded in sovereign ink. The law outlives the flesh.” — High Magistrate Vael

**visualDescription:** The inheritors of Morvane's authority carry the pact in their bearing. Like all Athien they are tall and slender, pale to the point of luminousness, with dark pool-like eyes, but a Athien's eyes are often described as reflecting a contract-glyph spiraling slowly around the pupil that only they can see. Their colorless spider-silk hair is worn long under layered ghost-silk robes of pale, authoritative cut. Their chests do not visibly rise and fall with breath, the stilled mark of the pact made visible, and they move with the unhurried certainty of people whose every word may be enforced by a god.

**tooltipSummary:** Contract-lords whose words carry binding weight, commanding authority through the Pact's enforceable legacy.

**description:** The original pact-bound Athien bloodline, predating later Riven severance. They cannot knowingly make false pact-enforced assertions; withholding, conditional statements and literal loopholes are distinct. Morvane enforces actual First Contract obligations, not every unrelated patron's bargain or every hypothetical statement. Their preserved bodies and spoken clauses carry the partnership's authority within its scope.

**culturalBackground:** The Athien trace their bloodline to the original scribes who presented the First Contract to Morvane, Vaelis the Scribe's direct descendants, generation by generation, clause by clause. They run Atropolis. They write the contracts that govern Athien society. They negotiate with the Solari, the humans, the Mimir, anyone who needs Athien preservation-craft or Athien memory-glass, and their negotiations are always, always binding.

Athien children are educated in the contract-halls from the moment their pale skin stabilizes, usually around age five or six. They learn to read ancient scrolls and contract covenants before they learn to read spoken faces. They learn contract law before they learn ethics. They learn that every word they speak carries weight, and that weight accumulates, a careless promise at ten becomes a binding obligation at fifty, and Morvane does not distinguish between a child's protestation and an adult's oath.

A Athien's power is their voice. When they invoke a clause aloud, a binding, a sealing, a cosmic enforcement, the pact responds. The air thickens. The light shifts. Everyone in the room feels Morvane's attention settle on the proceedings like a held breath. A Athien who has perfected their craft can seal a contract with a single spoken sentence that no signatory can ever break, not without consequences that ripple across generations.

The flaw is inseparable from the gift: a knowingly false pact-enforced assertion is forbidden, and an actual obligation carries consequences. Withholding, literal loopholes, and conditional statements require careful wording but are not automatically new obligations. First Contract jurisdiction is bounded; it does not turn every child's protest or hypothetical into an omniscient universal contract.

They view the Weft with a mixture of admiration and unease, the Weft see the web behind the text, the implications the Athien cannot perceive, and that makes them useful and unpredictable. They view the Riven with something closer to horror, the Riven are what happens when a Athien decides the pact's weight is heavier than the silence, and the Athien cannot process a choice that results in legal non-existence.

Trait Bound Tongue: Advantage on Persuasion when negotiating formal agreements. Knowingly false pact-enforced assertions are forbidden. Breaking an actual First Contract commitment deals the recorded 1d4 wyrd damage and Deception penalty; hypothetical statements, withholding and unrelated bargains are not automatically enforceable clauses.

Trait Clause of Binding: Invoke Morvane's authority to seal a spoken agreement with pact-magic. The target who accepts your terms is cosmically bound: if they break the promise, Morvane exacts a price. But the clause binds you equally, if you break your own word, the price is yours to pay.

Trait Canopy-Scholar: +2 to History and Arcana checks involving the Bryngloom Forest, contract law, Morvane, Athien genealogy, or the Wyrd. Requires 1 hour of archive maintenance per long rest to keep the bonus; missing it forfeits the bonus until you spend 1+ hour catching up. (You trained in the Canopy-Ledger, the living archive where Athien contracts sit in crystallized tree-sap that pours knowledge straight into the reader's mind; your education never truly ended.)

Trait Pact-Flame: Once per long rest, invoke Morvane's authority against a target within 30 feet that has broken a promise, contract, or oath within the last 24 hours. The target takes 2d6 wyrd damage (no save). Morvane does not forgive debts, and your voice carries its collection notice.

Current native: Animist, Arcanoneer, Revenant, Chronarch, Spellguard.

- **Animist** (vtt-react/src/data/classes/animistData.js:150): The Ledger-Summoner. Ledger-Citation: Spirits are summoned by referencing their exact entry in the archive; the more precise the citation (full name, dates, contract history), the stronger the bond. A mis-citation summons the wrong ancestor, and the Athien cannot legally dismiss what they have invoked.
  Edge (equipment=archive_citation): A precise archive citation stabilizes the requested spirit.. Cost: A bad citation must be resolved, not casually dismissed.. Access: normal-tradition; requirements spirit_anchor, communion_apprenticeship.

- **Arcanoneer** (vtt-react/src/data/classes/arcanoneerData.js:54): The Contract-Weaver. Mnemonic Shard: Silver blood crystallizes into volatile spell-anchors, held in suspension around the weaver's crystal focus. Each shard is a filed clause, a prepared spell held in legal suspension. A misfiled shard cannot be recalled, only detonated, because the contract has already been struck.
  Edge (equipment=mnemonic_shard): Filed syntax and Mnemonic Shards stabilize a declared, prepared formulation.. Cost: Filed parameters cannot be freely amended in the field.. Access: normal-tradition; requirements elemental_training, compatible_interface.

- **Revenant** (vtt-react/src/data/classes/revenantData.js:31): The Document-Preserved. Filed Soul: Your phylactery has documented provenance and resists hostile Wyrd corruption; its existence does not release your old obligations.
  Native reframe: Vesper, a Athien scribe dying of sump-lung-rot, performed the forbidden Rite of the Cold Hearth, binding his soul to a basalt phylactery and freezing his own decay. The Athien Revenant treats the soul as a document to be preserved: filed, anchored, and impossible to un-write.
  Crisis: The First Contract is fracturing, and clauses that preserved Athien souls for centuries are being rejected; a Athien Revenant whose phylactery depends on a broken clause may simply stop returning.
  Edge (equipment=archive_filed_anchor): A filed soul anchor with reliable provenance maintains the unlife state.. Cost: Its existence does not release old obligations.. Access: normal-tradition; requirements threshold_transition, finite_soul_anchor.

- **Chronarch** (vtt-react/src/data/classes/chronarchData.js:110): The Archive-Keeper. Memory-Glass Lattice: Temporal effects are stored in a crystal archive rather than the body; the Athien Chronarch externalizes temporal feedback into an ever-growing memory-glass lattice, allowing them to recall any witnessed moment with perfect clarity but at the cost of an increasingly encumbered stillness the young Athien are beginning to find unbearable.
  Edge (equipment=memory_glass_lattice): You store and retrieve a witnessed local state from a memory-glass lattice.. Cost: Finite archive and processing burden; Strain still applies.. Access: normal-tradition; requirements temporal_anchor, calibration_training.

- **Spellguard** (vtt-react/src/data/classes/spellguardData.js:95): The Clause-Canceller. Clause-Annulment: A trained clause-annulment interface dismantles a legible spell rather than taking its full impact. It still retains finite captured residual AEP and accounts for the dissipated remainder. Reduced yield is not zero-resource immunity. Illegible or foreign structure defeats this special method; ordinary compatible containment remains the baseline, not an ancestry-wide loss of Spellguard ability. No automatic yield percentage is applied by the resource tracker.
  Edge (equipment=contract_clause): Adapting Damon's structural analysis resolves one legible clause-bound attack precisely.. Cost: Lower captured yield; wild/foreign structures need ordinary containment instead.. Access: normal-tradition; requirements containment_induction, compatible_interface, venting_training.

## Weft / kessen_neth

Source vtt-react/src/data/races/neth.js; subrace kessen_neth.

**illustrationCaption:** “Beneath the grand chanceries lies the Under-Ledger, where debts are settled in dark water and whisper-coin.” — Shadow-Canal Proverb

**visualDescription:** Sly, cunning, and razor-sharp, the Weft are the street-smart shadow-brokers of the Athien. Adapted to subterranean gloom and canal fog, they possess a lean, wiry silhouette with slate-tinted pale skin and dark charcoal-streaked black hair tied back loosely. Their most striking feature is their luminous coin-silver eyes, which reflect lantern-light like a cat's in the dark and dart with calculating intelligence. They dress in dark wool traveling capes with concealed pockets, waxed oilskin vests, fingerless gloves, and soft leather boots, carrying handheld brass balance scales, spring-loaded stilettos, and hooded dark-lanterns.

**tooltipSummary:** Sly and cunning under-fog shadow-brokers who exploit obligation-webs, trading contraband, secrets, and probability in subterranean canals.

**description:** The sly and cunning underworld subrace of the Athien. Operating in the misty subterranean canals and shadowed vaults beneath Atropolis, the Weft perceive the invisible obligation-threads of the world and exploit them with ruthless ingenuity. Rather than serving the rigid letter of the First Contract, they weave through its loopholes, trading in contraband debts, secret pledges, forged passes, and probability itself.

**culturalBackground:** Under-Ledger is the lower canal/undercity district among Atropolis's grown ironwood root works. Weft brokers, appraisers, couriers, and information merchants read obligation-threads and negotiate loopholes; criminal syndicates are particular institutions, not every person's morality. Their coin-silver eyes and pale frames carry the history of raw Well over-drawing. They remain pact-bound, with preservation and Fraying obligations distinct from the House's separate credit.

Trait Morvane's Sight: Advantage on Insight checks to detect deception, read a creature's true loyalties, or gauge whether a promise is sincere. In social situations of more than 10 people you suffer disadvantage on Spirit and Charisma checks as the obligation-web overwhelms you, and your obligation-threads remain visible to any creature with supernatural perception. (You perceive the debt-threads binding all things; the web reveals everything, and the web is everywhere.)

Trait Probability-Weave: Tug a thread in the obligation-web at the precise moment. The universe rearranges itself around your intervention. Something elsewhere in the web snaps, you feel it break, but you will never know what it was.

Trait Temporal Ledger: +2 to initiative rolls, and once per long rest you may ask the GM one truthful but cryptic question about the approaching consequences of a situation. A failed or ominous divination answer imposes disadvantage on your next initiative roll. (Time is the longest obligation-thread; you feel promises coming due long before they arrive.)

Trait Thread-Snap: Once per long rest, when a creature within 60 feet makes an attack roll, ability check, or saving throw, you can force them to reroll and take the new result. You take 1d4 wyrd damage as the obligation-web recoils through your consciousness.

Current native: Augur, Gambit, Revenant.

- **Augur** (vtt-react/src/data/classes/augurData.js:163): The Web-Tally. Tension-Reading: Reads the immediate future in the strain-patterns of the obligation-web: which strand is about to break, which party to a contract is about to default, which oath is about to be tested. The Weft are the tradition's most *auditable* Augurs, their readings can be verified after the fact against the web itself, which is both their strength (reproducible omens) and their curse (a wrong reading is a documented failure, and the web remembers).
  Edge (bond=obligation_ledger): Obligation-web strain lets the Augur audit a specific impending failure.. Cost: The ledger has scope and can contain forged or altered data.. Access: normal-tradition; requirements divination_training, divination_focus.

- **Gambit** (vtt-react/src/data/classes/gambitData.js:43): The Clause-Gambler. Clause-Analysis: Probability is calculated as contract-law; the Gambit reads opponents' tells as legal exposures and stakes against the binding-force of their own word. A Weft Gambit cannot bluff, but they can structure a wager so that losing it benefits them more than winning, which is the same thing, legally.
  Native reframe: The <LoreLink termId="neth">Weft</LoreLink> read the obligation-web the way other people read ledgers, so when a ring of contraband runners was cornered in a flooding vault by Inquisition auditors, their ringleader did the only thing a Weft could do: she scattered blank scrimshaw tiles across the wet stone and asked the void what the room cost. She staked caste, pedigree, and ancestral memory. Probability inverted, the vault floor cracked open, and the House took payment in the one currency no Athien ledger could record: her bloodline's standing in the web. The House holds every Weft Gambit's fate-threads as collateral now. Their names survive; their luck no longer belongs to them. As long as they keep raising the stakes, they stay solid. Fold, back down, choose the safe path, and reality remembers the deficit.
  Crisis: Lyra has radicalized. Her Deck-Burners faction seeks to force the universe to choose, burning their rune-cards to collapse probability into certainty. The Weft Gambits of Ironjaw Port consider this heresy: a Gambit who forces the outcome is no longer gambling, and a Athien who no longer gambles is, by the terms of their own tradition, in breach of the debt that keeps them solid.
  Edge (bond=visible_obligations): Fate-thread collateral structures a truthful wager through visible obligations.. Cost: Cannot knowingly make a false pact assertion; collateral can fray independently.. Access: normal-tradition; requirements house_wager, initiation_survival, wager_discipline.

- **Revenant** (vtt-react/src/data/classes/revenantData.js:110): The Lien-Holder. Open-Ledger: Toll is drawn from outstanding obligations owed to and by the host; every unpaid entry anchors them further, and their phylactery is the ledger itself. The moment the web reads settled, the Weft drops where they stand, which is the only retirement the tradition recognizes.
  Native reframe: The <LoreLink termId="neth">Weft</LoreLink> read the obligation-web the way other people read weather, and a Weft Revenant is what the web does when a reader dies with entries still open. Death closes the account, but the web keeps the reader: unpaid obligations haul the body back the way a creditor hauls a debtor out of a canal, and the Revenant returns to finish what the web still lists as owed.
  Crisis: The dead marching toward the Monoliths are visible in the web as a mass settlement: something is paying every obligation at once and calling in every lien. A Weft Revenant who accepts the payment becomes a willing marcher; one who refuses becomes an unbalanced entry, and the web has begun sending collectors, their own risen kin, to close the difference.
  Edge (equipment=prepared_ledger): You audit one binding obligation through a prepared ledger.. Cost: Completing the covenant can release the anchor.. Access: normal-tradition; requirements threshold_transition, finite_soul_anchor.

## Riven / drun_neth

Source vtt-react/src/data/races/neth.js; subrace drun_neth.

**illustrationCaption:** “Among the ruins of Severance Hold, the Riven seek the silence that exists beyond all contracts.” — Chronicler of the Severed

**visualDescription:** Gaunt and haunting, the Riven bear the unpreserved pale frame of their kin, with paper-white dry skin, faint bluish veins, and pale-grey eyes in hollow sockets. Their chests rise and fall with ordinary breath. Wispy snow-white hair, rune-etched scars, ash-grey wraps, scholar bandoliers, stone-chisels, and severed debt-collars mark some ruin-scrivener traditions. Their souls were not universally stolen: the pact no longer preserves their bodies, and their appearance is not proof of undeath or ancestral guilt.

**tooltipSummary:** Riven, finite-lived Athien who eat, drink, sleep, and build lives beyond the First Contract; ruin-scriveners are one of their traditions.

**description:** The Riven descend from deliberate Severing, pioneered by Saren-Vel after the First Contract's founding. Burning their signatures from the pact removes its preservation and enforcement. They eat, drink, sleep, and slowly age. Pact authorities call this ancestral sin; it is not author truth that their souls were stolen. Their removed signatures defeat First Contract-keyed detection, not ordinary sight or every magical sensor.

**culturalBackground:** Riven communities include ruin-scriveners, epigraphers, enchanters, couriers, and outcasts. Severance Hold preserves fallen libraries and underground workshops; Over-Shanty and Deep-Quarter serve other lives beyond pact administration. Scholars take rubbings and study salvaged relics for knowledge, restoration, or chosen craft, not a universal obligation to recover stolen souls. Ordinary trade and trust-based promises remain possible outside First Contract jurisdiction.

Trait Severed: Your removed First Contract signature cannot be invoked for pact enforcement, signature-keyed detection, or Fraying. This is not universal magic immunity or invisibility. You lack pact preservation, eat, drink, sleep, and slowly age. Pact-dependent legal standing is lost; ordinary trade elsewhere remains possible.

Trait Silence-Walker: Trained silence-walking grants advantage on Stealth checks. First Contract signature-keyed tracking cannot find your removed signature, but ordinary tracks, scent, eyes, and unrelated magical sensors can reveal you. Your voice has no pact-weight in First Contract courts.

Trait Bog-Hardened: Resistance to blight damage and advantage on Survival checks in swamps, bogs, or the Bryngloom Forest. When you enter a location holding a strong First Contract copy (Atropolis, Ironjaw Port), you must make a DC 12 Constitution save or be sickened for 1 hour. (You survived the Severing and the bog that followed; the deep wild has stopped trying to kill you.)

Trait Null-Strike: Once per short rest, make a melee attack that deals +1d4 arcane damage. On hit, dispel one magical effect currently active on the target (GM chooses if multiple). Your severed nature unravels magic on contact; the pact cannot feel you, and neither can its spells.

Current native: Plaguebringer, False Prophet, Revenant, Toxicologist.

- **Plaguebringer** (vtt-react/src/data/classes/plaguebringerData.js:61): The Silence-Host. Silence-Cultivation: Cultivated diseases take root faster and more virulently in the Riven's partially-dead flesh, generating more Virulence per affliction cast. The cost: the Riven's decay *accelerates* with each cultivation, they are spending their remaining life as substrate.
  Edge (state=unpreserved_flesh): Refugee culture incubates a defined strain in unpreserved flesh.. Cost: Accelerates finite bodily decay; no universal immunity.. Access: normal-tradition; requirements introduced_culture, host_compatibility, cultivation_training.

- **False Prophet** (vtt-react/src/data/classes/falseProphetData.js:52): The Severance-Doctor. Severed Link: Your psychic links escape First Contract-keyed scrutiny because you were never entered in the record; you still have no immunity to the Voice, Madness, or ordinary witnesses.
  Edge (state=severed_contract): Struck from the First Contract, you escape First Contract-keyed scrutiny of your faith.. Cost: No immunity to the Voice, Madness, or ordinary witnesses.. Access: normal-tradition; requirements channel_encounter, link_training.

- **Revenant** (vtt-react/src/data/classes/revenantData.js:78): The Contract-Expired. Unrecorded-Death: The Revenant state is invisible to the Keeper and to contract-magic; a Riven Revenant cannot be sensed, bound, or dismissed by any system that relies on legal recognition. They are ghosts to the bureaucracy that governs all other Athien undeath, and pay for it with total social nonexistence.
  Native reframe: The <LoreLink termId="neth">Riven</LoreLink> severed all contracts and legally do not exist, and the Revenant state is, for them, the *fulfillment* of that legal non-existence made metaphysical. A Riven Revenant is a being the Keeper cannot see, the First Contract cannot bind, and death cannot claim, because they have already been erased from every ledger that governs such things. They are the freest undead in existence, and the loneliest.
  Crisis: The bog-graves waking is, to the Riven, a *jurisdictional crisis*: the risen dead are being routed by something the Keeper *does* see, and the Riven, unrecorded, unbound, are the only Revenants immune to the routing. Some Riven Revenants have realized they are the only undead still capable of *free movement*, and the question of whether to flee the marching dead or investigate what is driving them has split the caste entirely.
  Edge (state=severed_contract): Legally dead and severed, you avoid First Contract-keyed sanctions on your return.. Cost: Ordinary death and anchor destruction still apply.. Access: normal-tradition; requirements threshold_transition, finite_soul_anchor.

- **Toxicologist** (vtt-react/src/data/classes/toxicologistData.js:108): The Silence-Distiller. Null-Distillate: Toxins are distilled from the Toxicologist's own decaying flesh, carrying the Silence that voids Morvane's contractual detection. Riven poisons are legally untraceable  -  the Ledger simply cannot register them as existing  -  and they bypass magical wards that key off First Contract signatures. The cost: each distillation accelerates the Riven's dissolution, spending their remaining half-life as reagent.
  Edge (state=severed_contract): You brew a null-distillate that registers as nothing on the First Contract.. Cost: Faster finite bodily decline; the substance still exists.. Access: normal-tradition; requirements tolerance_induction, distillation_training.

## Bedel / clean_vreken

Source vtt-react/src/data/races/vreken.js; subrace clean_vreken.

**illustrationCaption:** “Beneath the peat and root-canopy, the Bedel keep vigil where sunlight cannot burn.” — Veil-Speaker Tradition

**visualDescription:** The inheritors of Deep-Glow, the oldest and most stable fungal strain, the Bedel bear their transformation lightly. Their features are closer to the original elven forms than any other Mycellan, elegant cheekbones, long tapered limbs, ears that curl only gently, and their lantern-eyes burn a controlled rust-amber, warm and steady, easily dimmed in polite company. They favor dark monastic cassocks embroidered with fungal-thread that marks bloodline and vocation. Pale-skinned and composed, they move with the quiet authority of people whose biology has never been a war, and they are accustomed to being stared at but never to being doubted.

**tooltipSummary:** Steadfast crypt-keepers whose stable Deep-Glow blood leaves them closer to the old elven forms, moving through the world with composed rust-amber sight and quiet authority.

**description:** The inheritors of Deep-Glow, the oldest and most stable fungal strain, bonded to their ancestors in the deep caves before the Wyrd wounded Morvane. Their transformation was less severe: their features are closer to their original elven forms, their lantern-eyes burn a controlled rust-amber, warm and steady, easily dimmed in polite company. The Deep-Glow strain threads less deeply through their nervous systems, leaves their minds more stable, their bodies more composed. They are near-total immune to the Over-Lit addiction: not morally superior, merely less entangled in Morvane's wound, carrying a strain that does not intoxicate. Disproportionately represented in trade delegations, crypt-councils, scriptorium gatekeeping, and every position that faces the outside world. Their privilege is invisible to them, they have never had to fight the hush, so they do not understand why the Cromyx cannot simply resist it. The flaw they carry is the quiet assumption that their biological luck is a form of virtue.

**culturalBackground:** The Bedel trace their bloodline to the first Mycellan who carried Deep-Glow, the stable, warm-amber fungal strain that threads least deeply through the nervous system and produces steady light with minimal intoxication. Their tradition is continuity: the scriptoriums, the crypt-councils, the trade routes, the diplomatic missions to Athien grave-cities and Solari forge-halls. The Bedel are the face the Mycellan show to outsiders, and they have been the face for so long that they have begun to forget there are other Mycellan in the dark who look nothing like them.

Bedel children are educated in the scriptoriums from the age when their lantern-eyes first steady, around six or seven. They learn to read fungal-wood records, to recite crypt-genealogies, to tend the spore-gardens and cultivate the strains that sustain the monastery. By adolescence they are expected to choose a vocation: Veil-Speaker (priesthood), Inscriptor (record-keeper), Witch Doctor (spore-healer), or Inquisitor (hunter). The last is the least common among the Bedel, their senses are less acute than the Cromyx's, and hunting an Over-Lit through the deep caves with dimmer eyes is a test few Bedel volunteer for.

They view the Cromyx with a complex, carefully unspoken mixture of pity and fear. The Cromyx are their siblings, their cousins, their children who inherited a different strain. The Bedel recognize the Cromyx's sharper perception of the Root-Veil. They rely on it, the best cultivators and readers of the underground in Mycellan society are overwhelmingly Cromyx. But the Bedel also control the institutions that record, govern, and trade, and none of those institutions have a Cromyx majority. The Bedel call this "stability." The Cromyx call it what it is.

The Bedel rarely leave the Bryngloom Forest. When they do, they travel in monastic vestments, dark cassocks with fungal-thread embroidery marking their bloodline and vocation, and their rust-amber eyes draw stares in human settlements, Athien trade-hubs, and Solari forge-halls alike. The Bedel are accustomed to being stared at. They are not accustomed to being doubted.

Trait Deep-Glow Blood: Immune to the Over-Lit (Hush) addiction and resistant to blight damage; darkvision limited to 30 feet; disadvantage on Intimidation checks against non-Mycellan. The Deep-Glow strain that protects you is warm, steady, and mercifully dim, a crypt-keeper's light rather than a predator's, though it also leaves your perception of the Root-Veil fainter than the Cromyx's.

Trait Crypt-Record: +2 to History and Medicine checks involving Bryngloom Forest, the Athien, fungal substrate, crypt-genealogies, or death-lore; this bonus is lost if you go 24 hours without spending at least 1 hour maintaining your personal crypt-record, and is recovered only by catching up. You were trained in the scriptoriums (the only formal education the Mycellan offer) and can read fungal-wood tablets and recite the dead as fluently as any Veil-Speaker, though the records do not maintain themselves and the backlog does not forgive.

Trait Veil-Speaker's Chant: Bedel bloodlines have sung the names of the dead since the first Sunken Spire was carved into the bog, a genealogy in melody, a rotation of remembrance that has not broken in seventeen centuries. You have learned the ancestral chants of your bloodline's crypt: the names, the order, the rise and fall of a song older than any written record in the Gloom. Once per short rest, you may spend 1 minute singing the names of your ancestors to grant one ally within 30 feet advantage on their next saving throw before the end of your next long rest. The chant requires your full voice, and it announces you, all creatures within 120 feet who can hear know your exact location, and your lantern-eyes brighten involuntarily for the duration. An ancestor whose name is never sung goes dark. You have promised not to be the one who stops.

Trait Crypt-Pulse: Once per long rest, channel ancestral fungal-light through your hands to heal a creature you touch for 1d8+Spirit HP. The crypt-light that sustains the dead can also sustain the living.

Current native: Animist, Plaguebringer, Revenant.

- **Animist** (vtt-react/src/data/classes/animistData.js:118): The Spore-Inhaler. Spore-Inhalation: The Wyrd � Keth Amar's spiritual corruption seeping through the broken shell � saturates the fungal strains native to the deep <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink>. The Bedel inhale these spores as a conduit, letting the ancestral dead ride bioluminescent particles into the lungs; bonds form there and express as bioluminescent skin-text. The spores are not the Wyrd itself, but a biological medium that carries its resonance. The deep-glow makes spirit-dialogue legible at a distance, but broadcasts every emotion to every Mycellan nearby.
  Edge (medium=deep_glow): Deep-Glow spores make a named ancestral channel visibly diagnosable.. Cost: The glow exposes the invocation to everyone nearby.. Access: normal-tradition; requirements spirit_anchor, communion_apprenticeship.

- **Plaguebringer** (vtt-react/src/data/classes/plaguebringerData.js:77): The Glow-Culture. Luminescent-Tracking: Cultivated diseases express as visible bioluminescent patterns, allowing the Plaguebringer to track infection-progress in real time and tune virulence with surgical precision, but also broadcasting the disease-map to every Mycellan nearby, a glowing confession of biological warfare.
  Edge (medium=deep_glow): Vespera's Cultivar with Deep-Glow diagnosis observes a fluorescent strain's progress.. Cost: Visible confession; nonfluorescent contamination defeats the extra information.. Access: normal-tradition; requirements introduced_culture, host_compatibility, cultivation_training.

- **Revenant** (vtt-react/src/data/classes/revenantData.js:46): The Ancestor-Bound. Anchor-Voice: Death-Toll is generated through ancestral communion rather than blood-sacrifice; the Bedel channels the dead's residual vitality, the ancestors willingly feeding the host to keep their voice alive. The arrangement is reciprocal, and the ancestors, eventually, expect to be *answered*.
  Native reframe: The <LoreLink termId="vreken">Bedel</LoreLink> are the tradition's <LoreLink termId="kora">Kora</LoreLink>-inheritors, the ancestral lights Kora the Veil-Speaker tended were the Mycellan's own dead. A Bedel Revenant refuses death because their *ancestors need a living voice to speak through*. The Revenant state is not selfish survival; it is continued service, the host kept half-alive so the dead can keep speaking.
  Crisis: The bog-graves waking on their own is, to the Bedel, the ancestors *firing them*, the dead no longer need a living voice because they are rising to speak for themselves. The Bedel Revenants are being made obsolete by their own charge, and several have begun hearing a new voice in the chorus: something that is not an ancestor, calling the dead toward the <LoreLink termId="the_breach">Sundered Monoliths</LoreLink>.
  Edge (bond=named_spirit): A named spirit helps stabilize one return.. Cost: Reciprocity and finite stored vitality.. Access: normal-tradition; requirements threshold_transition, finite_soul_anchor.

Rare Toxicologist: Hael the Split-Hand's debt-worker transmission diagnoses a prepared dose through stable fluorescence.; COST Visible/detectable evidence; not immunity to every toxin.; when {"type":"medium","value":"deep_glow"}.

Rare Inquisitor: Disciplined Deep-Glow observation diagnoses a readable corruption signature.; COST The signature must exist and be legible; the glow exposes the observer.; when {"type":"medium","value":"deep_glow"}.

Rare Minstrel: Ysenil Deep-Glow adapts performances into a defined living mycelial relay.; COST A dead or damaged network interrupts it; no maritime-only eligibility.; when {"type":"medium","value":"living_mycelial_network"}.

## Cromyx / marked_vreken

Source vtt-react/src/data/races/vreken.js; subrace marked_vreken.

**illustrationCaption:** “The root-paths twist through black mud; the sickle reaps only what the swamp allows.” — Cromyx Stalker Maxim

**visualDescription:** The inheritors of Ghost-Mycelium, Morvane's wounded nerve-tissue made symbiotic. The Cromyx share the compact wiry frame and vestigial elven architecture of their kin, but their lantern-eyes burn silver-white and will not dim easily, flaring with anger, flickering with grief, brightening under any strong emotion so that their hearts are readable across a room. Their ear-tips curl more sharply. The volatile strain threads deeper through them: their presence is impossible to hide in darkness, and the brilliant light that makes their perception extraordinary is the same light that consumes them from within.

**tooltipSummary:** Ghost-sighted beacon-carriers whose branded eyes blaze with Morvane's wounded nerve-tissue, perceiving the Root-Veil most keenly even as the Hush tempts them with every step.

**description:** The inheritors of Ghost-Mycelium, Morvane's wounded nerve-tissue made symbiotic, the volatile, brilliant, painful strain that amplifies perception and sensitivity at the cost of stability. Their lantern-eyes burn silver-white and do not dim easily; their emotions are readable from across a room, their presence impossible to hide in darkness. Their perception of the Root-Veil is extraordinary: they sense the mycelial network's pulse more clearly than any Bedel, read the spore-signatures of the underground, detect things other Mycellan cannot. They are also the most vulnerable to the Over-Lit addiction, their sensitivity is both gift and curse, and every Cromyx family carries at least one Over-Lit relative. Stigmatized by the Bedel as unreliable, dangerous, the bloodline most deeply entangled in the wounded god. The flaw they carry is their own biology: the light that makes them extraordinary is the same light that consumes them from within.

**culturalBackground:** The Cromyx trace their bloodline to the Mycellan most deeply touched by Morvane's wound, those who carry Ghost-Mycelium, the brilliant, silver-white fungal strain that is the deity's injured nerve-tissue made symbiotic. Their tradition is sensitivity: the Root-Veil read at acute depth, the spore-signatures of the underground sensed where the Bedel perceive only faint hum, the Over-Lit kin tracked into the deep caves by the same bond that will one day betray the tracker.

Cromyx children learn to feel the Root-Veil before they learn to speak, their Ghost-Mycelium bond is active from birth, silver-white pinpoints flickering in the cradle. By the time a Cromyx child can walk, they are already attuned to the mycelial network's pulse: they sense the health of the fungal gardens, the shift in the bog's currents, the distant tremor of something moving through the deep caves. They are taught to dim their eyes, a skill the Bedel never need to practice, and most never fully master it. A Cromyx's lantern-eyes flicker with their emotions, flare with their anger, dim with their grief. They are the most honest people in the Bryngloom Forest, and the most exposed.

Every Cromyx family has at least one Over-Lit relative. The numbers are not a matter of debate, they are recorded in the scriptoriums, which are maintained by the Bedel. The Cromyx believe the Bedel underreport the epidemic to minimize its political impact. The Bedel believe the Cromyx exaggerate their suffering to gain exploit in crypt-council negotiations. Neither side has proof. Both sides have centuries of resentment.

The Cromyx are disproportionately represented among the Inquisitors, the order that hunts Over-Lit Mycellan who have progressed past recovery. This is not because the Bedel forbid Bedel from joining. It is because the Bedel's fainter Root-Veil sense makes them less effective trackers, and because the psychological burden of killing your own kind falls more heavily on a Bedel who has never felt the hush's pull than on a Cromyx who has spent their entire life fighting it. The Cromyx who join the Inquisition are the most respected and most isolated Mycellan in the Gloom, feared by the Over-Lit they hunt, pitied by the Bedel who no longer sit beside them at crypt-feasts, and quietly, desperately envied by the Cromyx who have not yet fallen.

The Cromyx rarely serve as trade delegates or diplomatic envoys. Their eyes are too bright, they unsettle human merchants, make Athien negotiators uncomfortable, and remind the Solari of something their Sun-Speakers have been prophesying for centuries but will not name. When a Cromyx leaves the Bryngloom Forest, it is because they have chosen to, and the choice marks them as someone who has accepted that the outside world will stare and flinch and reach for iron that does not burn them but still, somehow, hurts to look at.

Trait Ghost-Mycelium Sight: Darkvision 90 feet; advantage on Perception checks to track creatures or detect hidden objects, passages, and traps; automatically sense any creature within 60 feet that drops below 25% of its maximum HP; but disadvantage on Stealth in all lighting, your eyes glow visibly from 120 feet in darkness, and creatures have advantage on Perception to detect you in dim light or darkness. Your silver-white Ghost-Mycelium eyes burn with Morvane's wounded nerve-tissue, a beacon that reads the Root-Veil's pulse for miles even as it reveals you in turn.

Trait The Hush-Temptation: Your Ghost-Mycelium bond is a double-edged gift. You can amplify your perception of the Root-Veil to extraordinary levels, tasting every spore-signature within miles, reading the mycelial network's deep currents, perceiving the wounded land's pulse in ways no Bedel bond could ever reach. But the hush sings in your blood, and every amplification brings you closer to the light that does not let go.

Trait Root-Veil Echo: The Ghost-Mycelium bond that gives you acute Root-Veil perception does not merely read the present, it echoes the recent past like a stone dropped in still water, the ripples visible long after the impact has vanished. Once per long rest, you may touch a surface in a location where events occurred within the last hour and experience an echo: you learn what creatures were present, their emotional states, and a shadow of their intent, enough to know whether they meant harm, whether they were fleeing, whether they were searching. The echo does not reveal faces or exact words, only the shape of what happened, written in the Root-Veil's own memory. But every echo pulls at the root, you gain 1 level of Exhaustion after using this ability, a cost paid not by the body but by the fungal bond itself, which must regrow the tendril you burned to reach backward through the mycelial network.

Trait Death-Mark Strike: Once per short rest, mark a target within 30 feet with your Ghost-Mycelium bond. For 1 minute, you know their exact location even through walls, and your attacks against them deal +1d4 blight damage. The Ghost-Mycelium does not forget what it has touched.

Current native: Inquisitor, Plaguebringer, Apex, Augur.

- **Inquisitor** (vtt-react/src/data/classes/inquisitorData.js:28): The Mycelium-Hunter. Network-Severance: Corrupted bonds are severed *through* the mycelial network rather than at the host, the Inquisitor cuts the spiritual infection where it roots in the forest itself. This heals the forest but leaves a permanent dead-patch in the network the Inquisitor must carry.
  Edge (bond=connected_infected_bond): Orven's network diagnosis and severance can reach one connected infected bond.. Cost: The cut damages the local conduit; no miles-wide universal purge.. Access: normal-tradition; requirements barbed_vow, containment_training.

- **Plaguebringer** (vtt-react/src/data/classes/plaguebringerData.js:93): The Mycelium-Vector. Network-Seeding: Cultivated diseases can be transmitted *through the mycelial network* to any connected organism, bypassing physical proximity entirely. The Cromyx are the tradition's only area-effect cultivators, a single Cromyx Plaguebringer can blight a grove through the roots beneath it.
  Edge (bond=prepared_connected_node): Cultivar applied to the mycelial connection seeds through a prepared nearby node.. Cost: Local network strain and controllable range; no invisible miles-wide plague.. Access: normal-tradition; requirements introduced_culture, host_compatibility, cultivation_training.

- **Apex** (vtt-react/src/data/classes/apexData.js:114): The Mycelium-Scent. Web-Sense: Tracking is performed through tactile vibration in the host's own mycelial network, the Apex feels prey moving anywhere on connected ground, through their skin. The most *immediate* tracking method, but requires the prey to be moving; a stationary target produces no vibration and is invisible to the Web-Sense.
  Native reframe: The <LoreLink termId="vreken">Cromyx</LoreLink>, ghost-mycelium walkers, track *through* their own network-connected skin, feeling the passage of prey as vibrations in the Root-Veil the way a spider feels a web. A Cromyx Apex does not read spoor; they *feel* movement, their mycelium-threaded body a living sensory net spread across miles of forest floor.
  Crisis: The Root-Veil's rejection of the Cromyx (the Plaguebringer crisis) is *amputating their senses*, as the network expels their mycelium, the Web-Sense's range collapses. Cromyx Apexes are being reduced from miles-wide perception to the range of their own skin, and the terror of going *numb*, of losing the web they have felt through for centuries, is driving some to tear the expelling mycelium out faster, to get the loss over with.
  Edge (medium=mycelium): You read moving quarry through connected fungal substrate.. Cost: Stationary or disconnected prey needs ordinary tracking.. Access: normal-tradition; requirements sensory_trade, sensory_training, bonded_companion.

- **Augur** (vtt-react/src/data/classes/augurData.js:131): The Mycelium-Haruspex. Bloom-Casting: Visions manifest as shifting bioluminescent patterns across the host's fungal network, readable in real time by the Augur and, unfortunately, by any other Cromyx in proximity. The prophecy is broadcast as much as it is received.
  Edge (medium=mycelium): You read incoming danger through the flashing pulses of subterranean root mushrooms.. Cost: The glow exposes the reader and is vulnerable to corrupted input.. Access: normal-tradition; requirements divination_training, divination_focus.

Rare Toxicologist: Heightened substrate perception identifies a local active reagent or contamination.; COST Sensory overload/network dependence; no free pathogen incubation.; when {"type":"bond","value":"connected_network"}.

Rare Shaper: Root-Veil contact assists one defined transition through mycelium.; COST Uses finite living substrate that requires regrowth and care.; when {"type":"bond","value":"living_substrate"}.

