import React, { useState } from 'react';
import { parseTextWithLoreLinks } from '../contentFormatting';

/**
 * A parchment-styled table card with optional collapse behavior.
 * Used for Deep Dive lookup tables, Quick Start and the Reference tab.
 */
const ResourceTableCard = ({ section, collapsible = true }) => {
 const [open, setOpen] = useState(Boolean(section.defaultOpen) || !collapsible);

 const toggle = () => {
  if (collapsible) setOpen((value) => !value);
 };

 const headerContent = (
  <>
   <span className="rs-table-card__title">
    <i className="fas fa-scroll" />
    {section.title}
   </span>
   <span className="rs-table-card__meta">
    {section.rows.length} rows
    {collapsible && (
     <i className={`fas fa-chevron-${open ? 'up' : 'down'} rs-table-card__chevron`} />
    )}
   </span>
  </>
 );

 return (
  <section className={`rs-section rs-table-card${open ? ' is-open' : ''}`} id={`resource-section-${section.id}`}>
   {collapsible ? (
    <button
     type="button"
     className="rs-table-card__header"
     onClick={toggle}
     aria-expanded={open}
    >
     {headerContent}
    </button>
   ) : (
    <div className="rs-table-card__header rs-table-card__header--static">{headerContent}</div>
   )}

   {section.subtitle && (
    <div className="rs-table-card__subtitle">{parseTextWithLoreLinks(section.subtitle)}</div>
   )}

   {open && (
    <div className="rs-table-card__body">
     <div className="rs-table-wrap">
      <table className="rs-table">
       <thead>
        <tr>
         {section.headers.map((header, index) => (
          <th key={index}>{parseTextWithLoreLinks(header)}</th>
         ))}
        </tr>
       </thead>
       <tbody>
        {section.rows.map((row, rowIndex) => (
         <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'row-even' : 'row-odd'}>
          {row.map((cell, cellIndex) => (
           <td key={cellIndex}>
            {cellIndex === 0 && section.rowAccents && section.rowAccents[rowIndex] && (
             <span
              className="rs-dot"
              style={{ background: section.rowAccents[rowIndex] }}
              aria-hidden="true"
             />
            )}
            {parseTextWithLoreLinks(String(cell))}
           </td>
          ))}
         </tr>
        ))}
       </tbody>
      </table>
     </div>
     {section.footnote && (
      <div className="rs-table-card__footnote">
       <i className="fas fa-info-circle" />
       {parseTextWithLoreLinks(section.footnote)}
      </div>
     )}
    </div>
   )}
  </section>
 );
};

export default ResourceTableCard;
