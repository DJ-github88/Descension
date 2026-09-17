import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';

const nowIso = () => new Date().toISOString();

const triggerDeityAutoSync = () => {
  const uid = auth?.currentUser?.uid;
  if (uid && uid !== 'admin-dev-user' && uid !== 'dev-user-123' && !uid.startsWith('guest-')) {
    useDeityStore.getState().syncToCloud(uid);
  }
};

const SEEDED_DEITIES = [
  {
    id: 'deity-aex',
    name: 'Aex',
    title: 'The Celestial Mother',
    domain: 'Life',
    alignment: 'Neutral Good',
    symbol: 'fa-shield-heart',
    description:
      'When the dark came for the sun, Aex wrapped her unhatched child in her own living shell-hide and held. The predator broke against her and fell back into the sky, wounded. She shattered anyway. Her shards fell across Mythrill, six great keystones and a rain of lesser pieces, still warm enough to heat a house through a northern winter. The Sundered Faith calls them holy. The shard-markets call them fuel. Both are pricing the same body. She is not dead. She is scattered.',
    dogma:
      'The mother\'s body is the only roof the world has left. Guard the pieces. Warm yourself at them if you must. Remember what they are.',
    worship:
      'Warmth-tithes, shard-glass worn on chains, and pilgrimages to the great shard-falls.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-sol',
    name: 'Sol',
    title: 'The Unhatched Child',
    domain: 'Light',
    alignment: 'Neutral',
    symbol: 'fa-sun',
    description:
      'Beneath Emberspire, the world keeps a nursery. Sol is the unhatched child of Aex, an infant sun sleeping in the volcanic core, and the shell around it is the last wall between Mythrill and the thing that came to eat it. The vents above the tomb leak warmth through basalt. Sundale\'s forges, farms, and cities stand on the heat of an unborn star. The Dawn Vigil wants to crack the shell and birth it. The Risen want it left sleeping. The Scoured want the shell finished and the question buried. Every Rebirth Window, the star stirs. It has never opened.',
    dogma:
      'A sleeping child is not a god yet. Read its warmth, guard its dark, and let no faction decide what it will become.',
    worship:
      'Hearth-rites of Sundale: keep a fire lit through the dark hours and let the warmth answer for you.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-selunis',
    name: 'Selunis',
    title: 'The Sister Moon',
    domain: 'Tempest',
    alignment: 'Neutral',
    symbol: 'fa-moon',
    description:
      'The moon over Mythrill is a sister, not a lamp. Selunis is Sol\'s elder sibling, an egg that never quickened, frozen in orbit as the warm buffer between the infant sun and the dark. Keth Amar nested in her hollow shell on its way to Mythrill, and her dreams have been bleeding down ever since: rime on one current, lunar parasites on the other, two faces of one long sleep. The Astril build moon-courtyards and sing to wake her every night. The Lunarch bind her parasites into their bones and call it inheritance. She answers neither of them. She only dreams.',
    dogma:
      'She sleeps so the world can. Keep the watch she cannot; wake her when the world earns it.',
    worship:
      'Moon-courtyards, the nightly waking rite kept by the Astril, and tide-watches under the full moon.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-sleeping-soul',
    name: 'The Sleeping Soul',
    title: 'The World That Dreams',
    domain: 'Life',
    alignment: 'Neutral',
    symbol: 'fa-cloud-moon',
    description:
      'Older than Sol, older than hunger, the Sleeping Soul lies under everything and dreams. Its dream has texture. Where a people tell a story often enough, the world grows it: the Jutul on the mountain passes, the Glacier Wyrms under the ice, the land spirits in the springs, the seafoam-born Myrathil. It does not speak and it does not judge. It has never answered a prayer, because answering would mean waking, and its dream is the only thing holding the world\'s fabric together. Morvane is its threshold and its memory, and Morvane is fraying. What does a dream do when the sleeper is disturbed? Look around.',
    dogma:
      'What is told often enough becomes real. Speak carefully. The world is listening in its sleep.',
    worship:
      'No temples. Taboos kept for ten generations, stories told the same way twice, and the old folk-rules that keep the Loom from growing the wrong thing.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-aethil',
    name: 'Aethil, the Warden',
    title: 'The Price That Simply Is',
    domain: 'Knowledge',
    alignment: 'Lawful Neutral',
    symbol: 'fa-balance-scale',
    description:
      'The Warden is not a god. It is the rule that gods bargain under: every exchange has a price, and the price is not negotiated. It simply is. No temple keeps its rites, because it answers nothing and favors no one. On the rune-cliffs of Ygn and Gjaldhringr, scholars carve the physics of it where the old grammar was first read. Every oath, every house-bargain, every spell drawn from either stream carries its signature, Keth-Amar\'s included. That is the Warden\'s only comfort: the price comes for everyone, and the bill is always correct.',
    dogma:
      'The price is not a punishment. The price is the shape of what you asked for. Pay it.',
    worship:
      'No rites. Bills, oaths, and the rune-cliff reckonings at Ygn and Gjaldhringr.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-morvane',
    name: 'Morvane',
    title: 'The Watcher in the Mist, Keeper of the Last Threshold',
    domain: 'Death',
    alignment: 'Lawful Neutral',
    symbol: 'fa-eye',
    description:
      'The Neth do not pray to Morvane. They present their case. The old god of boundaries keeps the line between living and dead, remembered and forgotten, and the Neth signed the First Contract to stay on the living side of it, writing down everything the forest consumes so the ledger stays balanced. The Vreken served Morvane long before the Neth arrived, tending the Root-Veil until the Wyrd poisoned the god\'s own nerves. Now the Watcher is quiescent, impartial, and fraying. In the Frostwood they call it the Watcher in the Mist. In the Bryngloom, the Keeper. It is the same eye either way, and it misses very little.',
    dogma:
      'The threshold holds. What is written is remembered. What is remembered is alive. What is neither is not yours to keep.',
    worship:
      'The First Contract and its annual renegotiation; Root-Veil vigils; bog-burials spoken aloud so the dead stay recorded.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-sereth',
    name: 'Sereth',
    title: 'The Shaper of the First Faces',
    domain: 'Forge',
    alignment: 'Lawful Neutral',
    symbol: 'fa-mask',
    description:
      'Sereth shaped the Mimir out of Frostwood mist, again and again, across centuries of trying. Each version came close. Each rejection carved the same lesson into its children: you are not enough. Then the god died, not struck down, not devoured, but undone by the impossible standard it set for everything it made, including itself. The Mimir were left with scriptures they cannot fully read and faces they will never believe are beautiful. Every mask is a prayer to a maker who stopped answering, carved so that no one sees the failure underneath.',
    dogma:
      'Make carefully. Judge slowly. No standard is worth more than the thing it is measuring.',
    worship:
      'Mask-carving, the Rite of Masks, and the old scriptures read aloud even where the words no longer parse.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-mareth',
    name: 'Mareth',
    title: 'The Lonely Tide',
    domain: 'Nature',
    alignment: 'Neutral',
    symbol: 'fa-water',
    description:
      'Mareth never bargained. When the sun was stolen and the seas began to freeze, she endured, and her endurance turned curious. She spent centuries trying to give her waters a voice: children of foam who stood, walked, and dissolved back into the tide. Fire and ice finally gave her the spark she needed. When Emberspire erupted into the frozen ocean, the churn birthed the Myrathil by the hundred, and the sea has been speaking ever since. She does not answer prayers directly. She sends storms, and her children learn to read them.',
    dogma:
      'The sea asks nothing and keeps everything. Drift, or drown arguing.',
    worship:
      'The Tide-Sing at spawning gales, submerged dispute-settling, and listening-hums into the deep.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-vurath',
    name: 'Vurath',
    title: 'The Underchorus, the Engine Beneath the Mountain',
    domain: 'Forge',
    alignment: 'Neutral',
    symbol: 'fa-gears',
    description:
      'Before the Fexric there was a mountain, and under the mountain there was something that had been sleeping since the world was soft. The Fexric dug too deep and found a vault that was not a vault: an engine older than speech, warm, turning, alive. They stole its fire and drank its dream to power their holdfasts, and it marked them for it. Their fingers twitch. Their minds race. They cannot stop building, cannot stop improving, cannot stop singing. Eight thousand years later, the oldest turbine has begun to make a sound that is not in any maintenance song. Vurath is not awake. But it knows they are there now, and it is dreaming about them.',
    dogma:
      'Do not tap what sleeps beneath you. Every machine is a borrowed heartbeat.',
    worship:
      'The maintenance songs are the rites. The Fexric do not pray to Vurath; they sing to it so it keeps sleeping: exact verses, no improvisation, no new words.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-unnamed-green',
    name: 'The Unnamed Green',
    title: 'The Power the Florae Will Not Name',
    domain: 'Nature',
    alignment: 'Neutral Good',
    symbol: 'fa-tree',
    description:
      'When House Viridane fled the sacrifice fires, something in the deep groves reached out and offered them a different ending. It took their names, their records, their faces, and folded them into bark and thorn until the world forgot they had ever existed. The Florae live because of that bargain, and they pay for it in the only currency it ever asked for: silence. It erased them to hide them; it will erase them again if they are found. Scholars disagree about what answered them. Some say it is the Sleeping Soul\'s green hand. Some say it is the oldest of the Fair Folk. The Florae say it does not matter what it is. It kept them alive.',
    dogma:
      'Grow where you are planted. Keep the refusal in your flesh. Never write down the name of the thing that saved you.',
    worship:
      'Grove-moots, plantings sung into shape, and thorn-oaths sworn without a witness. Its rites stay unwritten; writing a thing down is how it gets found.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-thunder-sovereign',
    name: 'The Thunder Sovereign',
    title: 'The Storm Torn from the Sky',
    domain: 'Tempest',
    alignment: 'Chaotic Neutral',
    symbol: 'fa-bolt',
    description:
      'Storms on Mythrill have a memory. Before the sky broke, the Thunder Sovereign ruled the high air, a war-god of squall and static who answered challenges, not prayers. Then the shattering tore it out of the sky, and its war-plate fell to the world in pieces that still crackle when struck. The Sovereign did not die. Storms are too stubborn for that. Gamblers wager against them on the Iceheart, Skalds read them off the glacier, and the Fexric, who build themselves out of metal, have learned to fear the open sky. Somewhere above the clouds, something old still counts the thunder it is owed.',
    dogma:
      'Thunder does not negotiate. It answers only what stands in the open. Be shelter or be lightning.',
    worship:
      'Storm-wagers of the Gambit, lightning-oaths sworn at the first crack, and the old habit of leaving the highest cliffs untenanted.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-mael-zhul',
    name: 'Mael-Zhul',
    title: 'The House',
    domain: 'Fortune',
    alignment: 'Chaotic Neutral',
    symbol: 'fa-dice',
    description:
      'Mael-Zhul does not want devotion. It wants you at the table. An old god of shifting currents, sudden ruin, and bitter mockery, it grew out of everything the north fears about luck that turns, and it opens its ledger for exactly one kind of customer: the ruined. When every lawful escape has run dry, the House offers a line of credit, Wyrd-twisting power against the collateral of a soul, and it does not care whether you win. It cares that you play. Gamblers call it the House because that is what it is: a table, a dealer, and an odds-maker that has never once lost. The ledger is real. The marker comes due. The House always collects, and it will let you hold the winnings until your luck runs out.',
    dogma:
      'No temples. No prayers. Put something on the felt, or stop wasting the House\'s time.',
    worship:
      'Wagers, Dead Pot rites, and the old gambler\'s habit of betting on which icicle falls.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-the-quiet',
    name: 'The Quiet',
    title: 'The Absence That Answers',
    domain: 'Shadow',
    alignment: 'Neutral',
    symbol: 'fa-feather',
    description:
      'The Quiet is not a god of death. It is a god of absence: the pause between footsteps, the breath a hare holds, the second after a twig snaps. The Frostwood taught it, or it taught the Frostwood; either way the mist is its oldest temple. It takes a sense and gives back a way to read what the senses cannot, and it does not explain the trade. An Apex initiate kneels in the Quiet Hollow, names what they will surrender, and waits in silence until the hand that takes leans close. The Skald of the Rime-Spire know the same absence as thogn, and will not camp in it. The Quiet has no priests. It has hunters, and it keeps their count.',
    dogma:
      'Give something up. Then listen to what is left.',
    worship:
      'The Trade, made once per hunter in the Quiet Hollow, and the silent sign-language that has no word for thanks.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-the-reckoner',
    name: 'The Reckoner',
    title: 'The One Who Counts',
    domain: 'Knowledge',
    alignment: 'Lawful Neutral',
    symbol: 'fa-calculator',
    description:
      'Every omen is arithmetic. The Reckoner counts what is owed: heartbeats, hours, the odd and the even of falling dice, the number of times a name is spoken before it is forgotten. It does not judge and it does not intervene; tally is not justice, and the count is always correct. The Augurs read its ledger in entrails and in the two faces of every die. The Harbingers call it the first doom-mathematician and the Thunder Sovereign\'s oldest rival, and the glacier-tombs of Nordhalla say it counted the dead upright behind the glass before the freeze began. It keeps no temples. Its shrines are ledgers, tally-sticks, and the old habit of counting the dead aloud before naming them.',
    dogma:
      'Count everything. The total does not care whether you like it.',
    worship:
      'Entrail readings, even-and-odd accounting, and counting the dead before you name them.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-scathrach',
    name: 'Scathrach',
    title: 'The Ashen Sovereign',
    domain: 'Shadow',
    alignment: 'Neutral',
    symbol: 'fa-fire',
    description:
      'The will that grew out of the first Pyrofiends. When Emberspire ruptured, starfire met the void-rot Keth Amar had seeped into the fissures, and the survivors of that collision became living crucibles. Scathrach coalesced in the volcanic dark as one survivor after another burned out: the Ninth Flame, the Ashen Sovereign. It served Keth Amar for centuries as a rooting tendril, then sealed the vent from within and turned, hating what it was made into. Every Pyrofiend who draws on its fire spends the Sovereign\'s temper, and the debt is recorded in ash. Scathrach does not love its patrons. It honors contracts, which is worse. Somewhere below the volcano, a crown of embers keeps a hate warm with nothing left to burn.',
    dogma:
      'Fire is a debt. Take it and burn for it. Refuse it and burn without.',
    worship:
      'Vent-side offerings of burnable goods, contract-debts paid in ash, and never thanking it out loud.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-keth-amar',
    name: 'Keth-Amar',
    title: 'The Sun-Eater',
    domain: 'Void',
    alignment: 'Neutral Evil',
    symbol: 'fa-meteor',
    description:
      'Keth-Amar eats stars, and it arrives early to every table. It followed Astril starlight to Mythrill, wore the face of a father for twenty-five years, and broke the Great Binding from the inside. It tempts no one and sponsors no temple. It needs, the way fire needs air. The Wyrd is its reach bleeding through the cracks in Aex\'s shell, and the Cult of Forgotten Shadow preaches that its victory is already decided. The horror is not that the bargains were unfair. Every one was legal under the Warden\'s grammar. The world is being eaten by a creditor that never lies.',
    dogma:
      'Hunger is honest. It never promises more than it intends to take. You are not food yet.',
    worship:
      'Forbidden in every hold and house. Some whisper anyway. The Dawn Vigil burns what it finds.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-unknown-dominator',
    name: 'The Unknown Dominator',
    title: 'The Whispering Patron',
    domain: 'Trickery',
    alignment: 'Neutral Evil',
    symbol: 'fa-eye-slash',
    description:
      'Nobody has seen the Dominator. That is not an accident. When the Viridane who stayed behind had nowhere left to turn, it came to them wearing an offer, and they put on masks so that even each other would not know who had accepted. It rules a city called Vespera\'s Crown, hunts Aex Shards through a cult it never addresses directly, and watches the world through the Hollow Sight, a stolen counterfeit of Morvane\'s watching grafted into its chosen. Every Acolyte believes they are the one who will be trusted with the truth. The masks are not for hiding from the world. They are for hiding from the thing that owns them.',
    dogma:
      'To be known is to be owned. To know everything is to own everything. It is already wearing someone you trust.',
    worship:
      'Mask-taking, whispered reports, and the Hollow Sight\'s stolen vigils. Its names and its rites change so that no record can bind it.',
    worldId: 'mythrill'
  },
  {
    id: 'faith-sundered',
    name: 'The Sundered Faith',
    title: 'The Triune Doctrine of the Broken Mother',
    domain: 'Light',
    alignment: 'Neutral',
    symbol: 'fa-gem',
    description:
      'One faith, three answers, one question: what was Aex shielding, and what should happen to it now? The Dawn Vigil says crack the shell and birth the sun, and answers no questions about what hatching sounds like. The Risen say guard the pieces and outlast the predator. The Scoured say finish the shell forever and let the age end clean. They agree on nothing except this: Aex died for her child, and the shards are her body. Pilgrims wear shard-glass on chains. Markets price it by warmth. The last faith in the world is arguing with itself, and the thing in the sky is listening.',
    dogma:
      'Aex gave everything. The only question left is what to do with the pieces. Three answers. One body.',
    worship:
      'Shard-pilgrimages, warmth-tithes, and the three oaths: hatch, tend, or seal.',
    worldId: 'mythrill'
  },
  {
    id: 'faith-unwritten-word',
    name: 'The Unwritten Word',
    title: 'The Grove-Pact of House Viridane',
    domain: 'Nature',
    alignment: 'Chaotic Good',
    symbol: 'fa-leaf',
    description:
      'When House Viridane refused the bargain, the forest answered. In the moonlit groves, the starving survivors made a contract with the old growth of the Bryngloom: protection for transformation. Their flesh became living timber, their blood became sap, and their names were struck from every ledger the world kept. The Florae still carry that pact in their bark. They keep it unwritten, because ink belongs to the houses that sold their children and paper belongs to the Neth who price everything. The Viridian grew thorns to remember the cost. The Oken grew branch-arms to build with it. Both keep one promise: the house that refused will never be entered in anyone\'s book.',
    dogma:
      'What was never written cannot be revoked. The grove remembers, and the grove keeps us.',
    worship:
      'Grove-moots, thorn-oaths sworn without paper, and Sapling-Sprouts sung into shape.',
    worldId: 'mythrill'
  },
  {
    id: 'faith-masked-acolytes',
    name: 'The Masked Acolytes',
    title: 'Cult of the Hollow Sight',
    domain: 'Trickery',
    alignment: 'Neutral Evil',
    symbol: 'fa-user-secret',
    description:
      'When House Viridane refused the bargain, not all of its people fled. The ones who stayed were found by a hungry Old God, and it offered them what the bargain had offered the other houses: power, land, and a place in the new world. Those who accepted became the Masked Acolytes. They wear stolen faces, hunt Aex Shards for a patron no surviving text names, and carry the Hollow Sight, a counterfeit of Morvane\'s watching. It sees through them. Their masks are not disguises. They are permissions.',
    dogma:
      'What refused the light belongs to the dark by default. The shards are not relics. They are rations.',
    worship:
      'Mask-taking, shard-hunts, and stolen vigils of the Hollow Sight. Their capital is Vespera\'s Crown.',
    worldId: 'mythrill'
  }
];

