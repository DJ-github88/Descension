import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import usePresenceStore from '../../store/presenceStore';
import { useIsPhone } from '../../hooks/useIsPhone';
import useNavOverflow from '../../hooks/useNavOverflow';
import GlobalChatWindowWrapper from '../social/GlobalChatWindowWrapper';
import RulesPage from '../rules/RulesPage';
import MapMakingSection from './MapMakingSection';
import { shouldReduceMotion } from '../../utils/accessibility';
import { getCurrentMapTransform } from '../../utils/mapTransform';
import { getPrimaryStarterMap } from '../../data/subregionMaps';
import { SUBSCRIPTION_TIERS } from '../../services/subscriptionService';
import './styles/LandingPage.css';

// Membership tab presentation config. Tier names, prices, limits and feature
// lists are read from SUBSCRIPTION_TIERS so this page always matches the plans
// the app actually enforces (see services/subscriptionService.js).
const MEMBERSHIP_TIER_ORDER = ['GUEST', 'FREE', 'PRO', 'ULTIMATE', 'MYTHIC'];

const MEMBERSHIP_CARD_META = {
  GUEST: {
    cardClass: 'free',
    action: 'login',
    lockedFeatures: ['No cloud save: data cleared on disconnect', 'Cannot create rooms']
  },
  FREE: { cardClass: 'premium', action: 'register' },
  PRO: { cardClass: 'premium', action: 'soon' },
  ULTIMATE: { cardClass: 'legendary', action: 'soon' },
  MYTHIC: { cardClass: 'mythic', action: 'soon' }
};

