import React, { useState, useRef, useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import './CardDrawSystem.css';

const CardDrawSystem = () => {
  const [drawCount, setDrawCount] = useState(1);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameMode, setGameMode] = useState('all'); // 'all', 'blackjack', 'poker', 'pairs', 'threeKind', 'flush', 'straight'
  const containerRef = useRef(null);
  const { addNotification } = useChatStore();
  const characterName = useCharacterStore((state) => state.name);

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Create a full deck
  const createDeck = () => {
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank, id: `${suit}-${rank}-${Math.random()}` });
      }
    }
    return deck;
  };

  // Shuffle deck
  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Draw cards
  const handleDraw = () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    const deck = shuffleDeck(createDeck());
    const cardsToDraw = deck.slice(0, Math.min(drawCount, 52)); // Max 52 cards (full deck)
    
    // Clear previous cards
    setDrawnCards([]);
    setRevealedCards(new Set());
    
    // Animate cards appearing one by one
    cardsToDraw.forEach((card, index) => {
      setTimeout(() => {
        setDrawnCards(prev => [...prev, card]);
      }, index * 150); // Stagger the appearance
    });
    
    setTimeout(() => {
      setIsDrawing(false);
      
      // Add notification to combat tab
      const cardStrings = cardsToDraw.map(card => {
        // Use first letter of suit as abbreviation (H, D, C, S)
        const suitAbbr = card.suit.charAt(0).toUpperCase();
        return `${card.rank}${suitAbbr}`;
      }).join(', ');
      
      addNotification('combat', {
        type: 'card_draw',
        sender: characterName || 'Player',
        drawCount: cardsToDraw.length,
        cards: cardStrings,
        timestamp: new Date().toISOString()
      });
    }, cardsToDraw.length * 150);
  };

  // Reveal a card
  const handleRevealCard = (cardId) => {
    setRevealedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId); // Flip back
      } else {
        newSet.add(cardId); // Reveal
      }
      return newSet;
    });
  };

  // Clear all cards
  const handleClear = () => {
    setDrawnCards([]);
    setRevealedCards(new Set());
  };

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  // Get numeric value for blackjack (Ace can be 1 or 11)
  const getCardValue = (rank) => {
    if (rank === 'A') return 11; // Ace defaults to 11
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank) || 0;
  };

  // Calculate blackjack total
  const calculateBlackjackTotal = (cards) => {
    let total = 0;
    let aceCount = 0;
    
    cards.forEach(card => {
      if (card.rank === 'A') {
        aceCount++;
        total += 11;
      } else {
        total += getCardValue(card.rank);
      }
    });
    
    // Adjust aces down from 11 to 1 if needed to avoid bust
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    
    return { total, isSoft: aceCount > 0 && total <= 21 };
  };

  // Get poker hand rank for a set of cards
  const evaluatePokerHand = (cards) => {
    if (cards.length < 5) return null;
    
    // Get ranks and suits
    const ranks = cards.map(card => card.rank);
    const suits = cards.map(card => card.suit);
    
    // Count occurrences of each rank
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const isFlush = suits.every(suit => suit === suits[0]);
    
    // Check for straight
    const rankValues = ranks.map(rank => {
      if (rank === 'A') return 14;
      if (rank === 'K') return 13;
      if (rank === 'Q') return 12;
      if (rank === 'J') return 11;
      return parseInt(rank);
    }).sort((a, b) => a - b);
    
    let isStraight = false;
    // Check normal straight
    if (rankValues.length >= 5) {
      for (let i = 0; i <= rankValues.length - 5; i++) {
        const sequence = rankValues.slice(i, i + 5);
        let consecutive = true;
        for (let j = 1; j < sequence.length; j++) {
          if (sequence[j] !== sequence[j - 1] + 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) {
          isStraight = true;
          break;
        }
      }
      // Check A-2-3-4-5 straight (wheel)
      if (!isStraight && rankValues.includes(14) && rankValues.includes(2) && 
          rankValues.includes(3) && rankValues.includes(4) && rankValues.includes(5)) {
        isStraight = true;
      }
    }
    
    // Helper to get rank name from value
    const getRankName = (value) => {
      if (value === 14) return 'A';
      if (value === 13) return 'K';
      if (value === 12) return 'Q';
      if (value === 11) return 'J';
      return value.toString();
    };
    
    // Determine hand rank
    if (isStraight && isFlush) {
      // Check for royal flush (A-K-Q-J-10 of same suit)
      if (rankValues.includes(14) && rankValues.includes(13) && 
          rankValues.includes(12) && rankValues.includes(11) && rankValues.includes(10)) {
        return { name: 'Royal Flush', rank: 10, detail: 'A-K-Q-J-10' };
      }
      const highStraight = Math.max(...rankValues);
      return { name: 'Straight Flush', rank: 9, detail: `High card: ${getRankName(highStraight)}` };
    }
    
    if (counts[0] === 4) {
      const fourRank = Object.entries(rankCounts).find(([rank, count]) => count === 4)?.[0];
      return { name: 'Four of a Kind', rank: 8, detail: `Four ${fourRank}s` };
    }
    
    if (counts[0] === 3 && counts[1] === 2) {
      const threeRank = Object.entries(rankCounts).find(([rank, count]) => count === 3)?.[0];
      const pairRank = Object.entries(rankCounts).find(([rank, count]) => count === 2)?.[0];
      return { name: 'Full House', rank: 7, detail: `Three ${threeRank}s, Pair of ${pairRank}s` };
    }
    
    if (isFlush) {
      const highRank = Math.max(...rankValues);
      return { name: 'Flush', rank: 6, detail: `High card: ${getRankName(highRank)}` };
    }
    
    if (isStraight) {
      const highStraight = Math.max(...rankValues);
      return { name: 'Straight', rank: 5, detail: `High card: ${getRankName(highStraight)}` };
    }
    
    if (counts[0] === 3) {
      const threeRank = Object.entries(rankCounts).find(([rank, count]) => count === 3)?.[0];
      return { name: 'Three of a Kind', rank: 4, detail: `Three ${threeRank}s` };
    }
    
    if (counts[0] === 2 && counts[1] === 2) {
      const pairRanks = Object.entries(rankCounts)
        .filter(([rank, count]) => count === 2)
        .map(([rank]) => rank)
        .sort((a, b) => {
          const getValue = (r) => {
            if (r === 'A') return 14;
            if (r === 'K') return 13;
            if (r === 'Q') return 12;
            if (r === 'J') return 11;
            return parseInt(r);
          };
          return getValue(b) - getValue(a);
        });
      return { name: 'Two Pair', rank: 3, detail: `Pair of ${pairRanks[0]}s and ${pairRanks[1]}s` };
    }
    
    if (counts[0] === 2) {
      const pairRank = Object.entries(rankCounts).find(([rank, count]) => count === 2)?.[0];
      return { name: 'Pair', rank: 2, detail: `Pair of ${pairRank}s` };
    }
    
    // High Card - find the highest card
    const highCardValue = Math.max(...rankValues);
    const highCardRank = getRankName(highCardValue);
    return { name: 'High Card', rank: 1, detail: `High card: ${highCardRank}` };
  };

  // Get poker hand rank (find best 5-card hand if more than 5 cards)
  const getPokerHandRank = (cards) => {
    if (cards.length < 5) return null;
    
    // If exactly 5 cards, evaluate directly
    if (cards.length === 5) {
      return evaluatePokerHand(cards);
    }
    
    // If more than 5 cards, find the best 5-card combination
    // Generate all combinations of 5 cards
    let bestHand = null;
    
    const generateCombinations = (arr, k) => {
      if (k === 0) return [[]];
      if (arr.length < k) return [];
      
      const [first, ...rest] = arr;
      const withFirst = generateCombinations(rest, k - 1).map(comb => [first, ...comb]);
      const withoutFirst = generateCombinations(rest, k);
      
      return [...withFirst, ...withoutFirst];
    };
    
    const combinations = generateCombinations(cards, 5);
    
    for (const combination of combinations) {
      const hand = evaluatePokerHand(combination);
      if (hand && (!bestHand || hand.rank > bestHand.rank)) {
        bestHand = hand;
      }
    }
    
    return bestHand;
  };

  // Check for specific hand types
  const checkSpecificHand = (cards, handType) => {
    if (cards.length < 2) return null;
    
    const ranks = cards.map(card => card.rank);
    const suits = cards.map(card => card.suit);
    
    // Count occurrences of each rank
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const isFlush = suits.every(suit => suit === suits[0]);
    
    // Check for straight
    const rankValues = ranks.map(rank => {
      if (rank === 'A') return 14;
      if (rank === 'K') return 13;
      if (rank === 'Q') return 12;
      if (rank === 'J') return 11;
      return parseInt(rank);
    }).sort((a, b) => a - b);
    
    let isStraight = false;
    if (rankValues.length >= 5) {
      for (let i = 0; i <= rankValues.length - 5; i++) {
        const sequence = rankValues.slice(i, i + 5);
        let consecutive = true;
        for (let j = 1; j < sequence.length; j++) {
          if (sequence[j] !== sequence[j - 1] + 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) {
          isStraight = true;
          break;
        }
      }
      if (!isStraight && rankValues.includes(14) && rankValues.includes(2) && 
          rankValues.includes(3) && rankValues.includes(4) && rankValues.includes(5)) {
        isStraight = true;
      }
    }
    
    switch (handType) {
      case 'pairs':
        if (counts[0] >= 2) {
          const pairCount = counts.filter(c => c >= 2).length;
          // Find which ranks have pairs
          const pairRanks = Object.entries(rankCounts)
            .filter(([rank, count]) => count >= 2)
            .map(([rank]) => rank)
            .sort((a, b) => {
              const getValue = (r) => {
                if (r === 'A') return 14;
                if (r === 'K') return 13;
                if (r === 'Q') return 12;
                if (r === 'J') return 11;
                return parseInt(r);
              };
              return getValue(b) - getValue(a);
            });
          
          // Get the actual cards that form pairs
          const pairCards = pairRanks.map(rank => {
            return cards.filter(card => card.rank === rank);
          }).flat();
          
          const pairNames = pairRanks.map(rank => {
            const suitSymbols = cards
              .filter(card => card.rank === rank)
              .map(card => getSuitSymbol(card.suit))
              .join('');
            return `${rank}${suitSymbols}`;
          }).join(', ');
          
          return { 
            name: pairCount === 1 ? 'Pair' : 'Two Pair', 
            found: true,
            cards: pairCards,
            detail: `Pair of ${pairRanks.length === 1 ? pairRanks[0] + 's' : pairRanks.join('s and ')}`
          };
        }
        return null;
      case 'threeKind':
        if (counts[0] >= 3) {
          // Find which rank has three of a kind
          const threeRank = Object.entries(rankCounts)
            .find(([rank, count]) => count >= 3)?.[0];
          
          if (threeRank) {
            const threeCards = cards.filter(card => card.rank === threeRank);
            const suitSymbols = threeCards.map(card => getSuitSymbol(card.suit)).join('');
            return { 
              name: 'Three of a Kind', 
              found: true,
              cards: threeCards,
              detail: `Three ${threeRank}s`
            };
          }
        }
        return null;
      case 'flush':
        if (isFlush && cards.length >= 5) {
          return { name: 'Flush', found: true };
        }
        return null;
      case 'straight':
        if (isStraight && cards.length >= 5) {
          return { name: 'Straight', found: true };
        }
        return null;
      default:
        return null;
    }
  };

  // Get result for displayed cards
  const getCardResult = () => {
    const revealedCardsList = drawnCards.filter(card => revealedCards.has(card.id));
    
    if (revealedCardsList.length === 0) return null;
    
    const results = [];
    
    // Show results based on game mode
    if (gameMode === 'all' || gameMode === 'blackjack') {
      const blackjack = calculateBlackjackTotal(revealedCardsList);
      if (blackjack.total === 21) {
        results.push({ type: 'blackjack', label: 'Blackjack!', value: 21, isSoft: blackjack.isSoft });
      } else if (blackjack.total > 21) {
        results.push({ type: 'blackjack', label: 'Bust', value: blackjack.total });
      } else {
        results.push({ 
          type: 'blackjack', 
          label: blackjack.isSoft ? 'Soft' : 'Hard', 
          value: blackjack.total,
          isSoft: blackjack.isSoft 
        });
      }
    }
    
    if (gameMode === 'all' || gameMode === 'poker') {
      // Poker hand result (only if 5+ cards)
      if (revealedCardsList.length >= 5) {
        const pokerHand = getPokerHandRank(revealedCardsList);
        if (pokerHand) {
          results.push({ 
            type: 'poker', 
            label: pokerHand.name, 
            rank: pokerHand.rank,
            detail: pokerHand.detail
          });
        }
      }
    }
    
    if (gameMode === 'pairs') {
      const hand = checkSpecificHand(revealedCardsList, 'pairs');
      if (hand) {
        results.push({ 
          type: 'specific', 
          label: hand.name, 
          found: true,
          detail: hand.detail,
          cards: hand.cards
        });
      }
    }
    
    if (gameMode === 'threeKind') {
      const hand = checkSpecificHand(revealedCardsList, 'threeKind');
      if (hand) {
        results.push({ 
          type: 'specific', 
          label: hand.name, 
          found: true,
          detail: hand.detail,
          cards: hand.cards
        });
      }
    }
    
    if (gameMode === 'flush') {
      const hand = checkSpecificHand(revealedCardsList, 'flush');
      if (hand) {
        results.push({ type: 'specific', label: hand.name, found: true });
      }
    }
    
    if (gameMode === 'straight') {
      const hand = checkSpecificHand(revealedCardsList, 'straight');
      if (hand) {
        results.push({ type: 'specific', label: hand.name, found: true });
      }
    }
    
    return results.length > 0 ? results : null;
  };

  const cardResults = getCardResult();

  return (
    <div className="card-draw-system">
      {/* Controls */}
      <div className="card-draw-controls">
        <div className="draw-count-control">
          <label>Cards to Draw:</label>
          <input
            type="number"
            min="1"
            max="52"
            value={drawCount}
            onChange={(e) => setDrawCount(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
            className="draw-count-input"
            disabled={isDrawing || drawnCards.length > 0}
          />
        </div>
        <div className="game-mode-control">
          <label>Game Mode:</label>
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            className="game-mode-select"
            disabled={isDrawing}
          >
            <option value="all">All Results</option>
            <option value="blackjack">Blackjack</option>
            <option value="poker">Poker Hands</option>
            <option value="pairs">Pairs</option>
            <option value="threeKind">Three of a Kind</option>
            <option value="flush">Flush</option>
            <option value="straight">Straight</option>
          </select>
        </div>
        <div className="draw-actions">
          {drawnCards.length === 0 ? (
            <button
              className="draw-button"
              onClick={handleDraw}
              disabled={isDrawing}
            >
              {isDrawing ? 'Drawing...' : `Draw ${drawCount} Card${drawCount > 1 ? 's' : ''}`}
            </button>
          ) : (
            <button
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Cards Display */}
      <div className="card-draw-area" ref={containerRef}>
        {drawnCards.length === 0 ? (
          <div className="card-draw-empty">
            <div className="card-back-preview"></div>
            <p>Click "Draw Cards" to begin</p>
          </div>
        ) : (
          <div className="drawn-cards-container">
            {drawnCards.map((card, index) => {
              const isRevealed = revealedCards.has(card.id);
              const suitColor = getSuitColor(card.suit);
              
              return (
                <div
                  key={card.id}
                  className={`card-wrapper ${isRevealed ? 'revealed' : ''}`}
                  style={{ '--card-index': index }}
                  onClick={() => handleRevealCard(card.id)}
                >
                  <div className="card-flip-container">
                    {/* Card Back */}
                    <div className={`card-side card-back ${isRevealed ? 'flipped' : ''}`}>
                      <div className="card-back-pattern"></div>
                    </div>
                    
                    {/* Card Front */}
                    <div className={`card-side card-front ${isRevealed ? 'flipped' : ''}`}>
                      <div className={`card-content ${suitColor}`}>
                        <div className="card-corner card-corner-top">
                          <div className="card-rank">{card.rank}</div>
                          <div className="card-suit">{getSuitSymbol(card.suit)}</div>
                        </div>
                        <div className="card-center">
                          {getSuitSymbol(card.suit)}
                        </div>
                        <div className="card-corner card-corner-bottom">
                          <div className="card-rank">{card.rank}</div>
                          <div className="card-suit">{getSuitSymbol(card.suit)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Result Display */}
      {cardResults && cardResults.length > 0 && (
        <div className="card-result-display">
          {cardResults.map((result, index) => (
            <div key={index} className={`card-result ${result.type} ${result.type === 'blackjack' && result.value === 21 ? 'blackjack-win' : ''} ${result.type === 'blackjack' && result.value > 21 ? 'bust' : ''} ${result.type === 'specific' && result.found ? 'found' : ''}`}>
              {result.type === 'blackjack' && (
                <div className="result-content">
                  <span className="result-label">{result.label}</span>
                  <span className="result-value">{result.value}</span>
                </div>
              )}
              {result.type === 'poker' && (
                <div className="result-content">
                  <span className="result-label">{result.label}</span>
                  {result.detail && (
                    <span className="result-detail">{result.detail}</span>
                  )}
                </div>
              )}
              {result.type === 'specific' && (
                <div className="result-content">
                  <span className="result-label">{result.label}</span>
                  {result.detail && (
                    <span className="result-detail">{result.detail}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {drawnCards.length > 0 && (
        <div className="card-draw-instructions">
          <p>Click any card to reveal it</p>
        </div>
      )}
    </div>
  );
};

export default CardDrawSystem;

