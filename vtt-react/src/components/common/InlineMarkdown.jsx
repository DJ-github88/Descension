import React from 'react';

const INLINE_TOKEN_REGEX = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

/**
 * Renders inline markdown (**bold**, *italic*) from lore strings as real
 * <strong>/<em> elements instead of showing raw asterisks.
 */
const InlineMarkdown = ({ text }) => {
  if (!text || typeof text !== 'string' || !text.includes('*')) {
    return text || null;
  }

  return text.split(INLINE_TOKEN_REGEX).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export default InlineMarkdown;
