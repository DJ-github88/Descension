import React, { useState, useEffect } from 'react';
import './BerserkerResourceBar.css';

const BerserkerResourceBar = ({ rage, maxRage = 100, isOverheat = false, rageState }) => {
  const [displayRage, setDisplayRage] = useState(rage);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (rage !== displayRage) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayRage(rage);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [rage, displayRage]);

  const getRageStateInfo = (currentRage) => {
    if (currentRage >= 101) return { name: 'Obliteration', color: '#8B0000', glow: 'intense' };
    if (currentRage >= 81) return { name: 'Cataclysm', color: '#DC143C', glow: 'strong' };
    if (currentRage >= 61) return { name: 'Carnage', color: '#FF4500', glow: 'moderate' };
    if (currentRage >= 41) return { name: 'Primal', color: '#FF6347', glow: 'moderate' };
    if (currentRage >= 21) return { name: 'Frenzied', color: '#FFA500', glow: 'light' };
    return { name: 'Smoldering', color: '#8B4513', glow: 'none' };
  };

  const rageStateInfo = getRageStateInfo(displayRage);
  const ragePercentage = Math.min((displayRage / maxRage) * 100, 100);

  // Convert rage to two d10s for display
  const tensDie = Math.floor(displayRage / 10);
  const onesDie = displayRage % 10;

  return (
    <div className={`berserker-resource-bar ${isOverheat ? 'overheat' : ''}`}>
      <div className="rage-state-header">
        <span className="rage-state-name" style={{ color: rageStateInfo.color }}>
          {rageStateInfo.name}
        </span>
        <span className="rage-amount">{displayRage}/100</span>
      </div>

      <div className="rage-dice-container">
        <div className={`rage-die tens ${isAnimating ? 'animating' : ''}`}>
          <span className="die-value">{tensDie}</span>
          <span className="die-label">Tens</span>
        </div>
        <div className={`rage-die ones ${isAnimating ? 'animating' : ''}`}>
          <span className="die-value">{onesDie}</span>
          <span className="die-label">Ones</span>
        </div>
      </div>

      <div className="rage-bar-container">
        <div
          className={`rage-bar-fill ${rageStateInfo.glow}`}
          style={{
            width: `${ragePercentage}%`,
            backgroundColor: rageStateInfo.color,
            boxShadow: rageStateInfo.glow !== 'none' ? `0 0 10px ${rageStateInfo.color}` : 'none'
          }}
        />
        <div className="rage-bar-background" />

        {/* Rage State Threshold Markers */}
        <div className="rage-threshold" style={{ left: '20%' }} title="Frenzied (21)" />
        <div className="rage-threshold" style={{ left: '40%' }} title="Primal (41)" />
        <div className="rage-threshold" style={{ left: '60%' }} title="Carnage (61)" />
        <div className="rage-threshold" style={{ left: '80%' }} title="Cataclysm (81)" />
        <div className="rage-threshold danger" style={{ left: '100%' }} title="Obliteration (101+)" />
      </div>

      {isOverheat && (
        <div className="overheat-warning">
          ⚠️ OVERHEAT IMMINENT - Spend Rage or take 2d6 damage!
        </div>
      )}
    </div>
  );
};

export default BerserkerResourceBar;
