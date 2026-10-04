### by Brian Armijo

### features
###     calculates sine, cosine, tangent, cosecant, secant, cotangent using function(radians) format

### requirements
###     import math

import math

def sine(radians):
    return math.sin(radians)
def cosine(radians):
    return math.cos(radians)
def tangent(radians):
    return math.tan(radians)
def cosecant(radians):
    return 1/math.sin(radians)
def secant(radians):
    return 1/math.cos(radians)
def cotangent(radians):
    return 1/math.tan(radians)

### testing
import random

for _ in range(10):
    print("------------------------------")
    input = random.uniform(-10, 10)
    print("Input is", input)
    print("Sine is", sine(input))
    print("Cosine is", cosine(input))
    print("Tangent is", tangent(input))
    print("Cosecant is", cosecant(input))
    print("Secant is", secant(input))
    print("Cotangent is", cotangent(input))

############ this is a new entry to test doing a pull request...................