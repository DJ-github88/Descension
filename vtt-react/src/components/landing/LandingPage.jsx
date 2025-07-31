import React, { useState, useEffect } from 'react';
import './styles/LandingPage.css';

const LandingPage = ({ onEnterSinglePlayer, onEnterMultiplayer }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHomeSection = () => (
    <div className="landing-section">
      <div className="hero-section">
        <div className="hero-content">
          <div className="title-section">
            <h1 className="game-title">Mythrill</h1>
            <div className="title-ornament">
              <i className="fas fa-gem"></i>
              <span className="ornament-line"></span>
              <i className="fas fa-dragon"></i>
              <span className="ornament-line"></span>
              <i className="fas fa-gem"></i>
            </div>
          </div>

          <p className="game-subtitle">The Ultimate Fantasy TTRPG Experience</p>
          <p className="game-description">
            Embark on epic adventures in a world of magic, mystery, and endless possibilities.
            Create your character, join parties, and experience tabletop gaming like never before.
          </p>

          <div className="game-highlights">
            <div className="highlight-item">
              <i className="fas fa-dice-d20"></i>
              <span>27 Unique Classes</span>
            </div>
            <div className="highlight-item">
              <i className="fas fa-magic"></i>
              <span>Dynamic Spellcrafting</span>
            </div>
            <div className="highlight-item">
              <i className="fas fa-users"></i>
              <span>Real-time Multiplayer</span>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="primary-action-btn"
              onClick={onEnterSinglePlayer}
            >
              <i className="fas fa-user"></i>
              <span className="btn-text">
                <span className="btn-title">Single Player</span>
                <span className="btn-subtitle">Start your solo adventure</span>
              </span>
            </button>
            <button
              className="secondary-action-btn"
              onClick={onEnterMultiplayer}
            >
              <i className="fas fa-users"></i>
              <span className="btn-text">
                <span className="btn-title">Multiplayer</span>
                <span className="btn-subtitle">Join friends online</span>
              </span>
            </button>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="placeholder-image">
            <i className="fas fa-dragon"></i>
            <p>Epic Fantasy Artwork</p>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="quick-start-section">
        <h2>Getting Started is Easy</h2>
        <div className="quick-start-grid">
          <div className="start-step">
            <div className="step-number">1</div>
            <h3>Choose Your Mode</h3>
            <p>Start with Single Player to learn the basics, or jump into Multiplayer to adventure with friends</p>
          </div>
          <div className="start-step">
            <div className="step-number">2</div>
            <h3>Create Your Character</h3>
            <p>Choose from 27 unique classes and customize your hero's abilities</p>
          </div>
          <div className="start-step">
            <div className="step-number">3</div>
            <h3>Begin Your Adventure</h3>
            <p>Explore, craft spells, and engage in epic battles</p>
          </div>
        </div>
      </div>

      <div className="features-preview">
        <h2>Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-dice-d20"></i>
            <h3>Dynamic Combat</h3>
            <p>Tactical combat with advanced VTT system</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-magic"></i>
            <h3>Spell Crafting</h3>
            <p>Create and customize unique spells</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Real-time Multiplayer</h3>
            <p>Adventure with friends online</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameInfoSection = () => (
    <div className="landing-section">
      <div className="info-content">
        <h2>About Mythrill</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Game System</h3>
            <p>Mythrill uses a unique d20-based system with innovative mechanics for spellcrafting, character progression, and tactical combat.</p>
            <ul>
              <li>27 unique character classes</li>
              <li>10 races with subraces</li>
              <li>Dynamic spell creation system</li>
              <li>No traditional leveling - quest-based progression</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Setting & Lore</h3>
            <p>Enter a world where magic and technology intertwine, ancient mysteries await discovery, and heroes forge their own destinies.</p>
            <div className="placeholder-content">
              <p><em>Rich lore and world-building content coming soon...</em></p>
            </div>
          </div>
          
          <div className="info-card">
            <h3>Getting Started</h3>
            <p>New to Mythrill? Our comprehensive guides will help you create your first character and understand the game mechanics.</p>
            <div className="placeholder-content">
              <p><em>Tutorial and guide system in development...</em></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembershipSection = () => (
    <div className="landing-section">
      <div className="membership-content">
        <h2>Membership & Pricing</h2>
        <div className="pricing-grid">
          <div className="pricing-card free">
            <h3>Free Adventurer</h3>
            <div className="price">$0<span>/month</span></div>
            <ul>
              <li>Single-player mode</li>
              <li>Basic character creation</li>
              <li>Limited spell library</li>
              <li>Community forums access</li>
            </ul>
            <button className="pricing-btn">Current Plan</button>
          </div>
          
          <div className="pricing-card premium">
            <h3>Premium Hero</h3>
            <div className="price">$9.99<span>/month</span></div>
            <ul>
              <li>Full multiplayer access</li>
              <li>Advanced character options</li>
              <li>Complete spell library</li>
              <li>Custom character portraits</li>
              <li>Priority support</li>
            </ul>
            <button className="pricing-btn">Coming Soon</button>
          </div>
          
          <div className="pricing-card legendary">
            <h3>Legendary Master</h3>
            <div className="price">$19.99<span>/month</span></div>
            <ul>
              <li>Everything in Premium</li>
              <li>GM tools & campaign management</li>
              <li>Custom content creation</li>
              <li>Early access to new features</li>
              <li>Direct developer feedback</li>
            </ul>
            <button className="pricing-btn">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="landing-section">
      <div className="account-content">
        <h2>Account & Character Management</h2>
        <div className="account-grid">
          <div className="account-card">
            <h3>Create Account</h3>
            <p>Sign up for your Mythrill account to save characters, join campaigns, and connect with other players.</p>
            <div className="placeholder-form">
              <input type="email" placeholder="Email Address" disabled />
              <input type="password" placeholder="Password" disabled />
              <input type="password" placeholder="Confirm Password" disabled />
              <button className="form-btn" disabled>Account System Coming Soon</button>
            </div>
          </div>
          
          <div className="account-card">
            <h3>Character Creation</h3>
            <p>Build your perfect character with our comprehensive creation system.</p>
            <div className="placeholder-content">
              <div className="character-preview">
                <div className="char-portrait-placeholder">
                  <i className="fas fa-user-circle"></i>
                </div>
                <p><em>Advanced character creator in development...</em></p>
                <ul>
                  <li>Visual character builder</li>
                  <li>Background & personality tools</li>
                  <li>Equipment customization</li>
                  <li>Character art integration</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="account-card">
            <h3>My Characters</h3>
            <p>Manage your character roster and campaign participation.</p>
            <div className="placeholder-content">
              <p><em>Character management system coming soon...</em></p>
              <div className="char-list-placeholder">
                <div className="char-item">📜 Character saves & backups</div>
                <div className="char-item">🎭 Multiple character slots</div>
                <div className="char-item">📊 Character statistics</div>
                <div className="char-item">🏆 Achievement tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const navigation = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'game-info', label: 'Game Info', icon: 'fas fa-info-circle' },
    { id: 'membership', label: 'Membership', icon: 'fas fa-crown' },
    { id: 'account', label: 'Account', icon: 'fas fa-user-cog' }
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-gem"></i>
            <span>Mythrill</span>
          </div>
          
          <nav className="main-nav">
            {navigation.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <i className={item.icon}></i>
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="header-actions">
            <button className="login-btn">
              <i className="fas fa-sign-in-alt"></i>
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="landing-main">
        {activeSection === 'home' && renderHomeSection()}
        {activeSection === 'game-info' && renderGameInfoSection()}
        {activeSection === 'membership' && renderMembershipSection()}
        {activeSection === 'account' && renderAccountSection()}
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Mythrill</h4>
            <p>The ultimate fantasy TTRPG experience</p>
          </div>
          <div className="footer-section">
            <h4>Community</h4>
            <a href="#discord">Discord</a>
            <a href="#reddit">Reddit</a>
            <a href="#forums">Forums</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact Us</a>
            <a href="#feedback">Feedback</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Mythrill. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          title="Back to top"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </div>
  );
};

export default LandingPage;
