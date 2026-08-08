import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('Immersion Transition System', () => {
  it('renders the Atlas Transition Gateway with celestial astrolabe compass and title', () => {
    const { container } = render(
      <div className="atlas-transition-gateway">
        <div className="atlas-gateway-backdrop" />
        <div className="atlas-gateway-vignette" />
        <div className="atlas-gateway-content">
          <div className="atlas-gateway-astrolabe">
            <div className="astrolabe-ring outer" />
            <div className="astrolabe-ring middle" />
            <div className="astrolabe-ring inner" />
            <div className="astrolabe-compass-rose">
              <span className="cardinal-point north">N</span>
              <span className="cardinal-point east">E</span>
              <span className="cardinal-point south">S</span>
              <span className="cardinal-point west">W</span>
              <i className="fas fa-dragon astrolabe-dragon-core" />
            </div>
          </div>
          <h1 className="atlas-gateway-title">THE ATLAS OF MYTHRIL</h1>
          <p className="atlas-gateway-subtitle">Unfolding ancient cartography &amp; uncharted realms...</p>
          <div className="atlas-gateway-rune-bar">
            <span className="rune-label">Aperio Mundum</span>
          </div>
        </div>
      </div>
    );

    expect(screen.getByText('THE ATLAS OF MYTHRIL')).toBeInTheDocument();
    expect(screen.getByText('Aperio Mundum')).toBeInTheDocument();
    expect(screen.getByText(/Unfolding ancient cartography/i)).toBeInTheDocument();
    expect(container.querySelector('.astrolabe-compass-rose')).toBeInTheDocument();
  });
});
