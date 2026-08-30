import React, { useState, useMemo } from 'react';
import useQuestStore from '../../store/questStore';
import RichLoreText from '../common/RichLoreText';
import './BookDocumentEditor.css';

export const SAMPLE_BOOK_QUESTS = [
  {
    id: 'quest-drunhold-key',
    title: 'The Lost Key of Drunhold',
    category: 'dungeon',
    categoryLabel: 'Dungeon Delve',
    level: 3,
    difficulty: 'Medium',
    status: 'Active',
    giver: 'Elder Moira',
    giverRole: 'Sunken Shrine Keeper',
    description: 'Ancient wards seal the sunken crypts beneath Drunhold. Elder Moira seeks adventurers brave enough to confront the frost wyrds and recover the ancestral runic key before the thaw breaks the seals.',
    objectives: [
      { id: 'obj-1', text: 'Seek out Gref near the crossroads to trade for rumors', completed: true },
      { id: 'obj-2', text: 'Descend into the Rime-Spire Catacombs beneath Drunhold', completed: false },
      { id: 'obj-3', text: 'Defeat the Frost Wyrd Stalker and claim the Drunhold Seal', completed: false },
      { id: 'obj-4', text: 'Return the seal to Elder Moira at the Sunken Shrine', completed: false }
    ],
    rewards: {
      experience: 450,
      currency: { gold: 25, silver: 50 },
      item: 'Frostward Key',
      itemQuality: 'rare'
    }
  },
  {
    id: 'quest-bounty-rime-wyrd',
    title: 'Bounty: The Rime-Wyrd of Frostpeak',
    category: 'bounty',
    categoryLabel: 'Bounty & Hunt',
    level: 5,
    difficulty: 'Hard',
    status: 'Active',
    giver: 'Captain Valerie',
    giverRole: 'High Watch Commander',
    description: 'A predatory glacial spirit known as the Rime-Wyrd has terrorized northern trade caravans. The High Watch offers a bounty for its frozen essence core.',
    objectives: [
      { id: 'obj-1', text: 'Track glacial frost-trails up the Rime-Spire Reach', completed: false },
      { id: 'obj-2', text: 'Slay the Rime-Wyrd in its high-altitude roost', completed: false },
      { id: 'obj-3', text: 'Bring the Frozen Essence Core to Captain Valerie', completed: false }
    ],
    rewards: {
      experience: 800,
      currency: { gold: 60, silver: 0 },
      item: 'Rime-Forged Dagger',
      itemQuality: 'rare'
    }
  },
  {
    id: 'quest-cinder-heart',
    title: 'The Cinder Heart of Mount Drass',
    category: 'storyline',
    categoryLabel: 'Main Storyline',
    level: 6,
    difficulty: 'Deadly',
    status: 'Active',
    giver: 'Solari High Sage',
    giverRole: 'Cinder-Bound Emissary',
    description: 'Deep in the volcanic caldera of Mount Drass, the dormant primordial titan stirs. Rekindle the volcanic beacons before the ash-veil consumes the northern reaches.',
    objectives: [
      { id: 'obj-1', text: 'Traverse the Magma Veins without succumbing to ash-fumes', completed: false },
      { id: 'obj-2', text: 'Realign the 3 Sunstone Anchors along the caldera rim', completed: false },
      { id: 'obj-3', text: 'Channel the primordial flame into the Cinder Core', completed: false }
    ],
    rewards: {
      experience: 1250,
      currency: { gold: 120, silver: 0 },
      item: 'Cinder Heart Relic',
      itemQuality: 'epic'
    }
  },
  {
    id: 'quest-shadows-nordhalla',
    title: 'Shadows over Nordhalla',
    category: 'intrigue',
    categoryLabel: 'Faction Intrigue',
    level: 4,
    difficulty: 'Medium',
    status: 'Active',
    giver: 'King Nikolaos Alduin',
    giverRole: 'High King of House Alduin',
    description: 'Whispers in the Frostwood Compact suggest a plot to assassinate the High Council during the midwinter feast. Uncover the conspiracy before blood stains the snow.',
    objectives: [
      { id: 'obj-1', text: 'Interrogate the cloaked courier at the Vale Tavern', completed: false },
      { id: 'obj-2', text: 'Decode the intercepted cypher from the Ashen Coven', completed: false },
      { id: 'obj-3', text: 'Expose the traitor among the High King\'s guard', completed: false }
    ],
    rewards: {
      experience: 650,
      currency: { gold: 45, silver: 20 },
      item: 'Royal Alduin Signet',
      itemQuality: 'rare'
    }
  },
  {
    id: 'quest-whispering-reliquary',
    title: 'The Whispering Reliquary',
    category: 'dungeon',
    categoryLabel: 'Dungeon Delve',
    level: 2,
    difficulty: 'Easy',
    status: 'Active',
    giver: 'Archivist Theron',
    giverRole: 'Grand Scribe of the Archive',
    description: 'A sealed reliquary in the lower archive vault has begun reciting forgotten verses in dead tongues. Retrieve the reliquary before the arcane resonance spreads.',
    objectives: [
      { id: 'obj-1', text: 'Bypass the arcane rune-locks in Vault Wing IV', completed: false },
      { id: 'obj-2', text: 'Silence the whispering wards using silver dust', completed: false },
      { id: 'obj-3', text: 'Deliver the reliquary safely to the Grand Archive', completed: false }
    ],
    rewards: {
      experience: 300,
      currency: { gold: 15, silver: 80 },
      item: 'Tome of the Void Excerpt',
      itemQuality: 'uncommon'
    }
  },
  {
    id: 'quest-stolen-memory-orbs',
    title: 'The Stolen Memory-Orbs',
    category: 'intrigue',
    categoryLabel: 'Faction Intrigue',
    level: 3,
    difficulty: 'Medium',
    status: 'Active',
    giver: 'Gref the Memory-Merchant',
    giverRole: 'Curio Dealer & Smuggler',
    description: 'Thieves broke into Gref\'s lockbox and made off with three crystallised memory-orbs carrying dangerous forbidden memories of the Shattering.',
    objectives: [
      { id: 'obj-1', text: 'Investigate the thief hideout in the Sunken Docks', completed: false },
      { id: 'obj-2', text: 'Recover all 3 Memory-Orbs without shattering them', completed: false },
      { id: 'obj-3', text: 'Decide whether to return them to Gref or keep the memories', completed: false }
    ],
    rewards: {
      experience: 500,
      currency: { gold: 30, silver: 0 },
      item: '2x Crystallised Memory Shards',
      itemQuality: 'uncommon'
    }
  }
];

