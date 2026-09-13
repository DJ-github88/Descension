import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import MythrillWindow from '../windows/MythrillWindow';
import useWindowStore from '../../store/windowManagerStore';
import useGameStore from '../../store/gameStore';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureWizardApp from '../creature-wizard/CreatureWizardApp';
import CommunityCreaturesTab from '../creature-wizard/components/library/CommunityCreaturesTab';
import ItemLibrary from '../item-generation/ItemLibrary';
import MapLibraryWindow from '../windows/MapLibraryWindow';
import '../../styles/library-bookshelf.css';

const WINDOW_ID = 'library';

const HIDDEN_GEMS = {
  'sheet-happens': {
    title: 'Sheet Happens',
    icon: 'fas fa-clipboard-list',
    subtitle: 'A support guide for the statistically optimistic',
    leather: { a: '#2e2318', b: '#463522', c: '#3a2c1c' }, accent: '#c8a45a', tilt: '-1.5deg',
    pages: [
      [
        {
          heading: 'Chapter One — The Blank Page',
          paragraphs: [
            'Every character sheet begins life as a promise. Six numbers, a name, and the quiet confidence of someone who has not yet met a saving throw.',
          ],
        },
        {
          heading: 'Chapter Two — Darkvision Exists',
          paragraphs: [
            'You wrote it down. It has been on the sheet the whole time. This chapter teaches you to stop asking the table whether you can see in the dark, and to start trusting the one line of text that has been correct since session zero.',
          ],
        },
        {
          heading: 'Chapter Three — The Math Is Made Up',
          paragraphs: [
            'Confidence is a modifier. Studies within this book show that players who cannot explain their bonus succeed almost as often as players who can, and have considerably more fun during the explanation.',
          ],
          list: [
            'If the modifier is +0, smile.',
            'If the modifier is negative, smile wider.',
            'If someone audits the math, cite Chapter Three.',
          ],
        },
      ],
      [
        {
          heading: 'Chapter Four — The Lucky Dice',
          paragraphs: [
            'Every player owns one set of dice that has never failed them, and one set that failed so completely it had to be retired to the drawer of shame. Neither set is real. The belief is doing the work.',
          ],
          list: [
            'If the dice are cold, apologize to them. Out loud.',
            'If the dice are hot, do not mention it. The mention is the curse.',
            'If another player touches your dice, those dice are now theirs. This is the rule, and the rule is older than the game.',
          ],
        },
        {
          heading: 'Chapter Five — Notes Nobody Reads',
          paragraphs: [
            'You wrote a backstory. It is beautiful, it is four pages long, and it explains the scar. The game master read it twice, and will spend the campaign pretending it is a coincidence that your uncle runs the docks.',
            'The other players will learn your story the honest way: by watching you refuse to talk about it for eleven sessions, and then over-sharing after the third ale.',
          ],
        },
      ],
      [
        {
          heading: 'Appendix A — Rolling in Public',
          paragraphs: [
            'Roll where the table can see. A die rolled in the open is a promise; a die rolled behind the screen is a rumor. If you must fudge, fudge toward the story, never toward the villain.',
          ],
        },
        {
          heading: 'Appendix B — The Five Stages of a Bad Roll',
          list: [
            'Denial — "That die was cocked. Everyone saw that it was cocked."',
            'Anger — directed at the die, which is a rock, and unmoved.',
            'Bargaining — offering the game master snacks, favors, and the rogue.',
            'Depression — silence, and the slow re-reading of your sheet.',
            'Acceptance — someone makes tea. The story continues, and it is better for the miss.',
          ],
        },
      ],
    ],
  },
  'mimic-precautions': {
    title: '101 Mimic Precautions',
    icon: 'fas fa-box-open',
    subtitle: 'Because the furniture is watching',
    leather: { a: '#2e1414', b: '#4e2020', c: '#3c1a1a' }, accent: '#d0655a', tilt: '1deg',
    pages: [
      [
        {
          heading: 'A Note From the Surviving Author',
          paragraphs: [
            'The original edition listed one hundred and one precautions. It is out of print, along with its author. What follows is the safe half of the list.',
          ],
        },
        {
          heading: 'The Precautions',
          list: [
            '1. The chest is a mimic.',
            '2. The stool is a mimic. You are sitting on the stool.',
            '7. Tap everything with the ten-foot pole. The pole is not a mimic. Probably.',
            '12. If the treasure room is dustier than the corridor, the dust is decorative.',
            '23. A mimic that passed its disguise check also gets a performance check. Compliment the hinges.',
            '48. If your rogue licks the lock and frowns, stop the rogue.',
            '77. The door you did not check leads to the room the last mimic was from.',
            '100. There is no precaution 100. The list itself is a mimic. Read something safe, like 99.',
          ],
        },
      ],
      [
        {
          heading: 'The Unsorted Half',
          paragraphs: [
            'The middle precautions survived only in fragments. They are reproduced here in the order they were recovered, which is not the order they are numbered, and arguably not an order at all.',
          ],
          list: [
            '4. Never trust a chest that is breathing. Chests have no business breathing. That is the entire tell.',
            '9. If the rug is warm, stand elsewhere. Rugs are not warm. Rugs have never been warm.',
            '16. A door that locks behind you has opinions. Do not argue with it. Leave through the window.',
            '28. Count the chairs before and after the fight. A mimic will take a seat.',
            '52. This book passed three inspections. The bookmark inside it did not.',
            '64. When the innkeeper says "take any room," take the one with the window.',
            '81. A dignified chest will not mind a tap. The undignified one will mind very much, and that is the point.',
            '99. Trust nothing that has waited patiently for you. Patience is the family crest of the mimic.',
            '101. Reserved. It knows why.',
          ],
        },
      ],
      [
        {
          heading: 'Field Signs of a Professional Mimic',
          list: [
            'The hinges have a favorite side.',
            'It holds eye contact throughout your entire inventory.',
            'It has dust — but only on the side you can see.',
            'It sighs when the party argues.',
            'It has been in the room for this whole conversation and has opinions about the seating.',
            'It flinches at its own reflection. Amateur hour.',
          ],
        },
      ],
      [
        {
          heading: 'Appendix A — The Furniture Amnesty Program',
          paragraphs: [
            'Every spring, participating dungeons observe one week of amnesty during which mimics may reveal themselves and relocate without violence. Last year a footstool turned itself in before breakfast and was resettled near a nice quiet vault.',
            'The program reports a ninety-percent success rate. The remaining ten percent declined to comment, on the grounds of being a treasure chest.',
          ],
        },
      ],
    ],
  },
  'adopted-villain': {
    title: 'The Adopted Villain',
    icon: 'fas fa-masks-theater',
    subtitle: 'From nemesis to nap-time companion',
    leather: { a: '#221a2e', b: '#382c4a', c: '#2c2238' }, accent: '#a98fd4', tilt: '-1deg',
    pages: [
      [
        {
          heading: 'Step One — Defeat, Loosely Defined',
          paragraphs: [
            'The battle went badly. For you. The dark lord had you at blade-point, and then the bard made a joke, and now everyone is laughing and the dark lord is laughing too and nobody can quite remember who was invading whom.',
          ],
        },
        {
          heading: 'Step Two — Naming Rights',
          paragraphs: [
            'He had a title, three syllables of doom, and an estate full of politically loyal spiders. The party named him Gregory within the minute. Do not resist this. Gregory fits.',
          ],
        },
        {
          heading: 'Step Three — The Mascot Arc',
          paragraphs: [
            'By nightfall Gregory is carrying the torch, warning the wizard about the loose flagstone, and taking his tea sweetened. Let it happen.',
            'Appendix A covers what to do when the actual villain arrives and asks Gregory to please come home. The short version: put the kettle on. Nobody leaves a family mid-brew.',
          ],
        },
      ],
      [
        {
          heading: 'Frequently Asked Questions at Blade-Point',
          list: [
            'Q: Is this a capture? — A: It is a residency.',
            'Q: Do we have to defeat him again? — A: Absolutely not. He has a favorite chair now.',
            'Q: What if he betrays us? — A: Then it is a plot twist, and we will all be very kind about it at dinner.',
            'Q: Who is in charge of him? — A: The kettle.',
          ],
        },
      ],
      [
        {
          heading: 'Appendix B — Gregory\'s Birthday',
          paragraphs: [
            'It is the day you met him. It has always been the day you met him, including retroactively, which the spiders insist is simply good calendaring.',
            'The spiders celebrate by rebuilding something structural. One (1) candle is lit, made of beeswax, because Gregory is trying. He blows it out and grins with too many teeth, and everyone pretends it was a normal amount of teeth.',
          ],
        },
      ],
    ],
  },
  cartography: {
    title: 'Cartography for Liars',
    icon: 'fas fa-map',
    subtitle: 'The coast is wherever you say it is',
    leather: { a: '#0f2426', b: '#1e4042', c: '#183334' }, accent: '#4fb3a5', tilt: '1.5deg',
    pages: [
      [
        {
          heading: 'The First Rule of Ink',
          paragraphs: [
            'Draw the mountain range first. Mountains excuse everything: weather, delays, the vague feeling that the road disagrees with the map. A confident mountain range has ended more arguments than any rulebook.',
          ],
        },
        {
          heading: 'Here Be Borrowed Villages',
          paragraphs: [
            'Every game master owns exactly one village. Rename it. Move the river. Swap the harvest festival for a conspiracy. The tavern keeps its name — that is what makes it feel like home.',
          ],
        },
        {
          heading: 'The Compass Concession',
          paragraphs: [
            'North is a tradition, not a fact. If a player checks the sun against your map, hand them a ration card and compliment their instincts. Cartography, practiced honestly, is just lying with excellent penmanship.',
          ],
        },
      ],
    ],
  },
  'bardic-insults': {
    title: 'Bardic Insults, Annotated',
    icon: 'fas fa-music',
    subtitle: 'Footnoted for your protection',
    leather: { a: '#2e1020', b: '#4e1f38', c: '#3c1830' }, accent: '#d478a8', tilt: '-1.2deg',
    pages: [
      [
        {
          heading: 'From the Margins of Surviving Performances',
          paragraphs: [
            'A verse is a weapon that fires in both directions. The annotations below were collected from the few audience members willing to discuss the evenings in question.',
          ],
        },
        {
          heading: 'Selected Works',
          list: [
            '"Your mother was a kobold." — See Appendix C for why this starts fights. Kobolds are famously devoted parents. You have complimented the dragon\'s kin. Anything is possible now.',
            '"Thy grace doth rival a resting ox." — Surprisingly effective against cavalry officers. Beware farm unions.',
            '"I have met smarter sacks of turnips." — Turnip merchants consider this a sales pitch. Know your audience before you rhyme.',
          ],
        },
        {
          heading: 'The Standing Warning',
          paragraphs: [
            'Whoever annotates the insults will eventually annotate the wrong one. Volume II contains a full chapter on apologizing in rhyme. It rhymes. That cannot be helped.',
          ],
        },
      ],
      [
        {
          heading: 'Insults That Worked Too Well',
          paragraphs: [
            'A successful insult ends a conversation. A perfect insult starts a feud, a ballad, and occasionally a religion. The following are filed under "perfect," against the author\'s wishes.',
          ],
          list: [
            '"Your sword has a name." — Intended as a compliment. Received as a duel. The sword won.',
            '"You sing like the weather." — The fog giant still sends weather to this day. It is always raining on this page.',
            '"I have seen better." — Four months of litigation and one extremely awkward harvest festival.',
          ],
        },
      ],
      [
        {
          heading: 'The Apology Volume (Excerpts)',
          list: [
            'To the Duchess of Verrow: I said your wine reminded me of vinegar. Vinegar is a proud tradition and I meant it lovingly. Enclosed: one barrel of vinegar, lovingly.',
            'To the fog giant: I have reconsidered the weather. The weather is fine. The weather has always been fine.',
            'To the dragon whose hoard I called "mostly coins": it was entirely coins. That was the joke. Please come down from the tower.',
          ],
        },
      ],
      [
        {
          heading: 'Index of Persons Currently Not Speaking to the Author',
          list: [
            'The entire town of Bramble. (See page 12.)',
            'A lich, two skeletons, and one skeleton who was not involved.',
            'The fog giant. Ongoing, weather-based.',
            'My mother. (Unrelated to the book. Included for accuracy.)',
            'The bard who taught me. This one stings.',
          ],
        },
      ],
      [
        {
          heading: 'Appendix C — The Standard Apology Form',
          list: [
            'Field 1 — Your name, as you would like it pronounced at the hearing.',
            'Field 2 — The insult, as you remember it.',
            'Field 3 — The insult, as they wrote it down.',
            'Field 4 — What you meant. Be honest; the auditors have a library.',
            'Field 5 — The requested remedy. Note: "let it go" is not a remedy, and also yes it is.',
          ],
        },
      ],
    ],
  },
  'door-handling': {
    title: 'Advanced Door Handling',
    icon: 'fas fa-door-open',
    subtitle: "Architecture's greatest adversary",
    leather: { a: '#2b1d0e', b: '#452f16', c: '#372512' }, accent: '#c89b52', tilt: '1deg',
    pages: [
      [
        {
          heading: 'The Kick Fallacy',
          paragraphs: [
            'Beginners kick. Kicking announces you, bruises your toe, and wakes up the thing the door was politely containing. The door is not the obstacle. The door is the messenger.',
          ],
        },
        {
          heading: 'The Persuasion School',
          paragraphs: [
            'Talk to the door. Compliment the hinges. Doors, like their mimic cousins, respond to respect. Graduates of this school report a one-hundred-percent success rate on doors that were going to open anyway, which is how scholarship works.',
          ],
        },
        {
          heading: 'The Checklist',
          list: [
            'Is it locked?',
            'Is it trapped?',
            'Is it, on reflection, a door at all?',
            'Is it another mimic? (See 101 Mimic Precautions, stool chapter.)',
            'Is the rogue already inside? This is the common case. Proceed directly to looting etiquette.',
          ],
        },
      ],
      [
        {
          heading: 'The Window Exception',
          paragraphs: [
            'Windows are doors that admit it. Entering through a window is never wrong; it is merely memorable. The owner will bring it up at every future visit. Consider this the price of a clean crossing.',
          ],
        },
        {
          heading: 'Knocking: A Lost Art',
          paragraphs: [
            'Three knocks, a pause, two knocks: friendly. Two knocks, a pause, two knocks: shopkeeper. One knock, followed by the door falling inward: the barbarian.',
            'The door keeps a census, and it remembers everyone who was rude.',
          ],
        },
      ],
      [
        {
          heading: 'Beyond Doors: A Field Guide',
          list: [
            'The portcullis: a door that has agreed to visit.',
            'The gate: a door with staff.',
            'The beaded curtain: statistically the deadliest, on account of the beads.',
            'The secret door: secret to no one after the rogue has been through it twice.',
            'The trapdoor: a door with ambitions.',
            'The mimic: a door that read this book and chose violence.',
          ],
        },
      ],
    ],
  },
  rulings: {
    title: 'Rulings, Not Rules',
    icon: 'fas fa-gavel',
    subtitle: 'Table law for the tired referee',
    leather: { a: '#1a2029', b: '#2c3644', c: '#232c38' }, accent: '#9db4cc', tilt: '-0.6deg',
    pages: [
      [
        {
          heading: 'The d6 Decree',
          paragraphs: [
            'If the rulebook is silent, the game master is sweating, and the players are circling, the answer is a d6. Odd: yes. Even: also yes, but slower. This ruling has never once been appealed successfully.',
          ],
        },
        {
          heading: 'Snacks as Currency',
          paragraphs: [
            'Table law holds that whoever brought snacks may reroll once per session. This appears in no official document. It does not need to. Some laws are load-bearing.',
          ],
        },
        {
          heading: 'On Officialdom',
          paragraphs: [
            'The rulebook is a suggestion with excellent public relations. The real rules are three: be fair, be swift, and never — under any circumstances — look up a spell in the middle of the drama. The drama is the ruling.',
          ],
        },
      ],
      [
        {
          heading: 'Emergency Rulings',
          list: [
            'If the table is split, the table is wrong. Reroll.',
            'If a player asks what happens next while it is happening, the answer is yes.',
            'If the map and the story disagree, the story is right and the map is a drawing of a different week.',
            'If two players claim the last slice, combat is initiated. The game master eats the slice during initiative.',
            'If the rulebook is on fire, the ruling is whatever the table remembers. Tables remember kindness and snacks.',
          ],
        },
        {
          heading: 'Precedents',
          list: [
            'A ruling made while standing is final. Sitting invites debate.',
            'The phrase "well, actually" opens a trial, not a ruling.',
            'If the game master laughs, the ruling stands. If the game master laughs too long, it stands twice.',
            'Every ruling expires at dawn, except the one about snacks. That one is eternal.',
          ],
        },
      ],
    ],
  },
  'ethical-looting': {
    title: 'Ethical Looting for Beginners',
    icon: 'fas fa-feather-pointed',
    subtitle: 'Probate for the prompt and the armed',
    leather: { a: '#241c0d', b: '#3f3216', c: '#332812' }, accent: '#d0b05a', tilt: '1.2deg',
    pages: [
      [
        {
          heading: 'Rule One — Gifting',
          paragraphs: [
            'If the former owner did not leave a written will, the loot is legally a gift. Adventuring takes place almost exclusively in dungeons, crypts, and ruins — precisely the places where paperwork has gone missing. The system, whatever its flaws, works in your favor.',
          ],
        },
        {
          heading: 'Rule Two — Dragons Donate',
          paragraphs: [
            'A hoard is best understood as a long-term charitable trust with scales. Collecting it merely accelerates the payout. You are, in the eyes of any reasonable accountant, a nonprofit.',
          ],
        },
        {
          heading: 'Rule Three — Say Thank You',
          list: [
            'Thank the estate.',
            'Thank the trap that nearly ended you. It taught you something.',
            'Thank the mimic. It too gave you something: perspective.',
            'Gratitude costs nothing and has never once summoned anything.',
          ],
        },
      ],
      [
        {
          heading: 'Frequently Audited Questions',
          list: [
            'Q: The tomb was guarded. Does that change the gift? — A: No. A guarded gift is simply a gift with delivery confirmation.',
            'Q: The dragon disagrees about the trust. — A: The dragon is welcome to audit our books. From a distance. With a lawyer.',
            'Q: Is a haunted suit of armor loot or personnel? — A: Personnel. Pay it a wage and it will carry the rest.',
            'Q: We took the altar. — A: Say thank you.',
            'Q: What about the coins in the fountain? — A: Wishes are a binding contract. Leave them.',
          ],
        },
      ],
      [
        {
          heading: 'A Note on Ownership',
          paragraphs: [
            'Ownership is nine-tenths of the law, and possession is the other nine-tenths. If you are holding it, and no one has objected for a century, the paperwork has effectively resolved itself.',
          ],
        },
      ],
      [
        {
          heading: 'What Not to Thank',
          list: [
            'The pit. It takes gratitude personally, and it expands.',
            'The cursed idol. Gratitude flatters it, and flattered idols talk.',
            'The rival party, while they can still hear you.',
            'The dragon, before the hoard is fully counted. Thank it after; timing is a form of respect.',
          ],
        },
      ],
    ],
  },
  'tavern-fire': {
    title: 'Why Is the Tavern Always on Fire?',
    icon: 'fas fa-fire',
    subtitle: 'Findings from a twelve-year study',
    leather: { a: '#26120a', b: '#452211', c: '#371b0e' }, accent: '#e0854a', tilt: '-1.4deg',
    pages: [
      [
        {
          heading: 'Methodology',
          paragraphs: [
            'Twelve years. Forty-four taverns. One increasingly patient fire-insurance adjuster. We asked the hard question, and then we stopped asking it, because the bard was right there, tuning the lute.',
          ],
        },
        {
          heading: 'Findings',
          list: [
            'Finding A: in 41 of 44 cases, the fire began within one verse of the lute being tuned.',
            'Finding B: in the remaining 3 cases, the bard was already holding the lute.',
            'Finding C: exposed-beam architecture is a contributing factor and should be studied by someone braver than this author.',
          ],
        },
        {
          heading: 'Prevention',
          paragraphs: [
            'Hide the lute. Not forever — the tavern needs its spirit — just until the last wagon has left for the night.',
            'Water barrels are decorative at this scale of event. Buy them anyway. The adjuster likes to see effort.',
          ],
        },
      ],
      [
        {
          heading: 'Case File 17 — The Bard Paradox',
          paragraphs: [
            'The Gilded Goose burned twice in a single night. The first fire began, as expected, when the lute was tuned. The second began the moment the patrons asked the bard to stop.',
            'Both fires reached the same rafter in the same minute. The study classifies this as a lose-lose scenario and recommends, in bold type, that no one ask a bard to stop.',
          ],
        },
      ],
      [
        {
          heading: 'The Control Group',
          paragraphs: [
            'To isolate the variable, we built a tavern with no bard. It burned down within the week. The investigators suspect the lute, which had been stored in the cellar for safekeeping.',
            'The lute denies everything. The cellar is considering its options.',
          ],
        },
      ],
      [
        {
          heading: 'Peer Review, Pending',
          paragraphs: [
            'Full peer review is pending. The first review committee\'s tavern also burned down. We launched an investigation into the committee and its tavern burned down too.',
            'The pattern suggests that competent auditors will need to meet in an open field, at a distance, with no lutes and no exposed beams. The full report is forthcoming, weather permitting, and there is a bard in the weather department.',
          ],
        },
      ],
    ],
  },
  'cursed-warranty': {
    title: "So You've Been Cursed",
    icon: 'fas fa-bolt',
    subtitle: 'Terms, conditions & generational clauses',
    leather: { a: '#1c1426', b: '#33224a', c: '#271a38' }, accent: '#b07ee0', tilt: '1.3deg',
    pages: [
      [
        {
          heading: 'Congratulations on Your Curse',
          paragraphs: [
            'Your curse has been registered, filed, and is already following you. Please keep this handbook on your person at all times, as the curse will. Do not lose the handbook; that is clause one of the curse.',
          ],
        },
        {
          heading: 'What Your Coverage Includes',
          list: [
            'Hereditary curses, subject to the generational clause (see Chapter 4b, and your grandmother).',
            'Spontaneous combustion. Partial coverage only: the fire is covered, the smoke damage is not.',
            'Full-moon transformations, scheduled for two to three business moons.',
          ],
        },
        {
          heading: 'Filing an Appeal',
          paragraphs: [
            'Appeals are heard at the shrine of your choosing and require one (1) sincere regret and two (2) witnesses who are not also cursed.',
            'If the appeal is denied, the denial is itself cursed. The handbook considers this a feature and asks that you stop writing letters about it.',
          ],
        },
      ],
      [
        {
          heading: 'Exclusions and Fine Print',
          list: [
            'Curses acquired before the warranty date are included retroactively. This is the curse working as intended.',
            'Do not remove the tag. The tag is load-bearing.',
            'Loss of shoes, sleep, or your reflection is covered. Loss of soul is covered up to two (2) ancestors.',
            'If your curse and your neighbor\'s curse merge to form a third, larger curse, both policies are void and the third is invited to file.',
            'This warranty expires when you stop believing in it, at which point it renews automatically.',
          ],
        },
      ],
      [
        {
          heading: 'A Word From Your Curse',
          paragraphs: [
            'Hello. You have questions, and I have been assigned to you. I follow the rules printed above, which are also printed in you now. Please stop reading the exclusions aloud. It gives us both ideas.',
          ],
        },
      ],
      [
        {
          heading: 'Claiming Your Benefits',
          list: [
            'For fire: stop, drop, and roll. The adjuster will find you mid-roll.',
            'For transformations: be transformed at the time of filing. Tea is provided afterward.',
            'For generational claims: bring your grandmother\'s curse and this handbook to the village of your ancestors. They are expecting you.',
            'All claims are final. All curses are also final. This is not a contradiction; it is the business model.',
          ],
        },
      ],
    ],
  },
  'wandering-etiquette': {
    title: 'Etiquette for Wandering Monsters',
    icon: 'fas fa-shoe-prints',
    subtitle: 'Knock first. Devour later.',
    leather: { a: '#17251a', b: '#2a4230', c: '#203427' }, accent: '#6fbf73', tilt: '-1.1deg',
    pages: [
      [
        {
          heading: 'On Entering a Room',
          paragraphs: [
            'The door is a social contract. A monster who enters with a polite cough and a moment of eye contact receives a full round of surprise by consent — which no ambush has ever matched for style.',
          ],
        },
        {
          heading: 'The Grazing Protocol',
          list: [
            'Never eat provisions you did not pack. If you must take the party\'s rations, leave a written apology and the crusts.',
            'The wizard is not a snack. The wizard is a colleague with opinions, and those opinions follow you.',
            'Do not begin grazing before the initiative order is fully seated.',
          ],
        },
        {
          heading: 'Departing Gracefully',
          paragraphs: [
            'When the evening is not going your way, withdraw before it goes permanently. A short bow on the way out is traditional, costs nothing, and confuses pursuit.',
          ],
        },
      ],
      [
        {
          heading: 'Choosing an Entrance',
          paragraphs: [
            'Ceiling entrances are for dragons and drips. Everyone else uses the door. If the room has no door, make one loudly; that is an announcement, not a breach.',
          ],
        },
      ],
      [
        {
          heading: 'Small Talk at the Table',
          list: [
            'Weather first. Always the weather.',
            'Ask about the campaign so far; never about the ending.',
            'Do not ask why the wizard is holding the map upside down. The wizard knows. The wizard is aware.',
            'If the paladin offers to pray for you, accept. It costs nothing and it may count.',
          ],
        },
      ],
    ],
  },
  'dungeon-feng-shui': {
    title: 'Dungeon Feng Shui',
    icon: 'fas fa-couch',
    subtitle: 'Flow, light, and sacrificial altars',
    leather: { a: '#2b1a10', b: '#4a2f1b', c: '#3a2414' }, accent: '#d9a35c', tilt: '0.9deg',
    pages: [
      [
        {
          heading: 'The Command Position',
          paragraphs: [
            'Your throne should face the only entrance. A lich seated with his back to an open corridor is not menacing — he is available. Rearrange the room, not the lich.',
          ],
        },
        {
          heading: 'Lighting the Descent',
          paragraphs: [
            'Torches every forty feet, and no more. Nothing spoils foreshadowing like a well-lit staircase. Guests should descend into mystery, not into paperwork.',
          ],
        },
        {
          heading: 'The Altar Aisle',
          list: [
            'Altars belong at the end of a long approach. Arrival should feel earned.',
            'A sacrificial altar doubles as an excellent conversation pit when not in use.',
            'Keep one decorative skeleton per room. Rentals available; see the back page.',
          ],
        },
      ],
      [
        {
          heading: 'The Treasure Room',
          paragraphs: [
            'Treasure is the punctuation of a dungeon. Piles should be visible from the door but not reachable in a single turn; the corridor does the drama, the gold does the rest.',
            'Count your coins by the handful, never by the wheelbarrow. The wheelbarrow implies budgeting, and budgeting implies doubt.',
          ],
        },
      ],
      [
        {
          heading: 'The Lair Tour',
          list: [
            'The hall: first impressions. Keep it long, keep it cold.',
            'The pit: a punctuation mark. One per dungeon. Two is a personality.',
            'The library: only for lairs that read. A prop book with a real title earns respect.',
            'The throne room: where the tour ends. The throne must be uncomfortable, or adventurers will steal it.',
            'The exit: always leave one. Adventurers who find it think they escaped; that is how you get repeat visitors.',
          ],
        },
      ],
      [
        {
          heading: 'The Approach',
          paragraphs: [
            'The first corridor sets expectations: narrow, cold, and slightly too long. Guests should arrive at the first room already regretting the walk. If they arrive cheerful, add fog.',
          ],
        },
      ],
      [
        {
          heading: 'Minion Quarters',
          list: [
            'Bunk beds destroy menace. Hammocks are worse; they imply hobbies.',
            'Every minion needs one personal grievance, told twice a week to the skeletons.',
            'The break room is optional. The break is not.',
            'One (1) defaced portrait of a hero is permitted. The defacement must be tasteful.',
          ],
        },
      ],
    ],
  },
  'owlbear-training': {
    title: 'How to Train Your Owlbear',
    icon: 'fas fa-paw',
    subtitle: 'Obedience school for feathered bears',
    leather: { a: '#2c1f0c', b: '#4d3816', c: '#3c2b11' }, accent: '#e0b84f', tilt: '-0.8deg',
    pages: [
      [
        {
          heading: 'Week One — Trust',
          paragraphs: [
            'Bring treats. The owlbear will take the treats. Trust is built through repetition: you bring the treats, it brings the enthusiasm. Nobody is training anybody yet. That comes later.',
          ],
        },
        {
          heading: 'Week Two — Sit',
          paragraphs: [
            'It already sits. It sits whenever it likes, wherever it likes, including on the cart. The command is not for the owlbear. The command is for the neighbors.',
          ],
        },
        {
          heading: 'Advanced Commands',
          list: [
            '"Stay" — understood as "wait until the deer moves."',
            '"Fetch" — returns most of the object, and all of the enthusiasm.',
            '"Maul" — do not teach before Week Three, and never on the day guests arrive.',
            '"Roll Over" — an emergency evacuation technique, not a trick.',
          ],
        },
      ],
      [
        {
          heading: 'Choosing Your Owlbear',
          paragraphs: [
            'Adopt the owlbear that chooses the crate. Do not adopt the owlbear that chooses you; that one has already made its decision, and its decision is about lunch.',
          ],
        },
      ],
      [
        {
          heading: 'Troubleshooting',
          list: [
            'It is sitting on a guest: do not shout. Sit beside it until everyone feels supported.',
            'It has eaten the homework: this is a school. Homework is edible by tradition.',
            'It has adopted a second family: normal. Owlbears maintain overlapping households.',
            'It has learned to open doors: you have taught it everything. Now teach yourself to lock things.',
          ],
        },
      ],
      [
        {
          heading: 'Week Five — Graduation',
          paragraphs: [
            'The graduation ceremony is held wherever the owlbear is standing. Guests are encouraged to bring treats and discouraged from bringing hats.',
            'Diplomas are edible, on purpose. Any owlbear that has graduated is a graduate. That is the certificate. This school has never failed anyone, and does not intend to start now.',
          ],
        },
      ],
    ],
  },
  'potion-impatience': {
    title: 'Potions for the Impatient',
    icon: 'fas fa-flask',
    subtitle: 'Shake well. Drink fast. Report findings.',
    leather: { a: '#0f2024', b: '#1d3d44', c: '#163138' }, accent: '#4fc3d9', tilt: '1.4deg',
    pages: [
      [
        {
          heading: 'Skip the Simmer',
          paragraphs: [
            'The twelve-hour reduction is a suggestion made by people who own kitchens. In the field, if the color is close enough, taste is a formality.',
          ],
        },
        {
          heading: 'Field-Tested Shortcuts',
          list: [
            'Substitute one (1) healing potion with two vials of confidence. Confidence is not healing. It is, however, faster.',
            'Measure by splash, never by spoon. Spoons imply doubt.',
            'If the mixture begins to glow, do not stir faster. Faster stirring is how the century\'s greatest alchemists became the century\'s briefest.',
          ],
        },
        {
          heading: 'The Results Table',
          paragraphs: [
            'Side effects are documented at the back of this book, which is where the book now lives. If you have grown a tail, note its length and be grateful it is the sort you can sit on.',
          ],
        },
      ],
      [
        {
          heading: 'The Complaint Form',
          paragraphs: [
            'If the potion did not go as planned, complete the form at the back. The form asks three questions: which potion did you mean to brew, which potion did you brew, and which shape are you now.',
            'Attach a recent silhouette. Complaints are reviewed in order of urgency, and by shape.',
          ],
        },
        {
          heading: 'The Loyalty Card',
          paragraphs: [
            'Ten potions, one free. The free potion is the same potion, but free, which alchemists assure us is the entire appeal.',
            'Punch the card yourself. Trust is the eleventh ingredient.',
          ],
        },
      ],
    ],
  },
  'necromancer-planner': {
    title: "The Necromancer's Day Planner",
    icon: 'fas fa-skull',
    subtitle: 'Raise the dead. Mind the deadlines.',
    leather: { a: '#1d1d22', b: '#33333f', c: '#28282f' }, accent: '#8fd14f', tilt: '-1.3deg',
    pages: [
      [
        {
          heading: 'Monday — The Long Meeting',
          paragraphs: [
            'The skeleton crew understands the assignment. Present it twice — once for each shift. Rotate your wraiths into the graveyard shift; a resentful wraith moans, and moaning is a productivity leak.',
          ],
        },
        {
          heading: 'The Weekly Rite',
          list: [
            'Tuesday — reassert command over anything that has died recently.',
            'Wednesday — one (1) mass resurrection, weather permitting.',
            'Friday — close out the to-do list. If the list itself has died, do not raise it. Let it go.',
          ],
        },
        {
          heading: 'Quarterly Review',
          paragraphs: [
            'The dead do not ask for raises. They do, occasionally, ask for explanations. Keep your answers short and your phylactery shorter.',
          ],
        },
      ],
      [
        {
          heading: 'Notes on Delegation',
          list: [
            'Delegate the digging. The dead are excellent at it and never ask when.',
            'Never delegate the count. You will do the count, and the count will be correct, or you will do the count again.',
            'Rumors of a rival necromancer are best ignored. Rivalries are for the living.',
            'Write it down. Memory is the first thing a lich trades away.',
          ],
        },
      ],
      [
        {
          heading: 'The Back Pages — Assorted Errands for the Restless',
          list: [
            'Return the shovel you borrowed from the gravedigger. He counts them.',
            'Apologize to the skeleton crew for the draft. They know it is not your fault; they still want to hear it.',
            'Renew the cemetery lease. Landlords care not where the dead lie, only that the rent rises.',
            'Count the dead. The count is correct. You are verifying yourself.',
          ],
        },
      ],
    ],
  },
};

