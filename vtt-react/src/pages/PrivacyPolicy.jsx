import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy-container">
        <button className="privacy-back-btn" onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <h1>Privacy Policy</h1>
        <p className="privacy-effective-date">Last updated: July 1, 2026</p>

        <section>
          <h2>Who We Are</h2>
          <p>
            Mythrill is a virtual tabletop application for running tabletop role-playing games online.
            For questions about this policy, contact us at <strong>privacy@mythrill.net</strong>.
          </p>
        </section>

        <section>
          <h2>Data We Collect</h2>
          <h3>Account Data</h3>
          <p>
            When you create an account, we collect your email address and display name.
            If you sign in with Google, we receive your basic Google profile (name and email).
            Guest accounts use a locally generated identifier and no personal data is stored server-side.
          </p>

          <h3>Game Data</h3>
          <p>
            We store maps, tokens, characters, chat messages, combat state, and other content you create
            within sessions. This data is linked to your room and persists until you delete it.
          </p>

          <h3>Usage and Analytics Data</h3>
          <p>
            We collect anonymized usage metrics including page views, feature interactions, session duration,
            screen resolution, timezone, and browser user agent. This helps us understand how the app is used
            and improve performance.
          </p>

          <h3>Device and Log Data</h3>
          <p>
            Our servers collect IP addresses, error logs, and connection metadata (such as Socket.IO session IDs)
            for security monitoring, rate limiting, and debugging. This data is retained for a maximum of 30 days.
          </p>
        </section>

        <section>
          <h2>How We Use Data</h2>
          <ul>
            <li><strong>Provide the service</strong> — to deliver multiplayer rooms, authentication, and game features.</li>
            <li><strong>Analytics and improvement</strong> — to understand usage patterns, fix bugs, and improve the application.</li>
            <li><strong>Security and abuse prevention</strong> — to enforce rate limits, prevent unauthorized access, and protect the service.</li>
            <li><strong>Communication</strong> — to send service-critical notifications (e.g., downtime alerts) if you have opted in.</li>
          </ul>
        </section>

        <section>
          <h2>Legal Basis</h2>
          <p>
            We process your data under the following legal bases where applicable:
          </p>
          <ul>
            <li><strong>Contract</strong> — processing is necessary to provide the Mythrill service you signed up for.</li>
            <li><strong>Consent</strong> — where you have given explicit consent, such as for analytics tracking. You can withdraw consent at any time (see below).</li>
            <li><strong>Legitimate interests</strong> — for security monitoring, debugging, and service improvement.</li>
            <li><strong>Legal obligation</strong> — where required by applicable law.</li>
          </ul>
        </section>

        <section>
          <h2>Cookies and Browser Storage</h2>
          <p>
            Mythrill uses the following browser technologies:
          </p>
          <ul>
            <li><strong>Essential cookies</strong> — Firebase Auth tokens for session management (required for login).</li>
            <li><strong>localStorage / sessionStorage</strong> — room state, user preferences, UI state, and analytics session IDs.</li>
            <li><strong>Firebase Analytics</strong> — first-party analytics cookies used to measure site usage (requires consent).</li>
          </ul>
          <p>
            Essential storage is active by default and cannot be disabled. Analytics tracking is only enabled
            after you accept the consent banner.
          </p>
        </section>

        <section>
          <h2>Service Providers</h2>
          <p>We rely on the following third-party services:</p>
          <ul>
            <li><strong>Google Firebase</strong> — authentication, Firestore database, Cloud Storage, and Analytics.</li>
            <li><strong>Netlify</strong> — static hosting and CDN for the frontend application.</li>
            <li><strong>Railway</strong> — hosting for the multiplayer game server.</li>
            <li><strong>Socket.IO</strong> — real-time WebSocket communication for multiplayer sessions.</li>
          </ul>
          <p>
            These providers process data on our behalf under strict data processing agreements and are bound
            by their own privacy commitments.
          </p>
        </section>

        <section>
          <h2>International Transfers</h2>
          <p>
            Your data is stored in Firebase (Google Cloud) which may process data in the United States or other
            countries. Google Cloud participates in the EU-US Data Privacy Framework and provides appropriate
            safeguards for international transfers.
          </p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <ul>
            <li><strong>Account data</strong> — retained for the lifetime of your account and deleted within 30 days after account deletion.</li>
            <li><strong>Game data</strong> — retained until you delete the room or character, or until the room expires if inactive.</li>
            <li><strong>Analytics data</strong> — retained for up to 14 months in Firebase Analytics, then automatically deleted.</li>
            <li><strong>Server logs</strong> — retained for a maximum of 30 days.</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of your personal data.</li>
            <li><strong>Correction</strong> — update your display name or email address.</li>
            <li><strong>Deletion</strong> — delete your account and all associated data.</li>
            <li><strong>Object</strong> — object to processing based on legitimate interests.</li>
            <li><strong>Restrict</strong> — request restriction of processing.</li>
            <li><strong>Data portability</strong> — request your data in a structured, machine-readable format.</li>
            <li><strong>Withdraw consent</strong> — withdraw analytics consent at any time via the consent banner or cookie settings. Analytics tracking will stop immediately.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at <strong>privacy@mythrill.net</strong>.
            We will respond to your request within 30 days. You also have the right to lodge a complaint
            with a supervisory data protection authority in your jurisdiction.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify users of material changes
            by updating the "Last updated" date at the top of this page. We encourage you to review this
            policy periodically.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
