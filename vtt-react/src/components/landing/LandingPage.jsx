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
import './styles/LandingPage.css';

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
  const [showPhoneNotice, setShowPhoneNotice] = useState(null);
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
  // This happens when navigating TO the landing page from another page
  if (location.pathname === '/') {
   window.scrollTo(0, 0);
   setShowCommunity(false);
  }
 }, [location.pathname]);

 const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };

  const [isActivatingImmerse, setIsActivatingImmerse] = useState(false);
  const [isImmersingTransition, setIsImmersingTransition] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  // Map background path
  const mapImagePath = `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`;

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
  const handlePreloadWorldMap = () => {
    import('../world-map/WorldMapImmerse').catch(() => {});
    import('../../utils/mapImagePreloader').then(({ preloadMapAssets }) => {
      preloadMapAssets();
    }).catch(() => {});
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(handlePreloadWorldMap, { timeout: 2500 });
      } else {
        setTimeout(handlePreloadWorldMap, 1000);
      }
    }
  }, []);

  // Handle community button click
  const handleCommunityClick = () => {
    setShowCommunity(prev => !prev);
  };

  const handleImmerseClick = (e) => {
    setIsActivatingImmerse(true);
    setIsImmersingTransition(true);

    const el = document.querySelector('.landing-page.map-background');
    const btn = e?.currentTarget || document.querySelector('.immersive-action-btn');

    if (btn) {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      const deltaX = Math.round(screenCenterX - btnCenterX);
      const deltaY = Math.round(screenCenterY - btnCenterY);

      document.documentElement.style.setProperty('--immerse-target-x', `${deltaX}px`);
      document.documentElement.style.setProperty('--immerse-target-y', `${deltaY}px`);
    }

    const transform = getCurrentMapTransform(el);

    if (shouldReduceMotion()) {
      if (onImmerse) onImmerse(transform);
      setIsActivatingImmerse(false);
      setIsImmersingTransition(false);
      return;
    }

    handlePreloadWorldMap();

    // Cinematic immersion transition: allow button glow, celestial astrolabe pulse, and header slide to play smoothly
    setTimeout(() => {
      if (onImmerse) {
        onImmerse(transform);
      }
      setTimeout(() => {
        setIsActivatingImmerse(false);
        setIsImmersingTransition(false);
      }, 500);
    }, 600);
  };

  // ── Seamless Immerse Transition ──
  // When Immerse is activated: freeze the mapPan animation at its current frame.
  // WorldMapImmerse mounts immediately at this exact spot without zooming out,
  // while landing page UI text and dark vignette fade out smoothly.
  const isImmersingActive = isWorldMapActive || isImmersingTransition;

  useEffect(() => {
    if (!isImmersingActive) return;

    const el = document.querySelector('.landing-page.map-background');
    if (!el) return;

    // 1. Read the current animated frame BEFORE killing the animation
    const cs = window.getComputedStyle(el);
    const frozenSize = cs.backgroundSize;
    const frozenPos = cs.backgroundPosition;

    // 2. Kill the animation entirely so our inline styles can take over
    el.style.setProperty('animation', 'none', 'important');

    // 3. Lock the frozen frame as inline styles at the exact spot
    el.style.backgroundSize = frozenSize;
    el.style.backgroundPosition = frozenPos;

    // Cleanup: restore the landing page when exiting Immerse mode
    return () => {
      const cleanupEl = document.querySelector('.landing-page.map-background');
      if (cleanupEl) {
        // Keep background frozen while landing UI slides/fades back in during exit
        setTimeout(() => {
          cleanupEl.style.transition = 'none';
          cleanupEl.style.backgroundSize = '';
          cleanupEl.style.backgroundPosition = '';
          cleanupEl.style.removeProperty('animation');
          // Force reflow so the browser registers the change before the
          // animation resumes from its CSS declaration
          void cleanupEl.offsetWidth;
        }, 1200);
      }
    };
  }, [isImmersingActive]);

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
       className={`primary-action-btn ${isPhone ? 'phone-disabled' : ''}`}
       onClick={() => {
        if (isPhone) { setShowPhoneNotice('Play Online'); return; }
        onEnterMultiplayer();
       }}
       disabled={isPhone}
       title={isPhone ? 'The VTT grid is not optimised for phones. Play on a tablet or desktop.' : ''}
      >
       <i className="fas fa-dragon"></i>
       <span className="btn-text">
        <span className="btn-title">Play Online</span>
        <span className="btn-subtitle">Adventure with friends</span>
       </span>
      </button>
      <button
       className={`immersive-action-btn ${isImmersingActive ? 'is-immerse-activating' : ''}`}
       onClick={handleImmerseClick}
       onMouseEnter={handlePreloadWorldMap}
       onTouchStart={handlePreloadWorldMap}
       title="Explore the interactive World Map of Mythril"
      >
       <i className="fas fa-map"></i>
       <span className="btn-text">
        <span className="btn-title">Immerse</span>
        <span className="btn-subtitle">Explore the world map</span>
       </span>
       {isImmersingActive && (
         <div className="immerse-btn-astrolabe-aura">
           <div className="astrolabe-aura-ring" />
           <i className="fas fa-compass astrolabe-aura-compass" />
         </div>
       )}
      </button>
      <button
       className={`secondary-action-btn ${isPhone ? 'phone-disabled' : ''}`}
       onClick={() => {
        if (isPhone) { setShowPhoneNotice('Sandbox Mode'); return; }
        onEnterSinglePlayer();
       }}
       disabled={isPhone}
       title={isPhone ? 'The VTT grid is not optimised for phones. Play on a tablet or desktop.' : ''}
      >
       <i className="fas fa-flask"></i>
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
    <h2>Membership & Pricing</h2>
    <div className="pricing-grid">
     <div className="pricing-card free">
      <div className="pricing-card-icon"><i className="fas fa-user-secret"></i></div>
      <h3>Guest</h3>
      <div className="price">Free</div>
      <ul>
       <li>✓ Join multiplayer rooms as a player</li>
       <li>✓ 1 temporary character</li>
       <li>✓ Full combat & dice rolling</li>
       <li>✓ Room chat</li>
       <li><span className="locked-feature">✗ No cloud save</span></li>
       <li><span className="locked-feature">✗ Cannot create rooms</span></li>
      </ul>
      <p className="account-note">
       <i className="fas fa-info-circle"></i>
       No account needed: just join a game
      </p>
      <button
       className="pricing-btn primary-account-btn"
       onClick={onShowLogin}
      >
       <i className="fas fa-sign-in-alt"></i>
       Get Started
      </button>
     </div>

     <div className="pricing-card premium">
      <div className="pricing-card-icon"><i className="fas fa-shield-halved"></i></div>
      <h3>Free Adventurer</h3>
      <div className="price">$0<span>/forever</span></div>
      <ul>
       <li>✓ 3 character slots with cloud save</li>
       <li>✓ 1 permanent room (up to 4 players)</li>
       <li>✓ 25 MB cloud storage</li>
       <li>✓ Full character creation (21 classes, 10 primary races)</li>
       <li>✓ Spell crafting, creature & item creation</li>
       <li>✓ Map editor with static fog of war</li>
       <li>✓ Combat system & 3D physics dice</li>
       <li>✓ Unlimited local rooms</li>
      </ul>
      <p className="account-note">
       <i className="fas fa-info-circle"></i>
       Free forever • No credit card required
      </p>
      <button
       className="pricing-btn primary-account-btn"
       onClick={onShowRegister}
      >
       <i className="fas fa-user-plus"></i>
       Create Free Account
      </button>
     </div>

     <div className="pricing-card premium">
      <div className="pricing-card-icon"><i className="fas fa-crown"></i></div>
      <div className="popular-badge">Most Popular</div>
      <h3>Dungeon Master</h3>
      <div className="price">$7.99<span>/month</span></div>
      <ul>
       <li>✓ 15 character slots with cloud save</li>
       <li>✓ 5 rooms (up to 6 players each)</li>
       <li>✓ 500 MB cloud storage</li>
       <li>✓ Full GM notes (scroll, NPC, encounter, trap)</li>
       <li>✓ Portal system: connect maps</li>
       <li>✓ Travel system with biomes & weather</li>
       <li>✓ Atmospheric effects (rain, snow, fog)</li>
       <li>✓ Campaign manager & session tracking</li>
       <li>✓ Memory snapshots & afterimages</li>
       <li>✓ Custom rollable tables & quest sharing</li>
      </ul>
      <button className="pricing-btn">Coming Soon</button>
     </div>

     <div className="pricing-card legendary">
      <div className="pricing-card-icon"><i className="fas fa-chess-king"></i></div>
      <h3>Archmage</h3>
      <div className="price">$14.99<span>/month</span></div>
      <ul>
       <li>✓ Unlimited character slots</li>
       <li>✓ 25 rooms (up to 12 players each)</li>
       <li>✓ Everything in Dungeon Master</li>
       <li>✓ Campaign analytics dashboard</li>
       <li>✓ Custom room themes</li>
       <li>✓ Priority support & early access</li>
       <li>✓ 5 GB cloud storage</li>
      </ul>
      <button className="pricing-btn">Coming Soon</button>
     </div>

     <div className="pricing-card mythic">
      <div className="pricing-card-icon"><i className="fas fa-wand-magic-sparkles"></i></div>
      <h3>Demiurge</h3>
      <div className="price">$22.00<span>/month</span></div>
      <ul>
       <li>✓ Unlimited character slots</li>
       <li>✓ 100 rooms (up to 24 players each)</li>
       <li>✓ 25 GB ultra cloud storage</li>
       <li>✓ Everything in Archmage +</li>
       <li>✓ Full Living Campaign & Timeline Engine</li>
       <li>✓ Dynamic Fog of War & Map Route Planner</li>
       <li>✓ Co-GM Multiplayer Collaboration</li>
       <li>✓ Dedicated VIP priority servers</li>
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
  { id: 'rules', label: 'Rules', icon: 'fas fa-book' },
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
    className={`landing-page map-background ${isBgLoaded ? 'map-loaded' : 'map-loading'} ${isImmersingActive ? 'immersing' : ''} ${activeSection === 'rules' ? 'rules-mode' : ''}`}
    style={{
     '--map-background-url': `url("${`${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`}")`
    }}
   >
    <header className="landing-header">
      <div className="header-content" ref={headerRef}>
       <div className="header-left" ref={headerLeftRef}>
        <div className="logo">
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
