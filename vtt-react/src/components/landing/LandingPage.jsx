import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import GlobalChatWindowWrapper from '../social/GlobalChatWindowWrapper';
import './styles/LandingPage.css';

const LandingPage = ({ onEnterSinglePlayer, onEnterMultiplayer, onShowLogin, onShowRegister }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const navigate = useNavigate();
  const { enableDevelopmentBypass, user } = useAuthStore();

  // Development bypass handler
  const handleDevelopmentBypass = () => {
    enableDevelopmentBypass();
    navigate('/account');
  };

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

  // Debug: Log user state
  useEffect(() => {
    console.log('LandingPage - User state:', user);
  }, [user]);

  // Handle community button click
  const handleCommunityClick = () => {
    console.log('🎭 Community button clicked, user:', user);
    console.log('🎭 Opening community chat...');
    setShowCommunity(true);
  };

  // Debug: Log showCommunity state changes
  useEffect(() => {
    console.log('🎭 showCommunity state changed:', showCommunity);
  }, [showCommunity]);



  const renderHomeSection = () => (
    <div className="landing-section">
      <div className="hero-section">
        <div className="hero-content">
          <div className="title-section">
            <h1 className="game-title">Mythrill</h1>
            <div className="title-ornament">
              <i className="fas fa-dragon"></i>
              <span className="ornament-line"></span>
              <i className="fas fa-gem"></i>
              <span className="ornament-line"></span>
              <i className="fas fa-dragon"></i>
            </div>
          </div>

          <p className="game-subtitle">The Ultimate Fantasy TTRPG Experience</p>
          <p className="game-description">
            Embark on epic adventures in a world of magic, mystery, and endless possibilities.
          </p>

          <div className="action-buttons">
            <button
              className="primary-action-btn"
              onClick={onEnterMultiplayer}
            >
              <i className="fas fa-dragon"></i>
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
            <button
              className="pricing-btn primary-account-btn"
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



  const renderRulesSection = () => (
    <div className="landing-section">
      <div className="rules-content">
        <h2>Rules & Getting Started</h2>

        <div className="rules-grid">
          {/* Getting Started Guide */}
          <div className="rules-card getting-started-card">
            <div className="rules-card-header">
              <i className="fas fa-book-open"></i>
              <h3>Getting Started</h3>
            </div>
            <div className="rules-card-body">
              <div className="guide-step">
                <div className="guide-step-number">1</div>
                <div className="guide-step-content">
                  <h4>Create Your Account</h4>
                  <p>Sign up for a free account to unlock character creation and multiplayer features. Guest accounts are limited to 1 character and 1 room.</p>
                </div>
              </div>

              <div className="guide-step">
                <div className="guide-step-number">2</div>
                <div className="guide-step-content">
                  <h4>Build Your Character</h4>
                  <p>Choose from 10 races, 27 classes, and multiple backgrounds. Allocate your ability scores and select starting equipment to prepare for adventure.</p>
                </div>
              </div>

              <div className="guide-step">
                <div className="guide-step-number">3</div>
                <div className="guide-step-content">
                  <h4>Join or Create a Room</h4>
                  <p>Create your own campaign room as a GM, or join an existing room to play with friends. Rooms support up to 2 players in the free edition.</p>
                </div>
              </div>

              <div className="guide-step">
                <div className="guide-step-number">4</div>
                <div className="guide-step-content">
                  <h4>Start Your Adventure</h4>
                  <p>Use the World Builder to create maps, place tokens, and craft your story. Roll dice, cast spells, and track combat in real-time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Rules */}
          <div className="rules-card core-rules-card">
            <div className="rules-card-header">
              <i className="fas fa-scroll"></i>
              <h3>Core Rules</h3>
            </div>
            <div className="rules-card-body">
              <div className="rule-section">
                <h4><i className="fas fa-dice-d20"></i> Ability Scores</h4>
                <p>Characters have six core abilities:</p>
                <ul>
                  <li><strong>Strength:</strong> Physical power and melee combat</li>
                  <li><strong>Agility:</strong> Dexterity, reflexes, and ranged attacks</li>
                  <li><strong>Constitution:</strong> Health, stamina, and resilience</li>
                  <li><strong>Intelligence:</strong> Knowledge, reasoning, and arcane magic</li>
                  <li><strong>Spirit:</strong> Willpower, divine magic, and perception</li>
                  <li><strong>Charisma:</strong> Personality, leadership, and social skills</li>
                </ul>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-heart"></i> Health & Resources</h4>
                <ul>
                  <li><strong>HP (Health Points):</strong> Based on Constitution, determines survivability</li>
                  <li><strong>MP (Mana Points):</strong> Used for casting spells and abilities</li>
                  <li><strong>AP (Action Points):</strong> Spent during combat for actions</li>
                </ul>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-weight-hanging"></i> Encumbrance</h4>
                <p>Carrying capacity is based on Strength. Exceeding your limit applies penalties:</p>
                <ul>
                  <li>-25% movement speed</li>
                  <li>+5% to Strength and Constitution</li>
                  <li>-5% to all other ability scores</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Game Mechanics */}
          <div className="rules-card mechanics-card">
            <div className="rules-card-header">
              <i className="fas fa-cogs"></i>
              <h3>Game Mechanics</h3>
            </div>
            <div className="rules-card-body">
              <div className="rule-section">
                <h4><i className="fas fa-dice"></i> Dice Rolling</h4>
                <p>All randomization uses dice rolls, card draws, or coin flips. The d20 system forms the core of skill checks and combat.</p>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-swords"></i> Combat</h4>
                <ul>
                  <li>Turn-based tactical combat with initiative order</li>
                  <li>Action Points (AP) limit actions per turn</li>
                  <li>Movement tracked in feet with visual distance indicators</li>
                  <li>Real-time multiplayer combat synchronization</li>
                </ul>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-magic"></i> Spellcrafting</h4>
                <p>Create custom spells with unique effects, targeting, and resource costs. Each class has access to specialized spell schools plus universal baseline spells.</p>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-tree"></i> Talent Trees</h4>
                <p>Unlock powerful abilities through class-specific talent trees. Talents are tier-based with visual dependency chains showing prerequisites.</p>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="rules-card community-card">
            <div className="rules-card-header">
              <i className="fas fa-users"></i>
              <h3>Community Guidelines</h3>
            </div>
            <div className="rules-card-body">
              <div className="rule-section">
                <h4><i className="fas fa-handshake"></i> Respect & Conduct</h4>
                <ul>
                  <li>Treat all players with respect and courtesy</li>
                  <li>No harassment, hate speech, or discriminatory behavior</li>
                  <li>Keep content appropriate for all audiences</li>
                  <li>Respect GM decisions and table rules</li>
                </ul>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-shield-alt"></i> Fair Play</h4>
                <ul>
                  <li>No cheating, exploiting, or metagaming</li>
                  <li>Communicate openly with your party</li>
                  <li>Work together to create memorable stories</li>
                  <li>Report bugs and issues to help improve the platform</li>
                </ul>
              </div>

              <div className="rule-section">
                <h4><i className="fas fa-balance-scale"></i> GM Authority</h4>
                <p>The Game Master has final authority over their campaign. GMs can:</p>
                <ul>
                  <li>Set house rules and modify game mechanics</li>
                  <li>Remove disruptive players from their rooms</li>
                  <li>Transfer GM leadership to another player</li>
                  <li>Manage room settings and permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const navigation = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'rules', label: 'Rules', icon: 'fas fa-book' },
    { id: 'game-info', label: 'Game Info', icon: 'fas fa-info' },
    { id: 'membership', label: 'Membership', icon: 'fas fa-star' }
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
            <button
              className="community-btn"
              onClick={handleCommunityClick}
              title="Community Chat"
            >
              <i className="fas fa-users"></i>
              Community
            </button>
            <button className="dev-bypass-btn" onClick={handleDevelopmentBypass}>
              <i className="fas fa-cog"></i>
              Dev Preview
            </button>
            <button className="login-btn" onClick={onShowLogin}>
              <i className="fas fa-user"></i>
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="landing-main">
        {activeSection === 'home' && renderHomeSection()}
        {activeSection === 'rules' && renderRulesSection()}
        {activeSection === 'game-info' && renderGameInfoSection()}
        {activeSection === 'membership' && renderMembershipSection()}
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

      {/* Global Chat Window */}
      <GlobalChatWindowWrapper
        isOpen={showCommunity}
        onClose={() => setShowCommunity(false)}
      />
    </div>
  );
};

export default LandingPage;
