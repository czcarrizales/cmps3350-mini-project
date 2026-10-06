import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");

  const handleButtonClick = (value) => {
    if (value === "C") {
      setDisplay("0");
      return;
    }
    
    if (value === "=") {
      // We'll connect this to the backend later.
      return;
    }

    if (display === "0") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  return (
    <div className="calculator">
      <h1>Calculator</h1>

      <div className="display">{display}</div>

      <div className="buttons">
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

        <button onClick={() => handleButtonClick("C")}>C</button>
        <button onClick={() => handleButtonClick("0")}>0</button>
        <button onClick={() => handleButtonClick("+")}>+</button>
        <button className="equals" onClick={() => handleButtonClick("=")}>
          =
        </button>
      </div>
    </div>
  );
}

export default App;