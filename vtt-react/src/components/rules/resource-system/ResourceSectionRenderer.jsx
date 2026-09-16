import React from 'react';
import SphereComboFinder from '../../../data/classes/arcanoneer/components/SphereComboFinder';
import { MarkdownContent, parseTextWithLoreLinks } from '../contentFormatting';
import ResourceTableCard from './ResourceTableCard';
import ResourcePlayingInPerson from './ResourcePlayingInPerson';

const SectionShell = ({ icon, title, subtitle, badge, className = '', children }) => (
 <section className={`rs-section ${className}`.trim()}>
  <div className="rs-section__head">
   {badge && (
    <span className="rs-section__badge">
     <i className={`fas ${badge.icon}`} /> {badge.label}
    </span>
   )}
   <h4 className="rs-section__title">
    {icon && <i className={`fas ${icon}`} />} {title}
   </h4>
   {subtitle && <div className="rs-section__subtitle">{subtitle}</div>}
  </div>
  {children}
 </section>
);

const StepsSection = ({ section }) => (
 <SectionShell icon="fa-shoe-prints" title={section.title}>
  <div className="rs-steps">
   {section.sections.map((step, index) => (
    <div className="rs-step" key={step.stepNumber || index}>
     <div className="rs-step__number">{step.stepNumber || index + 1}</div>
     <div className="rs-step__body">
      <div className="rs-step__title">{step.title}</div>
      {step.subtitle && <div className="rs-step__subtitle">{step.subtitle}</div>}
      <MarkdownContent content={step.content} />
     </div>
    </div>
   ))}
  </div>
 </SectionShell>
);

const ActionProfilesSection = ({ section }) => (
 <SectionShell icon="fa-crosshairs" title={section.title} subtitle={section.subtitle}>
  <div className="rs-action-grid">
   {section.actions.map((action, index) => (
    <div className="rs-action-card" key={index}>
     <div className="rs-action-card__head">
      <i className={`fas fa-${action.icon || 'bolt'}`} />
      <span>{action.name}</span>
     </div>
     <div className="rs-action-card__stats">
      <span>
       <b>Cost</b> {action.spheres} spheres + {action.mana} mana
      </span>
      <span>
       <b>Range</b> {action.range}
      </span>
      <span>
       <b>Target</b> {action.target}
      </span>
      <span>
       <b>Effect</b> {action.damage}
      </span>
     </div>
     {action.note && <div className="rs-action-card__note">{action.note}</div>}
    </div>
   ))}
  </div>
 </SectionShell>
);

const AbilityCardsSection = ({ section }) => (
 <SectionShell icon="fa-bolt" title={section.title} subtitle={section.subtitle}>
  <div className="rs-ability-grid">
   {section.abilities.map((ability, index) => (
    <div className="rs-ability-card" key={index}>
     <div className="rs-ability-card__head">
      {ability.name && <span className="rs-ability-card__name">{ability.name}</span>}
      {ability.type && <span className="rs-ability-card__type">{ability.type}</span>}
     </div>
     {ability.cost && <div className="rs-ability-card__cost">{ability.cost}</div>}
     {ability.description && (
      <div className="rs-ability-card__desc">{parseTextWithLoreLinks(ability.description)}</div>
     )}
    </div>
   ))}
  </div>
 </SectionShell>
);

const BaseVsRecipesSection = ({ section }) => (
 <SectionShell icon="fa-book-open" title={section.title} subtitle={section.subtitle}>
  <div className="rs-bvr__columns">
   {section.baselineCan && (
    <div className="rs-bvr__col rs-bvr__col--can">
     <div className="rs-bvr__col-title">
      <i className="fas fa-check" /> Base CAN
     </div>
     <ul>
      {section.baselineCan.map((item, index) => (
       <li key={index}>{parseTextWithLoreLinks(item)}</li>
      ))}
     </ul>
    </div>
   )}
   {section.baselineCannot && (
    <div className="rs-bvr__col rs-bvr__col--cannot">
     <div className="rs-bvr__col-title">
      <i className="fas fa-times" /> Base CANNOT
     </div>
     <ul>
      {section.baselineCannot.map((item, index) => (
       <li key={index}>{parseTextWithLoreLinks(item)}</li>
      ))}
     </ul>
    </div>
   )}
  </div>
  {section.recipeExamples && section.recipeExamples.length > 0 && (
   <div className="rs-bvr__recipes">
    {section.recipeExamples.map((example, index) => (
     <div className="rs-bvr__recipe" key={index}>
      <span className="rs-bvr__recipe-level">{example.level}</span>
      <span className="rs-bvr__recipe-name">{example.name}</span>
      <span className="rs-bvr__recipe-upgrade">{example.upgrade}</span>
     </div>
    ))}
   </div>
  )}
  {section.recipesUnlock && section.recipesUnlock.length > 0 && (
   <ul className="rs-bvr__unlock">
    {section.recipesUnlock.map((item, index) => (
     <li key={index}>{parseTextWithLoreLinks(item)}</li>
    ))}
   </ul>
  )}
 </SectionShell>
);

