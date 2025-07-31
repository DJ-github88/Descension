/**
 * Card System - Core mechanics for card-based spell effects
 * 
 * This module provides comprehensive utilities for working with standard playing cards
 * and tarot cards, including drawing, hand evaluation, and spell effect determination.
 */

// =====================================================================
// CARD DEFINITIONS
// =====================================================================

/**
 * Standard playing card suits
 */
export const CARD_SUITS = {
    HEARTS: 'hearts',
    DIAMONDS: 'diamonds',
    CLUBS: 'clubs',
    SPADES: 'spades'
  };
  
  /**
   * Standard playing card ranks
   */
  export const CARD_RANKS = {
    ACE: 'ace',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    JACK: 'jack',
    QUEEN: 'queen',
    KING: 'king'
  };
  
  /**
   * Card suit properties (for spell effects)
   */
  export const SUIT_PROPERTIES = {
    [CARD_SUITS.HEARTS]: {
      element: 'water',
      quality: 'restoration',
      color: '#ff5555',
      icon: '♥',
      opposingSuit: CARD_SUITS.SPADES
    },
    [CARD_SUITS.DIAMONDS]: {
      element: 'fire',
      quality: 'enhancement',
      color: '#ff9955',
      icon: '♦',
      opposingSuit: CARD_SUITS.CLUBS
    },
    [CARD_SUITS.CLUBS]: {
      element: 'earth',
      quality: 'protection',
      color: '#559955',
      icon: '♣',
      opposingSuit: CARD_SUITS.DIAMONDS
    },
    [CARD_SUITS.SPADES]: {
      element: 'air',
      quality: 'disruption',
      color: '#5555ff',
      icon: '♠',
      opposingSuit: CARD_SUITS.HEARTS
    }
  };
  
  /**
   * Card rank values (for hand evaluation)
   */
  export const RANK_VALUES = {
    [CARD_RANKS.ACE]: 14, // Ace high by default
    [CARD_RANKS.TWO]: 2,
    [CARD_RANKS.THREE]: 3,
    [CARD_RANKS.FOUR]: 4,
    [CARD_RANKS.FIVE]: 5,
    [CARD_RANKS.SIX]: 6,
    [CARD_RANKS.SEVEN]: 7,
    [CARD_RANKS.EIGHT]: 8,
    [CARD_RANKS.NINE]: 9,
    [CARD_RANKS.TEN]: 10,
    [CARD_RANKS.JACK]: 11,
    [CARD_RANKS.QUEEN]: 12,
    [CARD_RANKS.KING]: 13
  };
  
  /**
   * Alternate Ace low value
   */
  export const ACE_LOW_VALUE = 1;
  
  /**
   * Tarot major arcana cards (22 cards)
   */
  export const TAROT_MAJOR_ARCANA = [
    { id: 0, name: 'The Fool', element: 'air', meaning: 'New beginnings, freedom, innocence', reversed: 'Recklessness, risk-taking, folly' },
    { id: 1, name: 'The Magician', element: 'air', meaning: 'Manifestation, resourcefulness, power', reversed: 'Manipulation, untapped talents' },
    { id: 2, name: 'The High Priestess', element: 'water', meaning: 'Intuition, unconscious, inner voice', reversed: 'Secrets, disconnection, withdrawal' },
    { id: 3, name: 'The Empress', element: 'earth', meaning: 'Fertility, nurturing, abundance', reversed: 'Dependence, smothering, emptiness' },
    { id: 4, name: 'The Emperor', element: 'fire', meaning: 'Authority, structure, control', reversed: 'Domination, excessive control, rigidity' },
    { id: 5, name: 'The Hierophant', element: 'earth', meaning: 'Tradition, conformity, morality', reversed: 'Rebellion, subversion, unorthodoxy' },
    { id: 6, name: 'The Lovers', element: 'air', meaning: 'Union, choice, alignment of values', reversed: 'Disharmony, imbalance, misalignment' },
    { id: 7, name: 'The Chariot', element: 'water', meaning: 'Direction, control, willpower', reversed: 'Lack of control, opposition, lack of direction' },
    { id: 8, name: 'Strength', element: 'fire', meaning: 'Courage, persuasion, influence', reversed: 'Self-doubt, weakness, insecurity' },
    { id: 9, name: 'The Hermit', element: 'earth', meaning: 'Soul-searching, introspection, guidance', reversed: 'Isolation, loneliness, withdrawal' },
    { id: 10, name: 'Wheel of Fortune', element: 'fire', meaning: 'Change, cycles, fate', reversed: 'Bad luck, resistance to change, breaking cycles' },
    { id: 11, name: 'Justice', element: 'air', meaning: 'Fairness, truth, cause and effect', reversed: 'Unfairness, dishonesty, lack of accountability' },
    { id: 12, name: 'The Hanged Man', element: 'water', meaning: 'Pause, surrender, letting go', reversed: 'Stalling, indecision, resistance' },
    { id: 13, name: 'Death', element: 'water', meaning: 'Endings, change, transformation', reversed: 'Resistance to change, stagnation, decay' },
    { id: 14, name: 'Temperance', element: 'fire', meaning: 'Balance, moderation, patience', reversed: 'Imbalance, excess, lack of long-term vision' },
    { id: 15, name: 'The Devil', element: 'earth', meaning: 'Shadow self, attachment, addiction', reversed: 'Releasing limiting beliefs, detachment, freedom' },
    { id: 16, name: 'The Tower', element: 'fire', meaning: 'Sudden change, revelation, disruption', reversed: 'Avoiding disaster, delaying the inevitable' },
    { id: 17, name: 'The Star', element: 'air', meaning: 'Hope, faith, purpose, renewal', reversed: 'Lack of faith, despair, discouragement' },
    { id: 18, name: 'The Moon', element: 'water', meaning: 'Illusion, fear, anxiety, intuition', reversed: 'Release of fear, repressed emotion, confusion' },
    { id: 19, name: 'The Sun', element: 'fire', meaning: 'Success, radiance, joy, vitality', reversed: 'Temporary depression, lack of success' },
    { id: 20, name: 'Judgement', element: 'fire', meaning: 'Reflection, reckoning, awakening', reversed: 'Self-doubt, refusal of self-examination' },
    { id: 21, name: 'The World', element: 'earth', meaning: 'Completion, integration, accomplishment', reversed: 'Lack of closure, incomplete goals' }
  ];
  
  /**
   * Tarot minor arcana suits
   */
  export const TAROT_SUITS = {
    WANDS: 'wands',
    CUPS: 'cups',
    SWORDS: 'swords',
    PENTACLES: 'pentacles'
  };
  
  /**
   * Tarot suit properties (for spell effects)
   */
  export const TAROT_SUIT_PROPERTIES = {
    [TAROT_SUITS.WANDS]: {
      element: 'fire',
      quality: 'energy',
      domain: 'passion',
      color: '#ff7700',
      correspondingPlayingSuit: CARD_SUITS.CLUBS
    },
    [TAROT_SUITS.CUPS]: {
      element: 'water',
      quality: 'emotion',
      domain: 'relationships',
      color: '#3377ff',
      correspondingPlayingSuit: CARD_SUITS.HEARTS
    },
    [TAROT_SUITS.SWORDS]: {
      element: 'air',
      quality: 'intellect',
      domain: 'conflict',
      color: '#dddddd',
      correspondingPlayingSuit: CARD_SUITS.SPADES
    },
    [TAROT_SUITS.PENTACLES]: {
      element: 'earth',
      quality: 'material',
      domain: 'wealth',
      color: '#77cc44',
      correspondingPlayingSuit: CARD_SUITS.DIAMONDS
    }
  };
  
  /**
   * Tarot card ranks
   */
  export const TAROT_RANKS = {
    ACE: 'ace',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    PAGE: 'page',
    KNIGHT: 'knight',
    QUEEN: 'queen',
    KING: 'king'
  };
  
  /**
   * Hand ranking types (poker-style)
   */
  export const HAND_RANKINGS = {
    HIGH_CARD: 'high_card',
    ONE_PAIR: 'one_pair',
    TWO_PAIR: 'two_pair',
    THREE_OF_A_KIND: 'three_of_a_kind',
    STRAIGHT: 'straight',
    FLUSH: 'flush',
    FULL_HOUSE: 'full_house',
    FOUR_OF_A_KIND: 'four_of_a_kind',
    STRAIGHT_FLUSH: 'straight_flush',
    ROYAL_FLUSH: 'royal_flush'
  };
  
  /**
   * Deck types
   */
  export const DECK_TYPES = {
    STANDARD: 'standard',
    STANDARD_WITH_JOKERS: 'standard_with_jokers',
    TAROT: 'tarot',
    MINOR_ARCANA: 'minor_arcana',
    MAJOR_ARCANA: 'major_arcana',
    CUSTOM: 'custom'
  };
  
  // =====================================================================
  // DECK MANAGEMENT FUNCTIONS
  // =====================================================================
  
  /**
   * Create a standard deck of playing cards
   * 
   * @param {boolean} includeJokers - Whether to include jokers
   * @returns {Array} - Array of card objects
   */
  export function createStandardDeck(includeJokers = false) {
    const deck = [];
    const suits = Object.values(CARD_SUITS);
    const ranks = Object.values(CARD_RANKS);
    
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          suit,
          rank,
          value: RANK_VALUES[rank],
          id: `${rank}_of_${suit}`,
          altValue: rank === CARD_RANKS.ACE ? ACE_LOW_VALUE : null,
          name: `${rank.charAt(0).toUpperCase() + rank.slice(1)} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`
        });
      }
    }
    
    if (includeJokers) {
      deck.push({
        id: 'joker_red',
        name: 'Red Joker',
        rank: 'joker',
        suit: 'special',
        value: 15
      });
      
      deck.push({
        id: 'joker_black',
        name: 'Black Joker',
        rank: 'joker',
        suit: 'special',
        value: 15
      });
    }
    
    return deck;
  }
  
  /**
   * Create a tarot deck (major and minor arcana)
   * 
   * @returns {Array} - Array of tarot card objects
   */
  export function createTarotDeck() {
    const deck = [...TAROT_MAJOR_ARCANA];
    
    // Add minor arcana
    const suits = Object.values(TAROT_SUITS);
    const ranks = Object.values(TAROT_RANKS);
    
    for (const suit of suits) {
      for (const rank of ranks) {
        const properties = TAROT_SUIT_PROPERTIES[suit];
        
        let value;
        switch (rank) {
          case TAROT_RANKS.ACE: value = 1; break;
          case TAROT_RANKS.PAGE: value = 11; break;
          case TAROT_RANKS.KNIGHT: value = 12; break;
          case TAROT_RANKS.QUEEN: value = 13; break;
          case TAROT_RANKS.KING: value = 14; break;
          default: value = parseInt(rank);
        }
        
        deck.push({
          id: `${rank}_of_${suit}`,
          name: `${rank.charAt(0).toUpperCase() + rank.slice(1)} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          rank,
          suit,
          value,
          element: properties.element,
          quality: properties.quality,
          domain: properties.domain
        });
      }
    }
    
    return deck;
  }
  
  /**
   * Create a minor arcana deck (tarot without major arcana)
   * 
   * @returns {Array} - Array of minor arcana card objects
   */
  export function createMinorArcanaDeck() {
    const suits = Object.values(TAROT_SUITS);
    const ranks = Object.values(TAROT_RANKS);
    const deck = [];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        const properties = TAROT_SUIT_PROPERTIES[suit];
        
        let value;
        switch (rank) {
          case TAROT_RANKS.ACE: value = 1; break;
          case TAROT_RANKS.PAGE: value = 11; break;
          case TAROT_RANKS.KNIGHT: value = 12; break;
          case TAROT_RANKS.QUEEN: value = 13; break;
          case TAROT_RANKS.KING: value = 14; break;
          default: value = parseInt(rank);
        }
        
        deck.push({
          id: `${rank}_of_${suit}`,
          name: `${rank.charAt(0).toUpperCase() + rank.slice(1)} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          rank,
          suit,
          value,
          element: properties.element,
          quality: properties.quality,
          domain: properties.domain
        });
      }
    }
    
    return deck;
  }
  
  /**
   * Create a major arcana deck
   * 
   * @returns {Array} - Array of major arcana card objects
   */
  export function createMajorArcanaDeck() {
    return [...TAROT_MAJOR_ARCANA];
  }
  
  /**
   * Create a custom deck based on parameters
   * 
   * @param {Object} options - Deck creation options
   * @returns {Array} - Custom deck of cards
   */
  export function createCustomDeck(options = {}) {
    const {
      suits = Object.values(CARD_SUITS),
      ranks = Object.values(CARD_RANKS),
      includeJokers = false,
      includeMajorArcana = false,
      includeWildcards = false,
      specialCards = []
    } = options;
    
    let deck = [];
    
    // Add standard cards
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          suit,
          rank,
          value: RANK_VALUES[rank] || parseInt(rank) || 0,
          id: `${rank}_of_${suit}`,
          name: `${rank.charAt(0).toUpperCase() + rank.slice(1)} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`
        });
      }
    }
    
    // Add jokers
    if (includeJokers) {
      deck.push({
        id: 'joker_red',
        name: 'Red Joker',
        rank: 'joker',
        suit: 'special',
        value: 15
      });
      
      deck.push({
        id: 'joker_black',
        name: 'Black Joker',
        rank: 'joker',
        suit: 'special',
        value: 15
      });
    }
    
    // Add major arcana
    if (includeMajorArcana) {
      deck = [...deck, ...TAROT_MAJOR_ARCANA];
    }
    
    // Add wildcards
    if (includeWildcards) {
      deck.push({
        id: 'wildcard',
        name: 'Wildcard',
        rank: 'wild',
        suit: 'special',
        value: 16,
        isWild: true
      });
    }
    
    // Add special cards
    if (specialCards.length > 0) {
      deck = [...deck, ...specialCards];
    }
    
    return deck;
  }
  
  /**
   * Create a deck based on deck type
   * 
   * @param {string} deckType - Type of deck to create
   * @param {Object} options - Additional options
   * @returns {Array} - Deck of cards
   */
  export function createDeck(deckType = DECK_TYPES.STANDARD, options = {}) {
    switch (deckType) {
      case DECK_TYPES.STANDARD:
        return createStandardDeck(false);
      case DECK_TYPES.STANDARD_WITH_JOKERS:
        return createStandardDeck(true);
      case DECK_TYPES.TAROT:
        return createTarotDeck();
      case DECK_TYPES.MINOR_ARCANA:
        return createMinorArcanaDeck();
      case DECK_TYPES.MAJOR_ARCANA:
        return createMajorArcanaDeck();
      case DECK_TYPES.CUSTOM:
        return createCustomDeck(options);
      default:
        return createStandardDeck(false);
    }
  }
  
  // =====================================================================
  // CARD DRAWING AND SHUFFLING FUNCTIONS
  // =====================================================================
  
  /**
   * Shuffle a deck of cards
   * 
   * @param {Array} deck - Deck to shuffle
   * @returns {Array} - Shuffled deck
   */
  export function shuffleDeck(deck) {
    // Create a copy of the deck
    const shuffledDeck = [...deck];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    
    return shuffledDeck;
  }
  
  /**
   * Draw cards from a deck
   * 
   * @param {Array} deck - Deck to draw from
   * @param {number} count - Number of cards to draw
   * @param {boolean} removeFromDeck - Whether to remove cards from the deck
   * @returns {Object} - Drawn cards and the updated deck
   */
  export function drawCards(deck, count = 1, removeFromDeck = true) {
    if (!deck || !Array.isArray(deck) || deck.length === 0) {
      throw new Error('Invalid deck');
    }
    
    if (count > deck.length) {
      throw new Error(`Cannot draw ${count} cards from a deck of ${deck.length} cards`);
    }
    
    const drawnCards = [];
    let remainingDeck = [...deck];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * remainingDeck.length);
      const card = remainingDeck[randomIndex];
      
      drawnCards.push(card);
      
      if (removeFromDeck) {
        remainingDeck = [
          ...remainingDeck.slice(0, randomIndex),
          ...remainingDeck.slice(randomIndex + 1)
        ];
      }
    }
    
    return {
      cards: drawnCards,
      deck: remainingDeck
    };
  }
  
  /**
   * Deal a specified number of hands from a deck
   * 
   * @param {Array} deck - Deck to deal from
   * @param {number} handCount - Number of hands to deal
   * @param {number} cardsPerHand - Number of cards per hand
   * @returns {Object} - Dealt hands and the updated deck
   */
  export function dealHands(deck, handCount = 2, cardsPerHand = 5) {
    if (!deck || !Array.isArray(deck) || deck.length === 0) {
      throw new Error('Invalid deck');
    }
    
    const totalCards = handCount * cardsPerHand;
    
    if (totalCards > deck.length) {
      throw new Error(`Cannot deal ${totalCards} cards from a deck of ${deck.length} cards`);
    }
    
    // Shuffle the deck first
    let shuffledDeck = shuffleDeck([...deck]);
    const hands = [];
    
    for (let i = 0; i < handCount; i++) {
      const { cards, deck: updatedDeck } = drawCards(shuffledDeck, cardsPerHand, true);
      hands.push(cards);
      shuffledDeck = updatedDeck;
    }
    
    return {
      hands,
      deck: shuffledDeck
    };
  }
  
  /**
   * Draw a card with specific properties
   * 
   * @param {Array} deck - Deck to draw from
   * @param {Object} criteria - Criteria to match
   * @returns {Object} - Card and updated deck, or null if no match
   */
  export function drawSpecificCard(deck, criteria) {
    if (!deck || !Array.isArray(deck) || deck.length === 0) {
      throw new Error('Invalid deck');
    }
    
    // Find all matching cards
    const matchingCards = deck.filter(card => {
      for (const [key, value] of Object.entries(criteria)) {
        if (card[key] !== value) {
          return false;
        }
      }
      return true;
    });
    
    if (matchingCards.length === 0) {
      return null;
    }
    
    // Choose a random matching card
    const randomIndex = Math.floor(Math.random() * matchingCards.length);
    const selectedCard = matchingCards[randomIndex];
    
    // Remove the card from the deck
    const cardIndex = deck.findIndex(card => card.id === selectedCard.id);
    const updatedDeck = [
      ...deck.slice(0, cardIndex),
      ...deck.slice(cardIndex + 1)
    ];
    
    return {
      card: selectedCard,
      deck: updatedDeck
    };
  }
  
  // =====================================================================
  // HAND EVALUATION FUNCTIONS
  // =====================================================================
  
  /**
   * Group cards by rank
   * 
   * @param {Array} hand - Hand of cards
   * @returns {Object} - Cards grouped by rank
   */
  function groupCardsByRank(hand) {
    return hand.reduce((groups, card) => {
      const rank = card.rank;
      if (!groups[rank]) {
        groups[rank] = [];
      }
      groups[rank].push(card);
      return groups;
    }, {});
  }
  
  /**
   * Group cards by suit
   * 
   * @param {Array} hand - Hand of cards
   * @returns {Object} - Cards grouped by suit
   */
  function groupCardsBySuit(hand) {
    return hand.reduce((groups, card) => {
      const suit = card.suit;
      if (!groups[suit]) {
        groups[suit] = [];
      }
      groups[suit].push(card);
      return groups;
    }, {});
  }
  
  /**
   * Check if a hand contains a straight
   * 
   * @param {Array} hand - Hand of cards
   * @returns {boolean} - Whether the hand contains a straight
   */
  function hasStraight(hand) {
    if (hand.length < 5) return false;
    
    // Sort by value
    const sortedHand = [...hand].sort((a, b) => a.value - b.value);
    
    // Check for A-5 straight (Ace low)
    const hasAce = sortedHand.some(card => card.rank === CARD_RANKS.ACE);
    if (hasAce) {
      const aceLowHand = sortedHand.map(card => {
        if (card.rank === CARD_RANKS.ACE) {
          return { ...card, value: ACE_LOW_VALUE };
        }
        return card;
      });
      aceLowHand.sort((a, b) => a.value - b.value);
      
      let aceLowConsecutive = 1;
      for (let i = 1; i < aceLowHand.length; i++) {
        if (aceLowHand[i].value === aceLowHand[i - 1].value + 1) {
          aceLowConsecutive++;
          if (aceLowConsecutive >= 5) return true;
        } else if (aceLowHand[i].value !== aceLowHand[i - 1].value) {
          aceLowConsecutive = 1;
        }
      }
    }
    
    // Check for regular straight
    let consecutive = 1;
    for (let i = 1; i < sortedHand.length; i++) {
      if (sortedHand[i].value === sortedHand[i - 1].value + 1) {
        consecutive++;
        if (consecutive >= 5) return true;
      } else if (sortedHand[i].value !== sortedHand[i - 1].value) {
        consecutive = 1;
      }
    }
    
    return false;
  }
  
  /**
   * Check if a hand contains a flush
   * 
   * @param {Array} hand - Hand of cards
   * @returns {boolean} - Whether the hand contains a flush
   */
  function hasFlush(hand) {
    if (hand.length < 5) return false;
    
    const suitGroups = groupCardsBySuit(hand);
    
    for (const suit in suitGroups) {
      if (suitGroups[suit].length >= 5) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Get the highest ranked cards from a hand (for tiebreakers)
   * 
   * @param {Array} hand - Hand of cards
   * @param {number} count - Number of cards to get
   * @returns {Array} - Highest ranked cards
   */
  function getHighCards(hand, count = 5) {
    if (hand.length === 0) return [];
    
    return [...hand]
      .sort((a, b) => b.value - a.value)
      .slice(0, count);
  }
  
  /**
   * Evaluate a poker hand and return its ranking
   * 
   * @param {Array} hand - Hand of cards
   * @returns {Object} - Hand evaluation
   */
  export function evaluatePokerHand(hand) {
    if (!hand || !Array.isArray(hand) || hand.length === 0) {
      throw new Error('Invalid hand');
    }
    
    // For hands with wildcards, we'd need much more complex logic
    // This implementation assumes no wildcards
    
    const rankGroups = groupCardsByRank(hand);
    const suitGroups = groupCardsBySuit(hand);
    
    // Look for different hand types, starting with the best
    
    // Royal Flush - A, K, Q, J, 10 of the same suit
    for (const suit in suitGroups) {
      if (suitGroups[suit].length >= 5) {
        const royalCards = ['10', 'jack', 'queen', 'king', 'ace'];
        const hasMissingRoyalCard = royalCards.some(
          rank => !suitGroups[suit].some(card => card.rank === rank)
        );
        
        if (!hasMissingRoyalCard) {
          return {
            rank: HAND_RANKINGS.ROYAL_FLUSH,
            description: 'Royal Flush',
            value: 900,
            cards: suitGroups[suit].filter(card => royalCards.includes(card.rank))
          };
        }
      }
    }
    
    // Straight Flush - five cards in sequence all of the same suit
    for (const suit in suitGroups) {
      if (suitGroups[suit].length >= 5) {
        if (hasStraight(suitGroups[suit])) {
          // Determine the high card of the straight flush
          const sortedCards = [...suitGroups[suit]].sort((a, b) => b.value - a.value);
          return {
            rank: HAND_RANKINGS.STRAIGHT_FLUSH,
            description: 'Straight Flush',
            value: 800 + sortedCards[0].value,
            cards: sortedCards.slice(0, 5)
          };
        }
      }
    }
    
    // Four of a Kind - four cards of the same rank
    for (const rank in rankGroups) {
      if (rankGroups[rank].length === 4) {
        // Find the highest kicker
        const kickers = hand.filter(card => card.rank !== rank);
        const highestKicker = getHighCards(kickers, 1)[0];
        
        return {
          rank: HAND_RANKINGS.FOUR_OF_A_KIND,
          description: 'Four of a Kind',
          value: 700 + rankGroups[rank][0].value,
          cards: [...rankGroups[rank], highestKicker]
        };
      }
    }
    
    // Full House - three of a kind and a pair
    let hasThreeOfAKind = null;
    let hasPair = null;
    
    for (const rank in rankGroups) {
      if (rankGroups[rank].length === 3 && !hasThreeOfAKind) {
        hasThreeOfAKind = rank;
      } else if (rankGroups[rank].length >= 2 && !hasPair) {
        hasPair = rank;
      }
    }
    
    if (hasThreeOfAKind && hasPair) {
      return {
        rank: HAND_RANKINGS.FULL_HOUSE,
        description: 'Full House',
        value: 600 + (rankGroups[hasThreeOfAKind][0].value * 10) + rankGroups[hasPair][0].value,
        cards: [...rankGroups[hasThreeOfAKind], ...rankGroups[hasPair].slice(0, 2)]
      };
    }
    
    // Flush - five cards of the same suit
    for (const suit in suitGroups) {
      if (suitGroups[suit].length >= 5) {
        const topFiveCards = getHighCards(suitGroups[suit], 5);
        return {
          rank: HAND_RANKINGS.FLUSH,
          description: 'Flush',
          value: 500 + topFiveCards[0].value,
          cards: topFiveCards
        };
      }
    }
    
    // Straight - five cards in sequence
    if (hasStraight(hand)) {
      // Identify the straight cards
      const sortedHand = [...hand].sort((a, b) => a.value - b.value);
      let straightCards = [];
      let consecutive = 1;
      let startIndex = 0;
      
      for (let i = 1; i < sortedHand.length; i++) {
        if (sortedHand[i].value === sortedHand[i - 1].value + 1) {
          consecutive++;
          if (consecutive === 5) {
            straightCards = sortedHand.slice(startIndex, startIndex + 5);
            break;
          }
        } else if (sortedHand[i].value !== sortedHand[i - 1].value) {
          consecutive = 1;
          startIndex = i;
        }
      }
      
      // Handle A-5 straight
      if (straightCards.length === 0 && hand.some(card => card.rank === CARD_RANKS.ACE)) {
        const aceLowHand = hand.map(card => {
          if (card.rank === CARD_RANKS.ACE) {
            return { ...card, value: ACE_LOW_VALUE };
          }
          return card;
        });
        aceLowHand.sort((a, b) => a.value - b.value);
        
        consecutive = 1;
        startIndex = 0;
        
        for (let i = 1; i < aceLowHand.length; i++) {
          if (aceLowHand[i].value === aceLowHand[i - 1].value + 1) {
            consecutive++;
            if (consecutive === 5) {
              straightCards = aceLowHand.slice(startIndex, startIndex + 5);
              break;
            }
          } else if (aceLowHand[i].value !== aceLowHand[i - 1].value) {
            consecutive = 1;
            startIndex = i;
          }
        }
      }
      
      return {
        rank: HAND_RANKINGS.STRAIGHT,
        description: 'Straight',
        value: 400 + Math.max(...straightCards.map(card => card.value)),
        cards: straightCards
      };
    }
    
    // Three of a Kind - three cards of the same rank
    for (const rank in rankGroups) {
      if (rankGroups[rank].length === 3) {
        const kickers = hand.filter(card => card.rank !== rank);
        const highestKickers = getHighCards(kickers, 2);
        
        return {
          rank: HAND_RANKINGS.THREE_OF_A_KIND,
          description: 'Three of a Kind',
          value: 300 + rankGroups[rank][0].value,
          cards: [...rankGroups[rank], ...highestKickers]
        };
      }
    }
    
    // Two Pair - two different pairs
    const pairs = [];
    for (const rank in rankGroups) {
      if (rankGroups[rank].length === 2) {
        pairs.push(rankGroups[rank]);
      }
    }
    
    if (pairs.length >= 2) {
      // Sort pairs by value
      pairs.sort((a, b) => b[0].value - a[0].value);
      
      const topTwoPairs = pairs.slice(0, 2).flat();
      const kickers = hand.filter(card => 
        !topTwoPairs.some(pairCard => pairCard.id === card.id)
      );
      const highestKicker = getHighCards(kickers, 1)[0];
      
      return {
        rank: HAND_RANKINGS.TWO_PAIR,
        description: 'Two Pair',
        value: 200 + (pairs[0][0].value * 10) + pairs[1][0].value,
        cards: [...topTwoPairs, highestKicker]
      };
    }
    
    // One Pair - two cards of the same rank
    for (const rank in rankGroups) {
      if (rankGroups[rank].length === 2) {
        const kickers = hand.filter(card => card.rank !== rank);
        const highestKickers = getHighCards(kickers, 3);
        
        return {
          rank: HAND_RANKINGS.ONE_PAIR,
          description: 'One Pair',
          value: 100 + rankGroups[rank][0].value,
          cards: [...rankGroups[rank], ...highestKickers]
        };
      }
    }
    
    // High Card - highest card in the hand
    const highCards = getHighCards(hand, 5);
    return {
      rank: HAND_RANKINGS.HIGH_CARD,
      description: 'High Card',
      value: highCards[0].value,
      cards: highCards
    };
  }
  
  /**
   * Compare two poker hands to determine which is better
   * 
   * @param {Array} hand1 - First hand
   * @param {Array} hand2 - Second hand
   * @returns {number} - Positive if hand1 is better, negative if hand2 is better, 0 if equal
   */
  export function comparePokerHands(hand1, hand2) {
    const evaluation1 = evaluatePokerHand(hand1);
    const evaluation2 = evaluatePokerHand(hand2);
    
    // Compare hand ranks first
    if (evaluation1.value !== evaluation2.value) {
      return evaluation1.value - evaluation2.value;
    }
    
    // If ranks are equal, compare kickers
    const kickers1 = getHighCards(hand1, 5);
    const kickers2 = getHighCards(hand2, 5);
    
    for (let i = 0; i < Math.min(kickers1.length, kickers2.length); i++) {
      if (kickers1[i].value !== kickers2[i].value) {
        return kickers1[i].value - kickers2[i].value;
      }
    }
    
    return 0; // Hands are equal
  }
  
  /**
   * Check if a card collection has specific patterns
   * 
   * @param {Array} cards - Cards to check
   * @param {Object} patterns - Patterns to look for
   * @returns {Object} - Matched patterns
   */
  export function checkCardPatterns(cards, patterns = {}) {
    const {
      suitMatch = null,
      rankMatch = null,
      consecutiveValues = 0,
      sameSuit = false,
      minValue = null,
      maxValue = null,
      specificCards = []
    } = patterns;
    
    const results = {
      matchedSuit: false,
      matchedRank: false,
      isConsecutive: false,
      isWithinRange: true,
      hasSpecificCards: false,
      allSameSuit: false
    };
    
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return results;
    }
    
    // Check suit match
    if (suitMatch) {
      results.matchedSuit = cards.some(card => card.suit === suitMatch);
    }
    
    // Check rank match
    if (rankMatch) {
      results.matchedRank = cards.some(card => card.rank === rankMatch);
    }
    
    // Check consecutive values
    if (consecutiveValues > 1) {
      const sortedValues = cards.map(card => card.value).sort((a, b) => a - b);
      let maxConsecutive = 1;
      let currentConsecutive = 1;
      
      for (let i = 1; i < sortedValues.length; i++) {
        if (sortedValues[i] === sortedValues[i - 1] + 1) {
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else if (sortedValues[i] !== sortedValues[i - 1]) {
          currentConsecutive = 1;
        }
      }
      
      results.isConsecutive = maxConsecutive >= consecutiveValues;
    }
    
    // Check value range
    if (minValue !== null) {
      results.isWithinRange = results.isWithinRange && 
        cards.every(card => card.value >= minValue);
    }
    
    if (maxValue !== null) {
      results.isWithinRange = results.isWithinRange && 
        cards.every(card => card.value <= maxValue);
    }
    
    // Check for specific cards
    if (specificCards.length > 0) {
      results.hasSpecificCards = specificCards.every(specificCard => {
        return cards.some(card => {
          for (const [key, value] of Object.entries(specificCard)) {
            if (card[key] !== value) return false;
          }
          return true;
        });
      });
    }
    
    // Check if all cards are the same suit
    if (sameSuit) {
      const firstSuit = cards[0].suit;
      results.allSameSuit = cards.every(card => card.suit === firstSuit);
    }
    
    return results;
  }
  
  /**
   * Calculate probability of getting specific card combinations
   * 
   * @param {Object} params - Probability calculation parameters
   * @returns {Object} - Probability results
   */
  export function calculateCardProbability(params = {}) {
    const {
      deckType = DECK_TYPES.STANDARD,
      deckSize = null, // Override deck size
      drawCount = 1,
      targetSuit = null,
      targetRank = null,
      targetCard = null, // Specific card criteria
      combinationType = null, // 'pair', 'threeOfAKind', 'flush', etc.
      remainingCards = null // For conditional probability
    } = params;
    
    let baseDeck;
    let effectiveDeckSize;
    
    if (remainingCards && Array.isArray(remainingCards)) {
      baseDeck = remainingCards;
      effectiveDeckSize = baseDeck.length;
    } else {
      baseDeck = createDeck(deckType);
      effectiveDeckSize = deckSize || baseDeck.length;
    }
    
    // Simple case: Probability of drawing a specific card
    if (targetCard) {
      const matchingCards = baseDeck.filter(card => {
        for (const [key, value] of Object.entries(targetCard)) {
          if (card[key] !== value) return false;
        }
        return true;
      });
      
      const probability = matchingCards.length / effectiveDeckSize;
      return {
        probability,
        percentage: probability * 100,
        oddsFor: probability > 0 ? `1 in ${Math.round(1 / probability)}` : 'impossible',
        oddsAgainst: probability > 0 ? `${Math.round((1 - probability) / probability)} to 1` : 'impossible'
      };
    }
    
    // Probability of drawing a specific suit
    if (targetSuit) {
      const suitCards = baseDeck.filter(card => card.suit === targetSuit);
      const probability = suitCards.length / effectiveDeckSize;
      return {
        probability,
        percentage: probability * 100,
        oddsFor: probability > 0 ? `1 in ${Math.round(1 / probability)}` : 'impossible',
        oddsAgainst: probability > 0 ? `${Math.round((1 - probability) / probability)} to 1` : 'impossible'
      };
    }
    
    // Probability of drawing a specific rank
    if (targetRank) {
      const rankCards = baseDeck.filter(card => card.rank === targetRank);
      const probability = rankCards.length / effectiveDeckSize;
      return {
        probability,
        percentage: probability * 100,
        oddsFor: probability > 0 ? `1 in ${Math.round(1 / probability)}` : 'impossible',
        oddsAgainst: probability > 0 ? `${Math.round((1 - probability) / probability)} to 1` : 'impossible'
      };
    }
    
    // Probability of getting specific combinations
    if (combinationType) {
      // These are complex calculations - simplifying for illustration
      switch (combinationType) {
        case 'pair':
          // For a single pair with 5 card draw
          if (drawCount === 5) {
            // Approximate probability for a pair in 5 card draw
            return {
              probability: 0.4226,
              percentage: 42.26,
              oddsFor: '1 in 2.37',
              oddsAgainst: '1.37 to 1'
            };
          }
          break;
          
        case 'flush':
          // For a flush with 5 card draw
          if (drawCount === 5) {
            // Approximate probability for a flush in 5 card draw
            return {
              probability: 0.00198,
              percentage: 0.198,
              oddsFor: '1 in 508',
              oddsAgainst: '507 to 1'
            };
          }
          break;
          
        case 'straight':
          // For a straight with 5 card draw
          if (drawCount === 5) {
            // Approximate probability for a straight in 5 card draw
            return {
              probability: 0.00392,
              percentage: 0.392,
              oddsFor: '1 in 255',
              oddsAgainst: '254 to 1'
            };
          }
          break;
          
        default:
          // For other combinations, we would need more complex calculations
          break;
      }
    }
    
    // Default: general probability of drawing N cards
    return {
      probability: 1, // Probability of drawing any N cards
      percentage: 100,
      oddsFor: '1 in 1',
      oddsAgainst: '0 to 1'
    };
  }
  
  // =====================================================================
  // SPELL EFFECT DETERMINATION FUNCTIONS
  // =====================================================================
  
  /**
   * Map card combinations to spell effects
   * 
   * @param {Array} cards - Cards in hand
   * @param {Array} effectRules - Rules mapping cards to effects
   * @returns {Array} - Triggered effects
   */
  export function determineSpellEffects(cards, effectRules) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return [];
    }
    
    if (!effectRules || !Array.isArray(effectRules) || effectRules.length === 0) {
      return [];
    }
    
    const triggeredEffects = [];
    
    // Evaluate the hand
    const handEvaluation = evaluatePokerHand(cards);
    
    // Check each rule
    for (const rule of effectRules) {
      let isTriggered = false;
      
      // Check hand type requirements
      if (rule.handType && rule.handType !== handEvaluation.rank) {
        continue;
      }
      
      // Check suit requirements
      if (rule.requiredSuit) {
        const hasSuit = cards.some(card => card.suit === rule.requiredSuit);
        if (!hasSuit) continue;
      }
      
      // Check rank requirements
      if (rule.requiredRank) {
        const hasRank = cards.some(card => card.rank === rule.requiredRank);
        if (!hasRank) continue;
      }
      
      // Check pattern requirements
      if (rule.patterns) {
        const patternResults = checkCardPatterns(cards, rule.patterns);
        if (!Object.values(patternResults).every(Boolean)) continue;
      }
      
      // Custom evaluation function
      if (rule.evaluationFn && typeof rule.evaluationFn === 'function') {
        isTriggered = rule.evaluationFn(cards, handEvaluation);
        if (!isTriggered) continue;
      } else {
        isTriggered = true;
      }
      
      // If all requirements are met, add the effect
      if (isTriggered) {
        const effect = { ...rule.effect };
        
        // Calculate magnitude if provided
        if (rule.magnitudeCalculation && typeof rule.magnitudeCalculation === 'function') {
          effect.magnitude = rule.magnitudeCalculation(cards, handEvaluation);
        }
        
        triggeredEffects.push(effect);
      }
    }
    
    return triggeredEffects;
  }
  
  /**
   * Get the spell power/strength based on card combination
   * 
   * @param {Array} cards - Cards in hand
   * @param {Object} options - Power calculation options
   * @returns {number} - Calculated spell power
   */
  export function calculateSpellPower(cards, options = {}) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return 0;
    }
    
    const {
      baseValue = 5,
      handTypeMultipliers = {},
      suitBonuses = {},
      rankBonuses = {},
      useFaceCardMultiplier = false,
      highCardBonus = false
    } = options;
    
    let power = baseValue;
    
    // Evaluate the hand
    const handEvaluation = evaluatePokerHand(cards);
    
    // Apply hand type multiplier
    if (handTypeMultipliers[handEvaluation.rank]) {
      power *= handTypeMultipliers[handEvaluation.rank];
    }
    
    // Apply suit bonuses
    const suits = cards.map(card => card.suit);
    for (const suit in suitBonuses) {
      const suitCount = suits.filter(s => s === suit).length;
      if (suitCount > 0) {
        power += suitBonuses[suit] * suitCount;
      }
    }
    
    // Apply rank bonuses
    const ranks = cards.map(card => card.rank);
    for (const rank in rankBonuses) {
      const rankCount = ranks.filter(r => r === rank).length;
      if (rankCount > 0) {
        power += rankBonuses[rank] * rankCount;
      }
    }
    
    // Face card multiplier
    if (useFaceCardMultiplier) {
      const faceCards = cards.filter(card => 
        card.rank === CARD_RANKS.JACK || 
        card.rank === CARD_RANKS.QUEEN || 
        card.rank === CARD_RANKS.KING
      );
      
      if (faceCards.length > 0) {
        power *= (1 + (faceCards.length * 0.1));
      }
    }
    
    // High card bonus
    if (highCardBonus) {
      const highCard = getHighCards(cards, 1)[0];
      power += (highCard.value / 2);
    }
    
    return Math.round(power);
  }
  
  /**
   * Determine spell damage based on card combination
   * 
   * @param {Array} cards - Cards in hand
   * @param {Object} options - Damage calculation options
   * @returns {Object} - Damage result
   */
  export function calculateSpellDamage(cards, options = {}) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return { damage: 0, diceNotation: '0' };
    }
    
    const {
      baseDamage = '1d6',
      handTypeMultipliers = {},
      suitDamageTypes = {}
    } = options;
    
    // Evaluate the hand
    const handEvaluation = evaluatePokerHand(cards);
    
    // Determine base dice from hand type
    let diceNotation = baseDamage;
    if (handTypeMultipliers[handEvaluation.rank]) {
      const multiplier = handTypeMultipliers[handEvaluation.rank];
      
      // Parse the base damage to modify it
      const baseDiceParts = baseDamage.match(/(\d+)d(\d+)(?:\+(\d+))?/);
      if (baseDiceParts) {
        const [_, diceCount, dieSides, modifier] = baseDiceParts;
        const newDiceCount = Math.max(1, Math.floor(parseInt(diceCount) * multiplier));
        diceNotation = `${newDiceCount}d${dieSides}${modifier ? '+' + modifier : ''}`;
      }
    }
    
    // Determine damage type from suits
    const suits = cards.map(card => card.suit);
    const suitCounts = suits.reduce((counts, suit) => {
      counts[suit] = (counts[suit] || 0) + 1;
      return counts;
    }, {});
    
    let dominantSuit = Object.keys(suitCounts).reduce((a, b) => 
      suitCounts[a] > suitCounts[b] ? a : b
    );
    
    const damageType = suitDamageTypes[dominantSuit] || 'physical';
    
    return {
      damage: diceNotation,
      damageType,
      handType: handEvaluation.rank,
      handValue: handEvaluation.value
    };
  }
  
  /**
   * Interpret a tarot card for magical effects
   * 
   * @param {Object} card - Tarot card
   * @param {boolean} isReversed - Whether the card is reversed
   * @returns {Object} - Interpretation result
   */
  export function interpretTarotCard(card, isReversed = false) {
    if (!card) {
      return null;
    }
    
    // For major arcana
    if (card.id !== undefined && !card.suit) {
      return {
        name: card.name,
        meaning: isReversed ? card.reversed : card.meaning,
        element: card.element,
        isReversed,
        effectType: isReversed ? 'negative' : 'positive',
        magicalDomain: card.element,
        power: (card.id + 1) * (isReversed ? 0.7 : 1)
      };
    }
    
    // For minor arcana
    const properties = TAROT_SUIT_PROPERTIES[card.suit] || {};
    
    // Determine meaning based on rank and whether reversed
    let meaning = '';
    let effectType = isReversed ? 'negative' : 'positive';
    let power = card.value * (isReversed ? 0.7 : 1);
    
    // Simplified meaning determination
    if (card.rank === TAROT_RANKS.ACE) {
      meaning = isReversed ? 'Blocked potential' : 'New beginnings';
    } else if (card.rank === TAROT_RANKS.PAGE) {
      meaning = isReversed ? 'Immaturity' : 'Learning';
    } else if (card.rank === TAROT_RANKS.KNIGHT) {
      meaning = isReversed ? 'Recklessness' : 'Action';
    } else if (card.rank === TAROT_RANKS.QUEEN) {
      meaning = isReversed ? 'Dependence' : 'Nurturing';
    } else if (card.rank === TAROT_RANKS.KING) {
      meaning = isReversed ? 'Tyranny' : 'Mastery';
    } else {
      // Number cards
      const numericValue = parseInt(card.rank);
      if (numericValue >= 2 && numericValue <= 10) {
        meaning = isReversed ? 'Challenge' : 'Growth';
        effectType = isReversed ? 'negative' : 'positive';
      }
    }
    
    return {
      name: card.name,
      meaning,
      element: properties.element,
      quality: properties.quality,
      domain: properties.domain,
      isReversed,
      effectType,
      magicalDomain: properties.element,
      power
    };
  }
  
  /**
   * Interpret a tarot spread for spell effect determination
   * 
   * @param {Array} cards - Spread of tarot cards
   * @param {Array} positions - Positions in the spread
   * @param {Object} options - Interpretation options
   * @returns {Object} - Spread interpretation
   */
  export function interpretTarotSpread(cards, positions, options = {}) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return { interpretations: [] };
    }
    
    if (!positions || !Array.isArray(positions) || positions.length !== cards.length) {
      // Create default positions if not provided
      positions = cards.map((_, index) => ({
        name: `Position ${index + 1}`,
        meaning: `General influence ${index + 1}`
      }));
    }
    
    const {
      reversalProbability = 0.25,
      useFixedReversals = false,
      fixedReversals = []
    } = options;
    
    const interpretations = [];
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const position = positions[i];
      let isReversed;
      
      if (useFixedReversals && fixedReversals.length > i) {
        isReversed = fixedReversals[i];
      } else {
        isReversed = Math.random() < reversalProbability;
      }
      
      const cardInterpretation = interpretTarotCard(card, isReversed);
      
      interpretations.push({
        position,
        card,
        isReversed,
        interpretation: cardInterpretation,
        influence: getPositionalInfluence(position, cardInterpretation)
      });
    }
    
    // Calculate overall spread meaning
    const elements = interpretations.map(interp => interp.interpretation.element);
    const elementCounts = elements.reduce((counts, element) => {
      counts[element] = (counts[element] || 0) + 1;
      return counts;
    }, {});
    
    const dominantElement = Object.keys(elementCounts).reduce((a, b) => 
      elementCounts[a] > elementCounts[b] ? a : b
    );
    
    const positiveCount = interpretations.filter(
      interp => interp.interpretation.effectType === 'positive'
    ).length;
    
    const negativeCount = interpretations.length - positiveCount;
    const overallTone = positiveCount >= negativeCount ? 'positive' : 'negative';
    
    return {
      interpretations,
      dominantElement,
      overallTone,
      elementDistribution: elementCounts,
      totalPower: interpretations.reduce(
        (total, interp) => total + interp.interpretation.power, 0
      )
    };
  }
  
  /**
   * Get the influence of a card based on its position in a spread
   * 
   * @param {Object} position - Position in spread
   * @param {Object} cardInterpretation - Card interpretation
   * @returns {Object} - Position influence
   */
  function getPositionalInfluence(position, cardInterpretation) {
    return {
      domain: position.meaning,
      strength: cardInterpretation.power,
      aspect: cardInterpretation.effectType,
      element: cardInterpretation.element
    };
  }
  
  // =====================================================================
  // SPECIAL CARD MECHANICS
  // =====================================================================
  
  /**
   * Apply suit bonus effects to a spell
   * 
   * @param {Array} cards - Cards in hand
   * @param {Object} spell - Base spell
   * @param {Object} suitBonuses - Suit bonuses configuration
   * @returns {Object} - Enhanced spell
   */
  export function applySuitBonuses(cards, spell, suitBonuses) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return spell;
    }
    
    if (!suitBonuses) {
      return spell;
    }
    
    const enhancedSpell = { ...spell };
    
    // Count suits
    const suitCounts = cards.reduce((counts, card) => {
      if (card.suit) {
        counts[card.suit] = (counts[card.suit] || 0) + 1;
      }
      return counts;
    }, {});
    
    // Apply bonuses
    for (const suit in suitCounts) {
      const count = suitCounts[suit];
      
      if (suitBonuses[suit] && count > 0) {
        const bonus = suitBonuses[suit];
        
        // Apply power bonus
        if (bonus.powerBonus) {
          enhancedSpell.power = (enhancedSpell.power || 0) + bonus.powerBonus * count;
        }
        
        // Apply effect modifiers
        if (bonus.effects) {
          enhancedSpell.effects = [...(enhancedSpell.effects || []), ...bonus.effects];
        }
        
        // Apply damage bonus
        if (bonus.damageBonus && enhancedSpell.damage) {
          enhancedSpell.damageBonus = (enhancedSpell.damageBonus || 0) + bonus.damageBonus * count;
        }
        
        // Apply duration modifier
        if (bonus.durationModifier && enhancedSpell.duration) {
          enhancedSpell.duration *= (1 + bonus.durationModifier * count);
        }
      }
    }
    
    // Round any numeric values
    if (enhancedSpell.power) enhancedSpell.power = Math.round(enhancedSpell.power);
    if (enhancedSpell.damageBonus) enhancedSpell.damageBonus = Math.round(enhancedSpell.damageBonus);
    if (enhancedSpell.duration) enhancedSpell.duration = Math.round(enhancedSpell.duration);
    
    return enhancedSpell;
  }
  
  /**
   * Apply card combo (poker hand) bonuses to a spell
   * 
   * @param {Array} cards - Cards in hand
   * @param {Object} spell - Base spell
   * @param {Object} comboRules - Combo bonus configuration
   * @returns {Object} - Enhanced spell
   */
  export function applyCardComboBonuses(cards, spell, comboRules) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return spell;
    }
    
    if (!comboRules) {
      return spell;
    }
    
    const enhancedSpell = { ...spell };
    
    // Evaluate the hand
    const handEvaluation = evaluatePokerHand(cards);
    
    // Apply combo bonuses
    if (comboRules[handEvaluation.rank]) {
      const comboBonus = comboRules[handEvaluation.rank];
      
      // Apply power multiplier
      if (comboBonus.powerMultiplier) {
        enhancedSpell.power = (enhancedSpell.power || 0) * comboBonus.powerMultiplier;
      }
      
      // Apply additional effects
      if (comboBonus.additionalEffects) {
        enhancedSpell.effects = [...(enhancedSpell.effects || []), ...comboBonus.additionalEffects];
      }
      
      // Apply special rules
      if (comboBonus.special) {
        enhancedSpell.special = [...(enhancedSpell.special || []), comboBonus.special];
      }
    }
    
    // Round any numeric values
    if (enhancedSpell.power) enhancedSpell.power = Math.round(enhancedSpell.power);
    
    return enhancedSpell;
  }
  
  /**
   * Calculate Fate Weaver card synergies
   * 
   * @param {Array} cards - Cards in hand
   * @returns {Object} - Synergy results
   */
  export function calculateCardSynergies(cards) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return { synergy: 0, patterns: [] };
    }
    
    const patterns = [];
    let synergyScore = 0;
    
    // Check element synergies
    const elements = cards.map(card => {
      if (card.element) return card.element;
      
      // For standard cards, map suits to elements
      if (card.suit) {
        if (card.suit === CARD_SUITS.HEARTS) return 'water';
        if (card.suit === CARD_SUITS.DIAMONDS) return 'fire';
        if (card.suit === CARD_SUITS.CLUBS) return 'earth';
        if (card.suit === CARD_SUITS.SPADES) return 'air';
      }
      
      return null;
    }).filter(Boolean);
    
    // Count elements
    const elementCounts = elements.reduce((counts, element) => {
      counts[element] = (counts[element] || 0) + 1;
      return counts;
    }, {});
    
    // Check for dominant element
    const maxElementCount = Math.max(...Object.values(elementCounts));
    if (maxElementCount >= 3) {
      const dominantElement = Object.keys(elementCounts).find(
        key => elementCounts[key] === maxElementCount
      );
      
      patterns.push({
        type: 'elementalHarmony',
        element: dominantElement,
        count: maxElementCount,
        bonus: maxElementCount * 5
      });
      
      synergyScore += maxElementCount * 5;
    }
    
    // Check for numerical sequences
    const numericCards = cards.filter(card => !isNaN(parseInt(card.rank))).map(
      card => parseInt(card.rank)
    ).sort((a, b) => a - b);
    
    if (numericCards.length >= 3) {
      let maxSequence = 1;
      let currentSequence = 1;
      
      for (let i = 1; i < numericCards.length; i++) {
        if (numericCards[i] === numericCards[i - 1] + 1) {
          currentSequence++;
          maxSequence = Math.max(maxSequence, currentSequence);
        } else if (numericCards[i] !== numericCards[i - 1]) {
          currentSequence = 1;
        }
      }
      
      if (maxSequence >= 3) {
        patterns.push({
          type: 'numericalSequence',
          length: maxSequence,
          bonus: maxSequence * 3
        });
        
        synergyScore += maxSequence * 3;
      }
    }
    
    // Check for face card synergies
    const faceCards = cards.filter(card => 
      card.rank === CARD_RANKS.JACK || 
      card.rank === CARD_RANKS.QUEEN || 
      card.rank === CARD_RANKS.KING
    );
    
    if (faceCards.length > 0) {
      patterns.push({
        type: 'courtInfluence',
        count: faceCards.length,
        bonus: faceCards.length * 4
      });
      
      synergyScore += faceCards.length * 4;
    }
    
    // Check for balance (equal distribution across suits)
    const suits = cards.map(card => card.suit).filter(Boolean);
    const suitCounts = suits.reduce((counts, suit) => {
      counts[suit] = (counts[suit] || 0) + 1;
      return counts;
    }, {});
    
    const uniqueSuits = Object.keys(suitCounts).length;
    if (uniqueSuits >= 3) {
      patterns.push({
        type: 'elementalBalance',
        suits: uniqueSuits,
        bonus: uniqueSuits * 4
      });
      
      synergyScore += uniqueSuits * 4;
    }
    
    return {
      synergy: synergyScore,
      patterns
    };
  }
  
  /**
   * Create a card effect profile for a spell
   * 
   * @param {Array} cards - Cards used
   * @param {Object} options - Configuration options
   * @returns {Object} - Effect profile
   */
  export function createCardEffectProfile(cards, options = {}) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return {
        power: 0,
        elements: [],
        aspects: [],
        effects: []
      };
    }
    
    const {
      basePower = 10,
      suitBonuses = {},
      rankMultipliers = {},
      comboRules = {},
      elementAffinities = {}
    } = options;
    
    // Calculate base values
    let power = basePower;
    const elements = [];
    const aspects = [];
    const effects = [];
    
    // Evaluate hand for combos
    const handEvaluation = evaluatePokerHand(cards);
    const handType = handEvaluation.rank;
    
    // Apply combo bonuses
    if (comboRules[handType]) {
      const combo = comboRules[handType];
      power *= combo.powerMultiplier || 1;
      
      if (combo.elements) {
        elements.push(...combo.elements);
      }
      
      if (combo.aspects) {
        aspects.push(...combo.aspects);
      }
      
      if (combo.effects) {
        effects.push(...combo.effects);
      }
    }
    
    // Apply suit bonuses
    for (const card of cards) {
      if (card.suit && suitBonuses[card.suit]) {
        const bonus = suitBonuses[card.suit];
        power += bonus.powerBonus || 0;
        
        if (bonus.element && !elements.includes(bonus.element)) {
          elements.push(bonus.element);
        }
        
        if (bonus.aspect && !aspects.includes(bonus.aspect)) {
          aspects.push(bonus.aspect);
        }
        
        if (bonus.effect && !effects.includes(bonus.effect)) {
          effects.push(bonus.effect);
        }
      }
      
      // Apply rank multipliers
      if (card.rank && rankMultipliers[card.rank]) {
        power *= rankMultipliers[card.rank];
      }
      
      // Add card elements
      if (card.element && !elements.includes(card.element)) {
        elements.push(card.element);
      }
    }
    
    // Calculate synergies
    const synergies = calculateCardSynergies(cards);
    power += synergies.synergy;
    
    // Apply element affinities
    if (elements.length > 0 && elementAffinities) {
      for (const element of elements) {
        if (elementAffinities[element]) {
          power *= elementAffinities[element];
        }
      }
    }
    
    // Round power to nearest integer
    power = Math.round(power);
    
    return {
      power,
      elements,
      aspects,
      effects,
      synergies: synergies.patterns,
      handType,
      cardCount: cards.length
    };
  }
  
  // =====================================================================
  // CARD PROBABILITY UTILITIES
  // =====================================================================
  
  /**
   * Calculate probability of drawing specific cards in sequence
   * 
   * @param {Object} params - Calculation parameters
   * @returns {Object} - Probability result
   */
  export function calculateSequentialDrawProbability(params = {}) {
    const {
      deckType = DECK_TYPES.STANDARD,
      criteria = [], // Array of card criteria to match in sequence
      drawWithReplacement = false,
      drawCount = null // If different from criteria length
    } = params;
    
    const deck = createDeck(deckType);
    const effectiveDrawCount = drawCount || criteria.length;
    
    if (criteria.length === 0) {
      return {
        probability: 1,
        percentage: 100,
        odds: '1 to 1',
        description: 'No criteria specified'
      };
    }
    
    // For each draw, calculate how many cards match the criteria
    let sequentialProbability = 1;
    let remainingDeck = [...deck];
    
    for (let i = 0; i < effectiveDrawCount; i++) {
      const criteriaIndex = i % criteria.length;
      const currentCriteria = criteria[criteriaIndex];
      
      // Count matching cards
      let matchingCards = 0;
      
      if (currentCriteria) {
        matchingCards = remainingDeck.filter(card => {
          for (const [key, value] of Object.entries(currentCriteria)) {
            if (card[key] !== value) return false;
          }
          return true;
        }).length;
      } else {
        matchingCards = remainingDeck.length; // Any card matches
      }
      
      // Calculate probability for this draw
      const drawProbability = matchingCards / remainingDeck.length;
      sequentialProbability *= drawProbability;
      
      // Remove a card if drawing without replacement
      if (!drawWithReplacement && remainingDeck.length > 1) {
        remainingDeck.pop(); // Simulate removing a card
      }
    }
    
    return {
      probability: sequentialProbability,
      percentage: sequentialProbability * 100,
      odds: sequentialProbability > 0 
        ? `1 in ${Math.round(1 / sequentialProbability)}` 
        : 'impossible',
      description: `Drawing ${effectiveDrawCount} cards matching the criteria`
    };
  }
  
  /**
   * Calculate probability of specific poker hands
   * 
   * @param {string} handType - Type of hand (from HAND_RANKINGS)
   * @param {Object} options - Additional options
   * @returns {Object} - Probability result
   */
  export function calculatePokerHandProbability(handType, options = {}) {
    const {
      deckType = DECK_TYPES.STANDARD,
      drawCount = 5,
      exactHandType = true // If false, calculate probability of this hand or better
    } = options;
    
    // Standard probabilities for 5-card poker hands
    const standardProbabilities = {
      [HAND_RANKINGS.ROYAL_FLUSH]: 0.000154,
      [HAND_RANKINGS.STRAIGHT_FLUSH]: 0.00139,
      [HAND_RANKINGS.FOUR_OF_A_KIND]: 0.0240,
      [HAND_RANKINGS.FULL_HOUSE]: 0.1441,
      [HAND_RANKINGS.FLUSH]: 0.1965,
      [HAND_RANKINGS.STRAIGHT]: 0.3925,
      [HAND_RANKINGS.THREE_OF_A_KIND]: 2.1128,
      [HAND_RANKINGS.TWO_PAIR]: 4.7539,
      [HAND_RANKINGS.ONE_PAIR]: 42.2569,
      [HAND_RANKINGS.HIGH_CARD]: 50.1177
    };
    
    // If not standard 5-card draw, return approximate values
    if (drawCount !== 5 || deckType !== DECK_TYPES.STANDARD) {
      return {
        probability: standardProbabilities[handType] / 100 || 0,
        percentage: standardProbabilities[handType] || 0,
        odds: `${Math.round(100 / (standardProbabilities[handType] || 0.001))} to 1`,
        description: `Approximate probability for ${handType} with ${drawCount} cards`
      };
    }
    
    // For exact hand type, return the standard probability
    if (exactHandType) {
      return {
        probability: standardProbabilities[handType] / 100,
        percentage: standardProbabilities[handType],
        odds: `${Math.round(100 / (standardProbabilities[handType] || 0.001))} to 1`,
        description: `Probability of exactly ${handType}`
      };
    }
    
    // For "this hand or better", calculate cumulative probability
    const handRankings = Object.values(HAND_RANKINGS);
    const handIndex = handRankings.indexOf(handType);
    
    if (handIndex === -1) {
      return {
        probability: 0,
        percentage: 0,
        odds: 'impossible',
        description: `Unknown hand type: ${handType}`
      };
    }
    
    let cumulativeProbability = 0;
    for (let i = 0; i <= handIndex; i++) {
      cumulativeProbability += standardProbabilities[handRankings[i]] || 0;
    }
    
    return {
      probability: cumulativeProbability / 100,
      percentage: cumulativeProbability,
      odds: `${Math.round(100 / cumulativeProbability)} to 1`,
      description: `Probability of ${handType} or better`
    };
  }
  
  /**
   * Calculate probability of drawing at least N matching cards
   * 
   * @param {Object} criteria - Card matching criteria
   * @param {number} minimumMatches - Minimum number of matches
   * @param {Object} options - Additional options
   * @returns {Object} - Probability result
   */
  export function calculateMatchingCardsProbability(criteria, minimumMatches, options = {}) {
    const {
      deckType = DECK_TYPES.STANDARD,
      drawCount = 5
    } = options;
    
    const deck = createDeck(deckType);
    
    // Count matching cards in the deck
    const matchingCards = deck.filter(card => {
      for (const [key, value] of Object.entries(criteria)) {
        if (card[key] !== value) return false;
      }
      return true;
    }).length;
    
    const nonMatchingCards = deck.length - matchingCards;
    
    if (matchingCards < minimumMatches) {
      return {
        probability: 0,
        percentage: 0,
        odds: 'impossible',
        description: `Not enough matching cards in the deck (${matchingCards} found, ${minimumMatches} required)`
      };
    }
    
    if (minimumMatches > drawCount) {
      return {
        probability: 0,
        percentage: 0,
        odds: 'impossible',
        description: `Cannot draw ${minimumMatches} matches when only drawing ${drawCount} cards`
      };
    }
    
    // Calculate using hypergeometric distribution
    // P(X ≥ k) = 1 - sum(P(X = i) for i from 0 to k-1)
    let probability = 0;
    
    for (let i = minimumMatches; i <= Math.min(drawCount, matchingCards); i++) {
      // Probability of exactly i matches = C(matchingCards, i) * C(nonMatchingCards, drawCount - i) / C(deck.length, drawCount)
      const exactProbability = (
        combination(matchingCards, i) * 
        combination(nonMatchingCards, drawCount - i)
      ) / combination(deck.length, drawCount);
      
      probability += exactProbability;
    }
    
    return {
      probability,
      percentage: probability * 100,
      odds: probability > 0 
        ? `${Math.round(probability * 100) / 100} to ${Math.round((1 - probability) * 100) / 100}` 
        : 'impossible',
      description: `Drawing at least ${minimumMatches} cards matching the criteria out of ${drawCount} cards`
    };
  }
  
  /**
   * Calculate combination (n choose k)
   * 
   * @param {number} n - Total number of items
   * @param {number} k - Number of items to choose
   * @returns {number} - Number of combinations
   */
  function combination(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n - (k - i));
      result /= i;
    }
    
    return result;
  }
  
  // =====================================================================
  // EXPORT UTILITY FUNCTIONS
  // =====================================================================
  
  /**
   * Create a card system with custom configuration
   * 
   * @param {Object} config - Card system configuration
   * @returns {Object} - Card system object
   */
  export function createCardSystem(config = {}) {
    const {
      defaultDeckType = DECK_TYPES.STANDARD,
      includeJokers = false,
      customSuitBonuses = {},
      customComboRules = {},
      useAdvancedProbabilities = false
    } = config;
    
    return {
      // Deck management
      createDeck: (type = defaultDeckType, options = {}) => createDeck(type, options),
      shuffleDeck,
      drawCards,
      dealHands,
      
      // Hand evaluation
      evaluateHand: evaluatePokerHand,
      compareHands: comparePokerHands,
      checkPatterns: checkCardPatterns,
      
      // Spell effects
      determineEffects: (cards, rules) => determineSpellEffects(cards, rules),
      calculateSpellPower: (cards, options) => calculateSpellPower(cards, {
        ...options,
        suitBonuses: customSuitBonuses
      }),
      calculateSpellDamage,
      
      // Special mechanics
      applySuitBonuses: (cards, spell) => applySuitBonuses(cards, spell, customSuitBonuses),
      applyCardCombos: (cards, spell) => applyCardComboBonuses(cards, spell, customComboRules),
      calculateSynergies: calculateCardSynergies,
      createEffectProfile: createCardEffectProfile,
      
      // Tarot mechanics
      interpretTarotCard,
      interpretTarotSpread,
      
      // Probability calculations
      calculateProbability: useAdvancedProbabilities 
        ? calculateCardProbability 
        : (params) => ({
            probability: 0.5,
            percentage: 50,
            odds: '1 to 1',
            description: 'Basic probability calculation'
          })
    };
  }