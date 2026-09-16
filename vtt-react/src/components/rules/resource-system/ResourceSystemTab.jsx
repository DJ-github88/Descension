import React, { useEffect, useMemo, useState } from 'react';
import ClassResourceBar from '../../hud/ClassResourceBar';
import { buildResourceSystemView } from '../../../data/resourceSystems/normalizeResourceSystem';
import { MarkdownContent, parseTextWithLoreLinks } from '../contentFormatting';
import ResourceSectionRenderer from './ResourceSectionRenderer';
import ResourceTableCard from './ResourceTableCard';
import './ResourceSystemTab.css';

const PANELS = [
 { id: 'essentials', label: 'Essentials', icon: 'fas fa-book-open' },
 { id: 'deep-dive', label: 'Deep Dive', icon: 'fas fa-cogs' },
 { id: 'reference', label: 'Reference', icon: 'fas fa-scroll' },
];

const LOOP_ORDER = ['gain', 'hold', 'spend', 'risk'];

const LoopPanel = ({ loop, exampleTurn }) => {
 const beats = LOOP_ORDER.map((key) => loop[key]).filter(Boolean);
 if (beats.length === 0) return null;

 return (
  <section className="rs-section rs-loop">
   <div className="rs-section__head">
    <h4 className="rs-section__title">
     <i className="fas fa-exchange-alt" /> The Core Loop
    </h4>
   </div>
   <div className="rs-loop__beats">
    {beats.map((beat, index) => (
     <React.Fragment key={beat.title || index}>
      <div className="rs-loop__beat">
       <div className="rs-loop__beat-top">
        <span className="rs-loop__beat-icon">
         <i className={`fas ${beat.icon}`} />
        </span>
        <span className="rs-loop__beat-index">{index + 1}</span>
       </div>
       <div className="rs-loop__beat-title">{beat.title}</div>
       <MarkdownContent content={beat.text} />
      </div>
      {index < beats.length - 1 && (
       <div className="rs-loop__arrow" aria-hidden="true">
        <i className="fas fa-arrow-right" />
       </div>
      )}
     </React.Fragment>
    ))}
   </div>
   {exampleTurn && (
    <div className="rs-example">
     <span className="rs-example__tag">
      <i className="fas fa-play" /> In play
     </span>
     <MarkdownContent content={exampleTurn} />
    </div>
   )}
  </section>
 );
};

const WeaveInPanel = ({ items, onNavigateTab }) => {
 if (!items || items.length === 0) return null;

 return (
  <section className="rs-section rs-weave">
   <div className="rs-section__head">
    <h4 className="rs-section__title">
     <i className="fas fa-sitemap" /> How It Weaves Into Your Class
    </h4>
   </div>
   <ul className="rs-weave__list">
    {items.map((item, index) => (
     <li className="rs-weave__item" key={index}>
      <i className="fas fa-angle-right" />
      <span className="rs-weave__text">{parseTextWithLoreLinks(item.text)}</span>
      {item.tab && onNavigateTab && (
       <button
        type="button"
        className="rs-weave__link"
        onClick={() => onNavigateTab(item.tab)}
       >
        {item.tabLabel || 'Open'} <i className="fas fa-arrow-right" />
       </button>
      )}
     </li>
    ))}
   </ul>
  </section>
 );
};

/**
 * Three-layer Resource System tab:
 *   Essentials  - the 30-second answer (hero, core loop, weave-in, quick start)
 *   Deep Dive   - mechanics detail, examples and interactive tools
 *   Reference   - lookup tables and playing-in-person tracking
 */
