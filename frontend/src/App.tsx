import { useState } from "react";
import "./App.css";
// import { calculate } from "./api";

// //helper logic functions
const binaryOperators = ["+", "-", "×", "÷", "^"] // check list for full inclusions
const unaryOperators = ["sin", "cos", "tan", "sqrt", "square", "abs", "1/x"] // check list for full inclusions
// function isNumber(value: string) { return /^[0-9.]$/.test(value)}
// function isBinaryOperator(value: string) { return binaryOperators.includes(value)}
// function isUnaryOperator(value: string) { return unaryOperators.includes(value)}
function isOperator(value: string) { return unaryOperators.includes(value) || binaryOperators.includes(value)}

function App() {
  const [display, setDisplay] = useState("0");


  // //values to handle number and operator storage
  // const [num1, setNum1] = useState<string | null>(null)
  // const [operator, setOperator] = useState<string | null>(null)
  // const [num2, setNum2] = useState<string | null>(null)
  // const [calcState, setCalcState] = useState<CalcState>("EMPTY")
  // type CalcState = "EMPTY" | "NUM1" | "BINARY" | "UNARY" | "UNARY_NUM" | "BINARY_NUMS" | "ANSWER"
  // // example states: __        34       34+        sin        sin(34        34+8          <result>

  // function resetInputs() { setNum1(null); setOperator(null); setNum2(null); setCalcState("EMPTY")}

  function clearCalculator() {
    setDisplay("0");
    // resetInputs();
  }

  // async function calculateSafely(
  //   firstNumber: string | null,
  //   selectedOperator: string | null,
  //   secondNumber?: string | null
  // ) {
  //   if (firstNumber === null || selectedOperator === null) {
  //     return;
  //   }
  //
  //   try {
  //     const data = await calculate(
  //       Number(firstNumber),
  //       selectedOperator,
  //       secondNumber === null || secondNumber === undefined
  //         ? undefined
  //         : Number(secondNumber)
  //     );
  //
  //     // resetInputs();
  //     setDisplay(String(data.result));
  //     // setCalcState("ANSWER");
  //   } catch (error) {
  //     const message =
  //       error instanceof Error
  //         ? error.message
  //         : "An unexpected error occurred";
  //
  //     // resetInputs();
  //     setDisplay(`Error: ${message}`);
  //     // setCalcState("ANSWER");
  //   }
  // }

  async function evaluate(expression: string) {
    const response = await fetch("http://127.0.0.1:5000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return String(data.result); 
  }

  const handleButtonClick = async (value) => {

    // console.log("before:", value, calcState, num1, operator, num2)

    if (value === "C") {
      clearCalculator();
      return;
    }
    
    if (value === "=") {
      try {
        setDisplay(await evaluate(display));
      } catch (e) {
        setDisplay((e as Error).message);
      }
      // resetInputs();
      return;
    }

     if (display === "0") {
       setDisplay(value);
     } else if ( !(isOperator(display.at(-1)) && isOperator(value)) ) { //filters adding two operators in a row
       setDisplay(display + value);
     }

    //logic to handle input states and reaction
    /*
    const input = String(value)
    if (calcState === "EMPTY") {
      if (isNumber(input)) { setNum1(input); setDisplay(value); setCalcState("NUM1")}
      else if (isUnaryOperator(input)) { setOperator(input); setDisplay(value); setCalcState("UNARY")}
      return
    }
    if (calcState === "NUM1") {
      if (isNumber(input)) { setNum1(num1 => (num1 ?? "") + input); setDisplay(display + value);}
      else if (isBinaryOperator(input)) { setOperator(input); setDisplay(display + value); setCalcState("BINARY")}
      //else if (isUnaryOperator(input)) {
       // setOperator(input);
       // const data = await calculate(num1, operator); //sends data to backend
        //resetInputs();
        //setDisplay(String(data.result));
        // console.log("FULL RESPONSE:", data)
        //setCalcState("ANSWER");}
        else if (isUnaryOperator(input)) {
        setOperator(input);
        await calculateSafely(num1, input);
      }
      return
    }
    if (calcState === "BINARY") {
      if (isNumber(input)) { setNum2(input); setDisplay(display + value); setCalcState("BINARY_NUMS")}
      return
    }
    if (calcState === "UNARY") {
      if (isNumber(input)) { setNum1(input); setDisplay(display + value); setCalcState("UNARY_NUM")}
      return
    }
    // if (calcState === "BINARY_NUMS") {
    //   if (isNumber(input)) { setNum2(num2 => (num2 ?? "") + input); setDisplay(display + value);}
    //   else if (input === "=") {
    //     setNum2(num2 => (num2 ?? "") + input);
    //     const data = await calculate(num1, operator, num2) //sends data to backend
    //     resetInputs();
    //     setDisplay(String(data.result));
    //     // console.log("FULL RESPONSE:", data)
    //     setCalcState("ANSWER");}
    // return
    //}
        if (calcState === "BINARY_NUMS") {
      if (isNumber(input)) {
        setNum2(num2 => (num2 ?? "") + input);
        setDisplay(display + value);
      } else if (input === "=") {
        await calculateSafely(num1, operator, num2);
      }
      return;
    }
    // if (calcState === "UNARY_NUM") {
    //   if (isNumber(input)) { setNum1(num1 => (num1 ?? "") + input); setDisplay(display + value);}
    //   else if (input === "=") {
    //     setNum1(num1 => (num1 ?? "") + input);
    //     const data = await calculate(num1, operator, num2); //sends data to backend
    //     resetInputs();
    //     setDisplay(String(data.result));
    //     // console.log("FULL RESPONSE:", data)
    //     setCalcState("ANSWER");}
    //   return
    // }
        if (calcState === "UNARY_NUM") {
      if (isNumber(input)) {
        setNum1(num1 => (num1 ?? "") + input);
        setDisplay(display + value);
      } else if (input === "=") {
        await calculateSafely(num1, operator);
      }
      return;
    }

    if (calcState === "ANSWER") {
      if (isNumber(input)) { resetInputs(); setNum1(input); setDisplay(value); setCalcState("NUM1")}
      else if (isUnaryOperator(input)) { resetInputs(); setOperator(input); setDisplay(value); setCalcState("UNARY")}
      return
    }*/
  };

  const handleDeleteKey= () => {
    setDisplay(display.slice(0, -1));
  }

  // const handleEqualKey = () => {
  //
  // }

  return (
    <div className="calculator">
      <h1>Calculator</h1>

      <div className="display">{display}</div>

      <div className="buttons">
        <button onClick={() => handleButtonClick("(")}>(</button>
        <button onClick={() => handleButtonClick(")")}>)</button>
        <button onClick={() => handleButtonClick("^")}>^</button>
        <button onClick={() => handleButtonClick(".")}>.</button>
        
        <button onClick={() => handleButtonClick("7")}>7</button>
        <button onClick={() => handleButtonClick("8")}>8</button>
        <button onClick={() => handleButtonClick("9")}>9</button>
        <button onClick={() => handleDeleteKey()}>DEL</button>
        

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
        <button onClick={() => handleButtonClick("÷")}>÷</button>
        <button className="equals" onClick={() => handleButtonClick("=")}>
          =
        </button>
      </div>
    </div>
  );
}

export default App;