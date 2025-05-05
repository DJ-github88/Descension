import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import '../../styles/base.css';
import '../../styles/components.css';

const VisualCardSelector = ({ onCardSelected }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  
  // Cards data
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  // State for selected cards and current suit tab
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedSuit, setSelectedSuit] = useState('hearts');
  
  // Card value mapping (for formula calculation)
  const cardValues = {
    'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, 
    '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10
  };
  
  // Get suit symbol
  const getSuitSymbol = (suit) => {
    switch(suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };
  
  // Get suit color
  const getSuitColor = (suit) => {
    return (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
  };
  
  // Handle card selection
  const toggleCardSelection = (suit, rank) => {
    const cardId = `${rank}_of_${suit}`;
    const isSelected = selectedCards.some(card => card.id === cardId);
    
    let newSelectedCards;
    if (isSelected) {
      // Deselect card
      newSelectedCards = selectedCards.filter(card => card.id !== cardId);
    } else {
      // Select card
      newSelectedCards = [...selectedCards, { 
        id: cardId, 
        suit, 
        rank, 
        value: cardValues[rank] 
      }];
    }
    
    setSelectedCards(newSelectedCards);
    
    // Calculate total value for formula
    const totalValue = newSelectedCards.reduce((sum, card) => sum + card.value, 0);
    const faceCardCount = newSelectedCards.filter(card => ['J', 'Q', 'K'].includes(card.rank)).length;
    const suitCounts = {};
    newSelectedCards.forEach(card => {
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });
    
    // Find max number of cards of the same suit
    const maxSuitCount = Math.max(...Object.values(suitCounts).concat(0));
    
    // Call the callback with detailed card data
    if (onCardSelected) {
      onCardSelected({
        cards: newSelectedCards,
        totalValue,
        count: newSelectedCards.length,
        faceCardCount,
        sameSuitCount: maxSuitCount
      });
    }
  };
  
  // Check if a card is selected
  const isCardSelected = (suit, rank) => {
    const cardId = `${rank}_of_${suit}`;
    return selectedCards.some(card => card.id === cardId);
  };
  
  // Render tabs for card suits
  const renderSuitTabs = () => {
    return (
      <div className="card-suit-tabs">
        {suits.map(suit => (
          <div 
            key={suit}
            className={`card-suit-tab ${selectedSuit === suit ? 'active' : ''} ${getSuitColor(suit)}`}
            onClick={() => setSelectedSuit(suit)}
          >
            <span className="suit-symbol">{getSuitSymbol(suit)}</span>
            <span className="suit-name">{suit.charAt(0).toUpperCase() + suit.slice(1)}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Render cards for the selected suit
  const renderSuitCards = () => {
    return (
      <div className="cards-grid">
        {ranks.map(rank => {
          const cardId = `${rank}_of_${selectedSuit}`;
          const isSelected = isCardSelected(selectedSuit, rank);
          
          return (
            <div 
              key={cardId} 
              className={`card-item ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleCardSelection(selectedSuit, rank)}
            >
              <div className="card-content" style={{ color: getSuitColor(selectedSuit) }}>
                <div className="card-rank">{rank}</div>
                <div className="card-suit-symbol">{getSuitSymbol(selectedSuit)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render selected cards summary
  const renderSelectedCards = () => {
    if (selectedCards.length === 0) {
      return <div className="no-cards-selected">No cards selected</div>;
    }
    
    return (
      <div className="selected-cards-summary">
        <h5>Selected Cards ({selectedCards.length})</h5>
        <div className="selected-cards-list">
          {selectedCards.map(card => (
            <div key={card.id} className="selected-card-item" style={{ color: getSuitColor(card.suit) }}>
              {card.rank} {getSuitSymbol(card.suit)}
            </div>
          ))}
        </div>
        <div className="selected-cards-stats">
          <div>Total Value: {selectedCards.reduce((sum, card) => sum + card.value, 0)}</div>
          <div>Face Cards: {selectedCards.filter(card => ['J', 'Q', 'K'].includes(card.rank)).length}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="visual-card-selector">
      <h4>Select Cards</h4>
      {renderSuitTabs()}
      {renderSuitCards()}
      {renderSelectedCards()}
    </div>
  );
};

export default VisualCardSelector;
