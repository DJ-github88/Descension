import React, { useState, useEffect } from 'react';
import './TimelineDisplay.css';
import useTimelineStore from '../../store/timelineStore';

const EVENT_ART_MAP = {};

const getEventArt = (title) => {
 const matchedKey = Object.keys(EVENT_ART_MAP).find(k => title.toLowerCase().includes(k.toLowerCase()));
 return matchedKey ? EVENT_ART_MAP[matchedKey] : null;
};

const TimelineDisplay = () => {
 const E = useTimelineStore(state => state.getEraTimeline());
 const [showDMNotes, setShowDMNotes] = useState(false);
 const [expandedEras, setExpandedEras] = useState(E.map(() => true));

 useEffect(() => {
  setExpandedEras(E.map(() => true));
 }, [E]);

 const toggleEra = (idx) => {
  const next = [...expandedEras];
  next[idx] = !next[idx];
  setExpandedEras(next);
 };

 const runicDiamond = '\u25C6';
 const publicUrl = process.env.PUBLIC_URL || '';

 return (
  <div style={{ padding: '16px 20px 48px', maxWidth: '850px', margin: '0 auto', fontFamily: '"Crimson Text", "Georgia", serif' }}>
   {/* -- Header -- */}
   <div style={{
    textAlign: 'center', marginBottom: '24px', position: 'relative',
    padding: '16px 0 16px',
   }}>
    <div style={{
     position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
     background: 'linear-gradient(90deg, transparent, var(--rpg-gold, #c4a060), transparent)',
    }} />
    <h2 style={{
     fontFamily: '"Cinzel", serif', fontSize: '28px', color: '#4a150b', /* Rich Mahogany Ink */
     letterSpacing: '3px', margin: '0 0 6px', textTransform: 'uppercase',
     fontWeight: 700,
    }}>
     The Chronicle of the Sundering
    </h2>
    <div style={{
     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
     marginBottom: '4px',
    }}>
     <span style={{ color: 'var(--rpg-dark-gold, #8f6f35)', fontSize: '10px' }}>{runicDiamond}{runicDiamond}{runicDiamond}</span>
     <span style={{ color: '#6d4021', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 600 }}>
      From the First Stars to the Age of the Dimming
     </span>
     <span style={{ color: 'var(--rpg-dark-gold, #8f6f35)', fontSize: '10px' }}>{runicDiamond}{runicDiamond}{runicDiamond}</span>
    </div>
    <div style={{
     position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px',
     background: 'linear-gradient(90deg, transparent, var(--rpg-gold, #c4a060), transparent)',
    }} />
   </div>

   {/* -- DM Toggle -- */}
   <div style={{
    display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px',
    marginBottom: '20px', paddingRight: '4px',
   }}>
    <span style={{ color: '#6d4021', fontSize: '12px', fontStyle: 'italic', fontWeight: 600 }}>
     {showDMNotes ? 'GM Insights Revealed' : 'GM Insights Hidden'}
    </span>
    <button
     onClick={() => setShowDMNotes(!showDMNotes)}
     style={{
      background: showDMNotes
       ? 'linear-gradient(180deg, #8a1a10, #5a100a)'
       : 'linear-gradient(180deg, #f3ebd9, #eddcb8)',
      border: `1px solid ${showDMNotes ? 'var(--rpg-gold, #c4a060)' : 'rgba(196, 160, 96, 0.4)'}`,
      color: showDMNotes ? '#fffbf2' : '#5a1e12',
      padding: '5px 14px', borderRadius: '3px',
      cursor: 'pointer', fontFamily: '"Cinzel", serif', fontSize: '10px',
      fontWeight: 700, letterSpacing: '1px', transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
     }}
    >
     <i className={showDMNotes ? 'fas fa-eye' : 'fas fa-eye-slash'} style={{ marginRight: '6px' }} />
     {showDMNotes ? 'HIDE GM NOTES' : 'SHOW GM NOTES'}
    </button>
   </div>

   {/* -- Timeline -- */}
   <div style={{ position: 'relative', paddingLeft: '45px' }}>
    {/* Elegant Gold-and-Iron Spine */}
    <div style={{
     position: 'absolute', left: '17px', top: '12px', bottom: '12px', width: '2px',
     background: 'linear-gradient(to bottom, var(--rpg-gold, #c4a060), var(--rpg-dark-gold, #8f6f35), #8a1a10, #5c4033, #2b1c11)',
     boxShadow: '0 0 4px rgba(139, 69, 19, 0.2)',
    }} />

    {E.map((era, ei) => {
     const expanded = expandedEras[ei];
     const isLast = ei === E.length - 1;

     return (
      <div key={ei} style={{ marginBottom: isLast ? '0' : '40px' }}>
       {/* Era plaque header */}
       <div
        onClick={() => toggleEra(ei)}
        style={{
         display: 'flex', alignItems: 'center', gap: '12px',
         marginLeft: '-58px', marginBottom: expanded ? '16px' : '8px',
         cursor: 'pointer', userSelect: 'none',
        }}
       >
        {/* Custom Wax-Sealed Node */}
        <div style={{
         width: '28px', height: '28px', borderRadius: '50%',
         background: 'linear-gradient(135deg, #a82015 0%, #70110a 100%)',
         border: '2px solid var(--rpg-gold, #c4a060)',
         flexShrink: 0,
         display: 'flex', alignItems: 'center', justifyContent: 'center',
         boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
         transition: 'all 0.25s ease',
         transform: expanded ? 'scale(1.15) rotate(10deg)' : 'scale(1)',
        }}>
         <span style={{ color: '#fffbf2', fontSize: '10px', fontWeight: 700 }}>
          {expanded ? runicDiamond : '\u25B8'}
         </span>
        </div>

        <div style={{ flex: 1, borderBottom: '1px solid rgba(196, 160, 96, 0.2)', paddingBottom: '4px' }}>
         <h3 style={{
          fontFamily: '"Cinzel", serif', fontSize: '1.25rem', color: '#4a150b',
          margin: 0, letterSpacing: '1px', fontWeight: 700,
         }}>
          {era.name}
          {era.span && (
           <span style={{
            fontSize: '0.95rem', color: 'var(--rpg-dark-gold, #8f6f35)', marginLeft: '12px',
            fontWeight: 600, fontStyle: 'italic',
           }}>
            : {era.span}
           </span>
          )}
         </h3>
        </div>
       </div>

       {/* Collapsible era content */}
       {expanded && (
        <div style={{ paddingLeft: '4px' }}>
         {/* Era narrative quote */}
         <div style={{
          margin: '0 0 20px 4px', padding: '12px 18px',
          borderLeft: '3px solid var(--rpg-dark-gold, #8f6f35)',
          background: 'rgba(196, 160, 96, 0.04)',
          borderRadius: '0 4px 4px 0',
         }}>
          <p style={{
           margin: 0, color: '#5a1e12', fontSize: '1.05rem',
           fontStyle: 'italic', lineHeight: '1.6',
          }}>
           &ldquo;{era.quote}&rdquo;
          </p>
         </div>

         {/* GM Overview */}
         {showDMNotes && era.dmOverview && (
          <div style={{
           margin: '0 0 20px 4px', padding: '12px 18px',
           background: 'rgba(138, 26, 16, 0.03)',
           border: '1px dashed rgba(138, 26, 16, 0.35)',
           borderRadius: '4px',
          }}>
           <span style={{
            fontSize: '9px', color: '#8a1a10', fontFamily: '"Cinzel", serif',
            letterSpacing: '2px', display: 'block', marginBottom: '6px',
            fontWeight: 700
           }}>
            GM ARCHIVAL INSIGHT
           </span>
           <p style={{
            margin: 0, color: '#4a3728', fontSize: '0.98rem',
            lineHeight: '1.55', fontStyle: 'italic',
           }}>
            {era.dmOverview}
           </p>
          </div>
         )}

         {/* Event cards list */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '4px' }}>
          {era.events.map((ev, ei2) => {
           const artImage = getEventArt(ev.title);
           const dateStr = ev.dateDisplay || (ev.date && typeof ev.date === 'object' ? `Year ${ev.date.year}` : ev.date) || '';
           const narrativeText = ev.narrative || ev.description || '';

           return (
            <div key={ei2} className="timeline-card">
             <div className="timeline-card-header">
              <h4 className="timeline-card-title">{ev.title}</h4>
              <span className="timeline-card-date">{dateStr}</span>
             </div>
             <div className="timeline-card-body">
              {artImage && (
               <div className="timeline-art-container">
                <img 
                 src={`${publicUrl}/assets/images/${artImage}`} 
                 alt={ev.title} 
                 className="timeline-art" 
                />
               </div>
              )}
              <p dangerouslySetInnerHTML={{
               __html: narrativeText.replace(
                /\*\*(.*?)\*\*/g,
                '<strong>$1</strong>'
               )
              }} />
             </div>

             {/* GM Hook (placed below, taking full width) */}
             {showDMNotes && ev.dmHook && (
              <div className="timeline-gm-hook">
               <span className="timeline-gm-hook-label">
                CAMPAIGN HOOK
               </span>
               <p className="timeline-gm-hook-text">
                {ev.dmHook}
               </p>
              </div>
             )}
            </div>
           );
          })}
         </div>
        </div>
       )}
      </div>
     );
    })}
   </div>

   {/* -- Footer Quote -- */}
   <div style={{
    textAlign: 'center', marginTop: '36px', paddingTop: '20px',
    borderTop: '1px solid rgba(196, 160, 96, 0.25)',
   }}>
    <p style={{
     margin: 0, color: '#6d4021', fontSize: '1.05rem', fontStyle: 'italic',
     lineHeight: '1.65',
    }}>
     &ldquo;Sol cannot wake. Sol cannot die. Sol is being eaten from within.&rdquo;
     <br />
     <span style={{ fontSize: '0.85rem', color: 'var(--rpg-dark-gold, #8f6f35)', fontWeight: 600 }}>
      : Elder Thaeron, Sun-Speaker of the Harath-Vault
     </span>
    </p>
   </div>
  </div>
 );
};
export default TimelineDisplay;
