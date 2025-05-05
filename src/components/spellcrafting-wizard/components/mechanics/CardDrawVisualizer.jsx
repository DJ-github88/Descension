import React, { useState, useEffect } from 'react';
import '../../styles/CardDrawVisualizer.css';

const CardDrawVisualizer = ({ 
  onDraw, 
  critRule = 'face_cards',
  critSuit = 'hearts',
  drawCount = 1
}) => {
  const [cards, setCards] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
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
  
  const isFaceCard = (rank) => {
    return ['J', 'Q', 'K'].includes(rank);
  };
  
  const drawCards = () => {
    setDrawing(true);
    
    // Create a full deck
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    // Draw animation
    let currentDraw = 0;
    const drawInterval = setInterval(() => {
      if (currentDraw < drawCount) {
        setCards(prev => [...prev, deck[currentDraw]]);
        currentDraw++;
      } else {
        clearInterval(drawInterval);
        setDrawing(false);
        
        // Check if critical based on the rule
        const drawnCards = deck.slice(0, drawCount);
        let critical = false;
        
        switch (critRule) {
          case 'face_cards':
            critical = drawnCards.some(card => isFaceCard(card.rank));
            break;
          case 'aces':
            critical = drawnCards.some(card => card.rank === 'A');
            break;
          case 'specific_suit':
            critical = drawnCards.some(card => card.suit === critSuit);
            break;
          case 'red_cards':
            critical = drawnCards.some(card => getSuitColor(card.suit) === 'red');
            break;
          case 'black_cards':
            critical = drawnCards.some(card => getSuitColor(card.suit) === 'black');
            break;
          case 'pairs':
            const rankCounts = {};
            drawnCards.forEach(card => {
              rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
            });
            critical = Object.values(rankCounts).some(count => count >= 2);
            break;
          default:
            critical = false;
        }
        
        setIsCritical(critical);
        
        if (onDraw) {
          onDraw(drawnCards, critical);
        }
      }
    }, 300);
  };
  
  const resetDraw = () => {
    setCards([]);
    setIsCritical(false);
  };
  
  const getCriticalDescription = () => {
    switch (critRule) {
      case 'face_cards': return 'Face cards (J, Q, K) are critical';
      case 'aces': return 'Aces are critical';
      case 'specific_suit': return `${critSuit.charAt(0).toUpperCase() + critSuit.slice(1)} are critical`;
      case 'red_cards': return 'Red cards are critical';
      case 'black_cards': return 'Black cards are critical';
      case 'pairs': return 'Pairs are critical';
      default: return '';
    }
  };
  
  return (
    <div className={`card-draw-visualizer ${drawing ? 'drawing' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="card-draw-info">
        <div className="card-rule">{getCriticalDescription()}</div>
      </div>
      
      <div className="card-draw-area">
        {cards.length > 0 ? (
          <div className="drawn-cards">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className={`playing-card ${card.suit} ${isCritical && 
                  ((critRule === 'face_cards' && isFaceCard(card.rank)) ||
                   (critRule === 'aces' && card.rank === 'A') ||
                   (critRule === 'specific_suit' && card.suit === critSuit) ||
                   (critRule === 'red_cards' && getSuitColor(card.suit) === 'red') ||
                   (critRule === 'black_cards' && getSuitColor(card.suit) === 'black'))
                  ? 'highlight' : ''}`}
              >
                <div className="card-corner card-top-left">
                  <div className="card-rank">{card.rank}</div>
                  <div className="card-suit">{getSuitSymbol(card.suit)}</div>
                </div>
                <div className="card-center">
                  {getSuitSymbol(card.suit)}
                </div>
                <div className="card-corner card-bottom-right">
                  <div className="card-rank">{card.rank}</div>
                  <div className="card-suit">{getSuitSymbol(card.suit)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-placeholder">
            <div className="card-back"></div>
          </div>
        )}
      </div>
      
      <div className="card-draw-controls">
        {cards.length === 0 ? (
          <button 
            className="draw-button"
            onClick={drawCards}
            disabled={drawing}
          >
            Draw {drawCount > 1 ? `${drawCount} Cards` : 'a Card'}
          </button>
        ) : (
          <button 
            className="reset-button"
            onClick={resetDraw}
            disabled={drawing}
          >
            Reset
          </button>
        )}
      </div>
      
      {cards.length > 0 && (
        <div className="draw-status">
          {isCritical ? 'CRITICAL HIT!' : 'Normal hit'}
        </div>
      )}
    </div>
  );
};

export default CardDrawVisualizer;
