import React from 'react';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';

/**
 * Robust scanner/tokenizer that converts markdown and LoreLink markup into clickable React nodes.
 * Moved out of ClassDetailDisplay.jsx so the resource-system tab can reuse the exact same parsing.
 */
export const parseTextWithLoreLinks = (text, skipAutoLink = false) => {
 if (!text || typeof text !== 'string') return null;

 // Dynamically auto-link all dictionary terminology first
 const processedText = skipAutoLink ? text : autoLinkTerminology(text);

 const result = [];
 const regex = /(<LoreLink termId="([^"]+)">([\s\S]*?)<\/LoreLink>|\*\*(.*?)\*\*|\*(.*?)\*)/g;
 let lastIndex = 0;
 let match;
 let key = 0;

 while ((match = regex.exec(processedText)) !== null) {
  // Add text before the match
  if (match.index > lastIndex) {
   result.push(processedText.substring(lastIndex, match.index));
  }

  if (match[2]) {
   // LoreLink match: match[2] is termId, match[3] is label
   const termId = match[2];
   const label = match[3];
   result.push(
   <LoreLink key={`lore-${key++}`} termId={termId}>
     {parseTextWithLoreLinks(label, true)}
   </LoreLink>
  );
  } else if (match[4] !== undefined) {
   // Bold match: match[4] is the bold content
   const boldText = match[4];
   result.push(
    <strong key={`bold-${key++}`}>
     {parseTextWithLoreLinks(boldText, skipAutoLink)}
    </strong>
   );
  } else if (match[5] !== undefined) {
   // Italic match: match[5] is the italic content
   const italicText = match[5];
   result.push(
    <em key={`italic-${key++}`}>
     {parseTextWithLoreLinks(italicText, skipAutoLink)}
    </em>
   );
  }

  lastIndex = regex.lastIndex;
 }

 // Add remaining text
 if (lastIndex < processedText.length) {
  result.push(processedText.substring(lastIndex));
 }

 return result.length > 0 ? result : processedText;
};

const isBullet = (line) => /^[-•]\s+/.test(line);
const isNumbered = (line) => /^\d+[.)]\s+/.test(line);
const isBoldOnly = (line) => /^\*\*(.+?)\*\*:?$/.test(line);
const isTableSeparator = (line) => line.includes('-') && /^\|?[\s:|-]+\|?$/.test(line);
const startsBlock = (line) =>
 line.startsWith('```') ||
 line.startsWith('|') ||
 isBullet(line) ||
 isNumbered(line) ||
 isBoldOnly(line);

const splitTableRow = (line) =>
 line
  .replace(/^\|/, '')
  .replace(/\|$/, '')
  .split('|')
  .map((cell) => cell.trim());

/**
 * Lightweight markdown block parser: paragraphs, bullets, numbered lists, bold-only
 * subheadings, fenced code blocks and pipe tables. Inline text is rendered through
 * parseTextWithLoreLinks so bold/italic/LoreLink markup behaves exactly like the rest
 * of the rules page.
 */
export const parseMarkdownBlocks = (content) => {
 if (!content || typeof content !== 'string') return [];

 const lines = content.split('\n');
 const blocks = [];
 let i = 0;

 while (i < lines.length) {
  const line = lines[i].trim();

  if (!line) {
   i++;
   continue;
  }

  if (line.startsWith('```')) {
   const code = [];
   i++;
   while (i < lines.length && !lines[i].trim().startsWith('```')) {
    code.push(lines[i]);
    i++;
   }
   i++;
   blocks.push({ type: 'code', text: code.join('\n') });
   continue;
  }

  if (line.startsWith('|')) {
   const tableLines = [];
   while (i < lines.length && lines[i].trim().startsWith('|')) {
    tableLines.push(lines[i].trim());
    i++;
   }
   if (tableLines.length >= 2 && isTableSeparator(tableLines[1])) {
    blocks.push({
     type: 'table',
     headers: splitTableRow(tableLines[0]),
     rows: tableLines.slice(2).map(splitTableRow),
    });
    continue;
   }
   i -= tableLines.length - 1;
   blocks.push({ type: 'paragraph', text: line });
   i++;
   continue;
  }

  if (isBullet(line) || isNumbered(line)) {
   const ordered = isNumbered(line);
   const items = [];
   while (i < lines.length) {
    const candidate = lines[i].trim();
    if (ordered ? isNumbered(candidate) : isBullet(candidate)) {
     items.push(candidate.replace(/^(?:[-•]|\d+[.)])\s+/, ''));
     i++;
    } else {
     break;
    }
   }
   blocks.push({ type: 'list', ordered, items });
   continue;
  }

  if (isBoldOnly(line)) {
   blocks.push({ type: 'subheading', text: line.match(/^\*\*(.+?)\*\*:?$/)[1] });
   i++;
   continue;
  }

  const paragraph = [line];
  i++;
  while (i < lines.length) {
   const candidate = lines[i].trim();
   if (!candidate || startsBlock(candidate)) break;
   paragraph.push(candidate);
   i++;
  }
  blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
 }

 return blocks;
};

const renderBlock = (block, index) => {
 switch (block.type) {
  case 'code':
   return (
    <pre className="md-code" key={index}>
     <code>{block.text}</code>
    </pre>
   );
  case 'table':
   return (
    <div className="md-table-wrap" key={index}>
     <table className="md-table">
      <thead>
       <tr>
        {block.headers.map((header, idx) => (
         <th key={idx}>{parseTextWithLoreLinks(header)}</th>
        ))}
       </tr>
      </thead>
      <tbody>
       {block.rows.map((row, rowIdx) => (
        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'row-even' : 'row-odd'}>
         {row.map((cell, cellIdx) => (
          <td key={cellIdx}>{parseTextWithLoreLinks(cell)}</td>
         ))}
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   );
  case 'list':
   return block.ordered ? (
    <ol className="md-list" key={index}>
     {block.items.map((item, idx) => (
      <li key={idx}>{parseTextWithLoreLinks(item)}</li>
     ))}
    </ol>
   ) : (
    <ul className="md-list" key={index}>
     {block.items.map((item, idx) => (
      <li key={idx}>{parseTextWithLoreLinks(item)}</li>
     ))}
    </ul>
   );
  case 'subheading':
   return (
    <h5 className="md-subheading" key={index}>
     {parseTextWithLoreLinks(block.text)}
    </h5>
   );
  case 'paragraph':
  default:
   return (
    <p className="md-paragraph" key={index}>
     {parseTextWithLoreLinks(block.text)}
    </p>
   );
 }
};

export const MarkdownContent = ({ content, className = '' }) => {
 if (!content || typeof content !== 'string') return null;
 const blocks = parseMarkdownBlocks(content);
 if (blocks.length === 0) return null;
 return (
  <div className={`md-content${className ? ` ${className}` : ''}`}>
   {blocks.map(renderBlock)}
  </div>
 );
};