const ResourceSystemTab = ({ classData, regionInfo, demoResource, onNavigateTab }) => {
 const view = useMemo(() => buildResourceSystemView(classData), [classData]);
 const [panel, setPanel] = useState('essentials');

 useEffect(() => {
  setPanel('essentials');
 }, [view?.classId]);

 if (!view) return null;

 const panels = PANELS.filter(
  (entry) =>
   (entry.id !== 'deep-dive' || view.deepDive.length > 0) &&
   (entry.id !== 'reference' || view.reference.length > 0)
 );
 const activePanel = panels.some((entry) => entry.id === panel) ? panel : panels[0].id;
 const showTracker = activePanel === 'essentials';

 const accentStyle = {
  '--rs-accent': regionInfo?.accentColor || '#8b4513',
  '--rs-accent-glow': regionInfo?.glowColor || 'rgba(139, 69, 19, 0.15)',
  '--rs-border': regionInfo?.borderColor || '#8b4513',
  '--rs-accent-bg':
   regionInfo?.bgGradient ||
   'linear-gradient(135deg, rgba(139, 69, 19, 0.06) 0%, rgba(139, 69, 19, 0.02) 100%)',
 };

 const quickStart = view.essentials.quickStart;

 return (
  <div className="rs-tab" style={accentStyle}>
   <div className={`rs-hero${showTracker ? '' : ' rs-hero--compact'}`}>
    <div className="rs-hero__head">
     <span className="rs-hero__badge">
      <i className="fas fa-atom" /> Core Resource
     </span>
     <h3 className="rs-hero__title">{view.hero.title}</h3>
     {view.hero.tagline ? (
      <p className="rs-hero__tagline">{view.hero.tagline}</p>
     ) : (
      view.hero.subtitle && <p className="rs-hero__tagline">{view.hero.subtitle}</p>
     )}
     {view.hero.archetype && (
      <span className="rs-chip">
       <i className="fas fa-tag" /> {view.hero.archetype}
      </span>
     )}
    </div>

    {view.hero.vitals.length > 0 && (
     <div className="rs-vitals">
      {view.hero.vitals.map((vital, index) => (
       <div className="rs-vital" key={index}>
        <i className={`fas ${vital.icon}`} />
        <div>
         <span className="rs-vital__label">{vital.label}</span>
         <span className="rs-vital__value">{vital.value}</span>
        </div>
       </div>
      ))}
     </div>
    )}

    {showTracker && (
     <div className="rs-tracker">
      <div className="rs-tracker__label">
       <i className="fas fa-gauge-high" /> Interactive Preview
      </div>
      <div className="rules-resource-bar-container">
       <ClassResourceBar
        characterClass={classData.name}
        classResource={demoResource}
        size="large"
        context="hud"
        isGMMode={false}
        isOwner={true}
        showcase={true}
       />
      </div>
      <div className="rs-tracker__hint">
       <i className="fas fa-info-circle" /> {view.hero.trackerHint}
      </div>
     </div>
    )}
   </div>

   <nav className="rs-subnav" role="tablist" aria-label="Resource system sections">
    {panels.map((entry) => (
     <button
      key={entry.id}
      type="button"
      role="tab"
      aria-selected={activePanel === entry.id}
      className={`rs-subnav__btn${activePanel === entry.id ? ' is-active' : ''}`}
      onClick={() => setPanel(entry.id)}
     >
      <i className={entry.icon} /> {entry.label}
      {entry.id === 'reference' && (
       <span className="rs-subnav__count">{view.reference.length}</span>
      )}
     </button>
    ))}
   </nav>

   {activePanel === 'essentials' && (
    <div className="rs-panel" role="tabpanel">
     {view.essentials.loop && (
      <LoopPanel
       loop={view.essentials.loop}
       exampleTurn={view.essentials.exampleTurn}
      />
     )}
     <WeaveInPanel items={view.essentials.weaveIn} onNavigateTab={onNavigateTab} />
     {quickStart && (
      <ResourceTableCard
       section={{
        kind: 'table',
        id: 'quickStart',
        title: quickStart.title || 'Quick Start',
        headers: quickStart.headers,
        rows: quickStart.rows,
        footnote: quickStart.footnote,
        defaultOpen: true,
       }}
       collapsible={false}
      />
     )}
    </div>
   )}

   {activePanel === 'deep-dive' && (
    <div className="rs-panel" role="tabpanel">
     {view.deepDive.map((section) => (
      <ResourceSectionRenderer key={section.id} section={section} classData={classData} />
     ))}
    </div>
   )}

   {activePanel === 'reference' && (
    <div className="rs-panel rs-panel--reference" role="tabpanel">
     {view.reference.map((section) => (
      <ResourceSectionRenderer key={section.id} section={section} classData={classData} />
     ))}
    </div>
   )}
  </div>
 );
};

export default ResourceSystemTab;