const SECTIONS = [
  {
    id: 'creatures',
    label: 'Bestiary',
    subtitle: 'Creature library & creator',
    icon: 'fas fa-dragon',
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 50%, #2a1a0e 100%)',
    accentColor: '#c0392b',
    borderGlow: '0 4px 22px rgba(192, 57, 43, 0.35)',
    features: ['Monsters & Beasts', 'Custom Creator', 'Community Spells'],
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-book-open' },
      { id: 'wizard', label: 'Create New', icon: 'fas fa-plus-circle' },
      { id: 'community', label: 'Community', icon: 'fas fa-globe' },
    ],
  },
  {
    id: 'items',
    label: 'Armory',
    subtitle: 'Weapons, armor & artifacts',
    icon: 'fas fa-shield-halved',
    gradient: 'linear-gradient(135deg, #1a2744 0%, #2c3e6b 50%, #0f1a2e 100%)',
    accentColor: '#2980b9',
    borderGlow: '0 4px 22px rgba(41, 128, 185, 0.35)',
    features: ['Equipment Catalog', 'Item Forge', 'Shared Artifacts'],
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-book-open' },
      { id: 'designer', label: 'Designer', icon: 'fas fa-hammer' },
      { id: 'community', label: 'Community', icon: 'fas fa-globe' },
    ],
  },
  {
    id: 'maps',
    label: 'Atlas',
    subtitle: 'Maps & environments',
    icon: 'fas fa-map-location-dot',
    gradient: 'linear-gradient(135deg, #1a3320 0%, #2d5a3e 50%, #0f2216 100%)',
    accentColor: '#27ae60',
    borderGlow: '0 4px 22px rgba(39, 174, 96, 0.35)',
    features: ['Battle Grids', 'Environment Scenes', 'Grid Settings'],
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-map' },
    ],
  },
];

