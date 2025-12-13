import React from "react";

const HistoryPanel = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="history-panel">
      <div className="history-title">History</div>

      {history.map((item, i) => (
        <div
          key={i}
          className="history-item"
          onClick={() => onSelect(item.exp)}
        >
          <span className="history-exp">{item.exp}</span>
          <span className="history-res">= {item.res}</span>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
