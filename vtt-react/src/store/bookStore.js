import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const nowIso = () => new Date().toISOString();

/**
 * Normalizes a book object into the modern Chapter -> Page -> Blocks hierarchy.
 * Ensures 100% backward compatibility with flat legacy books.
 */
export const normalizeBook = (book) => {
  if (!book) return null;

  const normalized = {
    id: book.id || `book-${Date.now()}`,
    title: book.title || 'Untitled Chronicle',
    subtitle: book.subtitle || '',
    author: book.author || '',
    theme: book.theme || 'parchment', // 'parchment' | 'royal' | 'grimoire' | 'crimson'
    layout: book.layout || 'two-column', // 'two-column' | 'single-column' | 'spread'
    coverImage: book.coverImage || null,
    tags: Array.isArray(book.tags) ? book.tags : [],
    customTerms: Array.isArray(book.customTerms) ? book.customTerms : [],
    revisions: Array.isArray(book.revisions) ? book.revisions : [],
    createdAt: book.createdAt || nowIso(),
    updatedAt: book.updatedAt || nowIso(),
    chapters: []
  };

  // If chapters array exists and has pages, use it
  if (Array.isArray(book.chapters) && book.chapters.length > 0) {
    normalized.chapters = book.chapters.map((ch, chIdx) => ({
      id: ch.id || `ch-${chIdx + 1}-${Date.now()}`,
      title: ch.title || `Chapter ${chIdx + 1}`,
      subtitle: ch.subtitle || '',
      epigraph: ch.epigraph || '',
      pages: (Array.isArray(ch.pages) && ch.pages.length > 0)
        ? ch.pages.map((pg, pgIdx) => ({
            id: pg.id || `pg-${chIdx + 1}-${pgIdx + 1}`,
            pageNumber: pg.pageNumber || pgIdx + 1,
            headerTitle: pg.headerTitle || '',
            layout: pg.layout || normalized.layout,
            blocks: Array.isArray(pg.blocks) ? pg.blocks : []
          }))
        : [
            {
              id: `pg-${ch.id || chIdx}-1`,
              pageNumber: 1,
              headerTitle: ch.title || '',
              layout: normalized.layout,
              blocks: Array.isArray(ch.blocks) ? ch.blocks : []
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
            blocks: book.blocks
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

const STARTER_BOOKS = [
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
              { id: 'b-1', type: 'header', level: 1, text: 'The Shrouded Bargain' },
              { id: 'b-2', type: 'paragraph', hasDropCap: true, text: 'In the third century following the Shattered Moon, when the killing freeze threatened to extinguish all warmth across Nordhalla, the ancestors of House Thalreth sought refuge not behind stone, but behind the veil of the [[Ancient Mist]]. They bartered with the slumbering wyrd of the Frostwood Reach, exchanging spatial clarity for a barrier of insulating thermal fog.' },
              { id: 'b-3', type: 'callout', calloutType: 'lore', title: 'Historical Note: The Fog Compact', icon: 'fa-scroll', content: 'The fog that guards Greymark Keep does not merely insulate from cold; it slowly claims the ancestral memories of those who reside within it for more than three generations.' },
              { id: 'b-4', type: 'header', level: 2, text: 'The Sovereign Ledger' },
              { id: 'b-5', type: 'paragraph', hasDropCap: false, text: 'To combat the relentless erosion of memory, the Scribe-Sentinels established the [[Sovereign Ledger]]. Every birth, marriage, deed of valor, and land-grant is inscribed in treated dragon-parchment and stored within subterranean vault-libraries.' },
              { id: 'b-6', type: 'divider', dividerStyle: 'flourish' },
              { id: 'b-7', type: 'entity_embed', entityType: 'faction', entityId: 'house-thalreth', displayMode: 'card' }
            ]
          },
          {
            id: 'pg-frostwood-2',
            pageNumber: 2,
            headerTitle: 'The Encroaching Chill',
            layout: 'two-column',
            blocks: [
              { id: 'b-8', type: 'header', level: 2, text: 'The Encroaching Chill' },
              { id: 'b-9', type: 'paragraph', hasDropCap: true, text: 'Despite the rigorous duties of the archivist-guards, rumors persist that certain ledgers have been deliberately rewritten by the current regime, masking ancient treaties that would otherwise disinherit the ruling branches.' },
              { id: 'b-10', type: 'callout', calloutType: 'secret', title: 'GM Secret: The Lost Census', icon: 'fa-mask', content: 'The original unrevised census of the First Generation is buried in the sealed crypts beneath the Frozen Archive in Rime-Spire Peaks.' },
              { id: 'b-11', type: 'divider', dividerStyle: 'diamond' },
              {
                id: 'b-12',
                type: 'creature_statblock',
                name: 'Frost Wyrd Sentinel',
                creatureType: 'Elemental / Spirit',
                cr: 'CR 4 (Elite)',
                hp: { current: 68, max: 68 },
                ac: 15,
                speed: '30 ft., Fly 40 ft. (hover)',
                stats: { strength: 14, agility: 16, constitution: 15, intelligence: 12, spirit: 16, charisma: 10 },
                traits: [
                  { name: 'Fog Camouflage', desc: 'The sentinel has advantage on Stealth checks made while obscured by mist or snow.' },
                  { name: 'Memory Chill', desc: 'Melee attacks inflict 1d6 Cold damage and reduce the target’s Initiative by 2 until warmed.' }
                ],
                actions: [
                  { name: 'Rime Blade', desc: '+6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage plus 7 (2d6) cold damage.' },
                  { name: 'Mist Stride (Recharge 5-6)', desc: 'The sentinel teleports up to 30 feet to an unoccupied space obscured by fog or shadows.' }
                ]
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
      activeBookId: null,
      lastCloudSyncAt: null,

      setActiveBook: (bookId) => set({ activeBookId: bookId }),

      // --- Book CRUD ---
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

      deleteBook: (bookId) => set((state) => ({
        books: state.books.filter((b) => b.id !== bookId),
        activeBookId: state.activeBookId === bookId ? null : state.activeBookId
      })),

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
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'books');
          await setDoc(docRef, { books: get().books.map(normalizeBook), updatedAt: nowIso() }, { merge: true });
          set({ lastCloudSyncAt: nowIso() });
          return true;
        } catch (err) {
          console.debug('Books cloud sync skipped:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'books');
          const snap = await getDoc(docRef);
          if (snap.exists() && Array.isArray(snap.data()?.books)) {
            set({ books: snap.data().books.map(normalizeBook) });
            return true;
          }
        } catch (err) {
          console.debug('Books cloud hydration skipped:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('mythrill_books_storage', {
      partialize: (state) => ({
        books: state.books.map(normalizeBook),
        activeBookId: state.activeBookId,
        lastCloudSyncAt: state.lastCloudSyncAt
      })
    })
  )
);

export const getBookById = (bookId) => {
  const book = useBookStore.getState().books.find((b) => b.id === bookId);
  return book ? normalizeBook(book) : null;
};

export default useBookStore;
