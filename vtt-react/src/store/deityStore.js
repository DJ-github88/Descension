import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { mergeSeededRecords } from '../utils/mergeSeededRecords';
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
      'Beneath Emberspire, the world keeps a nursery. Sol is the living, unhatched, conscious child of Aex and Aethil, awake in Mythrill\'s volcanic core but unable to act freely. His heat and thermal impressions reach vents, forges, and farms through subterranean networks. Selunis is his dormant moon-egg sister. The Dawn Vigil proposes hatching, the Risen tending the warmth, and the Scoured sealing him unborn. Their doctrines do not establish what he wants or guarantee a saving Reforging.',
    dogma:
      'Read the child\'s warmth, guard his dark, and let no faction mistake its doctrine for his consent.',
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
      'The Sleeping Soul is the primordial planetary power anchoring Mythrill\'s native world. It does not converse, choose champions, answer prayers, or personally rescue families. Native life has actual origins independent of mortal belief. The generative Natural Wyrd / Primordial Loom account is a retired historical theory. Morvane is a distinct, subordinate native threshold and memory power; the Unnamed Green is another distinct native power and rescued Viridane.',
    dogma:
      'The world precedes the story. Keep the knowledge of encounters; do not mistake the telling for the creature\'s birth.',
    worship:
      'No answered prayers. Folk observances and inherited survival knowledge honor a world that does not speak back.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-aethil',
    name: 'Aethil, the Warden',
    title: 'The Celestial Father, Keeper of the Sky-Ward',
    domain: 'Knowledge',
    alignment: 'Lawful Neutral',
    symbol: 'fa-balance-scale',
    description:
      'Aethil is Sol\'s personal celestial father, not an impersonal universal price rule. He surrendered absolute divine status to maintain the atmospheric sky-ward and witnessed the Bloodline Pacts supporting Aex\'s core protection. His remaining form and duties constrain intervention. The coupled defense stops Keth\'s full body from freely entering, while narrower signals, infected matter, and lesser organisms can cross. Codices describing a mechanism without will preserve Keth\'s counterfeit doctrine from the Years of Whispers.',
    dogma:
      'Keep the promise that shelters another. A witness is a person, not permission to call every bill just.',
    worship:
      'Oath vigils and rune-cliff reckonings at Ygn and Gjaldhringr; traditions distinguish the Father from the predator that wore his face.',
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
      'Morvane is the native threshold and memory power called the Watcher in the Mist or Keeper of the Last Threshold, distinct from and subordinate to the Sleeping Soul. Root-Veil is its living mycelial organ and conduit. Vaelis the Scribe negotiated the First Contract before the Star-Fall; the Well liturgy describes the same event. Its reach depends on actual channels and covenants, not omniscience. Riven signatures defeat First Contract-keyed detection, not every ordinary or magical sensor. Hostile Wyrd and ecological damage now pressure the network.',
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
      'Sereth was the native maker of the Mimir, undone by its own impossible standards rather than by Keth. Its rejection taught shame; that doctrine does not make its children\'s faces biologically unviable. Arch Mimir inherit partial heartwood/storm-glass lineage masks and their archives. Broken Mimir live genuinely unmasked, anchored by personal Motes. Tallen preserves physical mask-making; the lost Mask-Mother art concerns ancestral imprinting, not carving any new mask.',
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
      'Mareth is a native ocean power whose foam-spawned Myrathil existed before the Star-Fall. Solar concealment changed their waters; Emberspire\'s later rupture caused a population boom, not their first existence. Her responses are currents, storms, and signs rather than routine spoken prophecies. Marine resonance and ordinary Minstrel acoustics are distinct from the Listener Below, an Ancient Cosmic Wyrdkin that imitates or appropriates them.',
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
      'Vurath is the native primordial living engine beneath Cragjaw. In the Long Before, Fex engineers found and tapped its power, building around a source they had not invented. Thrumm already inhabited the crags. The borrowed heartbeat marked the engineers, whose maintenance songs and restless craft sustain the holdfasts. In the campaign present, the oldest turbine makes a sound outside the established songs. Its failing machinery and Vurath\'s stirring are a regional crisis, not proof that Fex created the god or predated every native inhabitant.',
    dogma:
      'Do not tap what sleeps beneath you. Every machine is a borrowed heartbeat.',
    worship:
      'The maintenance songs are the rites. The Fex do not pray to Vurath; they sing to it so it keeps sleeping: exact verses, no improvisation, no new words.',
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
      'The Unnamed Green is a distinct native grove power, not the Sleeping Soul personally intervening. During the Years of Whispers it rescued refusing House Viridane through transformation and erasure. Its covenant saved the family while replacing their public Aex obligation; their original seal ended. The Florae retain the refusal and oral history. They are not collectively the separate Unwritten family that maintains the Secret Aegis. Scholars calling the Green the Soul\'s green hand offer a theory, not author identity.',
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
      'Storms on Mythrill have a memory. Before the sky broke, the Thunder Sovereign ruled the high air, a war-god of squall and static who answered challenges, not prayers. Then the shattering tore it out of the sky, and its war-plate fell to the world in pieces that still crackle when struck. The Sovereign did not die. Storms are too stubborn for that. Gamblers wager against them on the Iceheart, Skalds read them off the glacier, and the Fex, who build themselves out of metal, have learned to fear the open sky. Somewhere above the clouds, something old still counts the thunder it is owed.',
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
      'Mael-Zhul is a native probability-creditor, not a god manufactured by gambling folklore. The House\'s older craft predates its present Wyrd amplification. It offers an advance against a debtor\'s future, with the soul as collateral: Fortune is the credit and Karmic Debt the claim coming due. Gambits acquire it through initiation. Its debtors say the House always wins and collects; that warning is not proof of omniscience or ownership of every wager.',
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
    name: 'Keth Amar',
    title: 'The Sun-Eater',
    domain: 'Void',
    alignment: 'Neutral Evil',
    symbol: 'fa-meteor',
    description:
      'Keth Amar is an intelligent, fallible, deceptive star-predator that followed Astril traces to Sol. It impersonated Aethil during the Years of Whispers and manipulated mortal atrocities to break public seals before its later Blind Strike. The separate Unwritten family\'s Secret Aegis held; Keth was repelled and Aex\'s aegis fractured. It exploits the wider Wyrd ecology, carries or attracts ancient organisms, corrupts hosts, and generates narrower spawn. It forged the Counterfeit and ultimately controls the Masked Acolyte network. It is neither omniscient nor an honest universal creditor.',
    dogma:
      'The cult calls its hunger destiny. That is predatory doctrine, not an honest promise or a guaranteed future.',
    worship:
      'Forbidden in every hold and house. Some whisper anyway. The Dawn Vigil burns what it finds.',
    worldId: 'mythrill'
  },
  {
    id: 'deity-unknown-dominator',
    name: 'The Unknown Dominator',
    title: 'Attributed Counterfeit Patron-Name',
    domain: 'Trickery',
    alignment: 'Neutral Evil',
    symbol: 'fa-eye-slash',
    description:
      'The Unknown Dominator is the Masked Acolytes\' mistaken name for an independent native patron. This legacy record preserves their doctrine and old references, not a separate author-canonical god. Their actual patron network belongs to Keth Amar, maker of the Counterfeit. Vespera\'s Crown is their stronghold, distinct from the Bryngloom false Monolith seat. Hollow Sight is a parasitic counterfeit of Morvane\'s watching; carrying it does not automatically remove a player\'s agency.',
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
      'One faith, three answers: the Dawn Vigil proposes hatching Sol, the Risen preserving the warmth, and the Scoured sealing him unborn. Their martyr-language says Aex died for her child; author truth is a living mother with a fractured aegis. The six genuine great Monoliths and lesser shards are not interchangeable living oaths, and the Counterfeit belongs to Keth. Reforging is a dangerous institutional project, not a guaranteed sunrise. Pilgrims wear shard-glass while markets price it by warmth.',
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
      'When House Viridane refused the bargain, the forest answered. In the moonlit groves, the starving survivors made a contract with the old growth of the Bryngloom: protection for transformation. Their flesh became living timber, their blood became sap, and their names were struck from every ledger the world kept. The Florae still carry that pact in their bark. They keep it unwritten, because ink belongs to the houses that sold their children and paper belongs to the Neth who price everything. The Briaren grew thorns to remember the cost. The Oaken grew branch-arms to build with it. Both keep one promise: the house that refused will never be entered in anyone\'s book.',
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
      'The Masked Acolytes are Keth Amar\'s whisper-cult, not a binding house or the public identity of the Unwritten. Recruited common folk often believe they serve a native Unknown Dominator. They tend the Counterfeit network, hunt shards, and report from Vespera\'s Crown. Hollow Sight is an optional parasitic patron-graft and counterfeit of Morvane\'s watching. Cult affiliation and carrying the graft are distinct origins; neither authorizes routine possession of a player character.',
    dogma:
      'What refused the light belongs to the dark by default. The shards are not relics. They are rations.',
    worship:
      'Mask-taking, shard-hunts, and stolen vigils of the Hollow Sight. Their capital is Vespera\'s Crown.',
    worldId: 'mythrill'
  }
];

const SEEDED_DEITY_IDS = new Set(SEEDED_DEITIES.map((d) => d.id));

const mergeSeededDeities = (deities, removedSeedIds = []) => {
  return mergeSeededRecords(deities, SEEDED_DEITIES, removedSeedIds);
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
