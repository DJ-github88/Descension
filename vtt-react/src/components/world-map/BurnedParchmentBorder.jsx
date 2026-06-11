import React from 'react';
import './BurnedParchmentBorder.css';

const BurnedParchmentBorder = ({ visible }) => (
  <div className={`burned-parchment-border ${visible ? 'visible' : ''}`}>
    {/* SVG Turbulence Filter to distort the edges into organic torn/burnt shapes */}
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} width="0" height="0">
      <defs>
        <filter id="burned-parchment-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div className="burned-parchment-edge-container"></div>
    <div className="ember-glow ember-glow-tl"></div>
    <div className="ember-glow ember-glow-tr"></div>
    <div className="ember-glow ember-glow-bl"></div>
    <div className="ember-glow ember-glow-br"></div>
  </div>
);

export default BurnedParchmentBorder;