const QUEST_CATEGORIES = [
  { key: 'all', label: 'All Quests', icon: 'fa-globe' },
  { key: 'storyline', label: 'Main Storylines', icon: 'fa-crown' },
  { key: 'bounty', label: 'Bounties & Hunts', icon: 'fa-bullseye' },
  { key: 'dungeon', label: 'Dungeon Delves', icon: 'fa-dungeon' },
  { key: 'intrigue', label: 'Faction Intrigue', icon: 'fa-chess-rook' },
  { key: 'custom', label: 'My Campaign Quests', icon: 'fa-feather-pointed' }
];

const getDifficultyClass = (diff) => {
  const d = String(diff || '').toLowerCase();
  if (d === 'easy') return 'diff-easy';
  if (d === 'medium') return 'diff-medium';
  if (d === 'hard') return 'diff-hard';
  if (d === 'deadly') return 'diff-deadly';
  return 'diff-medium';
};

const BookQuestPickerModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const storeQuests = useQuestStore((state) => state.quests || []);
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine built-in presets with custom store quests
  const allQuests = useMemo(() => {
    const customList = storeQuests.map((q) => ({
      id: q.id || `custom-q-${Date.now()}`,
      title: q.title || q.name || 'Custom Quest',
      category: 'custom',
      categoryLabel: 'Campaign Quest',
      level: q.level || 1,
      difficulty: q.difficulty || 'Medium',
      status: q.status || 'Active',
      giver: q.giver || 'Campaign NPC',
      giverRole: q.giverRole || 'Quest Giver',
      description: q.description || 'Active campaign adventure hook.',
      objectives: Array.isArray(q.objectives)
        ? q.objectives.map((o, idx) => ({ id: o.id || `obj-${idx}`, text: o.text || o.description || String(o), completed: !!o.completed }))
        : [],
      rewards: q.rewards || { experience: 200, currency: { gold: 10, silver: 0 }, item: '' }
    }));

    return [...SAMPLE_BOOK_QUESTS, ...customList];
  }, [storeQuests]);

  const [selectedQuest, setSelectedQuest] = useState(() => {
    if (initialData && (initialData.title || initialData.id)) {
      return initialData;
    }
    return SAMPLE_BOOK_QUESTS[0];
  });
  const [mobileTab, setMobileTab] = useState('list');

  const filteredQuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allQuests.filter((quest) => {
      if (activeCat !== 'all' && quest.category !== activeCat) return false;
      if (q) {
        const fullText = `${quest.title} ${quest.giver} ${quest.description} ${quest.categoryLabel}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }
      return true;
    });
  }, [allQuests, activeCat, searchQuery]);

  if (!isOpen) return null;

  const handleConfirm = (quest = selectedQuest) => {
    if (!quest) return;
    onSave({
      type: 'quest_hook',
      id: quest.id,
      title: quest.title,
      level: quest.level || 3,
      difficulty: quest.difficulty || 'Medium',
      status: quest.status || 'Active',
      giver: quest.giver || 'Elder Moira',
      giverRole: quest.giverRole || '',
      description: quest.description || '',
      objectives: quest.objectives || [],
      rewards: quest.rewards || { experience: 350, currency: { gold: 20, silver: 0 } },
      reward: quest.reward || (quest.rewards?.currency ? `${quest.rewards.currency.gold || 0}g, ${quest.rewards.experience || 0} XP` : '')
    });
    onClose();
  };

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-quest-picker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-scroll"></i>
            <h3>Quest &amp; Adventure Hook Library</h3>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Category Tabs */}
        <div className="lore-category-tabs">
          {QUEST_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`lore-cat-btn ${activeCat === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.key)}
            >
              <i className={`fas ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="lore-search-strip">
          <div className="lore-search-input-wrap">
            <i className="fas fa-search"></i>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search fantasy quests, storylines, bounties, objectives, givers..."
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                &times;
              </button>
            )}
          </div>
          <span className="results-count">
            {filteredQuests.length} quests available
          </span>
        </div>

        {/* Mobile View Switcher Tabs (Shown only on small screens via CSS) */}
        <div className="lore-mobile-nav-tabs">
          <button
            type="button"
            className={`lore-mobile-tab-btn ${mobileTab === 'list' ? 'active' : ''}`}
            onClick={() => setMobileTab('list')}
          >
            <i className="fas fa-list-ul"></i>
            <span>Quests ({filteredQuests.length})</span>
          </button>
          <button
            type="button"
            className={`lore-mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileTab('preview')}
          >
            <i className="fas fa-eye"></i>
            <span>Preview &amp; Import</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className={`lore-explorer-grid mobile-show-${mobileTab}`}>
          {/* Left Cards List */}
          <div className={`lore-list-column ${mobileTab === 'list' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <div className="lore-cards-scroll">
              {filteredQuests.map((quest) => {
                const isSelected = selectedQuest?.id === quest.id || selectedQuest?.title === quest.title;
                const diffClass = getDifficultyClass(quest.difficulty);
                return (
                  <div
                    key={quest.id}
                    className={`lore-entry-card cat-quest ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedQuest(quest);
                      setMobileTab('preview');
                    }}
                    onDoubleClick={() => handleConfirm(quest)}
                  >
                    <div className="lore-card-left">
                      <div className="lore-icon-badge cat-quest">
                        <i className="fas fa-scroll"></i>
                      </div>
                      <div className="lore-meta-group">
                        <span className="lore-title">{quest.title}</span>
                        <div className="quest-card-meta-chips">
                          <span className={`quest-diff-chip ${diffClass}`}>{quest.difficulty || 'Medium'}</span>
                          <span className="quest-level-chip">Lvl {quest.level || 1}</span>
                          <span className="quest-giver-chip">{quest.giver}</span>
                        </div>
                      </div>
                    </div>
                    {quest.description && (
                      <p className="lore-snippet-text">{quest.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Preview Inspector */}
          <div className={`lore-preview-column ${mobileTab === 'preview' ? 'mobile-visible' : 'mobile-hidden'}`}>
            {selectedQuest ? (
              <div className="quest-inspect-full-parchment">
                {/* Mobile Back Button */}
                <div className="lore-mobile-back-row">
                  <button
                    type="button"
                    className="lore-mobile-back-btn"
                    onClick={() => setMobileTab('list')}
                    title="Back to Quests List"
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Quests</span>
                  </button>
                </div>

                {/* Authentic In-Game Quest Header */}
                <div className="quest-parchment-header">
                  <div className="quest-parchment-title-row">
                    <div className="quest-seal-badge">
                      <i className="fas fa-shield-halved"></i>
                    </div>
                    <div className="quest-title-block">
                      <h2 className="quest-main-title">{selectedQuest.title}</h2>
                      <div className="quest-parchment-meta-row">
                        <span className={`quest-diff-badge ${getDifficultyClass(selectedQuest.difficulty)}`}>
                          {selectedQuest.difficulty || 'Medium'}
                        </span>
                        <span className="quest-level-badge">
                          <i className="fas fa-shield"></i> Level {selectedQuest.level || 1}
                        </span>
                        <span className="quest-giver-badge">
                          <i className="fas fa-user-shield"></i> Given by: <strong>{selectedQuest.giver}</strong>
                          {selectedQuest.giverRole ? ` (${selectedQuest.giverRole})` : ''}
                        </span>
                        <span className="quest-status-pill">
                          {selectedQuest.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body & Objectives Scroll */}
                <div className="quest-parchment-body-scroll">
                  {/* Lore Excerpt */}
                  <div className="quest-story-section">
                    <h4 className="quest-section-label">
                      <i className="fas fa-feather"></i> Mission Briefing &amp; Lore
                    </h4>
                    <div className="quest-narrative-prose">
                      <RichLoreText text={selectedQuest.description} className="parchment-theme" />
                    </div>
                  </div>

                  {/* Objectives */}
                  {selectedQuest.objectives && selectedQuest.objectives.length > 0 && (
                    <div className="quest-objectives-section">
                      <h4 className="quest-section-label">
                        <i className="fas fa-list-check"></i> Objectives &amp; Milestones
                      </h4>
                      <div className="quest-objectives-grid">
                        {selectedQuest.objectives.map((obj, idx) => {
                          const text = typeof obj === 'object' ? obj.text : obj;
                          const completed = typeof obj === 'object' ? !!obj.completed : false;
                          return (
                            <div key={idx} className={`quest-objective-row ${completed ? 'is-done' : ''}`}>
                              <span className="obj-checkbox">
                                <i className={`fas ${completed ? 'fa-square-check' : 'fa-square'}`}></i>
                              </span>
                              <span className="obj-text">{text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  {selectedQuest.rewards && (
                    <div className="quest-rewards-section">
                      <h4 className="quest-section-label">
                        <i className="fas fa-gift"></i> Quest Rewards
                      </h4>
                      <div className="quest-rewards-chips-row">
                        {selectedQuest.rewards.experience && (
                          <div className="reward-chip xp-chip">
                            <i className="fas fa-sparkles"></i>
                            <span>+{selectedQuest.rewards.experience} XP</span>
                          </div>
                        )}
                        {selectedQuest.rewards.currency && (
                          <div className="reward-chip gold-chip">
                            <i className="fas fa-coins"></i>
                            <span>
                              {selectedQuest.rewards.currency.gold ? `${selectedQuest.rewards.currency.gold} Gold ` : ''}
                              {selectedQuest.rewards.currency.silver ? `${selectedQuest.rewards.currency.silver} Silver` : ''}
                            </span>
                          </div>
                        )}
                        {selectedQuest.rewards.item && (
                          <div className="reward-chip item-chip">
                            <i className="fas fa-gem"></i>
                            <span>{selectedQuest.rewards.item}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="inspect-footer-bar">
                  <button type="button" className="btn-cancel-lore" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-import-confirm"
                    onClick={() => handleConfirm(selectedQuest)}
                  >
                    <i className="fas fa-scroll"></i>
                    <span>Place Quest in Chronicle</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="lore-inspect-placeholder">
                <i className="fas fa-scroll"></i>
                <h4>Select a Quest</h4>
                <p>Choose an adventure hook from the catalog to preview and insert into your book.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookQuestPickerModal;
