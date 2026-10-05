from flask import Flask, jsonify, request
from flask_cors import CORS

from calculations import (
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


@app.post("/calculate")
def calculate():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be JSON"}), 400

    if "num1" not in data or "operator" not in data:
        return jsonify({"error": "num1 and operator are required"}), 400

    try:
        num1 = float(data["num1"])
        operator = data["operator"]
        num2 = None

        binary_operations = {
            "+": add,
            "-": subtract,
            "*": multiply,
            "/": divide,
            "^": power,
        }

        unary_operations = {
            "square": square,
            "sqrt": square_root,
            "%": percentage,
            "abs": absolute_value,
            "1/x": reciprocal,
            "sin": sine,
            "cos": cosine,
            "tan": tangent,
            "csc": cosecant,
            "sec": secant,
            "cot": cotangent,
        }

        if operator in binary_operations:
            if "num2" not in data:
                return jsonify({"error": "This operation needs num2"}), 400

            num2 = float(data["num2"])
            result = binary_operations[operator](num1, num2)

        elif operator in unary_operations:
            result = unary_operations[operator](num1)

        else:
            return jsonify({"error": "Unsupported operator"}), 400

        if isinstance(result, float) and result.is_integer():
            result = int(result)

        return jsonify({"result": result})

    except (TypeError, ValueError, ZeroDivisionError) as error:
        return jsonify({"error": str(error)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)
