import React from 'react';

const RulesSummaryBox = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="rules-summary-box">
      <div className="rules-summary-badge">
        <i className="fas fa-bookmark" />
        AT A GLANCE
      </div>
      <ul className="rules-summary-list">
        {items.map((item, idx) => (
          <li key={idx} className="rules-summary-item" dangerouslySetInnerHTML={{
            __html: typeof item === 'string'
              ? item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              : item
          }} />
        ))}
      </ul>
    </div>
  );
};

export default RulesSummaryBox;
