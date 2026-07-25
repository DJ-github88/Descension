/**
 * Applies the four ratified canon locks to lore.json:
 *   1. False Monolith = House Morrath's (the substitute); Viridane's = the hidden TRUE seventh.
 *   2. Dead Moon = dormant star with a slumbering deity within (the "egg" metaphor).
 *   3. The Watcher / Keeper of the Last Threshold canonical name = Morvane.
 *   4. (Martyr date is reported below for a separate targeted fix.)
 * Backs up lore.json first, validates JSON + entry count, writes 2-space indent + trailing newline.
 */
const fs = require('fs');
const LORE = 'vtt-react/public/data/lore.json';
const BAK = 'vtt-react/public/data/lore.json.bak';

const d = JSON.parse(fs.readFileSync(LORE, 'utf8'));
const beforeCount = Object.keys(d).length;
fs.writeFileSync(BAK, fs.readFileSync(LORE)); // raw backup

// ---------------------------------------------------------------------------
// 1. SUNDERED MONOLITHS — false = Morrath, hidden true = Viridane
// ---------------------------------------------------------------------------
d.sundered_monoliths.summary =
  "Seven fragments scattered when the seal cracked — six true Monoliths, one false shard fabricated for the substitute House Morrath, and a hidden true seventh (Viridane's) that is the cleansing key. The histories say six are true. The histories are incomplete.";

d.sundered_monoliths.fullEntry =
  "When the six houses fed their firstborn heirs to Keth-Amar at the Breach, the binding seal — woven from Aex's flayed hide — fractured. Six true fragments fell, each a piece of Aex anchored by a real bloodline-key. But the seventh seat was a lie.\n\n" +
  "**The Six True Monoliths** (corrupted and active — Keth-Amar feeds through each):\n\n" +
  "**Fog-Hand** — House Thalreth. The right hand, skin. Hidden in a mist-choked valley of the Frostwood Reach, where its presence thickens the memory-fog. Its pulses feel muffled.\n\n" +
  "**Ice-Crown** — House Skalvyr. A fragment of forehead and skull. Embedded in a Nordhalla glacier that has grown around it like a cyst; it pulses blue under winter ice. The Frost-Tithe feeds Keth-Amar through it.\n\n" +
  "**Wind-Bone** — House Tesshan. A rib bone. Lodged in a crevasse on the highest unclimbed peak of the Cragjaw Peaks; the eternal blizzard IS the Wyrd guarding it.\n\n" +
  "**Depth-Breath** — House Mereval. The lungs. At the bottom of the Iceheart Sea's deepest trench; the tissue still expands and contracts, and the storm above (the Shard-Window) cycles with its breathing.\n\n" +
  "**Grass-Spine** — House Ordavan. The spine. A mile-long ridge of black crystalline vertebrae half-buried in the endless grass of the Sundrift Vale; the eternal darkness overhead is Keth-Amar drinking light through it. The most exposed Monolith — the Vale is a forty-year war zone as the Dawn Vigil tries to retrieve it.\n\n" +
  "**Still-Heart** — House Solvan. The heart. Beneath the floor of the hall where Aex was named to the Warden, in the ruins of the oldest Solvan keep. It beats once per hour, each beat a tremor for a mile around. The genuine heart-fragment, often mistaken for the false one.\n\n" +
  "**The False Monolith — House Morrath.** No body part. No Aex-tissue. A hollow echo fabricated when House Morrath was snuck in as the substitute signatory to fill the seat Viridane vacated. Morrath's blood was never part of the original binding, so this 'Monolith' has no binding power. It rests in the Bryngloom Forest, in a bog-pool that has no bottom, leaking the memories of drowned divers into the peat. It hums in anticipation, not pain. Keth-Amar senses that one Monolith 'sings wrong' but cannot locate or resolve it; the houses have hidden the truth of why for eight centuries.\n\n" +
  "**The Hidden Seventh — House Viridane.** The TRUE seventh fragment, uncorrupted because Viridane's heir never marched to the peaks. Morvane hid it in the moonlit groves of the Frostwood Reach with the Briaran, Viridane's thorn-blooded descendants, who carry its cleansing key in their very blood. Keth-Amar cannot find it. To remember Viridane is to leave a thread the Sun-Eater could follow — so the fragment stays forgotten, protected by the same fog that hides the Briaran. Should heroes ever need to cleanse Sol of Keth-Amar's corruption, it is Briaran thorn-blood that must be harvested to do it.\n\n" +
  "For nearly eight centuries these stones lay dormant. Now they are waking. Aex can no longer hold them still. The Dawn Vigil publicly claims reassembling them will restart Sol. Their inner council has calculated it will summon Keth-Amar instead — and reforging the seal with the false Morrath shard would inject Keth-Amar's Wyrd-parasite directly into Sol's core.";

// ---------------------------------------------------------------------------
// 2. HOUSE MORRATH — append the false-Monolith note
// ---------------------------------------------------------------------------
d.house_morrath.fullEntry +=
  " House Morrath's signature was never part of Aex's binding — so the Monolith that bears their name is a hollow fabrication, a false shard resting in a bottomless bog-pool of the Bryngloom, humming in anticipation rather than pain. The house's entire legitimacy rests on a lie the other six houses helped write.";

