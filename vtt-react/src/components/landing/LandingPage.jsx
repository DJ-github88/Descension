import React, { useState, useEffect } from 'react';
import AuthModal from '../auth/AuthModal';
import './styles/LandingPage.css';

const LandingPage = ({ onEnterSinglePlayer, onEnterMultiplayer }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
              onClick={onEnterMultiplayer}
            >
              <i className="fas fa-users"></i>
              <span className="btn-text">
                <span className="btn-title">Play Online</span>
                <span className="btn-subtitle">Adventure with friends</span>
              </span>
            </button>
            <button
              className="secondary-action-btn"
              onClick={onEnterSinglePlayer}
            >
              <i className="fas fa-hammer"></i>
              <span className="btn-text">
                <span className="btn-title">World Builder</span>
                <span className="btn-subtitle">Create maps & creatures</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="quick-start-section">
        <h2>Getting Started is Easy</h2>
        <div className="quick-start-grid">
          <div className="start-step">
            <div className="step-number">1</div>
            <h3>Create Your Character</h3>
            <p>Choose from 27 unique classes and customize your hero's abilities - completely free!</p>
          </div>
          <div className="start-step">
            <div className="step-number">2</div>
            <h3>Join or Create a Room</h3>
            <p>Play with up to 2 friends for free, or upgrade for larger parties</p>
          </div>
          <div className="start-step">
            <div className="step-number">3</div>
            <h3>Adventure Together</h3>
            <p>Explore worlds, craft spells, and engage in epic multiplayer battles</p>
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
            <h3>Base Edition</h3>
            <div className="price">Free<span>/forever</span></div>
            <ul>
              <li>✓ Full character creation (27 classes)</li>
              <li>✓ World Builder mode</li>
              <li>✓ 2-player multiplayer rooms</li>
              <li>✓ Complete spell crafting system</li>
              <li>✓ Basic VTT features</li>
            </ul>
            <button className="pricing-btn">Current Plan</button>
          </div>

          <div className="pricing-card premium">
            <h3>Party Edition</h3>
            <div className="price">Coming Soon</div>
            <ul>
              <li>✓ Everything in Base Edition</li>
              <li>✓ Up to 6-player multiplayer rooms</li>
              <li>✓ Advanced GM tools</li>
              <li>✓ Custom content sharing</li>
              <li>✓ Enhanced VTT features</li>
            </ul>
            <button className="pricing-btn">Coming Soon</button>
          </div>

          <div className="pricing-card legendary">
            <h3>Guild Edition</h3>
            <div className="price">Coming Soon</div>
            <ul>
              <li>✓ Everything in Party Edition</li>
              <li>✓ Unlimited player rooms</li>
              <li>✓ Campaign management tools</li>
              <li>✓ Priority support & feedback</li>
              <li>✓ Early access to new features</li>
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
        <h2>Create Your Account</h2>
        <div className="account-grid">
          <div className="account-card account-main">
            <div className="account-hero">
              <div className="account-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3>Join the Adventure</h3>
              <p>Create your Mythrill account to unlock character creation, cloud saves, and multiplayer features</p>
            </div>

            <div className="account-benefits">
              <div className="benefit-row">
                <div className="benefit-item">
                  <i className="fab fa-google"></i>
                  <span>Google Sign-In</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure & Private</span>
                </div>
              </div>
              <div className="benefit-row">
                <div className="benefit-item">
                  <i className="fas fa-cloud"></i>
                  <span>Cloud Storage</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-users"></i>
                  <span>Multiplayer Ready</span>
                </div>
              </div>
            </div>

            <div className="account-actions">
              <button
                className="primary-account-btn"
                onClick={onShowLogin}
              >
                <i className="fas fa-sign-in-alt"></i>
                Get Started
              </button>
              <p className="account-note">
                <i className="fas fa-info-circle"></i>
                Free account • No credit card required
              </p>
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
            <button className="login-btn" onClick={onShowLogin}>
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



      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </div>
  );
};

export default LandingPage;
