import math


def add(num1, num2):
    return num1 + num2


def subtract(num1, num2):
    return num1 - num2


def multiply(num1, num2):
    return num1 * num2


def divide(num1, num2):
    if num2 == 0:
        raise ValueError("Cannot divide by zero")
    return num1 / num2


def power(num1, num2):
    return num1 ** num2


def square(num):
    return num ** 2


def square_root(num):
    if num < 0:
        raise ValueError("Cannot take the square root of a negative number")
    return math.sqrt(num)


def percentage(num):
    return num / 100


def absolute_value(num):
    return abs(num)


def reciprocal(num):
    if num == 0:
        raise ValueError("Cannot find the reciprocal of zero")
    return 1 / num


def sine(radians):
    return math.sin(radians)


def cosine(radians):
    return math.cos(radians)


def tangent(radians):
    return math.tan(radians)


def cosecant(radians):
    if math.sin(radians) == 0:
        raise ValueError("Cosecant is undefined")
    return 1 / math.sin(radians)


def secant(radians):
    if math.cos(radians) == 0:
        raise ValueError("Secant is undefined")
    return 1 / math.cos(radians)


def cotangent(radians):
    if math.tan(radians) == 0:
        raise ValueError("Cotangent is undefined")
    return 1 / math.tan(radians)


