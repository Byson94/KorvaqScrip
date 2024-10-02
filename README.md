# KorvaqScrip
A programming language that is simple to learn and easy to use due to its simple syntax.

# KorvaqScrip Documentation

## Introduction
**KorvaqScrip** is a programming language designed to be simple to learn and easy to use due to its straightforward syntax. It allows users to write clear and concise code while supporting essential programming constructs and data types.

**NOTE:** In this documentation we have also added features that are under testing and development so some of the codes in this documentation wouldnt work!

## Table of Contents
1. [Basic Syntax](#basic-syntax)
2. [Variable Declarations](#variable-declarations)
   - [Mutable Variables](#mutable-variables)
   - [Immutable Variables](#immutable-variables)
3. [Data Types](#data-types)
   - [Numbers](#numbers)
   - [Strings](#strings)
   - [Booleans](#booleans)
4. [Control Structures](#control-structures)
   - [Conditional Statements](#conditional-statements)
   - [Loops](#loops)
5. [Functions](#functions)
6. [Output](#output)
7. [Expressions](#expressions)
   - [Assignments](#assignments)
   - [Binary Expressions](#binary-expressions)
   - [Function Calls](#function-calls)
8. [Arrays](#arrays)
9. [Comments](#comments)
10. [Examples](#examples)

## Basic Syntax
KorvaqScrip uses a clear and readable syntax to facilitate learning. Each statement is generally terminated with a semicolon (`;`), and code blocks are enclosed in braces (`{}`).

## Variable Declarations

### Mutable Variables
Mutable variables are declared using the `let` keyword. These variables can be reassigned after their initial declaration.

**Example**:
```korvaq
let x = 5;
x = 10; // x is now 10
```

### Immutable Variables
Immutable variables are declared using the `make` keyword. Once assigned, these variables cannot be changed.

**Example**:
```korvaq
make y = 3;
// y = 4; // This will result in an error
```

## Data Types

### Numbers
KorvaqScrip supports numerical literals, allowing users to perform mathematical operations.

**Example**:
```korvaq
let sum = 5 + 10; // sum is 15
```

### Strings
Strings can be defined using double quotes.

**Example**:
```korvaq
let greeting = "Hello, World!";
```

### Booleans
Boolean values can be `true` or `false`.

**Example**:
```korvaq
let isActive = true;
```

## Control Structures

### Conditional Statements
The `if` and `else` keywords allow for conditional execution of code blocks.

**Example**:
```korvaq
if (x > 5) {
    show "x is greater than 5";
} else {
    show "x is less than or equal to 5";
}
```

### Loops
The `loop` statement is used for iteration. It requires an identifier, a start value, and an end value.

**Example**:
```korvaq
loop i, 0, 5 {
    show i; // Displays numbers from 0 to 5
}
```

## Functions
Functions are declared using the `func` keyword. They can accept parameters and return values.

**Example**:
```korvaq
func add(a, b) {
    return a + b;
}
let result = add(5, 10); // result is 15
```

## Output
The `show` keyword is used to print values to the console.

**Example**:
```korvaq
show "Hello, World!";
```

## Expressions

### Assignments
Variables can be assigned values using the `=` operator.

**Example**:
```korvaq
let a = 10;
let b = 20;
a = b; // a is now 20
```

### Binary Expressions
KorvaqScrip supports binary expressions for arithmetic and logical operations.

**Example**:
```korvaq
let total = a + b; // total is 30
let isEqual = (a == b); // isEqual is false
```

### Function Calls
Functions can be called by their name followed by parentheses, with arguments passed inside.

**Example**:
```korvaq
let result = add(5, 10); // Calls the add function
```

## Arrays
Arrays are defined using square brackets (`[]`) and can hold multiple values.

**Example**:
```korvaq
let numbers = [1, 2, 3, 4, 5];
```

## Comments
Comments can be added using `//` for single-line comments.

**Example**:
```korvaq
// This is a comment
let z = 5; // This assigns 5 to z
```

## Examples
Here are some complete examples of KorvaqScrip code:

**Example 1**: A simple program that checks if a number is even or odd.
```korvaq
let number = 4;

if (number % 2 == 0) {
    show "Even";
} else {
    show "Odd";
}
```

**Example 2**: A function to calculate the sum of two numbers.
```korvaq
func sum(a, b) {
    return a + b;
}

let result = sum(5, 10); // result is 15
show result;
```

**Example 3**: Looping through an array.
```korvaq
let fruits = ["Apple", "Banana", "Cherry"];

loop i, 0, 2 {
    show fruits[i]; // Displays each fruit
}
```