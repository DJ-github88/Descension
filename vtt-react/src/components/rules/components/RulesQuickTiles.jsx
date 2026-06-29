import React from 'react';

const RulesQuickTiles = ({ tiles }) => {
  if (!tiles || tiles.length === 0) return null;

  return (
    <div className="rules-quick-tiles">
      {tiles.map((tile, idx) => (
        <div key={idx} className="rules-quick-tile">
          {tile.icon && <div className="rules-quick-tile-icon"><i className={tile.icon} /></div>}
          <div className="rules-quick-tile-label">{tile.label}</div>
          <div className="rules-quick-tile-value">{tile.value}</div>
        </div>
      ))}
    </div>
  );
};

export default RulesQuickTiles;