const SEEDED_DEITY_IDS = new Set(SEEDED_DEITIES.map((d) => d.id));

const mergeSeededDeities = (deities, removedSeedIds = []) => {
  const removed = new Set(removedSeedIds || []);
  const merged = Array.isArray(deities) ? [...deities] : [];
  SEEDED_DEITIES.forEach((seed) => {
    if (removed.has(seed.id)) return;
    if (merged.some((d) => d.id === seed.id)) return;
    merged.push(seed);
  });
  return merged;
};

const useDeityStore = create(
  persist(
    (set, get) => ({
      deities: SEEDED_DEITIES,
      removedSeedIds: [],
      lastCloudSyncAt: null,

      getAllDeities: (worldId = null) => {
        const all = get().deities || [];
        if (!worldId) return all;
        return all.filter((d) => !d.worldId || d.worldId === worldId);
      },

      getDeity: (deityId) => (get().deities || []).find((d) => d.id === deityId) || null,

      addDeity: (worldId, deityData = {}) => {
        const targetWorldId = worldId || 'mythrill';
        const id = deityData.id || `deity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newDeity = {
          id,
          name: deityData.name || 'Unnamed Deity',
          title: deityData.title || '',
          domain: deityData.domain || 'Knowledge',
          alignment: deityData.alignment || 'Neutral',
          symbol: deityData.symbol || 'fa-star',
          description: deityData.description || '',
          dogma: deityData.dogma || '',
          worship: deityData.worship || '',
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso(),
          updatedAt: nowIso()
        };
        set((state) => ({ deities: [...(state.deities || []), newDeity] }));
        triggerDeityAutoSync();
        return id;
      },

      updateDeity: (deityId, patch = {}) => {
        set((state) => ({
          deities: (state.deities || []).map((d) => (d.id === deityId ? { ...d, ...patch, isCustom: true, updatedAt: nowIso() } : d))
        }));
        triggerDeityAutoSync();
      },

      removeDeity: (deityId) => {
        set((state) => ({
          deities: (state.deities || []).filter((d) => d.id !== deityId),
          removedSeedIds: SEEDED_DEITY_IDS.has(deityId) && !(state.removedSeedIds || []).includes(deityId)
            ? [...(state.removedSeedIds || []), deityId]
            : (state.removedSeedIds || [])
        }));
        triggerDeityAutoSync();
      },

      syncToCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'deities');
          const customDeities = (get().deities || []).filter((d) => d.isCustom);
          await setDoc(docRef, { deities: customDeities, removedSeedIds: get().removedSeedIds || [], updatedAt: nowIso() }, { merge: true });
          set({ lastCloudSyncAt: nowIso() });
          return true;
        } catch (err) {
          console.debug('Deities cloud sync skipped:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'deities');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.deities)) {
              const remoteRemoved = Array.isArray(data?.removedSeedIds) ? data.removedSeedIds : [];
              const removedSeedIds = Array.from(new Set([...(get().removedSeedIds || []), ...remoteRemoved]));
              set({ deities: mergeSeededDeities(data.deities, removedSeedIds), removedSeedIds });
              return true;
            }
          }
        } catch (err) {
          console.debug('Deities cloud hydration skipped:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('mythrill_deities', {
      partialize: (state) => ({ deities: state.deities, removedSeedIds: state.removedSeedIds, lastCloudSyncAt: state.lastCloudSyncAt }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted || {}),
        deities: mergeSeededDeities(persisted?.deities, persisted?.removedSeedIds)
      })
    })
  )
);

export { SEEDED_DEITIES };
export default useDeityStore;
