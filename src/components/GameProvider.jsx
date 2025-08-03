import React from 'react';

const GameProvider = ({ children }) => {
  return (
    <div className="game-provider">
      {children}
    </div>
  );
};

export default GameProvider;
