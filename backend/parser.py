import re

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
    natural_log,
    log,
    modula,
    factorial,
    pi_constant,
    e_constant,
)


# These are functions that take one value.
# The text on the left is what the parser will recognize.
functions = {
    "sqrt": square_root,
    "abs": absolute_value,
    "recip": reciprocal,
    "sin": sine,
    "cos": cosine,
    "tan": tangent,
    "csc": cosecant,
    "sec": secant,
    "cot": cotangent,
    "ln": natural_log,
    "log": log,
    "mod": modula,
}


# This pattern recognizes:
# numbers, function names, and calculator symbols.
TOKEN = re.compile(
    r"\s*(\d+(?:\.\d*)?|"
    r"\.\d+|"
    r"sqrt|abs|recip|sin|cos|tan|csc|sec|cot|ln|log|mod|"
    r"[+\-×÷^()%²!πe])"
)


def tokenize(expr):
    tokens = []
    pos = 0
    expr = expr.strip()

    # Move through the expression from left to right
    # and break it into pieces the parser understands.
    while pos < len(expr):
        match = TOKEN.match(expr, pos)

        # If nothing matches here, the user entered
        # something that this calculator does not understand.
        if match is None:
            raise ValueError("Invalid expression")

        tokens.append(match.group(1))
        pos = match.end()

    return tokens


class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0


    # Look at the next token without removing it.
    def peek(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]

        return None


    # Get the next token and move forward.
    def next(self):
        token = self.peek()
        self.pos += 1
        return token

    def starts_value(self, token):
        if token is None:
            return False

        if token in ("π", "e", "("):
            return True

        if token in functions:
            return True

        try:
            float(token)
            return True
        except ValueError:
            return False

    # Lowest priority:
    # addition and subtraction
    def expr(self):
        value = self.term()

        while self.peek() in ("+", "-"):
            operator = self.next()
            right = self.term()

            if operator == "+":
                value = add(value, right)

            elif operator == "-":
                value = subtract(value, right)

        return value


    # Multiplication and division happen
    # before addition and subtraction.
    def term(self):
        value = self.unary()

        while True:

            # Explicit multiplication/division
            if self.peek() in ("×", "÷"):
                operator = self.next()
                right = self.unary()

                if operator == "×":
                    value = multiply(value, right)

                elif operator == "÷":
                    value = divide(value, right)

            # Implicit multiplication
            elif self.starts_value(self.peek()):
                right = self.unary()
                value = multiply(value, right)

            else:
                break

        return value


    # Handles negative numbers and functions
    # such as sqrt(...), sin(...), etc.
    def unary(self):
        # Example: -5
        if self.peek() == "-":
            self.next()
            return -self.unary()

        # Example: sqrt(9)
        if self.peek() in functions:
            function_name = self.next()

            # A function must be followed by (
            if self.next() != "(":
                raise ValueError(
                    f"{function_name} must be followed by parentheses"
                )

            value = self.expr()

            # Make sure the function has a closing )
            if self.peek() is not None and self.next() != ")":
                raise ValueError("Missing closing parenthesis")

            # Run the matching function from calculations.py.
            return functions[function_name](value)

        return self.factor()


    # Handles exponents.
    def factor(self):
        value = self.postfix()

        if self.peek() == "^":
            self.next()
            exponent = self.unary()
            value = power(value, exponent)

        return value


    # Handles operations that come AFTER a number.
    #
    # Examples:
    # 50%     -> percentage(50)
    # 5²      -> square(5)
    # 5!      -> factorial(5)
    def postfix(self):
        value = self.atom()

        while self.peek() in ("%", "²", "!"):
            operator = self.next()

            if operator == "%":
                value = percentage(value)

            elif operator == "²":
                value = square(value)

            elif operator == "!":
                if value < 0 or not float(value).is_integer():
                    raise ValueError("Factorial requires a nonnegative integer")
                else:
                    value = factorial(int(value))

        return value


    # Highest-level basic pieces:
    # numbers and parentheses.
    def atom(self):
        token = self.next()

        if token is None:
            raise ValueError("Incomplete expression")

        if token == "π":
            return pi_constant()

        if token == "e":
            return e_constant()

        if token == "(":
            value = self.expr()

            if self.next() != ")":
                raise ValueError("Missing closing parenthesis")

            return value

        try:
            return float(token)

        except ValueError:
            raise ValueError("Invalid expression")