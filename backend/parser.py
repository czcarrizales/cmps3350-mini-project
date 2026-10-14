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
)

operators = ["+", "-", "×", "÷", "^", "(", ")", "%"] # this is an updatable list of operators that get parsed
operator_pattern = "".join(re.escape(op) for op in operators)
TOKEN = re.compile(
    rf"\s*(\d+(?:\.\d*)?|\.\d+|[{operator_pattern}])"
)

def tokenize(expr):
    tokens, pos = [], 0
    expr = expr.strip()
    while pos < len(expr):
        m = TOKEN.match(expr, pos)
        token = m.group(1)
        tokens.append(token)
        pos = m.end()
    return tokens

### this happens in app.py
# raw expression string
# ↓
# tokenize(...)
# ↓
# list of tokens
# ↓
# Parser(tokens)
# ↓
# parser.expr()

### this happens in this Parser class (PEMDAS order but reverse because nesting returns backwards)
# expr() → handles + and -
# ↓
# term() → handles * and /
# ↓
# unary() → handles unary -, like -5
# ↓
# factor() → handles ^
# ↓
# atom() → handles numbers and (...)

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def peek(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None

    def next(self):
        token = self.peek()
        self.pos += 1
        return token

    def expr(self):
        v = self.term()
        while self.peek() in ('+', '-'):
            op = self.next()
            r = self.term()
            if op == '+':
                v = add(v, r)
            elif op == '-':
                v = subtract(v, r)
        return v

    def term(self):
        v = self.unary()
        while self.peek() in ('×', '÷'):
            op = self.next()
            r = self.unary()
            if op == '×':
                v = multiply(v, r)
            elif op == '÷':
                v = divide(v, r)
        return v

    def unary(self):
        if self.peek() == '-':
            self.next()
            return -self.unary()
        return self.factor()

    def factor(self):
        base = self.atom()
        if self.peek() == '^':
            self.next()
            return power(base, self.unary())
        return base

    def atom(self):
        token = self.next()
        
        if token == '(':
            v = self.expr()
            self.next()
            return v
        
        return float(token)