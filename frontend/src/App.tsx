import { useState } from "react";
import "./App.css";


// One saved calculation in the history.
type HistoryItem = {
  expression: string;
  result: string;
};


function App() {
  // What is currently shown on the calculator screen.
  const [display, setDisplay] = useState("0");

  // Stores only the 3 most recent successful calculations.
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Controls whether the history panel is visible.
  const [showHistory, setShowHistory] = useState(false);

  // Lets us know that the last thing the user did was press "=".
  // This helps decide whether the next button should start a new
  // calculation or continue using the previous answer.
  const [justEvaluated, setJustEvaluated] = useState(false);


  // Send the full expression to the Flask backend.
  //
  // Example:
  // "5+3×2"
  //
  // The backend/parser handles PEMDAS and returns the answer.
  async function evaluate(expression: string) {
    const response = await fetch("http://127.0.0.1:5000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression }),
    });

    const data = await response.json();

    // If the backend returned an error,
    // send that error to the catch block below.
    if (!response.ok) {
      throw new Error(data.error || "Calculation failed");
    }

    return String(data.result);
  }


  // Clear the current calculation.
  // This does NOT erase calculation history.
  function clearCalculator() {
    setDisplay("0");
    setJustEvaluated(false);
  }


  // Delete the last character from the display.
  function handleDeleteKey() {
    if (display.length <= 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }

    setJustEvaluated(false);
  }


  // Handles nearly every calculator button.
  async function handleButtonClick(value: string) {
    // Clear button
    if (value === "C") {
      clearCalculator();
      return;
    }


    // Equals button
    if (value === "=") {
      try {
        // Save the expression before the display
        // gets replaced by the answer.
        const expression = display;

        const result = await evaluate(expression);

        // Add the newest successful calculation
        // to the beginning of history.
        //
        // slice(0, 3) means we keep only
        // the 3 newest calculations.
        setHistory((previousHistory) =>
          [
            { expression, result },
            ...previousHistory,
          ].slice(0, 3)
        );

        setDisplay(result);
        setJustEvaluated(true);

      } catch (error) {
        // Show a readable backend error on the calculator.
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        setDisplay(`Error: ${message}`);
        setJustEvaluated(true);
      }

      return;
    }


    // These are operations that can continue using
    // the previous answer.
    //
    // Example:
    // 5 + 5 = 10
    // then pressing "+" allows:
    // 10+
    const continuationOperators = [
      "+",
      "-",
      "×",
      "÷",
      "^",
      "%",
      "²",
    ];


    // If "=" was just pressed:
    if (justEvaluated) {
      // If the next button is an operator,
      // continue calculating with the previous answer.
      if (continuationOperators.includes(value)) {
        setDisplay(display + value);
      }

      // Otherwise, start a completely new calculation.
      else {
        setDisplay(value);
      }

      setJustEvaluated(false);
      return;
    }


    // Replace the starting 0 instead of creating things
    // like "05".
    if (display === "0") {
      setDisplay(value);
      return;
    }


    // Otherwise, add the pressed button to the expression.
    setDisplay(display + value);
  }


  return (
    <div className="calculator">
  <div className="calculator-header">
    <h1>Calculator</h1>

    <button
      className="history-toggle"
      onClick={() => setShowHistory(!showHistory)}
    >
      {showHistory ? "Hide History" : "History"}
    </button>
  </div>

  {showHistory && (
    <div className="history-card">
      <h3>Recent Calculations</h3>

      {history.length === 0 ? (
        <p className="empty-history">No calculations yet.</p>
      ) : (
        history.map((item, index) => (
          <div className="history-item" key={index}>
            <div className="history-expression">{item.expression}</div>
            <div className="history-result">= {item.result}</div>
          </div>
        ))
      )}
    </div>
  )}

  <div className="display-card">
    <div className="display">{display}</div>
  </div>

  <div className="buttons">
    <button onClick={() => handleButtonClick("sin(")}>sin</button>
    <button onClick={() => handleButtonClick("cos(")}>cos</button>
    <button onClick={() => handleButtonClick("tan(")}>tan</button>
    <button onClick={() => handleButtonClick("sqrt(")}>√</button>

    <button onClick={() => handleButtonClick("csc(")}>csc</button>
    <button onClick={() => handleButtonClick("sec(")}>sec</button>
    <button onClick={() => handleButtonClick("cot(")}>cot</button>
    <button onClick={() => handleButtonClick("²")}>x²</button>

    <button onClick={() => handleButtonClick("abs(")}>|x|</button>
    <button onClick={() => handleButtonClick("recip(")}>1/x</button>
    <button onClick={() => handleButtonClick("%")}>%</button>
    <button onClick={() => handleButtonClick("^")}>xʸ</button>

    <button onClick={() => handleButtonClick("(")}>(</button>
    <button onClick={() => handleButtonClick(")")}>)</button>
    <button onClick={() => handleButtonClick("C")}>C</button>
    <button onClick={handleDeleteKey}>DEL</button>

    <button onClick={() => handleButtonClick("7")}>7</button>
    <button onClick={() => handleButtonClick("8")}>8</button>
    <button onClick={() => handleButtonClick("9")}>9</button>
    <button onClick={() => handleButtonClick("÷")}>÷</button>

    <button onClick={() => handleButtonClick("4")}>4</button>
    <button onClick={() => handleButtonClick("5")}>5</button>
    <button onClick={() => handleButtonClick("6")}>6</button>
    <button onClick={() => handleButtonClick("×")}>×</button>

    <button onClick={() => handleButtonClick("1")}>1</button>
    <button onClick={() => handleButtonClick("2")}>2</button>
    <button onClick={() => handleButtonClick("3")}>3</button>
    <button onClick={() => handleButtonClick("-")}>−</button>

    <button onClick={() => handleButtonClick("0")}>0</button>
    <button onClick={() => handleButtonClick(".")}>.</button>
    <button onClick={() => handleButtonClick("+")}>+</button>
    <button className="equals" onClick={() => handleButtonClick("=")}>
      =
    </button>
  </div>
</div>
  );
}

export default App;