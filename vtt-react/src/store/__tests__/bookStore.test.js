import useBookStore, { normalizeBook } from '../bookStore';

describe('bookStore - Hierarchical Book Architecture', () => {
  beforeEach(() => {
    localStorage.clear();
    useBookStore.setState({
      books: [],
      activeBookId: null,
      customGlossaryTerms: []
    });
  });

  test('normalizeBook migrates legacy flat blocks into Chapter 1 / Page 1 hierarchy', () => {
    const legacyBook = {
      id: 'legacy-1',
      title: 'Legacy Tome',
      blocks: [
        { id: 'b1', type: 'header', text: 'Introduction' },
        { id: 'b2', type: 'paragraph', text: 'Old content' }
      ]
    };

    const normalized = normalizeBook(legacyBook);
    expect(normalized.chapters).toBeDefined();
    expect(normalized.chapters.length).toBe(1);
    expect(normalized.chapters[0].title).toBe('Chapter I: Introduction');
    expect(normalized.chapters[0].pages.length).toBe(1);
    expect(normalized.chapters[0].pages[0].blocks.length).toBe(2);
    expect(normalized.chapters[0].pages[0].blocks[0].text).toBe('Introduction');
    expect(normalized.customTerms).toEqual([]);
    expect(normalized.revisions).toEqual([]);
  });

  test('createBook initializes chapters and pages properly', () => {
    const { createBook } = useBookStore.getState();
    const bookId = createBook({ title: 'Bestiary of the Rime', author: 'Arch-Chronicler' });

    const books = useBookStore.getState().books;
    const book = books.find((b) => b.id === bookId);
    expect(book).toBeDefined();
    expect(book.title).toBe('Bestiary of the Rime');
    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].pages.length).toBe(1);
    expect(book.chapters[0].pages[0].pageNumber).toBe(1);
  });

  test('addChapter, updateChapter, and deleteChapter manage chapters', () => {
    const { createBook, addChapter, updateChapter, deleteChapter } = useBookStore.getState();
    const bookId = createBook({ title: 'Chronicles of Greymark' });

    const ch2Id = addChapter(bookId, { title: 'Chapter II: The Frost Wastes' });
    let book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.chapters.length).toBe(2);
    expect(book.chapters[1].title).toBe('Chapter II: The Frost Wastes');
    expect(book.chapters[1].pages.length).toBe(1);

    updateChapter(bookId, ch2Id, { title: 'Chapter II: The Glacial Expanse' });
    book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.chapters[1].title).toBe('Chapter II: The Glacial Expanse');

    deleteChapter(bookId, ch2Id);
    book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.chapters.length).toBe(1);
  });

  test('addPage, updatePage, and deletePage manage pages within chapters', () => {
    const { createBook, addPage, updatePage, deletePage, setPageBlocks } = useBookStore.getState();
    const bookId = createBook({ title: 'Arcane Formulae' });
    const book = useBookStore.getState().books.find((b) => b.id === bookId);
    const chId = book.chapters[0].id;

    const pg2Id = addPage(bookId, chId, { headerTitle: 'Spells of Cryomancy' });
    let updatedBook = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(updatedBook.chapters[0].pages.length).toBe(2);
    expect(updatedBook.chapters[0].pages[1].headerTitle).toBe('Spells of Cryomancy');

    setPageBlocks(bookId, chId, pg2Id, [
      { id: 'sp-1', type: 'spell_formula', name: 'Glacial Shard Lance' }
    ]);
    updatedBook = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(updatedBook.chapters[0].pages[1].blocks.length).toBe(1);
    expect(updatedBook.chapters[0].pages[1].blocks[0].name).toBe('Glacial Shard Lance');

    deletePage(bookId, chId, pg2Id);
    updatedBook = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(updatedBook.chapters[0].pages.length).toBe(1);
  });

  test('custom terms CRUD works seamlessly', () => {
    const { createBook, addCustomTerm, updateCustomTerm, deleteCustomTerm } = useBookStore.getState();
    const bookId = createBook({ title: 'Lore of Descension' });

    const termId = addCustomTerm(bookId, {
      name: 'Rime Crystal',
      alias: 'Glacial Stone',
      category: 'Relic',
      definition: 'A resonant crystal harvested from deep glaciers.'
    });

    let book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.customTerms.length).toBe(1);
    expect(book.customTerms[0].name).toBe('Rime Crystal');

    updateCustomTerm(bookId, termId, { definition: 'Updated lore definition.' });
    book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.customTerms[0].definition).toBe('Updated lore definition.');

    deleteCustomTerm(bookId, termId);
    book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.customTerms.length).toBe(0);
  });

  test('revision snapshots can be saved and restored', () => {
    const { createBook, addChapter, createRevisionSnapshot, restoreRevisionSnapshot } = useBookStore.getState();
    const bookId = createBook({ title: 'Historical Atlas' });

    // Create snapshot at baseline
    const revId = createRevisionSnapshot(bookId, 'Initial draft before Chapter 2');
    let book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.revisions.length).toBe(1);
    expect(book.chapters.length).toBe(1);

    // Add chapter 2
    addChapter(bookId, { title: 'Chapter II: The Great Schism' });
    book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.chapters.length).toBe(2);

    // Restore snapshot
    restoreRevisionSnapshot(bookId, revId);
    book = useBookStore.getState().books.find((b) => b.id === bookId);
    expect(book.chapters.length).toBe(1);
  });

  test('trash can supports 7-day soft delete, restore, permanent deletion, and auto-purge', () => {
    const { createBook, moveToTrash, restoreBook, permanentlyDeleteBook, emptyTrash, purgeExpiredTrash } = useBookStore.getState();
    const book1Id = createBook({ title: 'Book One' });
    const book2Id = createBook({ title: 'Book Two' });

    // Soft delete / Move to trash
    moveToTrash(book1Id);
    let state = useBookStore.getState();
    expect(state.books.find((b) => b.id === book1Id)).toBeUndefined();
    expect(state.trashedBooks.length).toBe(1);
    expect(state.trashedBooks[0].id).toBe(book1Id);
    expect(state.trashedBooks[0].trashedAt).toBeDefined();

    // Restore from trash
    restoreBook(book1Id);
    state = useBookStore.getState();
    expect(state.books.find((b) => b.id === book1Id)).toBeDefined();
    expect(state.trashedBooks.length).toBe(0);

    // Soft delete book 2, then permanently delete
    moveToTrash(book2Id);
    state = useBookStore.getState();
    expect(state.trashedBooks.length).toBe(1);
    permanentlyDeleteBook(book2Id);
    state = useBookStore.getState();
    expect(state.trashedBooks.length).toBe(0);
    expect(state.books.find((b) => b.id === book2Id)).toBeUndefined();

    // Test emptyTrash
    const book3Id = createBook({ title: 'Book Three' });
    moveToTrash(book3Id);
    expect(useBookStore.getState().trashedBooks.length).toBe(1);
    emptyTrash();
    expect(useBookStore.getState().trashedBooks.length).toBe(0);

    // Test purgeExpiredTrash (older than 7 days)
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    useBookStore.setState({
      trashedBooks: [
        { id: 'expired-book', title: 'Old Discarded', trashedAt: eightDaysAgo },
        { id: 'fresh-book', title: 'Recent Discarded', trashedAt: twoDaysAgo }
      ]
    });
    purgeExpiredTrash();
    state = useBookStore.getState();
    expect(state.trashedBooks.length).toBe(1);
    expect(state.trashedBooks[0].id).toBe('fresh-book');
  });
});

