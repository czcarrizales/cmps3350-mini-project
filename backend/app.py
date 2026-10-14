from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.calculations import (
    add,
    subtract,
    multiply,
    divide,
    power,
    square,
    square_root,
    percentage,
    absolute_value,
    reciprocal,
    sine,
    cosine,
    tangent,
    cosecant,
    secant,
    cotangent,
)

app = Flask(__name__)
CORS(app)

@app.get("/")
def home():
    return jsonify({"message": "Calculator backend is running"})

# @app.post("/calculate")
# def calculate():
#     data = request.get_json(silent=True)
#
#     if not isinstance(data, dict):
#         return jsonify({"error": "Request body must be JSON"}), 400
#
#     if "num1" not in data or "operator" not in data:
#         return jsonify({"error": "num1 and operator are required"}), 400
#
#     try:
#         num1 = float(data["num1"])
#         operator = data["operator"]
#         num2 = None
#
#         binary_operations = {
#             "+": add,
#             "-": subtract,
#             "×": multiply,
#             "÷": divide,
#             "^": power,
#         }
#
#         unary_operations = {
#             "square": square,
#             "sqrt": square_root,
#             "%": percentage,
#             "abs": absolute_value,
#             "1/x": reciprocal,
#             "sin": sine,
#             "cos": cosine,
#             "tan": tangent,
#             "csc": cosecant,
#             "sec": secant,
#             "cot": cotangent,
#         }
#
#         if operator in binary_operations:
#             if "num2" not in data:
#                 return jsonify({"error": "This operation needs num2"}), 400
#
#             num2 = float(data["num2"])
#             result = binary_operations[operator](num1, num2)
#
#         elif operator in unary_operations:
#             result = unary_operations[operator](num1)
#
#         else:
#             return jsonify({"error": "Unsupported operator"}), 400
#
#         if isinstance(result, float) and result.is_integer():
#             result = int(result)
#
#         return jsonify({"result": result})
#
#     except (TypeError, ValueError, ZeroDivisionError) as error:
#         return jsonify({"error": str(error)}), 400

from backend.parser import tokenize, Parser

@app.post("/evaluate")
def evaluate():
    try:
        # Get the JSON data that the frontend sent to the backend.
        # Example:
        # { "expression": "5+3" }
        data = request.get_json(silent=True)

        # Make sure we actually received usable data
        # and that it contains an expression to calculate.
        if not isinstance(data, dict) or "expression" not in data:
            return jsonify({"error": "Expression is required"}), 400

        expression = str(data["expression"])

        # Do not try to calculate an empty expression.
        if not expression.strip():
            return jsonify({"error": "Expression cannot be empty"}), 400

        # Break the expression into pieces the parser understands.
        # Example:
        # "5+3×2" becomes ["5", "+", "3", "×", "2"]
        tokens = tokenize(expression)

        # Give those pieces to the parser.
        # The parser handles things like PEMDAS and parentheses.
        parser = Parser(tokens)

        # Calculate the final answer.
        result = parser.expr()

        # If there are still unused pieces after the parser finishes,
        # something was probably wrong with the expression.
        # Example: "5)" should not quietly be accepted as just "5".
        if parser.peek() is not None:
            raise ValueError("Invalid expression")

        # If the answer is a decimal, limit it to 4 decimal places.
        # Example: 10 / 3 becomes 3.3333
        if isinstance(result, float):
            result = round(result, 4)

            # If the decimal is really a whole number,
            # display 5 instead of 5.0.
            if result.is_integer():
                result = int(result)

        # Send the successful answer back to the frontend.
        # Example:
        # { "result": 8 }
        return jsonify({"result": result})

    # Catch common calculation or input errors instead of letting
    # the Flask server crash and return an ugly server error.
    except (ValueError, TypeError, AttributeError, ZeroDivisionError) as error:

        # Send a readable error message back to the frontend.
        # HTTP 400 means the request could not be calculated as entered.
        return jsonify({"error": str(error)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
