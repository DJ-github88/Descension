import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createScopedStorageConfig } from '../persistence/scopedStoreStorage';
import { getScopedStoreEngine } from '../persistence/scopedStoreStorage';
import { loadScopedDraft, captureOwnerGuard } from '../persistence/scopedConsumer';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const nowIso = () => new Date().toISOString();
export const TRASH_RETENTION_DAYS = 7;
export const TRASH_RETENTION_MS = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Normalizes a book object into the modern Chapter -> Page -> Blocks hierarchy.
 * Ensures 100% backward compatibility with flat legacy books.
 */
export const normalizeBook = (book) => {
  if (!book) return null;

  const normalized = {
    ...book,
    id: book.id || `book-${Date.now()}`,
    title: book.title || 'Untitled Chronicle',
    subtitle: book.subtitle || '',
    author: book.author || '',
    theme: book.theme || 'parchment', // 'parchment' | 'royal' | 'grimoire' | 'crimson'
    layout: book.layout || 'two-column', // 'two-column' | 'single-column' | 'spread'
    columns: typeof book.columns === 'number' ? book.columns : undefined,
    coverImage: book.coverImage || null,
    tags: Array.isArray(book.tags) ? book.tags : [],
    customTerms: Array.isArray(book.customTerms) ? book.customTerms : [],
    revisions: Array.isArray(book.revisions) ? book.revisions : [],
    trashedAt: book.trashedAt || null,
    createdAt: book.createdAt || nowIso(),
    updatedAt: book.updatedAt || nowIso(),
    chapters: []
  };

  const normalizeDescensionText = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/\b\+\d+\s*to\s*hit,?\s*/gi, '')
      .replace(/\breach\s*(\d+\s*ft\.?),?\s*one\s*target\.?\s*Hit:\s*\d+\s*\(([^)]+)\)\s*/gi, 'Melee Strike (Reach $1): Deals $2 ')
      .replace(/\bHit:\s*\d+\s*\(([^)]+)\)\s*/gi, 'Deals $1 ')
      .replace(/\bHit:\s*/gi, 'Deals ')
      .replace(/\bplus\s+\d+\s*\(([^)]+)\)\s*/gi, 'plus $1 ')
      .replace(/\bslashing\s+damage\b/gi, 'Slicing damage')
      .replace(/\bpiercing\s+damage\b/gi, 'Stabbing damage')
      .replace(/\bbludgeoning\s+damage\b/gi, 'Smashing damage')
      .replace(/\bcold\s+damage\b/gi, 'Rime damage')
      .replace(/\bfire\s+damage\b/gi, 'Ember damage')
      .replace(/\bnecrotic\s+damage\b/gi, 'Blight damage')
      .replace(/\bpoison\s+damage\b/gi, 'Blight damage')
      .replace(/\bpsychic\s+damage\b/gi, 'Wyrd damage')
      .replace(/\bradiant\s+damage\b/gi, 'Sacred damage')
      .replace(/\badvantage\s+on\s+Stealth\s+checks\b/gi, '+3 bonus to Stealth checks');
  };

  const normalizeBlock = (b) => {
    if (!b || typeof b !== 'object') return b;
    const block = { ...b };
    // 1. Remove CR & AC from creature statblocks and normalize Descension damage/actions
    if (block.type === 'creature_statblock') {
      if (block.cr || !block.dangerLevel) {
        if (block.cr) {
          block.dangerLevel = String(block.cr).replace(/^CR\s*/i, '').trim() || 'Medium';
          delete block.cr;
        }
      }
      if (block.ac !== undefined) {
        delete block.ac;
      }
      if (block.mana === undefined) block.mana = 30;
      if (block.ap === undefined) block.ap = 3;
      if (!block.resistances && block.name === 'Frost Wyrd Sentinel') {
        block.resistances = 'Immune: Rime; Vulnerable: Ember';
      }
      if (Array.isArray(block.traits)) {
        block.traits = block.traits.map((t) => ({
          ...t,
          desc: normalizeDescensionText(t.desc)
        }));
      }
      if (Array.isArray(block.actions)) {
        block.actions = block.actions.map((a) => {
          let name = a.name || 'Action (1 AP)';
          if (name === 'Rime Blade') name = 'Rime Blade (1 AP)';
          if (name === 'Mist Stride (Recharge 5-6)') name = 'Mist Stride (1 AP, 10 Mana)';
          return {
            ...a,
            name,
            desc: normalizeDescensionText(a.desc)
          };
        });
      }
    }
    // 2. Upgrade any persisted D&D 5e starter strings in paragraphs/tables to Descension canon
    if (block.type === 'paragraph') {
      if (typeof block.text === 'string') {
        block.text = block.text.replace(/DC 14 Dexterity saving throw/g, 'DC 14 Agility saving throw');
      }
      if (typeof block.content === 'string') {
        block.content = block.content.replace(/DC 14 Dexterity saving throw/g, 'DC 14 Agility saving throw');
        if (!block.text) block.text = block.content;
      }
    }
    // 3. Normalize table headers & cells: replace "Threat / CR" or "CR" with "Threat Rating" / "Danger Level"
    if ((block.type === 'table' || block.type === 'roll_table') && Array.isArray(block.headers)) {
      block.headers = block.headers.map((h) => {
        if (typeof h === 'string') {
          return h.replace(/\bThreat\s*\/\s*CR\b/i, 'Threat Rating').replace(/\bCR\b/i, 'Threat Rating');
        }
        return h;
      });
      if (Array.isArray(block.rows)) {
        const starterUpgrades = {
          '1d4 Magmins searching for raw ore': '1d4 Ember-Motes scavenging raw cinder-ore',
          'Fire Snake nestled in obsidian fissure': 'Ash-Serpent coiled in an obsidian fissure',
          '2 Hell Hounds on perimeter patrol': '2 Cinder-Hounds prowling the basalt Causeway',
          'Azer Artisan forging brass talismans': 'Forge-Kin Artisan tempering brass wyrd-sigils',
          'Salamander scout with molten spear': 'Pyre-Stalker Vanguard with molten glaive',
          'Red Dragon Wyrmling feasting on gems': 'Cinder-Scale Wyrmling feasting on prism-shards'
        };
        block.rows = block.rows.map((row) => {
          if (!Array.isArray(row)) return row;
          return row.map((cell) => {
            if (typeof cell === 'string') {
              if (starterUpgrades[cell]) return starterUpgrades[cell];
              if (/^CR\s*/i.test(cell)) {
                const clean = cell.replace(/^CR\s*/i, '').trim();
                if (clean === '1/4' || clean === '1/2' || clean === '1') return 'Low';
                if (clean === '2') return 'Medium';
                if (clean === '3' || clean === '4') return 'High';
                if (clean === '5' || clean === '6') return 'Lethal';
                return `Threat ${clean}`;
              }
            }
            return cell;
          });
        });
      }
    }
    if (block.type === 'map_embed') {
      if (typeof block.subtitle === 'string' && block.subtitle.includes('Click any Keyed Pin')) {
        block.subtitle = 'Surveyed by the Scribe-Sentinels of Greymark Keep • Subterranean Vaults A1–A3';
      }
      if (Array.isArray(block.markers)) {
        block.markers = block.markers.map((m) => ({
          ...m,
          color: m.color === '#ffd700' ? '#8b5a1a' : m.color === '#ef4444' ? '#7c2d23' : m.color === '#10b981' ? '#3b5944' : m.color
        }));
      }
    }
    return block;
  };

  // If chapters array exists and has pages, use it
  if (Array.isArray(book.chapters) && book.chapters.length > 0) {
    normalized.chapters = book.chapters.map((ch, chIdx) => ({
      ...ch,
      id: ch.id || `ch-${chIdx + 1}-${Date.now()}`,
      title: ch.title || `Chapter ${chIdx + 1}`,
      subtitle: ch.subtitle || '',
      epigraph: ch.epigraph || '',
      pages: (Array.isArray(ch.pages) && ch.pages.length > 0)
        ? ch.pages.map((pg, pgIdx) => ({
            ...pg,
            id: pg.id || `pg-${chIdx + 1}-${pgIdx + 1}`,
            pageNumber: pg.pageNumber || pgIdx + 1,
            headerTitle: pg.headerTitle || '',
            layout: pg.layout || normalized.layout,
            blocks: (Array.isArray(pg.blocks) ? pg.blocks : []).map(normalizeBlock)
          }))
        : [
            {
              id: `pg-${ch.id || chIdx}-1`,
              pageNumber: 1,
              headerTitle: ch.title || '',
              layout: normalized.layout,
              blocks: (Array.isArray(ch.blocks) ? ch.blocks : []).map(normalizeBlock)
            }
          ]
    }));
  } else if (Array.isArray(book.blocks) && book.blocks.length > 0) {
    // Legacy flat blocks: migrate into Chapter 1, Page 1
    const firstHeader = book.blocks.find((b) => b.type === 'header')?.text;
    normalized.chapters = [
      {
        id: `ch-1-${book.id}`,
        title: firstHeader ? `Chapter I: ${firstHeader}` : (book.title ? `Chapter I: ${book.title}` : 'Chapter I: Introduction'),
        subtitle: 'Foundations & Lore',
        epigraph: '',
        pages: [
          {
            id: `pg-1-${book.id}`,
            pageNumber: 1,
            headerTitle: book.title || 'Page 1',
            layout: normalized.layout,
            blocks: book.blocks.map(normalizeBlock)
          }
        ]
      }
    ];
  } else {
    // Empty book default
    normalized.chapters = [
      {
        id: `ch-1-${book.id}`,
        title: 'Chapter I: The Beginning',
        subtitle: '',
        epigraph: '',
        pages: [
          {
            id: `pg-1-${book.id}`,
            pageNumber: 1,
            headerTitle: '',
            layout: normalized.layout,
            blocks: [
              { id: `b-${Date.now()}`, type: 'paragraph', hasDropCap: true, text: 'The quill awaits your words...', column: 'left' }
            ]
          }
        ]
      }
    ];
  }

  return normalized;
};