// ---------------------------------------------------------------------------
// 3. HOUSE VIRIDANE — append the true-hidden-fragment note
// ---------------------------------------------------------------------------
d.house_viridane.fullEntry +=
  " Viridane's true Monolith fragment — the uncorrupted seventh, never breached because Viridane's heir never marched — was hidden with them by Morvane in the moonlit groves. It is the cleansing key, carried in Briaran thorn-blood, waiting for the day Sol must be washed of Keth-Amar's taint.";

// ---------------------------------------------------------------------------
// 4. THE WATCHER / MORVANE — correct the false-Monolith references + canon name
// ---------------------------------------------------------------------------
d.the_watcher.fullEntry =
  "The Watcher in the Mist (canonical name Morvane; called the Keeper of the Last Threshold in Neth contract-law) is the world's memory and conscience — the boundary between life and death, memory and oblivion. Older than Keth-Amar's intrusion, it is a personality woven into the world's fabric: impartial, all-knowing, and fundamentally quiescent. It does not serve Aethil. It is not answerable to Keth-Amar. Its role is to watch, remember, weigh, and rarely act.\n\n" +
  "Morvane did not choose Viridane. Viridane's desperation during the Breach reached the boundary, and Morvane answered because total imbalance is the one thing it cannot permit. It offered the memory-fog to hide them from Keth-Amar's sight. At the same moment it folded House Morrath's false shard — the hollow echo the six houses fabricated to cover Viridane's vacant seat — into the deep bogs of the Bryngloom, and sheltered Viridane's true seventh fragment in the moonlit groves with the Briaran. The erasure worked too well. Now Morvane struggles to locate the exact grove where the true fragment sleeps — a splinter in its own territory it cannot extract without unmaking the very protection that hides it.\n\n" +
  "Its attention is strained. Keth-Amar's presence presses against the boundary, and Morvane is fracturing under the pressure. If it fractures, death and memory disappear as categories entirely. The fog that eats memory is both Morvane's protection and the first symptom of its collapse. Morvane is dying, and everything else is downstream of that death.";

// watcher_in_the_mist — correct the false-Monolith sentence in place
d.watcher_in_the_mist.fullEntry = d.watcher_in_the_mist.fullEntry.replace(
  "It hid the false Monolith in a pocket of forgotten memory at the moment of the Breach and now cannot find it either. The erasure worked too well.",
  "It hid House Morrath's false shard — the hollow echo fabricated to cover Viridane's vacant seat — in a pocket of forgotten memory at the moment of the Breach, and sheltered Viridane's true seventh fragment in the moonlit groves with the Briaran. The erasure worked too well; now even Morvane cannot find the exact grove where the true fragment sleeps."
);

// ---------------------------------------------------------------------------
// 5. DEAD MOON — the "egg" = a slumbering deity within the dormant star
// ---------------------------------------------------------------------------
d.dead_moon.fullEntry = d.dead_moon.fullEntry.replace(
  "Some Lunarch theologians call the moon an \"egg,\" a metaphor for the discovery that the parasites are not singular entities but siblings — children of the same dormant star, now communicating across hosts. The old belief that it was a dead celestial body was the prevailing scholarly consensus; the truth is stranger and older than any corpse.",
  "Some call the moon an \"egg,\" and they are closer to the truth than they know: a deity slumbers within the dormant star, and one day the shell must crack. The lunar parasites — void-adapted organisms that feed on memory, sensation, and vitality — are the living traces of that sleeper's inner ecology, siblings born of the same dormant star and now communicating across hosts. The old belief that it was merely a dead celestial body was the prevailing scholarly consensus; the truth is stranger and older than any corpse, and the deity within is the reason the Astril still sing to Selunis, trying to wake it gently rather than let it hatch in catastrophe."
);

// ---------------------------------------------------------------------------
// Write back + validate
// ---------------------------------------------------------------------------
fs.writeFileSync(LORE, JSON.stringify(d, null, 2) + '\n');
const after = JSON.parse(fs.readFileSync(LORE, 'utf8'));
const afterCount = Object.keys(after).length;

console.log('BEFORE entries:', beforeCount);
console.log('AFTER  entries:', afterCount);
console.log('Count preserved :', beforeCount === afterCount);
console.log('Monolith summary :', after.sundered_monoliths.summary.slice(0, 90) + '...');
console.log('Morrath tail     :', after.house_morrath.fullEntry.slice(-160).trim().slice(0, 90) + '...');
console.log('Dead Moon egg    :', (after.dead_moon.fullEntry.match(/egg.{0,80}/i) || ['?'])[0]);
console.log('Watcher name     :', /canonical name Morvane/.test(after.the_watcher.fullEntry));

// ---------------------------------------------------------------------------
// 6. REPORT — where does the Martyr founding date live? (for the next fix)
// ---------------------------------------------------------------------------
console.log('\n=== martyr lore entry (founding-date check) ===');
const m = after.martyr;
console.log('summary:', m.summary);
console.log('fullEntry (first 600):', m.fullEntry.slice(0, 600));