const GEM_IDS = Object.keys(HIDDEN_GEMS);
const SECTION_IDS = SECTIONS.map(section => section.id);
const VISIBLE_GEM_COUNT = 9;

const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const buildShelf = () => shuffle([
  ...shuffle(GEM_IDS)
    .slice(0, Math.min(VISIBLE_GEM_COUNT, GEM_IDS.length))
    .map(id => ({ type: 'gem', id })),
  ...SECTION_IDS.map(id => ({ type: 'section', id })),
]);

const LibraryWindow = ({ isOpen, onClose }) => {
  const [shelf] = useState(buildShelf);
  const [activeSection, setActiveSection] = useState(null);
  const [activeBook, setActiveBook] = useState(null);
  const [bookPage, setBookPage] = useState(0);
  const [hoverNote, setHoverNote] = useState(null);
  const [subTabs, setSubTabs] = useState({});
  const bookPageRef = useRef(null);
  const { getWindowPosition, getWindowSize, setWindowPosition, setWindowSize } = useWindowStore();
  const isGMMode = useGameStore(state => state.isGMMode);

  const savedPos = getWindowPosition(WINDOW_ID, { x: 80, y: 80 });
  const savedSize = getWindowSize(WINDOW_ID, { width: 1100, height: 700 });

  const handleDrag = useCallback((pos) => {
    setWindowPosition(WINDOW_ID, { x: pos.x, y: pos.y });
  }, [setWindowPosition]);

  const handleResize = useCallback((size) => {
    setWindowSize(WINDOW_ID, size);
  }, [setWindowSize]);

  const handleBack = useCallback(() => {
    setHoverNote(null);
    setActiveSection(null);
  }, []);

  const handleBackFromBook = useCallback(() => {
    setHoverNote(null);
    setBookPage(0);
    setActiveBook(null);
  }, []);

  const handleSectionClick = useCallback((sectionId) => {
    setHoverNote(null);
    setActiveSection(sectionId);
    setSubTabs(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] || 'library',
    }));
  }, []);

  const handleGemClick = useCallback((gemId) => {
    setHoverNote(null);
    setBookPage(0);
    setActiveBook(gemId);
  }, []);

  const showNote = useCallback((e, title, subtitle, hint = 'Click to open the tome') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = 280;
    const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
    const above = rect.top > 170;
    setHoverNote({
      title,
      subtitle,
      hint,
      left,
      top: above ? rect.top - 12 : rect.bottom + 12,
      above,
    });
  }, []);

  const hideNote = useCallback(() => {
    setHoverNote(null);
  }, []);

  const handleSubTabChange = useCallback((sectionId, tabId) => {
    setSubTabs(prev => ({
      ...prev,
      [sectionId]: tabId,
    }));
  }, []);

  const currentSection = SECTIONS.find(s => s.id === activeSection);
  const activeGem = activeBook ? HIDDEN_GEMS[activeBook] : null;
  const currentSubTab = activeSection ? (subTabs[activeSection] || 'library') : null;
  const title = currentSection ? currentSection.label : (activeGem ? activeGem.title : '');

  const handleTurnBookPage = useCallback((delta) => {
    if (!activeGem) return;
    setBookPage(prev => {
      const next = Math.min(Math.max(prev + delta, 0), activeGem.pages.length - 1);
      if (next !== prev && bookPageRef.current) {
        bookPageRef.current.scrollTop = 0;
      }
      return next;
    });
  }, [activeGem]);

  const [creatureEditingId, setCreatureEditingId] = useState(null);

  const handleEditCreature = useCallback((creatureId) => {
    setCreatureEditingId(creatureId);
    handleSubTabChange('creatures', 'wizard');
  }, [handleSubTabChange]);

  const handleBackToLibrary = useCallback(() => {
    setCreatureEditingId(null);
    handleSubTabChange('creatures', 'library');
  }, [handleSubTabChange]);

  const renderCreatureContent = () => {
    if (currentSubTab === 'library') {
      return <CreatureLibrary onEdit={handleEditCreature} />;
    }
    if (currentSubTab === 'wizard') {
      return (
        <CreatureWizardApp
          editMode={!!creatureEditingId}
          creatureId={creatureEditingId}
          onSave={handleBackToLibrary}
          onCancel={handleBackToLibrary}
          activeView={currentSubTab}
        />
      );
    }
    if (currentSubTab === 'community') {
      return <CommunityCreaturesTab />;
    }
    return null;
  };

  const renderTabsHeader = () => {
    if (!currentSection || !currentSection.tabs) return null;

    return (
      <div className="spellbook-tab-container">
        <button
          className={`spellbook-tab-button`}
          onClick={handleBack}
          style={{ maxWidth: '80px' }}
        >
          <i className="fas fa-arrow-left" style={{ marginRight: '6px', fontSize: '11px' }}></i>
          <span>Back</span>
        </button>
        {currentSection.tabs.map(tab => (
          <button
            key={tab.id}
            className={`spellbook-tab-button ${currentSubTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              if (tab.id === 'wizard' && activeSection === 'creatures') {
                setCreatureEditingId(null);
              }
              handleSubTabChange(activeSection, tab.id);
            }}
          >
            <i className={tab.icon} style={{ marginRight: '8px', fontSize: '13px' }}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderBookHeader = () => {
    if (!activeGem) return null;

    return (
      <div className="spellbook-tab-container">
        <button
          className="spellbook-tab-button tab-icon-only"
          onClick={handleBackFromBook}
          onMouseEnter={(e) => showNote(e, 'Shelf', 'Back to the bookcase', null)}
          onMouseLeave={hideNote}
          aria-label="Back to the shelf"
        >
          <i className="fas fa-arrow-left tab-icon-glyph"></i>
        </button>
        <button
          className="spellbook-tab-button tab-icon-only active"
          onMouseEnter={(e) => showNote(e, activeGem.title, activeGem.subtitle, 'Currently reading')}
          onMouseLeave={hideNote}
          aria-label={activeGem.title}
        >
          <i className={`${activeGem.icon} tab-icon-glyph`}></i>
        </button>
      </div>
    );
  };

  const renderBookPage = () => {
    if (!activeGem) return null;

    const pages = activeGem.pages;
    const pageIndex = Math.min(bookPage, pages.length - 1);
    const pageSections = pages[pageIndex] || [];

    return (
      <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
        <div className="library-shelf-molding library-shelf-molding--thin library-drag-handle" title="Drag to move window"></div>
        <div className="library-book-page" ref={bookPageRef}>
          <div className="library-book-page-sheet">
            <div className="library-book-page-ornament">❦ ❦ ❦</div>
            <h2 className="library-book-page-title">{activeGem.title}</h2>
            <p className="library-book-page-subtitle">{activeGem.subtitle}</p>
            <div className="library-book-page-rule"></div>
            {pageSections.map((sec, i) => (
              <section key={`${pageIndex}-${i}`} className="library-book-page-section">
                <h3>{sec.heading}</h3>
                {(sec.paragraphs || []).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {sec.list && (
                  <ul>
                    {sec.list.map((li, j) => (
                      <li key={j}>{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="library-book-page-turner">
              <button
                type="button"
                className="library-page-turn"
                onClick={() => handleTurnBookPage(-1)}
                disabled={pageIndex === 0}
              >
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
                <span>Turn Back</span>
              </button>
              <div className="library-page-marker" aria-hidden="true">
                {pages.map((_, i) => (
                  <span key={i} className={i === pageIndex ? 'active' : ''}>◆</span>
                ))}
              </div>
              <button
                type="button"
                className="library-page-turn"
                onClick={() => handleTurnBookPage(1)}
                disabled={pageIndex === pages.length - 1}
              >
                <span>Turn the Page</span>
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
            <div className="library-book-page-footer">Redwater Press · recovered from a bargain bin · page {pageIndex + 1} of {pages.length}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MythrillWindow
      isOpen={isOpen}
      onClose={activeSection ? handleBack : activeBook ? handleBackFromBook : onClose}
      title={title}
      defaultPosition={savedPos}
      defaultSize={savedSize}
      onDrag={handleDrag}
      onResize={handleResize}
      minConstraints={[700, 500]}
      handleClassName="library-drag-handle"
      className="library-window"
      customHeader={activeSection ? renderTabsHeader() : activeBook ? renderBookHeader() : null}
    >
      {activeBook ? (
        renderBookPage()
      ) : !activeSection ? (
        <div className="library-bookshelf">
          <div className="library-shelf-molding library-drag-handle" title="Drag to move window">
            <span className="library-molding-hint">Mythrill Grand Library · choose a tome to open</span>
          </div>
          <div className="library-shelf-row library-drag-handle">
            {shelf.map((item, idx) => {
              if (item.type === 'section') {
                const section = SECTIONS.find(s => s.id === item.id);
                return (
                  <div
                    key={section.id}
                    className="library-book-slot library-book-slot--section"
                    onMouseEnter={(e) => showNote(e, section.label, section.subtitle)}
                    onMouseLeave={hideNote}
                  >
                    <button
                      type="button"
                      className={`library-book library-book--${section.id}`}
                      onClick={() => handleSectionClick(section.id)}
                      aria-label={`Open ${section.label}`}
                    >
                      <span className="library-book-bands" aria-hidden="true"></span>
                      <i className={`${section.icon} library-book-icon`} aria-hidden="true"></i>
                      <span className="library-book-title">{section.label}</span>
                      <span className="library-book-crown" aria-hidden="true">◆</span>
                    </button>
                  </div>
                );
              }
              const gem = HIDDEN_GEMS[item.id];
              return (
                <div
                  key={item.id}
                  className="library-book-slot library-book-slot--gem"
                  onMouseEnter={(e) => showNote(e, gem.title, gem.subtitle)}
                  onMouseLeave={hideNote}
                >
                  <button
                    type="button"
                    className="library-book library-book--gem"
                    style={{
                      '--leather-a': gem.leather.a,
                      '--leather-b': gem.leather.b,
                      '--leather-c': gem.leather.c,
                      '--accent': gem.accent,
                      '--tilt': gem.tilt,
                    }}
                    onClick={() => handleGemClick(item.id)}
                    aria-label={`Open ${gem.title}`}
                  >
                    <span className="library-book-bands" aria-hidden="true"></span>
                    <i className={`${gem.icon} library-book-icon`} aria-hidden="true"></i>
                    <span className="library-book-title">{gem.title}</span>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="library-shelf-plank library-drag-handle" title="Drag to move window"></div>
          <div className="library-shelf-molding library-shelf-molding--bottom library-drag-handle" title="Drag to move window"></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <div className="library-shelf-molding library-shelf-molding--thin library-drag-handle" title="Drag to move window"></div>
          {activeSection === 'creatures' && (
            <CreatureLibraryProvider>
              <CreatureWizardProvider>
                <div className="creature-window">
                  <div className="creature-window-content">
                    {renderCreatureContent()}
                  </div>
                </div>
              </CreatureWizardProvider>
            </CreatureLibraryProvider>
          )}
          {activeSection === 'items' && (
            <ItemLibrary
              key={`items-${currentSubTab}`}
              onClose={onClose}
              contentOnly={true}
              initialTab={currentSubTab}
            />
          )}
          {activeSection === 'maps' && (
            <MapLibraryWindow isOpen={true} onClose={onClose} contentOnly={true} />
          )}
        </div>
      )}
      </MythrillWindow>
      {hoverNote && createPortal(
        <div
          className={`library-book-note library-book-note--fixed ${hoverNote.above ? 'library-book-note--above' : 'library-book-note--below'}`}
          style={{ left: hoverNote.left, top: hoverNote.top }}
          role="tooltip"
        >
          <span className="library-book-note-title">{hoverNote.title}</span>
          {hoverNote.subtitle}
          {hoverNote.hint && (
            <span className="library-book-note-open">{hoverNote.hint}</span>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default LibraryWindow;