export const STARTER_BOOKS = [
  {
    id: 'book-starter-frostwood',
    title: 'Chronicles of the Frostwood Compact',
    subtitle: 'An Exegesis of the Fog-Bound Reach & The Sovereign Ledger',
    author: 'Jarl-Archivist Kaelen Thalreth',
    theme: 'parchment',
    layout: 'two-column',
    coverImage: null,
    tags: ['starter', 'nordhalla', 'frostwood-reach', 'lore'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    customTerms: [
      {
        id: 'term-ancient-mist',
        name: 'Ancient Mist',
        alias: 'The Fog',
        category: 'Phenomenon',
        definition: 'A sentient thermal fog enveloping the Frostwood Reach that protects against deadly sub-zero blizzards but slowly consumes ancestral memories.',
        icon: 'fa-smog',
        color: '#8fa8c8'
      },
      {
        id: 'term-sovereign-ledger',
        name: 'Sovereign Ledger',
        alias: 'The Great Register',
        category: 'Relic',
        definition: 'A collection of dragon-vellum tomes safeguarded by the Scribe-Sentinels to preserve lineages against memory erosion.',
        icon: 'fa-book-bookmark',
        color: '#d4af37'
      }
    ],
    revisions: [],
    chapters: [
      {
        id: 'ch-frostwood-1',
        title: 'Chapter I: The Fog-Bound Covenant',
        subtitle: 'Founding of Greymark Keep',
        epigraph: '“When stone crumbles before the frost, only memory and mist endure.”',
        pages: [
          {
            id: 'pg-frostwood-1',
            pageNumber: 1,
            headerTitle: 'The Shrouded Bargain',
            layout: 'two-column',
            blocks: [
              { id: 'b-1', type: 'header', level: 1, text: 'The Shrouded Bargain', column: 'left' },
              { id: 'b-2', type: 'paragraph', hasDropCap: true, text: 'In the third century following the Shattered Moon, when the killing freeze threatened to extinguish all warmth across Nordhalla, the ancestors of House Thalreth sought refuge not behind stone, but behind the veil of the [[Ancient Mist]]. They bartered with the slumbering wyrd of the Frostwood Reach, exchanging spatial clarity for a barrier of insulating thermal fog.', column: 'left' },
              { id: 'b-3', type: 'callout', calloutType: 'info', title: 'Historical Note: The Fog Compact', icon: 'fa-scroll', content: 'The fog that guards Greymark Keep does not merely insulate from cold; it slowly claims the ancestral memories of those who reside within it for more than three generations.', column: 'left' },
              { id: 'b-4', type: 'header', level: 2, text: 'The Sovereign Ledger', column: 'right' },
              { id: 'b-5', type: 'paragraph', hasDropCap: false, text: 'To combat the relentless erosion of memory, the Scribe-Sentinels established the [[Sovereign Ledger]]. Every birth, marriage, deed of valor, and land-grant is inscribed in treated dragon-parchment and stored within subterranean vault-libraries.', column: 'right' },
              { id: 'b-6', type: 'divider', dividerStyle: 'flourish', column: 'right' },
              { id: 'b-7', type: 'entity_embed', entityType: 'faction', entityId: 'house-thalreth', displayMode: 'card', column: 'right' }
            ]
          },
          {
            id: 'pg-frostwood-2',
            pageNumber: 2,
            headerTitle: 'The Encroaching Chill',
            layout: 'two-column',
            blocks: [
              { id: 'b-8', type: 'header', level: 2, text: 'The Encroaching Chill', column: 'left' },
              { id: 'b-9', type: 'paragraph', hasDropCap: true, text: 'Despite the rigorous duties of the archivist-guards, rumors persist that certain ledgers have been deliberately rewritten by the current regime, masking ancient treaties that would otherwise disinherit the ruling branches.', column: 'left' },
              { id: 'b-10', type: 'callout', calloutType: 'secret', title: 'GM Secret: The Lost Census', icon: 'fa-mask', content: 'The original unrevised census of the First Generation is buried in the sealed crypts beneath the Frozen Archive in Rime-Spire Peaks.', column: 'left' },
              { id: 'b-11', type: 'divider', dividerStyle: 'diamond', column: 'left' },
              {
                id: 'b-12',
                type: 'creature_statblock',
                column: 'right',
                name: 'Frost Wyrd Sentinel',
                creatureType: 'Elemental / Spirit',
                dangerLevel: 'High',
                hp: 68,
                mana: 30,
                ap: 3,
                speed: '30 ft., Fly 40 ft. (hover)',
                resistances: 'Immune: Rime; Vulnerable: Ember',
                stats: { strength: 14, agility: 16, constitution: 15, intelligence: 12, spirit: 16, charisma: 10 },
                traits: [
                  { name: 'Fog Camouflage', desc: 'The sentinel gains +3 to Stealth checks and imposes -2 accuracy on ranged strikes against it while obscured by mist or snow.' },
                  { name: 'Memory Chill', desc: 'Melee strikes inflict 1d6 Rime damage and reduce the target’s Initiative by 2 until warmed by an Ember source.' }
                ],
                actions: [
                  { name: 'Rime Blade (1 AP)', desc: 'Melee Strike (Reach 5 ft.): Deals 2d6 + 3 Slicing damage plus 2d6 Rime damage.' },
                  { name: 'Mist Stride (1 AP, 10 Mana)', desc: 'The sentinel teleports up to 30 ft. to an unoccupied space obscured by thermal fog or shadow.' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'book-campaign-rime-spire',
    title: 'The Rime-Spire Covenant',
    subtitle: 'A Complete Descension Campaign Module for Levels 3–6',
    author: 'Grand Archivist Veyra & Mythrill Press',
    theme: 'parchment',
    layout: 'book-spread',
    coverImage: '/assets/images/backgrounds/nordhalla.jpeg',
    tags: ['campaign', 'descension', 'frostwood-reach', 'full-showcase', 'drunhold'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    customTerms: [
      {
        id: 'term-unwritten-bell',
        name: 'The Unwritten Bell',
        alias: 'Vesper of Drunhold',
        category: 'Relic',
        definition: 'A cracked bronze bell suspended above the Sunken Archive; when rung, it strips spoken names from the air within a mile.',
        icon: 'fa-bell',
        color: '#c89a3c'
      },
      {
        id: 'term-seelie-accord',
        name: 'Seelie Accord',
        alias: 'The Twilight Pact',
        category: 'Treaty',
        definition: 'The pre-Binding covenant between Tallyn settlers and native Frostwood fey to share hearth-warmth in exchange for safeguarded memories.',
        icon: 'fa-handshake',
        color: '#506e30'
      }
    ],
    revisions: [],
    chapters: [
      {
        id: 'ch-rimespire-1',
        title: 'Chapter I: Whispers in the Fog-Bound Reach',
        subtitle: 'Dramatis Personae, Sovereign Bloodlines & Campaign Arc',
        epigraph: '“To forget your grandfather’s oath is misfortune; to have it stolen from the ink is treason.”',
        pages: [
          {
            id: 'pg-rimespire-1',
            pageNumber: 1,
            headerTitle: 'Campaign Overview & Gazetteer',
            layout: 'two-column',
            blocks: [
              { id: 'rs-1', type: 'header', level: 1, variant: 'banner-crimson', text: 'Act I: The Fading Names', column: 'left' },
              {
                id: 'rs-2',
                type: 'paragraph',
                hasDropCap: true,
                column: 'left',
                text: 'Across the border-hamlets of Drunhold, elders are waking without their surnames. Ink is lifting from family Bibles and tax rolls alike, drawn toward the subterranean vaults beneath Rime-Spire Crag where the [[Sovereign Ledger]] was sealed during the Great Binding. If the party cannot descend into the Sunken Archive before the winter solstice, the [[Seelie Accord]] will unravel and the thermal fog protecting the valley will turn frigid.'
              },
              {
                id: 'rs-3',
                type: 'callout',
                calloutType: 'readaloud',
                column: 'left',
                title: 'Read-Aloud: Arrival at the Crossroads',
                content: 'A rusted iron lantern swings from a leaning birch signpost at the edge of Drunhold. Beneath it sits a stooped figure no taller than a child, sorting tarnished brass keys inside a wooden barrow while the warm silver fog curls around your boots.'
              },
              {
                id: 'rs-4',
                type: 'location_showcase',
                column: 'left',
                name: 'Drunhold & The Sunken Archive',
                locationType: 'Fortified Settlement & Vault',
                dangerRating: 'High',
                region: 'Frostwood Reach',
                faction: 'House Thalreth',
                landmarks: 'The Weeping Wellhead, Iron-Vellum Scriptorium, Crossroads Shrine',
                description: 'Built atop geothermal vents that feed the [[Ancient Mist]], Drunhold is a timber-and-slate bastion where Scribe-Sentinels guard the stairways descending into the First Generation vaults.',
                secrets: 'The Scriptorium cellar connects directly to Area A1 via a flooded drainage sluice.'
              },
              {
                id: 'rs-5',
                type: 'plot_thread',
                column: 'right',
                title: 'The Thawing of the First Seal',
                type: 'Main Campaign Arc',
                status: 'Active',
                act: 'I–III',
                theme: 'Memory, Duty, and the Price of Warmth',
                summary: 'Rogue archivist-priests have cracked the lower Rime-Spire vault to rewrite the royal succession, inadvertently awakening the Frost Wyrd Sentinels bound to guard the original parchment.',
                beats: [
                  { title: 'Barter with Gref at the Twilight Crossroads', description: 'Trade a personal memory or rusted key to learn the hidden sluice entrance.', completed: true },
                  { title: 'Breach the Sunken Archive of Drunhold', description: 'Navigate Areas A1–A3 and survive the Rime-Weeping wards.', completed: false },
                  { title: 'Reclaim the First Generation Census', description: 'Defeat the Frost Wyrd Sentinel in Area A3 and seal the breach.', completed: false }
                ]
              },
              {
                id: 'rs-6',
                type: 'npc_dossier',
                column: 'right',
                name: 'Gref, the Memory-Merchant',
                role: 'Crossroads Guide & Curio Broker',
                disposition: 'Friendly',
                faction: 'Seelie Accord',
                personality: 'Speaks in a dry autumn-leaf whisper; counts old iron keys when nervous.',
                description: 'A native pre-Binding fey who collects misplaced trinkets and forgotten regrets along the Drunhold road. Gref refuses coin, accepting only stories, secrets, or heirloom keys.',
                quote: '“Keep your gold, warm-blood. Give me the name of the first hound you loved, and I will give you the key to the dry stair.”'
              }
            ]
          },
          {
            id: 'pg-rimespire-2',
            pageNumber: 2,
            headerTitle: 'Bloodlines & Sovereign Houses',
            layout: 'two-column',
            blocks: [
              {
                id: 'rs-7',
                type: 'lineage_showcase',
                column: 'left',
                name: 'Rime-Touched Tallyn',
                essence: 'Keepers of the Thermal Veil',
                abilityModifiers: { STR: 0, AGI: 1, CON: 1, INT: 0, SPI: 2, CHA: 0 },
                baseTraits: { size: 'Medium', baseSpeed: 30, baseHp: 28, baseMana: 20, languages: ["Wayfarer's Cant", 'Old Skaldic'], lifespan: '80–120 yrs' },
                description: 'Born within three leagues of the [[Ancient Mist]], Rime-Touched Tallyn carry pale silver irises and frost-rimed breath that never clouds in winter air.',
                racialPassives: [
                  { name: 'Mist-Sight', description: 'Ignores accuracy penalties from non-magical fog, snowfall, and twilight gloom up to 60 ft.' },
                  { name: 'Hearth-Tempered Blood', description: 'Resistant to Rime damage; reduces Frozen duration by 1 round.' }
                ],
                racialAbilities: [
                  { name: 'Recall the Inscribed Oath', actionPointCost: 1, manaCost: 8, description: 'Bolsters an ally within 30 ft. with ancestral clarity, granting +2 to Spirit saves and cleansing Wyrd confusion.' }
                ],
                meaningfulTradeoffs: 'Prolonged exposure to scorching Ember vents imposes -1 on Constitution saves.'
              },
              {
                id: 'rs-8',
                type: 'dynasty_tree',
                column: 'right',
                name: 'Sovereign House Thalreth',
                description: 'The hereditary Wardens of Greymark Keep whose legitimacy rests upon the disputed First Generation Census.',
                nodes: [
                  { id: 'th-1', name: 'Jarl Halvar Thalreth', title: 'First Compact Signer', lifespan: '12–84 AB', role: 'Founder', gender: 'male' },
                  { id: 'th-2', name: 'Lady Astrid Thalreth', title: 'Keeper of the Seals', lifespan: '240–Present', role: 'Matriarch', gender: 'female' },
                  { id: 'th-3', name: 'Kaelen Thalreth', title: 'Jarl-Archivist', lifespan: '268–Present', role: 'Ruling Warden', gender: 'male' },
                  { id: 'th-4', name: 'Soren the Unwritten', title: 'Disinherited Scion', lifespan: '271–Present', role: 'Exiled Claimant', gender: 'male' }
                ],
                relationships: [
                  { fromId: 'th-1', toId: 'th-2', type: 'ancestor of' },
                  { fromId: 'th-2', toId: 'th-3', type: 'mother of' },
                  { fromId: 'th-3', toId: 'th-4', type: 'estranged brother of' }
                ]
              },
              {
                id: 'rs-9',
                type: 'quest_hook',
                column: 'right',
                title: 'The Unwritten Census of Drunhold',
                level: 4,
                difficulty: 'High',
                status: 'Active',
                giver: 'Jarl-Archivist Kaelen Thalreth',
                description: 'Descend beneath the flooded sluice of Drunhold Scriptorium, silence the [[The Unwritten Bell]], and recover the dragon-vellum roll before Soren’s zealots burn the true lineage.',
                objectives: [
                  { text: 'Acquire the Sluice-Gate Key from Gref at the Twilight Crossroads', completed: true },
                  { text: 'Survive the Olveist ambush in Area A1 (The Rime-Weeping Threshold)', completed: false },
                  { text: 'Defeat the Frost Wyrd Sentinel in Area A3 and secure the First Census', completed: false }
                ],
                rewards: {
                  experience: 850,
                  currency: { gold: 65, silver: 40 },
                  item: 'Vellum-Bound Blade of Thalreth'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'ch-rimespire-2',
        title: 'Chapter II: The Sunken Archive of Drunhold',
        subtitle: 'Cartography, Keyed Vault Chambers & Random Encounters',
        epigraph: '“Step lightly on the ice; the dead below are still reading.”',
        pages: [
          {
            id: 'pg-rimespire-3',
            pageNumber: 3,
            headerTitle: 'Vault Cartography & Keyed Chambers',
            layout: 'two-column',
            blocks: [
              {
                id: 'rs-10',
                type: 'map_embed',
                column: 'left',
                title: 'The Sunken Archive & Drunhold Approaches',
                subtitle: 'Surveyed by the Scribe-Sentinels of Greymark Keep • Subterranean Vaults A1–A3',
                imageUrl: '/assets/images/backgrounds/nordhalla.jpeg',
                layoutStyle: 'stacked',
                heightStyle: 'standard',
                description: 'The subterranean archive is carved into a glacier-fed cavern beneath Drunhold. Warm bog-vents in Area A1 give way to dry, rime-encrusted vaults in Areas A2 and A3.',
                locations: [
                  { id: 'loc-all', name: 'Archive Overview', focalPoint: { x: 50, y: 50 }, zoom: 1.0, description: 'Full cartographic survey of the Sunken Archive.' },
                  { id: 'loc-a1', name: 'A1: Sluice Threshold', focalPoint: { x: 30, y: 62 }, zoom: 1.8, description: 'Flooded peat-sluice guarded by an Olveist.' },
                  { id: 'loc-a2', name: 'A2: Hall of Ledgers', focalPoint: { x: 52, y: 46 }, zoom: 1.9, description: 'Tiered basalt alcoves holding bronze scroll-tubes.' },
                  { id: 'loc-a3', name: 'A3: Inner Sanctum', focalPoint: { x: 74, y: 34 }, zoom: 2.1, description: 'Vault of the Unwritten Bell and the First Census.' }
                ],
                markers: [
                  { id: 'pin-a1', x: 30, y: 62, icon: 'fa-water', color: '#3b5944', areaCode: 'A1' },
                  { id: 'pin-a2', x: 52, y: 46, icon: 'fa-book-bookmark', color: '#8b5a1a', areaCode: 'A2' },
                  { id: 'pin-a3', x: 74, y: 34, icon: 'fa-skull', color: '#7c2d23', areaCode: 'A3' }
                ]
              },
              { id: 'rs-11', type: 'header', level: 2, variant: 'keyed-area', areaCode: 'A1', text: 'The Rime-Weeping Threshold', column: 'right' },
              {
                id: 'rs-12',
                type: 'paragraph',
                hasDropCap: false,
                column: 'right',
                text: '**Flooded Sluice.** Knee-deep black peat-water fills the entry hall, warmed by a cracked geothermal conduit. An **Olveist Silt-Serpent** coils beneath the submerged flagstones, sensing footsteps through boot-soles. Stepping onto the dry stone causeway requires a DC 13 Agility check or alerts the serpent.'
              },
              { id: 'rs-13', type: 'header', level: 2, variant: 'keyed-area', areaCode: 'A2', text: 'Hall of Frozen Ledgers', column: 'right' },
              {
                id: 'rs-14',
                type: 'paragraph',
                hasDropCap: false,
                column: 'right',
                text: '**Whispering Alcoves.** Twelve-foot shelves of iron-oak hold thousands of dragon-vellum cylinders. Frost-runes along the pillars flare whenever a creature speaks aloud; casting a vocal spell triggers a **Wyrd Echo** (1d6 Wyrd damage and DC 14 Spirit save or lose 1 AP on your next turn).'
              },
              { id: 'rs-15', type: 'header', level: 2, variant: 'keyed-area', areaCode: 'A3', text: 'Sanctum of the Unwritten Name', column: 'right' },
              {
                id: 'rs-16',
                type: 'paragraph',
                hasDropCap: false,
                column: 'right',
                text: '**The Dais of Seals.** Beneath [[The Unwritten Bell]] stands a lectern of pale rime-crystal holding the First Generation Census. A **Frost Wyrd Sentinel** manifests from the freezing vapor as soon as anyone approaches within 15 ft. of the dais.'
              },
              {
                id: 'rs-17',
                type: 'callout',
                calloutType: 'secret',
                column: 'right',
                title: 'GM Secret: Silencing the Bell',
                content: 'Wrapping the clapper of the Unwritten Bell in wool or striking it with an Ember spell suppresses the room’s Memory Chill aura and weakens the Frost Wyrd Sentinel by 20 HP.'
              }
            ]
          },
          {
            id: 'pg-rimespire-4',
            pageNumber: 4,
            headerTitle: 'Archive Omens, Bestiary & Relics',
            layout: 'two-column',
            blocks: [
              {
                id: 'rs-18',
                type: 'roll_table',
                column: 'left',
                title: 'd12 Sunken Archive Omens & Encounters',
                diceFormula: 'd12',
                headers: ['d12', 'Archive Event or Adversary', 'Threat Rating'],
                rows: [
                  ['1–3', 'Ink-Motes rise from a cracked scroll-tube, whispering a party member’s childhood secret (DC 13 Spirit save or 1d4 Wyrd damage)', 'Low'],
                  ['4–6', '2 Rime-Bound Scribe Husks patrolling the upper gallery with iron-tipped quills (1d8+2 Stabbing damage)', 'Medium'],
                  ['7–9', 'Sudden Rime-Draft extinguishes non-magical torches; all creatures take 1d6 Rime damage unless sheltered', 'Medium'],
                  ['10–11', 'Olveist Silt-Serpent lunges from a drainage grate (Deals 2d6+3 Stabbing + Grapple)', 'High'],
                  ['12', 'Frost Wyrd Sentinel materializes from the Sovereign Ledger vault', 'Apex']
                ]
              },
              {
                id: 'rs-19',
                type: 'spell_formula',
                column: 'left',
                name: 'Glacial Shard Lance',
                category: 'damage',
                damageTypes: ['rime'],
                tier: 2,
                spellType: 'ACTION',
                ap: 2,
                manaCost: 15,
                range: '60 ft.',
                duration: 'Instantaneous',
                targetingMode: 'single',
                effect: 'A crystalline lance of compressed rime impales the target for 3d8 + 4 Rime and Stabbing damage and slows their movement by 10 ft. for 1 round.',
                empower: 'Each additional 5 Mana increases Rime damage by 1d8.',
                primaryDamage: { dice: '3d8', flat: 4 },
                tags: ['offensive', 'damage', 'rime', 'utility']
              },
              {
                id: 'rs-20',
                type: 'creature_statblock',
                column: 'right',
                name: 'Olveist Silt-Serpent',
                creatureType: 'Large Beast / River-Guardian',
                dangerLevel: 'Very High',
                hp: 115,
                mana: 10,
                ap: 4,
                speed: '25 ft., Swim 40 ft.',
                resistances: 'Resistant: Rime, Smashing; Vulnerable: Ember',
                stats: { strength: 16, agility: 16, constitution: 15, intelligence: 4, spirit: 12, charisma: 4 },
                traits: [
                  { name: 'Tremor-Sense', desc: 'Blind beyond 5 ft., but pinpoints any moving or bleeding creature within 40 ft. touching water or stone.' },
                  { name: 'Peat Camouflage', desc: 'Invisible while fully submerged in silt or bog-water until it strikes.' }
                ],
                actions: [
                  { name: 'Silt Grasp (1 AP)', desc: 'Melee Strike (Reach 10 ft.): Deals 2d6 + 3 Stabbing damage. Target must pass a DC 14 Agility save or be Grappled and pulled 10 ft. into deep water.' },
                  { name: 'Leech Drain (2 AP)', desc: 'Requires a Grappled target: Deals 2d8 + 3 Stabbing and Blight damage and restores an equal amount of HP to the Olveist.' }
                ]
              },
              {
                id: 'rs-21',
                type: 'item_card',
                column: 'right',
                id: 'item-vellum-blade-thalreth',
                name: 'Vellum-Bound Blade of Thalreth',
                quality: 'epic',
                type: 'weapon',
                subtype: 'Longsword',
                damage: '2d6 + 3 Slicing + 1d6 Rime',
                durability: 'd10',
                maxDurability: 'd10',
                value: { gold: 180, silver: 0, copper: 0, platinum: 0 },
                properties: 'Runic, Versatile, Wyrd-Warded (+2 Spirit Saves)',
                description: 'Etched with the unbroken oath of Jarl Halvar along its fuller. Strikes with this blade deal an extra 1d6 Rime damage and cannot be parried by ethereal spirits.',
                flavor: '“What is carved in steel outlasts the fog.”'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'book-starter-chromatic-vault',
    title: 'The Chromatic Vault & Aeternum',
    subtitle: 'A Facing Two-Page Spread & Campaign Chronicle',
    author: 'Mythrill TTRPG Press',
    theme: 'parchment',
    layout: 'book-spread',
    coverImage: null,
    tags: ['starter', 'descension', 'two-page-spread', 'encounter-tables', 'dungeon'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    customTerms: [
      {
        id: 'term-chromatic-keystone',
        name: 'Chromatic Keystone',
        alias: 'The Wyrm Seal',
        category: 'Relic',
        definition: 'An enchanted obsidian prism that dispels the evocation wards on the vault thresholds.',
        icon: 'fa-gem',
        color: '#dc2626'
      }
    ],
    revisions: [],
    chapters: [
      {
        id: 'ch-vault-1',
        title: 'Level Two: The Chromatic Vault',
        subtitle: 'Subterranean Halls of the Dragonkin',
        epigraph: '“When the vault doors unseal, remember that gold does not bleed, but those who seek it surely will.”',
        pages: [
          {
            id: 'pg-vault-1',
            pageNumber: 76,
            headerTitle: 'Chromatic Vault — Level Two',
            layout: 'two-column',
            blocks: [
              { id: 'bv-1', type: 'header', level: 1, text: 'Dungeon Level Two', variant: 'banner-dark', column: 'left' },
              { id: 'bv-2', type: 'paragraph', hasDropCap: true, text: 'Beneath the obsidian crags of Mount Brazier lies the Chromatic Vault, a forgotten treasury forged in the Age of Wyrms. Its scorched stone corridors reek of brimstone, ozone, and dragonfire.', column: 'left' },
              { id: 'bv-3', type: 'header', level: 2, text: 'Entrance Well', variant: 'keyed-area', areaCode: 'U1', column: 'left' },
              { id: 'bv-4', type: 'paragraph', hasDropCap: false, text: '**Floor Trap.** The stone flagstones around the iron grating are rigged with hair-trigger pressure plates. Any creature stepping on them without the [[Chromatic Keystone]] must succeed on a DC 14 Agility saving throw or plunge 30 feet into the spiked pit.', column: 'left' },
              { id: 'bv-5', type: 'header', level: 2, text: 'Dragon Statues', variant: 'keyed-area', areaCode: 'U2', column: 'right' },
              { id: 'bv-6', type: 'paragraph', hasDropCap: false, text: '**Story Hook.** Two colossal statues carved of veined jade flank the inner sanctum. Their ruby eyes gleam with dormant evocation magic, ready to unleash scorching beams upon trespassers.', column: 'right' },
              {
                id: 'bv-7',
                type: 'image',
                frameStyle: 'cutout',
                alignment: 'bottom-right',
                column: 'right',
                caption: 'Slumbering Wyrmling of the Chromatic Vault',
                url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
              }
            ]
          },
          {
            id: 'pg-vault-2',
            pageNumber: 77,
            headerTitle: 'Wandering Encounters & Lore',
            layout: 'two-column',
            blocks: [
              { id: 'bv-8', type: 'header', level: 1, text: 'Wandering Encounters', variant: 'banner-crimson', column: 'left' },
              {
                id: 'bv-9',
                type: 'roll_table',
                title: 'd20 Wandering Encounters',
                column: 'left',
                headers: ['d20', 'Encounter', 'Threat Rating'],
                rows: [
                  ['01–04', '1d4 Ember-Motes scavenging raw cinder-ore', 'Low'],
                  ['05–08', 'Ash-Serpent coiled in an obsidian fissure', 'Low'],
                  ['09–12', '2 Cinder-Hounds prowling the basalt Causeway', 'High'],
                  ['13–16', 'Forge-Kin Artisan tempering brass wyrd-sigils', 'Medium'],
                  ['17–19', 'Pyre-Stalker Vanguard with molten glaive', 'High'],
                  ['20', 'Cinder-Scale Wyrmling feasting on prism-shards', 'Severe']
                ]
              },
              {
                id: 'bv-10',
                type: 'quote',
                column: 'right',
                text: '“When the vault doors unseal, remember that gold does not bleed, but those who seek it surely will.”',
                author: 'Aaron Lyles, Prophet of Destruction'
              },
              {
                id: 'bv-11',
                type: 'callout',
                calloutType: 'secret',
                column: 'right',
                title: 'GM Secret: The Sealed Hoard',
                icon: 'fa-mask',
                content: 'The third keystone is hidden behind the bronze bas-relief on the southern dais. Solving the draconic riddle disarms the fire traps throughout Area U3.'
              }
            ]
          }
        ]
      }
    ]
  }
];

const useBookStore = create(
  persist(
    (set, get) => ({
      books: STARTER_BOOKS.map(normalizeBook),
      trashedBooks: [],
      activeBookId: null,
      lastCloudSyncAt: null,

      setActiveBook: (bookId) => set({ activeBookId: bookId }),

      // --- Book CRUD & Trash Management ---
      createBook: (meta = {}) => {
        const title = (meta.title || '').trim() || 'Untitled Chronicle';
        const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const book = normalizeBook({
          id: bookId,
          title,
          subtitle: meta.subtitle || '',
          author: meta.author || '',
          theme: meta.theme || 'parchment',
          layout: meta.layout || 'two-column',
          coverImage: meta.coverImage || null,
          tags: meta.tags || [],
          chapters: [
            {
              id: `ch-1-${bookId}`,
              title: 'Chapter I: The Beginning',
              subtitle: '',
              epigraph: '',
              pages: [
                {
                  id: `pg-1-${bookId}`,
                  pageNumber: 1,
                  headerTitle: title,
                  layout: meta.layout || 'two-column',
                  blocks: [
                    { id: `b-${Date.now()}`, type: 'header', level: 1, text: title },
                    { id: `b-${Date.now() + 1}`, type: 'paragraph', hasDropCap: true, text: 'The first words of your chronicle await...' }
                  ]
                }
              ]
            }
          ]
        });

        set((state) => ({ books: [...state.books, book] }));
        return book.id;
      },

      updateBookMeta: (bookId, patch) => set((state) => ({
        books: state.books.map((b) => (b.id === bookId ? { ...b, ...patch, updatedAt: nowIso() } : b))
      })),

      duplicateBook: (bookId) => {
        const source = get().books.find((b) => b.id === bookId);
        if (!source) return null;
        const copy = JSON.parse(JSON.stringify(source));
        copy.id = `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        copy.title = `${source.title} (Copy)`;
        copy.createdAt = nowIso();
        copy.updatedAt = nowIso();
        set((state) => ({ books: [...state.books, copy] }));
        return copy.id;
      },

      moveToTrash: (bookId) => {
        const target = get().books.find((b) => b.id === bookId);
        if (!target) return;
        const trashedBook = {
          ...normalizeBook(target),
          trashedAt: nowIso(),
          updatedAt: nowIso()
        };
        set((state) => ({
          books: state.books.filter((b) => b.id !== bookId),
          trashedBooks: [trashedBook, ...(state.trashedBooks || []).filter((b) => b.id !== bookId)],
          activeBookId: state.activeBookId === bookId ? null : state.activeBookId
        }));
      },

      restoreBook: (bookId) => {
        const target = (get().trashedBooks || []).find((b) => b.id === bookId);
        if (!target) return;
        const restoredBook = {
          ...normalizeBook(target),
          trashedAt: null,
          updatedAt: nowIso()
        };
        set((state) => ({
          trashedBooks: (state.trashedBooks || []).filter((b) => b.id !== bookId),
          books: [restoredBook, ...state.books.filter((b) => b.id !== bookId)]
        }));
      },

      permanentlyDeleteBook: (bookId) => set((state) => ({
        books: state.books.filter((b) => b.id !== bookId),
        trashedBooks: (state.trashedBooks || []).filter((b) => b.id !== bookId),
        activeBookId: state.activeBookId === bookId ? null : state.activeBookId
      })),

      emptyTrash: () => set({ trashedBooks: [] }),

      purgeExpiredTrash: () => {
        const now = Date.now();
        set((state) => ({
          trashedBooks: (state.trashedBooks || []).filter((b) => {
            if (!b.trashedAt) return false;
            const trashedTime = new Date(b.trashedAt).getTime();
            return !isNaN(trashedTime) && (now - trashedTime) < TRASH_RETENTION_MS;
          })
        }));
      },

      deleteBook: (bookId, permanent = false) => {
        if (permanent) {
          get().permanentlyDeleteBook(bookId);
        } else {
          get().moveToTrash(bookId);
        }
      },

      // --- Chapter Operations ---
      addChapter: (bookId, chapterMeta = {}) => {
        const chId = `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id !== bookId) return b;
            const norm = normalizeBook(b);
            const nextIdx = norm.chapters.length + 1;
            const newChapter = {
              id: chId,
              title: chapterMeta.title || `Chapter ${nextIdx}`,
              subtitle: chapterMeta.subtitle || '',
              epigraph: chapterMeta.epigraph || '',
              pages: [
                {
                  id: `pg-${chId}-1`,
                  pageNumber: 1,
                  headerTitle: chapterMeta.title || `Chapter ${nextIdx}`,
                  layout: norm.layout || 'two-column',
                  blocks: [
                    { id: `b-${Date.now()}`, type: 'paragraph', hasDropCap: true, text: 'A new chapter begins here...', column: 'left' }
                  ]
                }
              ]
            };
            return {
              ...norm,
              chapters: [...norm.chapters, newChapter],
              updatedAt: nowIso()
            };
          })
        }));
        return chId;
      },

      updateChapter: (bookId, chapterId, patch) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            chapters: norm.chapters.map((ch) => (ch.id === chapterId ? { ...ch, ...patch } : ch)),
            updatedAt: nowIso()
          };
        })
      })),

      deleteChapter: (bookId, chapterId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          if (norm.chapters.length <= 1) return norm; // Keep at least one chapter
          return {
            ...norm,
            chapters: norm.chapters.filter((ch) => ch.id !== chapterId),
            updatedAt: nowIso()
          };
        })
      })),

      reorderChapters: (bookId, sourceIndex, targetIndex) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          const chapters = [...norm.chapters];
          if (targetIndex < 0 || targetIndex >= chapters.length) return norm;
          const [moved] = chapters.splice(sourceIndex, 1);
          chapters.splice(targetIndex, 0, moved);
          return { ...norm, chapters, updatedAt: nowIso() };
        })
      })),

      // --- Page Operations ---
      addPage: (bookId, chapterId, pageMeta = {}) => {
        const pgId = `pg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id !== bookId) return b;
            const norm = normalizeBook(b);
            return {
              ...norm,
              chapters: norm.chapters.map((ch) => {
                if (ch.id !== chapterId) return ch;
                const newPage = {
                  id: pgId,
                  pageNumber: ch.pages.length + 1,
                  headerTitle: pageMeta.headerTitle || '',
                  layout: pageMeta.layout || norm.layout || 'two-column',
                  blocks: pageMeta.blocks || [
                    { id: `b-${Date.now()}`, type: 'paragraph', hasDropCap: false, text: 'Continue your passage...', column: 'left' }
                  ]
                };
                return {
                  ...ch,
                  pages: [...ch.pages, newPage]
                };
              }),
              updatedAt: nowIso()
            };
          })
        }));
        return pgId;
      },

      updatePage: (bookId, chapterId, pageId, patch) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            chapters: norm.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              return {
                ...ch,
                pages: ch.pages.map((pg) => (pg.id === pageId ? { ...pg, ...patch } : pg))
              };
            }),
            updatedAt: nowIso()
          };
        })
      })),

      deletePage: (bookId, chapterId, pageId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            chapters: norm.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              if (ch.pages.length <= 1) return ch; // Keep at least one page
              const filtered = ch.pages.filter((pg) => pg.id !== pageId);
              return {
                ...ch,
                pages: filtered.map((pg, idx) => ({ ...pg, pageNumber: idx + 1 }))
              };
            }),
            updatedAt: nowIso()
          };
        })
      })),

      reorderPages: (bookId, chapterId, sourceIndex, targetIndex) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            chapters: norm.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              const pages = [...ch.pages];
              if (targetIndex < 0 || targetIndex >= pages.length) return ch;
              const [moved] = pages.splice(sourceIndex, 1);
              pages.splice(targetIndex, 0, moved);
              return {
                ...ch,
                pages: pages.map((pg, idx) => ({ ...pg, pageNumber: idx + 1 }))
              };
            }),
            updatedAt: nowIso()
          };
        })
      })),

      setPageBlocks: (bookId, chapterId, pageId, blocks) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            chapters: norm.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              return {
                ...ch,
                pages: ch.pages.map((pg) => (pg.id === pageId ? { ...pg, blocks } : pg))
              };
            }),
            updatedAt: nowIso()
          };
        })
      })),

      // Legacy fallback wrapper
      setBookBlocks: (bookId, blocks) => {
        const book = getBookById(bookId);
        if (!book) return;
        const norm = normalizeBook(book);
        const chId = norm.chapters[0]?.id;
        const pgId = norm.chapters[0]?.pages[0]?.id;
        if (chId && pgId) {
          get().setPageBlocks(bookId, chId, pgId, blocks);
        }
      },

      // --- Page Overflow & Auto-Chronicle Compilation ---
      flowPageOverflow: (bookId, chapterId, pageId, keepCount = 5) => {
        let targetPageId = null;
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id !== bookId) return b;
            const norm = normalizeBook(b);
            return {
              ...norm,
              chapters: norm.chapters.map((ch) => {
                if (ch.id !== chapterId) return ch;
                const pgIndex = ch.pages.findIndex((pg) => pg.id === pageId);
                if (pgIndex === -1) return ch;
                const sourcePage = ch.pages[pgIndex];
                const blocks = Array.isArray(sourcePage.blocks) ? sourcePage.blocks : [];
                const splitIndex = Math.max(1, Math.min(keepCount, blocks.length - 1));
                if (blocks.length <= 1) return ch;
                const keptBlocks = blocks.slice(0, splitIndex);
                const overflowBlocks = blocks.slice(splitIndex);
                const pages = [...ch.pages];
                pages[pgIndex] = { ...sourcePage, blocks: keptBlocks };

                if (pgIndex + 1 < pages.length) {
                  const nextPage = pages[pgIndex + 1];
                  targetPageId = nextPage.id;
                  pages[pgIndex + 1] = {
                    ...nextPage,
                    blocks: [...overflowBlocks, ...(nextPage.blocks || [])]
                  };
                } else {
                  const newPgId = `pg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                  targetPageId = newPgId;
                  pages.push({
                    id: newPgId,
                    pageNumber: pages.length + 1,
                    headerTitle: sourcePage.headerTitle ? `${sourcePage.headerTitle} (Cont.)` : '',
                    layout: sourcePage.layout || 'two-column',
                    blocks: overflowBlocks
                  });
                }
                return {
                  ...ch,
                  pages: pages.map((pg, idx) => ({ ...pg, pageNumber: idx + 1 }))
                };
              }),
              updatedAt: nowIso()
            };
          })
        }));
        return targetPageId;
      },

      compileCampaignChronicle: (options = {}) => {
        const {
          targetBookId = null,
          title = 'Compiled Campaign Chronicle',
          subtitle = 'An Illustrated Compendium of Realms, Dramatis Personae & Relics',
          author = 'Grand Chronicler',
          theme = 'parchment',
          layout = 'book-spread',
          chapters = [],
          customTerms = []
        } = options;

        if (targetBookId) {
          set((state) => ({
            books: state.books.map((b) => {
              if (b.id !== targetBookId) return b;
              const norm = normalizeBook(b);
              const existingTermNames = new Set((norm.customTerms || []).map((t) => (t.name || '').toLowerCase()));
              const mergedTerms = [
                ...(norm.customTerms || []),
                ...customTerms.filter((t) => t?.name && !existingTermNames.has(t.name.toLowerCase()))
              ];
              return normalizeBook({
                ...norm,
                chapters: [...(norm.chapters || []), ...chapters],
                customTerms: mergedTerms,
                updatedAt: nowIso()
              });
            })
          }));
          return targetBookId;
        }

        const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const compiledBook = normalizeBook({
          id: bookId,
          title,
          subtitle,
          author,
          theme,
          layout,
          tags: ['compiled', 'campaign-chronicle', 'descension'],
          customTerms,
          chapters: chapters.length > 0 ? chapters : undefined
        });
        set((state) => ({
          books: [compiledBook, ...state.books],
          activeBookId: compiledBook.id
        }));
        return compiledBook.id;
      },

      // --- Custom Glossary Terms ---
      addCustomTerm: (bookId, term) => {
        const termId = `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newTerm = {
          id: termId,
          name: term.name || 'New Term',
          alias: term.alias || '',
          category: term.category || 'Concept',
          definition: term.definition || '',
          icon: term.icon || 'fa-bookmark',
          color: term.color || '#d4af37'
        };

        set((state) => ({
          books: state.books.map((b) => {
            if (b.id !== bookId) return b;
            const norm = normalizeBook(b);
            return {
              ...norm,
              customTerms: [...(norm.customTerms || []), newTerm],
              updatedAt: nowIso()
            };
          })
        }));
        return termId;
      },

      updateCustomTerm: (bookId, termId, patch) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            customTerms: (norm.customTerms || []).map((t) => (t.id === termId ? { ...t, ...patch } : t)),
            updatedAt: nowIso()
          };
        })
      })),

      deleteCustomTerm: (bookId, termId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            customTerms: (norm.customTerms || []).filter((t) => t.id !== termId),
            updatedAt: nowIso()
          };
        })
      })),

      // --- Revision History & Snapshots ---
      createRevisionSnapshot: (bookId, summary = 'Manual Checkpoint', metadata = {}) => {
        const revId = `rev-${Date.now()}`;
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id !== bookId) return b;
            const norm = normalizeBook(b);
            const totalPages = (norm.chapters || []).reduce((acc, ch) => acc + (ch.pages?.length || 0), 0);
            const totalBlocks = (norm.chapters || []).reduce((acc, ch) => acc + (ch.pages || []).reduce((bAcc, pg) => bAcc + (pg.blocks?.length || 0), 0), 0);
            const snapshot = {
              id: revId,
              timestamp: nowIso(),
              summary: summary || 'Manual Checkpoint',
              tag: metadata.tag || 'Draft',
              note: metadata.note || '',
              chapterCount: (norm.chapters || []).length,
              pageCount: totalPages,
              blockCount: totalBlocks,
              termCount: (norm.customTerms || []).length,
              snapshot: JSON.parse(JSON.stringify({
                title: norm.title,
                subtitle: norm.subtitle,
                author: norm.author,
                theme: norm.theme,
                layout: norm.layout,
                chapters: norm.chapters,
                customTerms: norm.customTerms
              }))
            };
            return {
              ...norm,
              revisions: [snapshot, ...(norm.revisions || [])].slice(0, 50)
            };
          })
        }));
        return revId;
      },

      deleteRevisionSnapshot: (bookId, revisionId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          return {
            ...norm,
            revisions: (norm.revisions || []).filter((r) => r.id !== revisionId),
            updatedAt: nowIso()
          };
        })
      })),

      restoreRevisionSnapshot: (bookId, revisionId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id !== bookId) return b;
          const norm = normalizeBook(b);
          const rev = (norm.revisions || []).find((r) => r.id === revisionId);
          if (!rev || !rev.snapshot) return norm;
          return {
            ...norm,
            title: rev.snapshot.title || norm.title,
            subtitle: rev.snapshot.subtitle || norm.subtitle,
            author: rev.snapshot.author || norm.author,
            theme: rev.snapshot.theme || norm.theme,
            layout: rev.snapshot.layout || norm.layout,
            chapters: rev.snapshot.chapters || norm.chapters,
            customTerms: rev.snapshot.customTerms || norm.customTerms,
            updatedAt: nowIso()
          };
        })
      })),

      // --- Cloud Sync ---
      syncToCloud: async (userId) => {

        const ownerGuard = captureOwnerGuard(userId);

        if (!ownerGuard.ok) return false;
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'books');
          await setDoc(docRef, {
            books: get().books.map(normalizeBook),
            trashedBooks: (get().trashedBooks || []).map(normalizeBook),
            updatedAt: nowIso()
          }, { merge: true });
          if (!ownerGuard.isCurrent()) return false;

          set({ lastCloudSyncAt: nowIso() });
          return true;
        } catch (err) {
          console.debug('Books cloud sync skipped:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        const ownerGuard = captureOwnerGuard(userId);
        if (!ownerGuard.ok) return false;
        const applyIfCurrent = (updates) => { if (ownerGuard.isCurrent()) set(updates); };
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        // B5B: capture the local revision/identity when hydration starts and
        // refuse to replace newer local work that lands while the read is
        // pending. Owner identity alone is insufficient.
        const engine = getScopedStoreEngine('worldbuilding.books');
        const before = loadScopedDraft({ familyId: 'worldbuilding.books' });
        const beforeRevision = before.status === 'OK' ? before.localRevision : null;
        const beforeDraftId = before.status === 'OK' ? before.draftId : null;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'books');
          const snap = await getDoc(docRef);
          if (!ownerGuard.isCurrent()) return false;
          const after = loadScopedDraft({ familyId: 'worldbuilding.books' });
          const afterRevision = after.status === 'OK' ? after.localRevision : null;
          const afterDraftId = after.status === 'OK' ? after.draftId : null;
          const localChanged = afterRevision !== beforeRevision ||
            (after.status === 'OK' && before.status === 'OK' && afterDraftId !== beforeDraftId) ||
            !!(engine && typeof engine.__hasPendingWrites === 'function' && engine.__hasPendingWrites());
          if (localChanged) {
            // Newer local authored work exists: never replace it with the
            // older cloud response. The cloud copy stays intact in the cloud
            // until a safe reconciliation is available.
            return false;
          }
          if (snap.exists()) {
            const data = snap.data();
            const updates = {};
            if (Array.isArray(data?.books)) {
              updates.books = data.books.map(normalizeBook);
            }
            if (Array.isArray(data?.trashedBooks)) {
              updates.trashedBooks = data.trashedBooks.map(normalizeBook);
            }
            if (Object.keys(updates).length > 0) {
              applyIfCurrent(updates);
              get().purgeExpiredTrash();
              return true;
            }
          }
        } catch (err) {
          console.debug('Books cloud hydration skipped:', err?.message || err);
        }
        return false;
      }
    }),
    createScopedStorageConfig('worldbuilding.books', 'mythrill_books_storage', {
      partialize: (state) => ({
        books: state.books.map(normalizeBook),
        trashedBooks: (state.trashedBooks || []).map(normalizeBook),
        activeBookId: state.activeBookId,
        lastCloudSyncAt: state.lastCloudSyncAt
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }
        const normalizedPersistedBooks = Array.isArray(persistedState.books)
          ? persistedState.books.map(normalizeBook).filter(Boolean)
          : currentState.books;
        const normalizedTrashedBooks = Array.isArray(persistedState.trashedBooks)
          ? persistedState.trashedBooks.map(normalizeBook).filter(Boolean)
          : (currentState.trashedBooks || []);
        const existingIds = new Set([
          ...normalizedPersistedBooks.map((b) => b.id),
          ...normalizedTrashedBooks.map((b) => b.id)
        ]);
        const missingStarters = STARTER_BOOKS
          .filter((sb) => !existingIds.has(sb.id))
          .map(normalizeBook);
        return {
          ...currentState,
          ...persistedState,
          books: [...normalizedPersistedBooks, ...missingStarters],
          trashedBooks: normalizedTrashedBooks
        };
      }
    })
  )
);

export const getBookById = (bookId) => {
  const book = useBookStore.getState().books.find((b) => b.id === bookId);
  return book ? normalizeBook(book) : null;
};

export default useBookStore;
