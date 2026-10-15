// Authored preview copy only. These examples do not implement or approve rules.
const event = (id, phase, text, extra = {}) => ({ id, phase, text, ...extra });
const accepted = (id, text, extra) => event(id, 'outcome', text, { ...extra, accepted: true });
const frame = (announcement, reaction = null) => ({ events: [announcement], reaction });
const fireball = { title: 'Respond to Fireball', options: ['Counterspell', 'Intercept', 'Pass'], countdown: '8 s' };
const parry = { title: 'Parry opportunity', options: ['Parry', 'Pass'], countdown: '6 s' };
const riposte = { title: 'New Riposte opportunity', options: ['Riposte', 'Pass'], countdown: '5 s' };

export const scenarios = [
  {
    id: 'routine', title: 'Routine hit', description: 'A declaration, then a supplied accepted result. Expand the arithmetic without crowding the sentence.',
    frames: [
      frame(event('hit-1', 'declaration', 'Ilsa strikes at the goblin.')),
      frame(accepted('hit-2', 'Ilsa’s strike deals 6 slicing.', {
        arithmetic: '8 rolled − 2 mitigation = 6 slicing.', source: 'Fixture: publicly accepted strike result.'
      }))
    ]
  },
  {
    id: 'counterspell', title: 'Counterspell & interception', description: 'Declarations and commitments stay distinct from the supplied outcome. The intervention becomes unnecessary only when that outcome arrives.',
    frames: [
      frame(event('fire-1', 'declaration', 'Goblin casts Fireball at Marcus.')),
      frame(event('fire-2', 'opportunity', 'Fireball declared. A reaction opportunity is available.'), fireball),
      frame(event('fire-3', 'response', 'Marcus counters. Rocko commits to intercepting.', { important: true }), fireball),
      frame(accepted('fire-4', 'The Fireball collapses. Rocko’s intervention is unnecessary.', {
        source: 'Fixture: supplied public Counterspell outcome; no interception consequence is inferred.'
      }))
    ]
  },
  {
    id: 'parry', title: 'Parry → new Riposte opportunity', description: 'A successful Parry and a newly supplied Riposte opportunity are separate announcements. This preview does not create either window.',
    frames: [
      frame(event('parry-1', 'declaration', 'The goblin lunges at Ilsa.')),
      frame(event('parry-2', 'opportunity', 'Ilsa may respond to the incoming strike.'), parry),
      frame(event('parry-3', 'response', 'Ilsa parries.', { important: true }), parry),
      frame(accepted('parry-4', 'Ilsa’s Parry succeeds.')),
      frame(event('parry-5', 'opportunity', 'Riposte ready: your Parry succeeded.'), riposte),
      frame(event('parry-6', 'response', 'Ilsa commits to a riposte.', { important: true }), riposte),
      frame(accepted('parry-7', 'Ilsa’s riposte deals 4 slicing.', {
        arithmetic: '5 rolled − 1 mitigation = 4 slicing.', source: 'Fixture: publicly accepted Riposte result.'
      }))
    ]
  },
  {
    id: 'unknown', title: 'Unknown → confirmed result', description: 'Time passing, advancing a banner and changing a countdown cannot confirm an outcome. Only the final fixture supplies confirmation.',
    frames: [
      frame(event('unknown-1', 'declaration', 'Marcus casts Arcane Bolt at the goblin.')),
      frame(event('unknown-2', 'unresolved', 'Arcane Bolt is awaiting confirmation. No result is announced.', { certainty: 'pending' })),
      frame(event('unknown-3', 'unresolved', 'Arcane Bolt’s outcome is unknown. A confirmed public result has not arrived.', { certainty: 'unknown' })),
      frame(accepted('unknown-4', 'Confirmed: Arcane Bolt deals 3 arcane.', {
        arithmetic: '3 accepted arcane damage.', source: 'Fixture: later confirmed public result, supplied separately.'
      }))
    ]
  },
  {
    id: 'burst', title: 'Rapid announcements & long text', description: 'Send the burst to fill the four-slot queue. Routine overflow is grouped; priority results remain in history. Try a narrow viewport.',
    frames: [
      frame(event('burst-0', 'declaration', 'Archmagister Seraphina of the Seven Unbroken Oaths declares a strike against GrumbarStonewardKeeperOfTheEasternGate, beside the ruined observatory’s northern passage.')),
      ...Array.from({ length: 24 }, (_, index) => frame(event(`burst-${index + 1}`, index % 2 ? 'response' : 'declaration',
        index % 2 ? `Watchkeeper ${index + 1} acknowledges the movement.` : `Watchkeeper ${index + 1} declares a repositioning.`))),
      frame(accepted('burst-result-1', 'Seraphina’s strike deals 7 arcane to Grumbar Stoneward.', {
        arithmetic: '10 rolled − 3 mitigation = 7 arcane.', source: 'Fixture: accepted public strike result.'
      })),
      frame(accepted('burst-result-2', 'The eastern gate holds. The watchkeepers’ defense is confirmed.')),
      frame(event('burst-opportunity', 'opportunity', 'A new response opportunity is available to the watchkeepers.'),
        { title: 'Watchkeeper response', options: ['Respond', 'Pass'], countdown: '12 s' }),
      frame(accepted('burst-result-3', 'The observatory’s defenders complete their withdrawal.')),
      frame(accepted('burst-result-4', 'The final watchkeeper reaches the eastern gate.'))
    ]
  }
];
