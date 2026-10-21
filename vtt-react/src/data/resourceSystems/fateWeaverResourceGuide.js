export const fateWeaverResourceGuide = {
  version: 2,
  tagline: 'Three threads, three links, and a public promise before the consequence.',
  archetype: 'Finite Consented Links',
  vitals: [
    { icon: 'fa-link', label: 'Threads', value: '3 tokens | max 3 links' },
    { icon: 'fa-handshake', label: 'Consent', value: 'recorded both ways' },
    { icon: 'fa-hourglass-half', label: 'Recovery', value: 'completed long rest only' },
    { icon: 'fa-book', label: 'Mode', value: 'manual tabletop only' }
  ],
  loop: {
    gain: { title: 'Reserve a Real Thread', icon: 'fa-link', text: 'Tie the Thread reserves one of three tokens and records both endpoints, a public purpose, consent, one use and expiry. Tie and Cut are core grants.' },
    hold: { title: 'Keep the Promise Visible', icon: 'fa-eye', text: 'Every link names its source, target, public purpose, token state, remaining uses and absolute expiry. At most three links and one consequence per link per round.' },
    spend: { title: 'Choose Who Bears the Risk', icon: 'fa-scale-balanced', text: 'A transfer moves at most three points of original assigned damage after mitigation to the caster. Ward, severance and re-anchoring use the same token record; none is a second bank.' },
    risk: { title: 'A Broken Link Has a Price', icon: 'fa-scissors', text: 'Expired links leave their token recovering until a completed long rest. Cut links follow their own authored refund. No reconnect, initiative or scene-change refill; consent withdrawal ends the link immediately.' }
  },
  exampleTurn: '**Turn 1:** Reserve one token with Tie the Thread and record a public purpose. **Turn 2:** Use Shared Burden to redirect up to 2 original damage, then mark the use once. **Turn 3:** Cut the link with Cut Clean, or let it expire and leave the token recovering. No automatic AP, damage, expiry or recovery is applied.',
  weaveIn: [
    { text: 'Forty optional records and two core records; every price, consent term and expiry stays visible.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Covenant Weaver, Thread Cutter and Tapestry Keeper each have a signature and capstone with tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Fate Weaver has no registered native heritage edge. Kessen Neth access is not implied; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Thread', headers: ['Action', 'Price', 'Result'], rows: [
      ['Tie the Thread', '1 AP; reserve 1 token', 'One consented link, one use, expires at your next turn start'],
      ['Cut Clean', '1 AP', 'End one link; its token becomes free immediately'],
      ['Shared Burden', '1 AP; learned optional', 'Redirect up to 2 original damage to you, once'],
      ['Read the Bond', '2 AP; learned optional', 'Public purpose, consent, uses and expiry only'],
      ['Completed long rest', 'Explicit settled event', 'All recovering tokens become free'],
      ['Sever the Borrowed Crown', '2 AP; learned signature', 'End one link and suppress one benefit until the target next turn ends']
    ],
    footnote: 'Read-only display: no token, link, AP, HP, movement, expiry or recovery is automatically applied.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents a token, link, consent record, expiry or refill. Observer projections contain counts and public terms only.',
  extraSections: [{
    kind: 'prose', id: 'fateWeaverLedger', title: 'The Thread Ledger', icon: 'fa-link',
    content: 'Record each link exactly once: both endpoints, public purpose, consent, token state, remaining uses and absolute expiry. Three tokens and three links are hard caps. Expired links recover only on a completed long rest. This is a manual tabletop record, not an automated combat authority.'
  }],
  tableMeta: { activePricingTable: { title: 'All 48 Active Prices', defaultOpen: false } },
  playingInPerson: {
    materials: ['Three distinct thread tokens', 'Three link cards naming both endpoints and the public purpose', 'A consent record and a use/expiry record', 'A completed-rest marker'],
    keepSections: ['tracking', 'consent', 'rest label']
  }
};
