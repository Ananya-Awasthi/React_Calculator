import React from "react";

const DisplayWindow = ({ expression, result }) => {
  return (
    <div className="displayWindow">
      <div className="screen">
        <div className="expression">{expression || "0"}</div>
        <div className="result">{result}</div>
      </div>
    </div>
  );
};

export default DisplayWindow;

