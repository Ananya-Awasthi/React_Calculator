import React, { useState, useEffect } from "react";
import DisplayWindow from "./DisplayWindow.jsx";
import KeyWindow from "./KeyWindow.jsx";
import HistoryPanel from "./HistoryPanel.jsx";

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [displayEXP, setDisplayEXP] = useState("");
  const [result, setResult] = useState("0");
  const [isScientific, setIsScientific] = useState(false);
  const [justPercent, setJustPercent] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ================= OPERATOR MAP ================= */

  const map = {
    sin: "Math.sin(",
    cos: "Math.cos(",
    tan: "Math.tan(",
    log: "Math.log10(",
    ln: "Math.log(",
    "√": "Math.sqrt(",
    π: "Math.PI",
    e: "Math.E",
    "^": "**",
    x: "*",
    "÷": "/",
  };

  /* ================= HELPERS ================= */

  const getLastNumber = (exp) => {
    const m = exp.match(/(\d+\.?\d*)$/);
    return m ? m[0] : "";
  };

  const applyPercent = (exp) => {
    const num = getLastNumber(exp);
    if (!num) return exp;
    return exp.slice(0, -num.length) + `(${num}/100)`;
  };

  const autoCloseBrackets = (exp) => {
    const open = (exp.match(/\(/g) || []).length;
    const close = (exp.match(/\)/g) || []).length;
    return exp + ")".repeat(open - close);
  };

  const normalizeTrig = (exp) =>
    exp.replace(
      /Math\.(sin|cos|tan)\(([^()]+)\)/g,
      (_, fn, val) => `Math.${fn}((${val}) * Math.PI / 180)`
    );

  /* ================= CALCULATE ================= */

  const calculate = () => {
    try {
      let exp = autoCloseBrackets(expression);
      exp = normalizeTrig(exp);

      // eslint-disable-next-line no-eval
      let value = eval(exp);
      value = parseFloat(value.toFixed(10));

      setResult(value.toString());

      // save history
      setHistory((prev) => [
        { exp: displayEXP, res: value.toString() },
        ...prev.slice(0, 9),
      ]);
    } catch {
      setResult("Error");
    }
  };

  /* ================= SMART ( ) ================= */

  const handleParenthesis = () => {
    const open = (displayEXP.match(/\(/g) || []).length;
    const close = (displayEXP.match(/\)/g) || []).length;
    const last = displayEXP.slice(-1);
    const operators = ["+", "-", "x", "÷", "*", "/"];

    if (
      displayEXP === "" ||
      operators.includes(last) ||
      last === "("
    ) {
      setExpression((p) => p + "(");
      setDisplayEXP((p) => p + "(");
      return;
    }

    if (open > close && /\d|\)/.test(last)) {
      setExpression((p) => p + ")");
      setDisplayEXP((p) => p + ")");
      return;
    }

    setExpression((p) => p + "(");
    setDisplayEXP((p) => p + "(");
  };

  /* ================= INPUT HANDLER ================= */

  const handleButton = (val) => {
    if (val === "AC") {
      setExpression("");
      setDisplayEXP("");
      setResult("0");
      setJustPercent(false);
      return;
    }

    if (val === "DEL") {
      setExpression((p) => p.slice(0, -1));
      setDisplayEXP((p) => p.slice(0, -1));
      setJustPercent(false);
      return;
    }

    if (val === "=") {
      calculate();
      setJustPercent(false);
      return;
    }

    /* ===== HISTORY TOGGLE ===== */
    if (val === "HIS") {
      setShowHistory((p) => !p);
      return;
    }

    if (val === "( )") {
      handleParenthesis();
      return;
    }

    if (val === "%") {
      setExpression((p) => applyPercent(p));
      setDisplayEXP((p) => p + "%");
      setJustPercent(true);
      return;
    }

    if (val === ".") {
      const curr = getLastNumber(displayEXP);
      if (curr.includes(".")) return;

      setExpression((p) => p + (curr ? "." : "0."));
      setDisplayEXP((p) => p + (curr ? "." : "0."));
      return;
    }

    if (["sin", "cos", "tan", "log", "ln", "√"].includes(val)) {
      setExpression((p) => p + map[val]);
      setDisplayEXP((p) => p + val + "(");
      return;
    }

    setExpression((p) => {
      if (justPercent && /[\d(]/.test(val)) {
        setJustPercent(false);
        return p + "*" + (map[val] || val);
      }
      return p + (map[val] || val);
    });

    setDisplayEXP((p) => p + val);
  };

  /* ================= KEYBOARD ================= */

  useEffect(() => {
    const onKeyDown = (e) => {
      const k = e.key;

      if (!isNaN(k)) handleButton(k);
      if (["+", "-", "*", "/"].includes(k))
        handleButton(k === "*" ? "x" : k === "/" ? "÷" : k);
      if (k === ".") handleButton(".");
      if (k === "%") handleButton("%");
      if (k === "Enter") {
        e.preventDefault();
        handleButton("=");
      }
      if (k === "Backspace") handleButton("DEL");
      if (k === "Escape") handleButton("AC");
      if (k === "(" || k === ")") handleButton("( )");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="calculator">
        <DisplayWindow expression={displayEXP} result={result} />
        <KeyWindow
          handleButton={handleButton}
          isScientific={isScientific}
          toggleScientific={() => setIsScientific((p) => !p)}
        />
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={(exp) => {
            setDisplayEXP(exp);
            setExpression(exp);
            setResult("0");
            setShowHistory(false);
          }}
        />
      )}
    </>
  );
};

export default Calculator;