const LandingPage = ({ onEnterSinglePlayer, onEnterMultiplayer, onShowLogin, onShowRegister, onLoginTransition, isAuthenticated, user, onImmerse, isWorldMapActive }) => {

  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const sec = searchParams.get('section');
      if (sec && (sec === 'rules' || sec === 'membership' || sec === 'home')) {
        return sec;
      }
    }
    return localStorage.getItem('landingActiveSection') || 'home';
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isPhone = useIsPhone();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDevelopmentBypass, signOut, isAuthenticated: authStoreIsAuthenticated, user: authStoreUser, isDevelopmentBypass: authStoreIsDevelopmentBypass, isAdminBypass } = useAuthStore();

  // Lord Bertil's Map Making section is only available to admin (admin/admin dev-login)
  const isAdmin = isAdminBypass || !!authStoreUser?.isAdmin;

  // Sync activeSection with URL search params so browser Back & Forward buttons navigate cleanly
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sec = searchParams.get('section');
    if (sec && (sec === 'rules' || sec === 'membership' || sec === 'home')) {
      setActiveSection(sec);
    } else if (!sec && location.pathname === '/') {
      setActiveSection('home');
    }
  }, [location.search, location.pathname]);

  // Party state for indicator
  const isInParty = usePresenceStore((state) => state.isInParty);
  const currentParty = usePresenceStore((state) => state.currentParty);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const isPartyLeader = currentParty?.leaderId === currentUserPresence?.userId;

  // Community notification badge state
  const whisperTabs = usePresenceStore((state) => state.whisperTabs);
  const partyChatUnreadCount = usePresenceStore((state) => state.partyChatUnreadCount);

  // Calculate total unread count for community badge
  const totalCommunityUnread = React.useMemo(() => {
   let total = partyChatUnreadCount || 0;
   whisperTabs?.forEach(tab => {
    total += tab.unreadCount || 0;
   });
   return total;
  }, [whisperTabs, partyChatUnreadCount]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
   const handleResize = () => {
    if (window.innerWidth > 768) setMobileMenuOpen(false);
   };
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
   setMobileMenuOpen(false);
  }, [location.pathname]);

  // Save active section to localStorage when it changes
  useEffect(() => {
   localStorage.setItem('landingActiveSection', activeSection);
  }, [activeSection]);

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
  // This happens when navigating TO the landing page from another page.
  // location.search is included so switching landing sections (Home/Rules/
  // Membership) also resets the scroll position instead of leaving the new
  // section's heading hidden underneath the sticky header.
  if (location.pathname === '/') {
   window.scrollTo(0, 0);
   setShowCommunity(false);
  }
 }, [location.pathname, location.search]);

 const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };

  const [immersion, setImmersion] = useState(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  // Map background path — use user's chosen primary starter map
  const [primaryMap, setPrimaryMap] = useState(() => getPrimaryStarterMap());
  const mapImagePath = primaryMap?.image || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`;

  // Listen for live changes when user sets a new primary map from AccountMapManager
  useEffect(() => {
    const handlePrimaryMapChanged = (e) => {
      if (e.detail) {
        setPrimaryMap(e.detail);
        setIsBgLoaded(false); // trigger re-preload
      }
    };
    window.addEventListener('mythrill_primary_map_changed', handlePrimaryMapChanged);
    return () => window.removeEventListener('mythrill_primary_map_changed', handlePrimaryMapChanged);
  }, []);

  // Preload starter page background image so it stays static until fully loaded
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = mapImagePath;
    if (img.complete) {
      setIsBgLoaded(true);
    } else {
      img.onload = () => {
        if (isMounted) setIsBgLoaded(true);
      };
      img.onerror = () => {
        if (isMounted) setIsBgLoaded(true);
      };
    }
    return () => {
      isMounted = false;
    };
  }, [mapImagePath]);

  // Preload World Map chunk and map textures during idle moments
  const handlePreloadWorldMap = React.useCallback(() => {
    const mapReady = import('../world-map/WorldMapImmerse');
    const imageReady = import('../../utils/mapImagePreloader').then(({ preloadMapAssets, preloadImage }) => {
      preloadMapAssets();
      return preloadImage(`${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`);
    });
    return Promise.all([mapReady, imageReady]).catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(handlePreloadWorldMap, { timeout: 2500 });
      } else {
        setTimeout(handlePreloadWorldMap, 1000);
      }
    }
  }, [handlePreloadWorldMap]);

  // Handle community button click
  const handleCommunityClick = () => {
    setShowCommunity(prev => !prev);
  };

  const isImmersingActive = isWorldMapActive || !!immersion;

  const handleImmerseClick = () => {
    if (isImmersingActive || !onImmerse) return;
    const from = getCurrentMapTransform(document.querySelector('.landing-page.map-background'));
    const reducedMotion = shouldReduceMotion();
    const zoom = reducedMotion ? 1 : 1.18;
    const centerX = document.documentElement.clientWidth / 2;
    const centerY = document.documentElement.clientHeight / 2;
    setMobileMenuOpen(false);
    setImmersion({
      from,
      to: {
        scale: from.scale * zoom,
        posX: centerX + (from.posX - centerX) * zoom,
        posY: centerY + (from.posY - centerY) * zoom
      },
      reducedMotion,
      duration: reducedMotion ? 160 : 820,
      onComplete: onImmerse
    });
  };

  useEffect(() => {
    if (!immersion) return;
    let cancelled = false;
    let timer;
    const flightFinished = new Promise(resolve => {
      timer = setTimeout(resolve, immersion.duration);
    });
    // Keep the final camera frame visible until the interactive chunk is ready.
    Promise.all([flightFinished, handlePreloadWorldMap()]).then(() => {
      if (!cancelled) {
        setImmersion(null);
        immersion.onComplete(immersion.to);
      }
    });
    const cancelFlight = () => {
      cancelled = true;
      setImmersion(null);
      requestAnimationFrame(() => document.querySelector('.immersive-action-btn')?.focus({ preventScroll: true }));
    };
    const handleKey = event => {
      if (event.key === 'Escape') cancelFlight();
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', cancelFlight);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', cancelFlight);
    };
  }, [immersion, handlePreloadWorldMap]);

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

     <div className="action-buttons">
      <button
       className={`primary-action-btn ${isPhone ? 'phone-disabled' : ''}`}
        onClick={() => {
         if (isPhone) return;
         onEnterMultiplayer();
        }}
       disabled={isPhone}
       title={isPhone ? 'The VTT grid is not optimised for phones. Play on a tablet or desktop.' : ''}
      >
       <span className="btn-text">
        <span className="btn-title">Play Online</span>
        <span className="btn-subtitle">Adventure with friends</span>
       </span>
      </button>
      <button
       className="immersive-action-btn"
       onClick={handleImmerseClick}
       disabled={isImmersingActive}
       aria-busy={isImmersingActive}
       onMouseEnter={handlePreloadWorldMap}
       onTouchStart={handlePreloadWorldMap}
       title="Explore the interactive World Map of Mythril"
      >
       <span className="btn-text">
        <span className="btn-title">Immerse</span>
        <span className="btn-subtitle">Explore the world map</span>
       </span>
      </button>
      <button
       className={`secondary-action-btn ${isPhone ? 'phone-disabled' : ''}`}
        onClick={() => {
         if (isPhone) return;
         onEnterSinglePlayer();
        }}
       disabled={isPhone}
       title={isPhone ? 'The VTT grid is not optimised for phones. Play on a tablet or desktop.' : ''}
      >
       <span className="btn-text">
        <span className="btn-title">Sandbox Mode</span>
        <span className="btn-subtitle">Test tools & experiment</span>
       </span>
      </button>
     </div>

     {isPhone && (
      <p className="phone-notice-banner">
       <i className="fas fa-info-circle"></i>
       You're on a phone: the tactical grid is designed for larger screens.
       Character Creation, Lore and the world map are fully available.
      </p>
     )}
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
      <p>New to Mythrill? Our complete guides will help you create your first character and understand the game mechanics.</p>
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
    <h2>Membership &amp; Pricing</h2>
    <p className="membership-subtitle">
     Every tier plays the same game. Plans only change how much you can build, store and run.
    </p>
    <div className="pricing-grid">
     {MEMBERSHIP_TIER_ORDER.map(tierKey => {
      const tier = SUBSCRIPTION_TIERS[tierKey];
      const meta = MEMBERSHIP_CARD_META[tierKey];
      if (!tier || !meta) return null;

      const features = meta.lockedFeatures
       ? tier.features.filter(feature => !/^no cloud save/i.test(feature))
       : tier.features;

      return (
       <div
        key={tierKey}
        className={`pricing-card ${meta.cardClass}${tier.highlight ? ' highlighted' : ''}`}
       >
        {tier.highlight && (
         <div className="popular-badge">Most Popular</div>
        )}
        <div className="pricing-card-icon" style={{ color: tier.color }}>
         <i className={`fas ${tier.icon}`}></i>
        </div>
        <h3>{tierKey === 'FREE' ? 'Free Adventurer' : tier.name}</h3>
        <div className="price">
         {tier.price === 0 ? (
          tierKey === 'GUEST' ? 'Free' : <>Free<span>/forever</span></>
         ) : (
          <>${tier.price}<span>/month</span></>
         )}
        </div>
        <p className="pricing-description">{tier.description}</p>
        <ul>
         {features.map((feature, idx) => (
          <li key={idx}>✓ {feature}</li>
         ))}
         {meta.lockedFeatures?.map(feature => (
          <li key={feature}>
           <span className="locked-feature">✗ {feature}</span>
          </li>
         ))}
        </ul>
        {meta.action === 'login' && (
         <button
          className="pricing-btn primary-account-btn"
          onClick={onShowLogin}
         >
          <i className="fas fa-sign-in-alt"></i>
          Get Started
         </button>
        )}
        {meta.action === 'register' && (
         <button
          className="pricing-btn primary-account-btn"
          onClick={onShowRegister}
         >
          <i className="fas fa-user-plus"></i>
          Create Free Account
         </button>
        )}
        {meta.action === 'soon' && (
         <button className="pricing-btn" disabled>Coming Soon</button>
        )}
       </div>
      );
     })}
    </div>
   </div>
  </div>
 );



 const renderRulesSection = () => (
  <div className="landing-section rules-section-wrapper">
   <RulesPage />
  </div>
 );

 const renderMapMakingSection = () => (
  <div className="landing-section map-making-section-wrapper">
   {isAdmin ? (
    <MapMakingSection />
   ) : (
    <div className="map-making-locked">
     <i className="fas fa-lock"></i>
     <h2>Map Making: Restricted</h2>
     <p>This section is reserved for the map maker. Please log in as an admin to access it.</p>
    </div>
   )}
  </div>
 );

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    if (sectionId === 'home') {
      navigate('/', { replace: false });
    } else {
      navigate(`/?section=${sectionId}`, { replace: false });
    }
  };

 const navigation = [
  { id: 'home', label: 'Home', icon: 'fas fa-home' },
  { id: 'rules', label: 'Laws & Lore', icon: 'fas fa-book' },
  { id: 'membership', label: 'Membership', icon: 'fas fa-star' }
 ];

 // Total items in main-nav: navigation items + Community button
 const totalNavItems = navigation.length + 1;
 const headerRef = React.useRef(null);
 const headerLeftRef = React.useRef(null);
 const headerRightRef = React.useRef(null);
 const { containerRef: navContainerRef, setItemRef, overflowCount } = useNavOverflow(totalNavItems, headerRef, headerLeftRef, headerRightRef);
 const [overflowOpen, setOverflowOpen] = useState(false);

 // Close overflow dropdown on Escape
 useEffect(() => {
  if (!overflowOpen) return;
  const handleKey = (e) => {
   if (e.key === 'Escape') setOverflowOpen(false);
  };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
 }, [overflowOpen]);

 return (
  <>
   <div
    className={`landing-page map-background ${isBgLoaded ? 'map-loaded' : 'map-loading'} ${isImmersingActive ? 'immersing' : ''} ${immersion?.reducedMotion ? 'immersion-reduced-motion' : ''} ${activeSection === 'home' ? 'home-mode' : ''} ${activeSection === 'rules' ? 'rules-mode' : ''} ${activeSection === 'membership' ? 'membership-mode' : ''}`}
    inert={isImmersingActive ? '' : undefined}
    style={{
     '--map-background-url': `url("${`${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`}")`
    }}
   >
    {immersion && (
      <div className="immerse-map-flight" aria-hidden="true" style={{
        '--camera-from': `translate3d(${immersion.from.posX}px, ${immersion.from.posY}px, 0) scale(${immersion.from.scale})`,
        '--camera-to': `translate3d(${immersion.to.posX}px, ${immersion.to.posY}px, 0) scale(${immersion.to.scale})`,
        '--immersion-duration': `${immersion.duration}ms`
      }}>
        <div className="immerse-map-flight-texture" />
      </div>
    )}
    <header className="landing-header">
      <div className="header-content" ref={headerRef}>
       <div className="header-left" ref={headerLeftRef}>
        <div
          className="logo"
          onClick={() => handleNavClick('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavClick('home');
            }
          }}
          title="Return to Mythrill Home"
          aria-label="Return to Mythrill Home"
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
         <i className="fas fa-gem"></i>
         <span>Mythrill</span>
        </div>
       </div>

       <div className="header-center">
        <nav className="main-nav" ref={navContainerRef}>
         {navigation.map((item, i) => {
          const totalItems = navigation.length + 1;
          const hidden = overflowCount > 0 && i >= totalItems - overflowCount;
          return (
           <button
            key={item.id}
            ref={setItemRef(i)}
            className={`nav-item ${hidden ? 'nav-item-overflow-hidden' : ''} ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
           >
            <i className={item.icon}></i>
            {item.label}
           </button>
          );
         })}

         <button
          ref={setItemRef(navigation.length)}
          className={`nav-item community-nav-btn ${overflowCount > 0 ? 'nav-item-overflow-hidden' : ''} ${isInParty ? 'in-party' : ''} ${showCommunity ? 'active' : ''}`}
          onClick={handleCommunityClick}
          title={isInParty ? `Community Chat (In Party${isPartyLeader ? ' - Leader' : ''})` : "Community Chat"}
         >
          <i className="fas fa-users"></i>
          {totalCommunityUnread > 0 && (
           <span className="community-notification-badge">
            {totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}
           </span>
          )}
          {isInParty && (
           <i className={`fas ${isPartyLeader ? 'fa-crown' : 'fa-shield-alt'} party-indicator`}
            title={isPartyLeader ? 'Party Leader' : 'In Party'}></i>
          )}
          Community
         </button>

         {overflowCount > 0 && (
          <div className="nav-overflow-wrapper">
           <button
            className={`nav-overflow-btn ${overflowOpen ? 'active' : ''}`}
            onClick={() => setOverflowOpen(prev => !prev)}
             aria-label="More navigation items"
            >
             <i className="fas fa-plus"></i>
            </button>
          </div>
         )}
        </nav>
       </div>

       {overflowOpen && overflowCount > 0 && (
        <>
         <div className="nav-overflow-backdrop" onClick={() => setOverflowOpen(false)} />
         <div className="nav-overflow-dropdown">
          {(() => {
           const totalItems = navigation.length + 1;
           const overflowedNavItems = navigation.slice(totalItems - overflowCount);
           const communityItem = { id: 'community', label: 'Community', icon: 'fas fa-users', isCommunity: true };
           const items = overflowedNavItems.length > 0 ? [...overflowedNavItems, communityItem] : [communityItem];
           return items.map(item => (
            <button
             key={item.id}
             className={`nav-overflow-item ${activeSection === item.id ? 'active' : ''}`}
             onClick={() => {
              if (item.isCommunity) {
               handleCommunityClick();
              } else {
               handleNavClick(item.id);
              }
              setOverflowOpen(false);
             }}
            >
             <i className={item.icon}></i>
             {item.label}
             {item.isCommunity && totalCommunityUnread > 0 && (
              <span className="community-notification-badge">
               {totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}
              </span>
             )}
            </button>
           ));
          })()}
         </div>
        </>
       )}

       <div className="header-right header-actions" ref={headerRightRef}>
        <button
         type="button"
         className="privacy-btn"
         onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/privacy');
         }}
         title="Privacy Policy"
        >
         <i className="fas fa-shield-alt"></i>
         Privacy
        </button>
        {authStoreIsAuthenticated && authStoreUser ? (
        <>
         <button
          type="button"
          className="account-btn"
          onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           navigate('/account', { replace: false });
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
          navigate('/account', { replace: false });
         }}
        >
         <i className="fas fa-user-circle"></i>
         Account
        </button>
       ) : (
        <>
         <button className="login-btn" onClick={onShowLogin}>
          <i className="fas fa-user"></i>
          Login
         </button>
        </>
       )}
      </div>

      <button
       className={`mobile-hamburger ${mobileMenuOpen ? 'open' : ''}`}
       onClick={() => setMobileMenuOpen(prev => !prev)}
       aria-label="Menu"
      >
       <span></span>
       <span></span>
       <span></span>
      </button>
     </div>

     <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="mobile-menu-list">
       {navigation.map(item => (
        <button
         key={item.id}
         className={`mobile-menu-item ${activeSection === item.id ? 'active' : ''}`}
         onClick={() => handleNavClick(item.id)}
        >
         <i className={item.icon}></i>
         {item.label}
        </button>
       ))}
       <button
        className="mobile-menu-item"
        onClick={() => { handleCommunityClick(); setMobileMenuOpen(false); }}
       >
        <i className="fas fa-users"></i>
        Community
        {totalCommunityUnread > 0 && (
         <span className="mobile-menu-badge">{totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}</span>
        )}
       </button>

       {authStoreIsAuthenticated && authStoreUser ? (
        <>
         <button
          className="mobile-menu-item"
          onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
         >
          <i className="fas fa-user-circle"></i>
          Account
         </button>
         <button
          className="mobile-menu-item"
          onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
         >
          <i className="fas fa-sign-out-alt"></i>
          Logout
         </button>
        </>
       ) : authStoreIsDevelopmentBypass ? (
        <button
         className="mobile-menu-item"
         onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
        >
         <i className="fas fa-user-circle"></i>
         Account
        </button>
       ) : (
        <>
         <button
          className="mobile-menu-item highlight"
          onClick={() => { onShowLogin(); setMobileMenuOpen(false); }}
         >
          <i className="fas fa-user"></i>
          Login
         </button>
        </>
       )}
       <button
        className="mobile-menu-item"
        onClick={() => { navigate('/privacy'); setMobileMenuOpen(false); }}
       >
        <i className="fas fa-shield-alt"></i>
        Privacy Policy
       </button>
      </div>
     </div>
    </header>

    <main className="landing-main">
     {activeSection === 'home' && renderHomeSection()}
     {activeSection === 'rules' && renderRulesSection()}
     {activeSection === 'membership' && renderMembershipSection()}
    </main>

    {/* Copyright stamp */}
    <footer className="landing-copyright">
      <span>&copy; 2026 Out of Mana Studios. All rights reserved.</span>
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
  </>
 );
};

export default LandingPage;