const TierCardsSection = ({ section }) => (
 <SectionShell icon="fa-layer-group" title={section.title} subtitle={section.subtitle}>
  <div className="rs-tier-grid">
   {section.tiers.map((tier, index) => (
    <div className={`rs-tier-card${tier.highlight ? ' is-highlight' : ''}`} key={index}>
     <div className="rs-tier-card__name">{tier.name}</div>
     <div className="rs-tier-card__meta">
      <span>
       <i className="fas fa-circle" /> {tier.sphereCost} spheres
      </span>
      <span>
       <i className="fas fa-tint" /> {tier.manaCost} mana
      </span>
      <span>
       <i className="fas fa-unlock" /> {tier.available}
      </span>
     </div>
     <div className="rs-tier-card__desc">{parseTextWithLoreLinks(tier.description)}</div>
    </div>
   ))}
  </div>
 </SectionShell>
);

const CardsSection = ({ section }) => (
 <SectionShell icon="fa-id-card" title={section.title}>
  <div className="rs-stat-cards">
   {section.cards.map((card, index) => (
    <div className="rs-stat-card" key={index}>
     <div className="rs-stat-card__title">{card.title}</div>
     {card.stats && <div className="rs-stat-card__stat">{card.stats}</div>}
     {card.details && (
      <div className="rs-stat-card__details">{parseTextWithLoreLinks(card.details)}</div>
     )}
    </div>
   ))}
  </div>
 </SectionShell>
);

const UsageSection = ({ section }) => (
 <SectionShell icon="fa-gauge-high" title={section.title}>
  <div className="rs-usage">
   {section.items.map((item, index) => (
    <div className="rs-usage__item" key={index}>
     <span className="rs-usage__label">{item.label}</span>
     <span className="rs-usage__text">{parseTextWithLoreLinks(item.text)}</span>
    </div>
   ))}
  </div>
 </SectionShell>
);

const CalloutSection = ({ section }) => (
 <section
  className={`rs-section rs-callout rs-callout--${section.tone || 'info'}`}
  id={`resource-section-${section.id}`}
 >
  <div className="rs-callout__title">
   {section.icon && <i className={`fas ${section.icon}`} />} {section.title}
  </div>
  <MarkdownContent content={section.content} />
 </section>
);

const InteractiveSection = ({ section, classData }) => (
 <SectionShell
  icon="fa-atom"
  title={section.title}
  subtitle={section.subtitle}
  className="rs-interactive"
 >
  <SphereComboFinder combinationMatrix={classData.combinationMatrix} />
 </SectionShell>
);

const ResourceSectionRenderer = ({ section, classData }) => {
 switch (section.kind) {
  case 'steps':
   return <StepsSection section={section} />;
  case 'actionProfiles':
   return <ActionProfilesSection section={section} />;
  case 'abilityCards':
   return <AbilityCardsSection section={section} />;
  case 'baseVsRecipes':
   return <BaseVsRecipesSection section={section} />;
  case 'tierCards':
   return <TierCardsSection section={section} />;
  case 'cards':
   return <CardsSection section={section} />;
  case 'usage':
   return <UsageSection section={section} />;
  case 'callout':
   return <CalloutSection section={section} />;
  case 'interactive':
   return <InteractiveSection section={section} classData={classData} />;
  case 'table':
   return <ResourceTableCard section={section} />;
  case 'playingInPerson':
   return <ResourcePlayingInPerson section={section} />;
  case 'prose':
   return (
    <SectionShell icon={section.icon} title={section.title} className="rs-prose">
     <MarkdownContent content={section.content} />
    </SectionShell>
   );
  default:
   return null;
 }
};

export default ResourceSectionRenderer;
