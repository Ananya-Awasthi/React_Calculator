import { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [currentOperand, setCurrentOperand] = useState("");
  const [previousOperand, setPreviousOperand] = useState("");
  const [operation, setOperation] = useState("");

  // Add digit or dot
  const addDigit = (digit) => {
    if (digit === "." && currentOperand.includes(".")) return;
    setCurrentOperand((prev) => prev + digit);
  };

  // Helper: perform operation
  const operate = (prev, current, op) => {
    let result;
    switch (op) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "÷":
        result = prev / current;
        break;
      default:
        result = current;
    }
    return result;
  };

  // Choose +, -, *, ÷
  const chooseOperation = (op) => {
    if (currentOperand === "" && previousOperand === "") return;

    // change operation if user just switches operator
    if (currentOperand === "" && previousOperand !== "") {
      setOperation(op);
      return;
    }

    if (previousOperand === "") {
      setPreviousOperand(currentOperand);
      setCurrentOperand("");
      setOperation(op);
      return;
    }

    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    const result = operate(prev, current, operation);
    setPreviousOperand(result.toString());
    setCurrentOperand("");
    setOperation(op);
  };

  const clear = () => {
    setCurrentOperand("");
    setPreviousOperand("");
    setOperation("");
  };

  const deleteDigit = () => {
    setCurrentOperand((prev) => prev.slice(0, -1));
  };

  const compute = () => {
    if (previousOperand === "" || currentOperand === "" || operation === "") return;

    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    const result = operate(prev, current, operation);
    setCurrentOperand(result.toString());
    setPreviousOperand("");
    setOperation("");
  };

  // 🔥 Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (key >= "0" && key <= "9") {
        addDigit(key);
        return;
      }

      if (key === ".") {
        addDigit(".");
        return;
      }

      if (key === "+" || key === "-" || key === "*" || key === "/") {
        // our UI uses "÷" but keyboard gives "/"
        const op = key === "/" ? "÷" : key;
        chooseOperation(op);
        return;
      }

      if (key === "Enter" || key === "=") {
        e.preventDefault();
        compute();
        return;
      }

      if (key === "Backspace") {
        deleteDigit();
        return;
      }

      if (key === "Escape") {
        clear();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      {/* Simple heading */}
      <h1 style={{ textAlign: "center", marginTop: "1rem", color: "white" }}>
        React Calculator
      </h1>

      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {previousOperand} {operation}
          </div>
          <div className="current-operand">{currentOperand || "0"}</div>
        </div>

        <button className="span-two" onClick={clear}>
          AC
        </button>
        <button onClick={deleteDigit}>DEL</button>
        <button onClick={() => chooseOperation("÷")}>÷</button>

        <button onClick={() => addDigit("1")}>1</button>
        <button onClick={() => addDigit("2")}>2</button>
        <button onClick={() => addDigit("3")}>3</button>
        <button onClick={() => chooseOperation("*")}>*</button>

        <button onClick={() => addDigit("4")}>4</button>
        <button onClick={() => addDigit("5")}>5</button>
        <button onClick={() => addDigit("6")}>6</button>
        <button onClick={() => chooseOperation("+")}>+</button>

        <button onClick={() => addDigit("7")}>7</button>
        <button onClick={() => addDigit("8")}>8</button>
        <button onClick={() => addDigit("9")}>9</button>
        <button onClick={() => chooseOperation("-")}>-</button>

        <button onClick={() => addDigit(".")}>.</button>
        <button onClick={() => addDigit("0")}>0</button>

        <button className="span-two" onClick={compute}>
          =
        </button>
      </div>
    </>
  );
}

export default App;

