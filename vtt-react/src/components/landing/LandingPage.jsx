import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import GlobalChatWindowWrapper from '../social/GlobalChatWindowWrapper';
import RulesPage from '../rules/RulesPage';
import './styles/LandingPage.css';

const LandingPage = ({ onEnterSinglePlayer, onEnterMultiplayer, onShowLogin, onShowRegister, isAuthenticated, user }) => {

  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('landingActiveSection') || 'home';
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enableDevelopmentBypass, isDevelopmentBypass, signOut, isAuthenticated: authStoreIsAuthenticated, user: authStoreUser, isDevelopmentBypass: authStoreIsDevelopmentBypass } = useAuthStore();

  // Save active section to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('landingActiveSection', activeSection);
  }, [activeSection]);

  // Development bypass handler
  const handleDevelopmentBypass = async () => {
    const result = await enableDevelopmentBypass();
    if (result?.success) {
      navigate('/account');
    } else {
      console.error('Development bypass failed:', result?.error);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation to landing page
  useEffect(() => {
    // Only scroll to top when the pathname explicitly changes to /
    // This happens when navigating TO the landing page from another page
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
      setShowCommunity(false);
    }
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle community button click
  const handleCommunityClick = () => {
    setShowCommunity(true);
  };



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
              <i className="fas fa-flask"></i>
              <span className="btn-text">
                <span className="btn-title">Sandbox Mode</span>
                <span className="btn-subtitle">Test tools & experiment</span>
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
    <div className="landing-section rules-section-wrapper">
      <RulesPage />
    </div>
  );

  const navigation = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'rules', label: 'Rules', icon: 'fas fa-book' },
    { id: 'membership', label: 'Membership', icon: 'fas fa-star' }
  ];

  // Map background path
  const mapImagePath = `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`;

  return (
    <>
      <div
        className="landing-page map-background"
        style={{
          '--map-background-url': `url("${mapImagePath}")`
        }}
      >
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

              {/* Show Account and Logout buttons if logged in, otherwise show Login and Dev Preview */}
              {authStoreIsAuthenticated && authStoreUser ? (
                <>
                  <button
                    type="button"
                    className="account-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Account button clicked - navigating to /account');
                      console.log('Current location:', window.location.href);
                      try {
                        navigate('/account', { replace: false });
                        console.log('Navigation called successfully');
                      } catch (error) {
                        console.error('Navigation failed:', error);
                      }
                    }}
                  >
                    <i className="fas fa-user-circle"></i>
                    Account
                  </button>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </>
              ) : authStoreIsDevelopmentBypass ? (
                <button
                  type="button"
                  className="account-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Account button clicked (dev bypass) - navigating to /account');
                    navigate('/account', { replace: false });
                  }}
                >
                  <i className="fas fa-user-circle"></i>
                  Account
                </button>
              ) : (
                <>
                  <button className="dev-bypass-btn" onClick={handleDevelopmentBypass}>
                    <i className="fas fa-cog"></i>
                    Dev Preview
                  </button>
                  <button className="login-btn" onClick={onShowLogin}>
                    <i className="fas fa-user"></i>
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="landing-main">
          {activeSection === 'home' && renderHomeSection()}
          {activeSection === 'rules' && renderRulesSection()}
          {activeSection === 'membership' && renderMembershipSection()}
        </main>

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
    </>
  );
};

export default LandingPage;
