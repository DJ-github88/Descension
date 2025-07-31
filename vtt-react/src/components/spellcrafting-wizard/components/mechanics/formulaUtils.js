export const createDefaultFormula = (resolutionSystem) => {
  switch (resolutionSystem) {
    case 'dice': return '1d6 + modifier';
    case 'coins': return 'heads: 2, tails: 1';
    case 'cards': return 'cardValue * multiplier';
    default: return '1d6 + modifier';
  }
};

export const createDefaultDotFormula = (resolutionSystem) => {
  switch (resolutionSystem) {
    case 'dice': return '1d4 per round for 3 rounds';
    case 'coins': return 'tails: 1 damage per round for 3 rounds';
    case 'cards': return 'cardValue damage per round for 3 rounds';
    default: return '1d4 per round for 3 rounds';
  }
};
