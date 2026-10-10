import re 
from backend.calculations import (
    add, 
    subtract,
    multiply,
    divide,
    power
)

TOKEN = re.compile(r"\s*(\d+\.?\d*|\.|d+|[-+*/^()])")

def tokenize(expr):
    tokens, pos = [], 0
    expr = expr.strip()
    while pos < len(expr):
        m = TOKEN.match(expr, pos)
        if not m:
            raise SyntaxError(f"Unexpected character: {expr[pos]}")
        token = m.group(1)
        tokens.append(token)
        pos = m.end()
    return tokens

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
        while self.peek() in ('*', '/'):
            op = self.next()
            r = self.unary()
            if op == '*':
                v = multiply(v, r)
            elif op == '/':
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
        if token is None:
            raise SyntaxError("Unexpected end of input")
        if token == '(':
            v = self.expr()
            if self.next() != ')':
                raise SyntaxError("Expected ')'")
            return v
        try:
            return float(token)
        except ValueError:
            raise SyntaxError(f"Unexpected token: {token}")