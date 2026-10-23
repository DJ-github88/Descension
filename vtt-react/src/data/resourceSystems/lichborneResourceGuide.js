export const lichborneResourceGuide = {
  version: 2,
  tagline: 'The vessel can break. Track the anchor before you spend what keeps you here.',
  archetype: 'Vulnerable Anchor',
  vitals: [
    { icon: 'fa-gem', label: 'Integrity', value: '0-12' },
    { icon: 'fa-layer-group', label: 'Stage', value: '0-2' },
    { icon: 'fa-book', label: 'Traits', value: '2 prepared | active <= stage' },
    { icon: 'fa-snowflake', label: 'Anchor', value: 'intact or destroyed' }
  ],
  loop: {
    gain: { title: 'Record the Vessel', icon: 'fa-gem', text: 'Name the physical anchor, its location, ward and public condition. The anchor is a place and object, not an invisible backup.' },
    hold: { title: 'Track Integrity and Stage', icon: 'fa-heart-pulse', text: 'Anchor integrity runs 0-12 and undeath stage 0-2. Exactly two traits are prepared; active traits cannot exceed the stage, and the table records every suppression.' },
    spend: { title: 'Pay for Cold Power', icon: 'fa-snowflake', text: 'Spend integrity only as an authored record or manual table decision. Cold control and borrowed mortality never create a hidden second resource or free recovery.' },
    risk: { title: 'The Vessel Can Break', icon: 'fa-skull', text: 'An anchor is intact or destroyed, and the life state is active, dormant or dead. Repair only through authored records or a completed rest; no class-change, reconnect or initiative refill.' }
  },
  exampleTurn: '**Before play:** record the anchor id, location, ward and intact status, starting integrity 12, stage 0 and two prepared traits. **In play:** spend or lose integrity only by an explicit record, then update the stage and active traits by hand. **After a rest:** apply only the recovery the table actually recorded; nothing repairs automatically.',
  weaveIn: [
    { text: 'Two core grants and forty optional records keep integrity, traits, stage and recovery public.', tab: 'spells', tabLabel: 'browse the spellbook' },
    { text: 'Rime Sovereign, Phylactery Keeper and Veil Scholar each have a signature and capstone with tree gates.', tab: 'specializations', tabLabel: 'compare the three paths' },
    { text: 'Lichborne has no registered native heritage edge. Velun Neth and Tessen Human are recommendations only; the four acquisition requirements must be recorded.' }
  ],
  quickStart: {
    title: 'The First Vessel',
    headers: ['Action', 'Price', 'Result'],
    rows: [
      ['Record the anchor', 'Name id, location and ward', 'A physical vessel with a public condition'],
      ['Start play', 'Integrity 12; stage 0', 'Two prepared traits; no active trait yet'],
      ['Raise the stage', 'Authored record only', 'Stage 0-2; active traits cannot exceed it'],
      ['Lose integrity', 'Record 0-12', 'No automatic death save or repair'],
      ['Destroy the anchor', 'Record destroyed', 'No immunity or hidden replacement vessel'],
      ['Completed rest or authored repair', 'Recorded recovery', 'Integrity changes only by that record']
    ],
    footnote: 'Read-only display: no integrity, trait, suppression, stage, life state or repair is applied automatically.'
  },
  trackerHint: 'The integrated tracker starts uninitialized. It never invents an anchor, integrity value, stage, prepared trait, suppression or repair. Observer projections hide the anchor location and ward.',
  extraSections: [{
    kind: 'prose', id: 'lichborneAnchorLedger', title: 'The Anchor Ledger', icon: 'fa-gem',
    content: 'Record the anchor id, location, ward and intact or destroyed status. Integrity runs 0-12 and stage 0-2. Exactly two traits are prepared, and active traits cannot exceed the stage. Life state is active, dormant or dead. Repair comes only from an authored record or a completed rest; there is no class-change, reconnect or initiative refill.'
  }],
  playingInPerson: {
    materials: ['An anchor card with id, location and ward', 'An integrity track from 0-12', 'A stage marker from 0-2', 'Two prepared-trait cards and active-trait markers'],
    keepSections: ['tracking', 'anchor privacy', 'recovery label']
  }
};
