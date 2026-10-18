import { useState } from "react";
import "./App.css";

// click_sound1 - https://freesound.org/people/potentjello/sounds/194072/ - Buttons and Knobs 1.wav - potentjello
// click_sound2 - https://freesound.org/people/herraportti/sounds/436667/ - snap3.wav - herraportti
const click_sound1 = new Audio("/click1.wav");
const click_sound2 = new Audio("/click2.wav");
click_sound1.volume = 0.03;
click_sound2.volume = 0.3;

// One saved calculation in the history.
type HistoryItem = {
  expression: string;
  result: string;
};

const Operators = ["+", "-", "×", "÷", "^", "mod" ] // symbols that can't appear twice in a row
function isNonduplicateOperator(value: string) { return Operators.includes(value)}

function endsWithOperator(expression: string) {
  return Operators.some((operator) => expression.endsWith(operator));
}

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

const [showAdvanced, setShowAdvanced] = useState(false);
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



  // toggle between display formatting for default display, fractional display, and scientific notation display
  type DisplayMode = "normal" | "fraction" | "scientific";
  const [displayMode, setDisplayMode] = useState<DisplayMode>("normal");
  function formatDisplay(value: string, mode: DisplayMode): string {
    const number = Number(value);

    // Don't try to format expressions/errors/etc.
    if (Number.isNaN(number)) {
      return value;
    }
    if (mode === "normal") {
      return String(number);
    }
    if (mode === "scientific") {
      return number.toExponential();
    }
    if (mode === "fraction") {
      return decimalToFraction(number);
    }
    return value;
  }
  function decimalToFraction(value: number): string {
    const maxDenominator = 100;

    let bestNumerator = 1;
    let bestDenominator = 1;
    let smallestError = Math.abs(value - 1);

    for (let denominator = 1; denominator <= maxDenominator; denominator++) {
      const numerator = Math.round(value * denominator);
      const error = Math.abs(value - numerator / denominator);

      if (error < smallestError) {
        smallestError = error;
        bestNumerator = numerator;
        bestDenominator = denominator;
      }
    }

    return `${bestNumerator}/${bestDenominator}`;
  }




  // Handles nearly every calculator button.
  async function handleButtonClick(value: string) {
    // Clear button
    if (value === "C") {
      clearCalculator();
      return;
    }

    function safeSetDisplay() { //filters adding two operators in a row
      //if (!(isNonduplicateOperator(display.at(-1) ?? "") && isNonduplicateOperator(value))) {
      if (!(endsWithOperator(display) && isNonduplicateOperator(value))) {
        setDisplay(display + value);
      }
    }

    // Equals button
    if (value === "=") {
      click_sound2.currentTime = 0;
      click_sound2.play();

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
    } else {
      click_sound1.currentTime = 0;
      click_sound1.play();
    }

    if (value === "format") {
      setDisplayMode(current => {
        if (current === "normal") return "fraction";
        if (current === "fraction") return "scientific";
        return "normal";
      });

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
      "!",
      "mod",
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
    safeSetDisplay();
  }


  return (
    <div className="calculator">
  <div className="calculator-header">
  <h1>Calculator</h1>

  <div className="header-buttons">
    <button
      className="mode-button"
      onClick={() => setShowAdvanced(!showAdvanced)}
    >
      {showAdvanced ? "Basic" : "Scientific"}
    </button>

    <button
      className="history-toggle"
      onClick={() => setShowHistory(!showHistory)}
    >
      History
    </button>
  </div>
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
    <div className="display">{formatDisplay(display, displayMode)}</div>
  </div>

  <div className="buttons">
    {showAdvanced && ( // showAdvanced = scientific layout
    <>
      <button onClick={() => handleButtonClick("ln(")}>ln</button>
      <button onClick={() => handleButtonClick("log(")}>log</button>
      <button onClick={() => handleButtonClick("mod")}>mod</button>
      <button onClick={() => handleButtonClick("!")}>x!</button>

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
      <button onClick={() => handleButtonClick("π")}>pi</button>
      <button onClick={() => handleButtonClick("e")}>e</button>
    </>
  )}
    <button onClick={() => handleButtonClick("C")}>C</button>
    <button onClick={handleDeleteKey}>DEL</button>
    <button onClick={() => handleButtonClick("format")}>format</button>
    <button onClick={() => handleButtonClick("×")}>×</button>

    <button onClick={() => handleButtonClick("7")}>7</button>
    <button onClick={() => handleButtonClick("8")}>8</button>
    <button onClick={() => handleButtonClick("9")}>9</button>
    <button onClick={() => handleButtonClick("÷")}>÷</button>

    <button onClick={() => handleButtonClick("4")}>4</button>
<button onClick={() => handleButtonClick("5")}>5</button>
<button onClick={() => handleButtonClick("6")}>6</button>
<button onClick={() => handleButtonClick("-")}>−</button>

<button onClick={() => handleButtonClick("1")}>1</button>
<button onClick={() => handleButtonClick("2")}>2</button>
<button onClick={() => handleButtonClick("3")}>3</button>
<button onClick={() => handleButtonClick("+")}>+</button>


<button onClick={() => handleButtonClick("0")}>0</button>
<button onClick={() => handleButtonClick(".")}>.</button>
<button className="equals" onClick={() => handleButtonClick("=")}>
  =
</button>
  </div>
</div>
  );
}

export default App;