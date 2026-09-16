import React from 'react';
import { MarkdownContent } from '../contentFormatting';
import ResourceTableCard from './ResourceTableCard';

/**
 * "Playing in Person" reference block: physical materials, canonical d8 chart
 * and token colors generated from classResources.js, plus the authored process
 * notes kept from the legacy content.
 */
const ResourcePlayingInPerson = ({ section }) => {
 const hasMaterials = section.materials && section.materials.length > 0;
 const hasColors = section.colors && section.colors.length > 0;
 const hasSections = section.sections && section.sections.length > 0;

 return (
  <section className="rs-section rs-pip" id="resource-section-playingInPerson">
   <div className="rs-section__head">
    <span className="rs-section__badge">
     <i className="fas fa-dice-d20" /> PLAYING IN PERSON
    </span>
    <h4 className="rs-section__title">{section.title}</h4>
    {section.subtitle && <div className="rs-section__subtitle">{section.subtitle}</div>}
   </div>

   {section.intro && <MarkdownContent content={section.intro} />}

   {hasMaterials && (
    <div className="rs-pip__block">
     <h5>What You Need</h5>
     <div className="rs-pip__materials">
      {section.materials.map((item, index) => (
       <span className="rs-pip__material" key={index}>
        <i className="fas fa-circle" />
        {item}
       </span>
      ))}
     </div>
    </div>
   )}

   {section.chart && (
    <ResourceTableCard
     section={{
      kind: 'table',
      id: 'pipSphereChart',
      title: 'd8 → Sphere Chart',
      headers: section.chart.headers,
      rows: section.chart.rows,
      rowAccents: section.chart.rowAccents,
      defaultOpen: true,
     }}
     collapsible={false}
    />
   )}

   {hasColors && (
    <div className="rs-pip__block">
     <h5>Token Colors</h5>
     <div className="rs-pip__colors">
      {section.colors.map((color) => (
       <span className="rs-pip__color" key={color.name}>
        <i style={{ background: color.color }} aria-hidden="true" />
        {color.name}
       </span>
      ))}
     </div>
    </div>
   )}

   {hasSections &&
    section.sections.map((kept) => (
     <div className="rs-pip__block" key={kept.title}>
      <h5>{kept.title}</h5>
      <MarkdownContent content={kept.content} />
     </div>
    ))}
  </section>
 );
};

export default ResourcePlayingInPerson;
