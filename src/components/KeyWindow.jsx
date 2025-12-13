import React from "react";

const KeyWindow = ({ handleButton, isScientific, toggleScientific }) => {
  const sciKeys = ["sin", "cos", "tan", "log","ln", "√", "^", "π"];

  const basicKeys = [
    "AC",
    "DEL",
    "%",
    "÷",
    "7",
    "8",
    "9",
    "x",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
    "HIS",
  ];

  return (
    <div className="keysWindow">
      {/* Toggle */}
      <button className="toggleBtn" onClick={toggleScientific}>
        {isScientific ? "Hide Advanced ▲" : "Show Advanced ▼"}
      </button>

      {/* Scientific */}
      {isScientific && (
        <div className="keys_scientific">
          {sciKeys.map((key, i) => (
            <button key={i} onClick={() => handleButton(key)}>
              {key}
            </button>
          ))}
        </div>
      )}

      {/* Basic */}
      <div className="keys_basic">
        {basicKeys.map((key, i) => (
          <button
            key={i}
            className={`${key >= "0" && key <= "9" ? "number" : ""} ${
              key === "=" ? "equal" : ""
            }`}
            onClick={() => handleButton(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KeyWindow;


