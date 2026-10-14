import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const scrollToTop = () => {
    const root = document.getElementById('root');
    if (root) {
      root.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="privacy-policy-page">
      {/* Top ambient navigation ribbon */}
      <header className="privacy-top-bar">
        <button
          type="button"
          className="privacy-back-btn"
          onClick={handleBack}
          aria-label="Return to Mythrill"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Return to Mythrill</span>
        </button>

        <nav className="privacy-breadcrumbs" aria-label="Codex Breadcrumbs">
          <span className="breadcrumb-segment">Mythrill Codex</span>
          <span className="breadcrumb-sep" aria-hidden="true">◆</span>
          <span className="breadcrumb-segment">Legal Scrolls</span>
          <span className="breadcrumb-sep" aria-hidden="true">◆</span>
          <span className="breadcrumb-segment active">Privacy Policy</span>
        </nav>
      </header>

      {/* Main illuminated codex folio */}
      <main className="privacy-folio-container">
        <article className="privacy-folio" role="article">
          <header className="privacy-folio-header">
            <div className="privacy-seal-medallion" aria-hidden="true">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1>Privacy Policy</h1>
            <p className="privacy-subtitle">
              The Covenant of Player Privacy &amp; Chronicle Stewardship
            </p>
            <div className="privacy-effective-meta">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Last updated: July 1, 2026 &bull; Effective Worldwide</span>
            </div>

            <div className="privacy-ornate-divider" aria-hidden="true">
              <span className="divider-line"></span>
              <span className="divider-glyph">◆</span>
              <span className="divider-line"></span>
            </div>

            {/* Quick Codex Table of Contents */}
            <nav className="privacy-toc" aria-label="Table of Contents">
              <span className="privacy-toc-label">Codex Index:</span>
              <ul className="privacy-toc-list">
                <li><a href="#who-we-are" onClick={(e) => handleScrollToSection(e, 'who-we-are')}>I. Identity</a></li>
                <li><a href="#data-collect" onClick={(e) => handleScrollToSection(e, 'data-collect')}>II. Data Collected</a></li>
                <li><a href="#data-usage" onClick={(e) => handleScrollToSection(e, 'data-usage')}>III. Data Usage</a></li>
                <li><a href="#legal-basis" onClick={(e) => handleScrollToSection(e, 'legal-basis')}>IV. Legal Basis</a></li>
                <li><a href="#cookies-storage" onClick={(e) => handleScrollToSection(e, 'cookies-storage')}>V. Storage</a></li>
                <li><a href="#service-providers" onClick={(e) => handleScrollToSection(e, 'service-providers')}>VI. Providers</a></li>
                <li><a href="#international" onClick={(e) => handleScrollToSection(e, 'international')}>VII. Transfers</a></li>
                <li><a href="#retention" onClick={(e) => handleScrollToSection(e, 'retention')}>VIII. Retention</a></li>
                <li><a href="#your-rights" onClick={(e) => handleScrollToSection(e, 'your-rights')}>IX. Adventurer Rights</a></li>
                <li><a href="#amendments" onClick={(e) => handleScrollToSection(e, 'amendments')}>X. Amendments</a></li>
              </ul>
            </nav>
          </header>

          {/* Section 1: Who We Are */}
          <section id="who-we-are" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">I.</span> Who We Are
            </h2>
            <div className="privacy-scribe-panel">
              <p>
                Mythrill is a virtual tabletop application for running tabletop role-playing games online.
                We believe in total transparency regarding your personal chronicles and privacy. For questions about
                this policy or your personal data, contact us at{' '}
                <a href="mailto:privacy@mythrill.net" className="privacy-link">
                  privacy@mythrill.net
                </a>.
              </p>
            </div>
          </section>

          {/* Section 2: Data We Collect */}
          <section id="data-collect" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">II.</span> Data We Collect
            </h2>
            <p>
              We only collect data strictly necessary to run your games, preserve session state, and maintain service
              reliability.
            </p>

            <div className="privacy-subcard-grid">
              <div className="privacy-subcard">
                <h3>Account Data</h3>
                <p>
                  When you create an account, we collect your email address and display name. If you sign in with
                  Google, we receive your basic Google profile (name and email). Guest accounts use a locally generated
                  identifier and no personal data is stored server-side.
                </p>
              </div>

              <div className="privacy-subcard">
                <h3>Game Data</h3>
                <p>
                  We store maps, tokens, characters, chat messages, combat state, and other content you create within
                  sessions. This data is linked to your room and persists until you delete it.
                </p>
              </div>

              <div className="privacy-subcard">
                <h3>Usage and Analytics Data</h3>
                <p>
                  We collect anonymized usage metrics including page views, feature interactions, session duration,
                  screen resolution, timezone, and browser user agent. This helps us understand how the app is used and
                  improve performance.
                </p>
              </div>

              <div className="privacy-subcard">
                <h3>Device and Log Data</h3>
                <p>
                  Our servers collect IP addresses, error logs, and connection metadata (such as Socket.IO session IDs)
                  for security monitoring, rate limiting, and debugging. This data is retained for a maximum of 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Data */}
          <section id="data-usage" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">III.</span> How We Use Data
            </h2>
            <ul className="privacy-ruled-list">
              <li>
                <strong>Provide the service</strong>: to deliver multiplayer rooms, authentication, and game features.
              </li>
              <li>
                <strong>Analytics and improvement</strong>: to understand usage patterns, fix bugs, and improve the
                application.
              </li>
              <li>
                <strong>Security and abuse prevention</strong>: to enforce rate limits, prevent unauthorized access, and
                protect the service.
              </li>
              <li>
                <strong>Communication</strong>: to send service-critical notifications (such as downtime alerts) if you
                have opted in.
              </li>
            </ul>
          </section>

          {/* Section 4: Legal Basis */}
          <section id="legal-basis" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">IV.</span> Legal Basis
            </h2>
            <p>We process your data under the following legal bases where applicable:</p>
            <ul className="privacy-ruled-list">
              <li>
                <strong>Contract</strong>: processing is necessary to provide the Mythrill service you signed up for.
              </li>
              <li>
                <strong>Consent</strong>: where you have given explicit consent, such as for analytics tracking. You can
                withdraw consent at any time (see below).
              </li>
              <li>
                <strong>Legitimate interests</strong>: for security monitoring, debugging, and service improvement.
              </li>
              <li>
                <strong>Legal obligation</strong>: where required by applicable law.
              </li>
            </ul>
          </section>

          {/* Section 5: Cookies and Browser Storage */}
          <section id="cookies-storage" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">V.</span> Cookies and Browser Storage
            </h2>
            <p>Mythrill uses the following browser technologies:</p>

            <ul className="privacy-ruled-list">
              <li>
                <strong>Essential cookies</strong>: Firebase Auth tokens for session management (required for login).
              </li>
              <li>
                <strong>localStorage / sessionStorage</strong>: room state, user preferences, UI state, and analytics
                session IDs.
              </li>
              <li>
                <strong>Firebase Analytics</strong>: first-party analytics cookies used to measure site usage (requires
                consent).
              </li>
            </ul>

            <div className="privacy-scribe-panel">
              <p>
                Essential storage is active by default and cannot be disabled. Analytics tracking is only enabled
                after you accept the consent banner.
              </p>
            </div>
          </section>

          {/* Section 6: Service Providers */}
          <section id="service-providers" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">VI.</span> Service Providers
            </h2>
            <p>We rely on the following third-party services to operate the virtual tabletop:</p>

            <ul className="privacy-ruled-list">
              <li>
                <strong>Google Firebase</strong>: authentication, Firestore database, Cloud Storage, and Analytics.
              </li>
              <li>
                <strong>Netlify</strong>: static hosting and CDN for the frontend application.
              </li>
              <li>
                <strong>Railway</strong>: hosting for the multiplayer game server.
              </li>
              <li>
                <strong>Socket.IO</strong>: real-time WebSocket communication for multiplayer sessions.
              </li>
            </ul>

            <p>
              These providers process data on our behalf under strict data processing agreements and are bound by their
              own privacy commitments.
            </p>
          </section>

          {/* Section 7: International Transfers */}
          <section id="international" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">VII.</span> International Transfers
            </h2>
            <p>
              Your data is stored in Firebase (Google Cloud) which may process data in the United States or other
              countries. Google Cloud participates in the EU-US Data Privacy Framework and provides appropriate
              safeguards for international transfers.
            </p>
          </section>

          {/* Section 8: Data Retention */}
          <section id="retention" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">VIII.</span> Data Retention
            </h2>
            <ul className="privacy-ruled-list">
              <li>
                <strong>Account data</strong>: retained for the lifetime of your account and deleted within 30 days after
                account deletion.
              </li>
              <li>
                <strong>Game data</strong>: retained until you delete the room or character, or until the room expires if
                inactive.
              </li>
              <li>
                <strong>Analytics data</strong>: retained for up to 14 months in Firebase Analytics, then automatically
                deleted.
              </li>
              <li>
                <strong>Server logs</strong>: retained for a maximum of 30 days.
              </li>
            </ul>
          </section>

          {/* Section 9: Your Rights */}
          <section id="your-rights" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">IX.</span> Your Rights
            </h2>
            <p>You have the following rights regarding your personal data:</p>

            <ul className="privacy-ruled-list">
              <li>
                <strong>Access</strong>: request a copy of your personal data.
              </li>
              <li>
                <strong>Correction</strong>: update your display name or email address.
              </li>
              <li>
                <strong>Deletion</strong>: delete your account and all associated data.
              </li>
              <li>
                <strong>Object</strong>: object to processing based on legitimate interests.
              </li>
              <li>
                <strong>Restrict</strong>: request restriction of processing.
              </li>
              <li>
                <strong>Data portability</strong>: request your data in a structured, machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent</strong>: withdraw analytics consent at any time via the consent banner or
                cookie settings. Analytics tracking will stop immediately.
              </li>
            </ul>

            <div className="privacy-scribe-panel">
              <p>
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:privacy@mythrill.net" className="privacy-link">
                  privacy@mythrill.net
                </a>. We will respond to your request within 30 days. You also have the right to lodge a complaint
                with a supervisory data protection authority in your jurisdiction.
              </p>
            </div>
          </section>

          {/* Section 10: Changes to This Policy */}
          <section id="amendments" className="privacy-section">
            <h2>
              <span className="section-roman" aria-hidden="true">X.</span> Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of material changes by
              updating the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this
              policy periodically.
            </p>
          </section>

          {/* Colophon & Return To Top */}
          <footer className="privacy-colophon">
            <div className="privacy-colophon-seal" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <p className="privacy-colophon-text">
              Inscribed for the tabletop adventurers, dungeon masters, and chroniclers of Mythrill.
            </p>
            <div className="privacy-colophon-actions">
              <button
                type="button"
                className="privacy-scroll-top-btn"
                onClick={scrollToTop}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                <span>Return to Top</span>
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
