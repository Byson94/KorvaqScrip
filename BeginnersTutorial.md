# KorvaqScrip Documentation (beginner tutorial)

## Introduction
**KorvaqScrip** is a programming language designed to be simple to learn and easy to use due to its straightforward syntax. It allows users to write clear and concise code while supporting essential programming constructs and data types. "KorvaqScrip" uses the ".kq" file extension.

**NOTE:** In this documentation we have also added features that are under testing and development so some of the codes in this documentation wouldnt work!



## Table of Contents

1. [Basic Syntax](#basic-syntax)
2. [Data Types](#data-types)
   - [Numbers](#numbers)
   - [Strings](#strings)
   - [Booleans](#booleans)
   - [Arrays](#arrays)
3. [Variable Declarations](#variable-declarations)
   - [Mutable Variables](#mutable-variables)
   - [Immutable Variables](#immutable-variables)
   - [Deleting Variables](#deleting-variables)
4. [Output](#output)
5. [Control Structures](#control-structures)
   - [Conditional Statements](#conditional-statements)
   - [Loops](#loops)
6. [Expressions](#expressions)
   - [Assignments](#assignments)
   - [Binary Expressions](#binary-expressions)
   - [Function Calls](#function-calls)
7. [Functions](#functions)
   - [Return](#return)
   - [Delete Functions](#delete-functions)
8. [Comments](#comments)
9. [Linking Files](#linking-files)
10. [Running Asynchronous](#running-asynchronous)
11. [File Management](#file-management)
12. [Examples](#examples)
13. [Recommended Approaches](#recommended-approaches)
14. [Extra notes](#extra-notes)

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
Immutable variables are declared using the `make` keyword. Once assigned, these variables cannot be changed or be deleted.

**Example**:
```korvaq
make y = 3;

y = 4; // This will result in an error
```

### Deleting Variables
Everytime you declare a variable it is stored in memory. If variables are not removed from memory, it may lead to memory leaks and other issues. We can delete variables using the `delvar` keyword to delete variables after using them. **(NOTE: You cannot delete Immutable variables as told earlier!)**

**Example**:
```korvaq
let x = 21;
delvar x; // Deletes the variable

show x; // This will result in an error

// If you have made a huge project, then if you didnt delete variables it may lead to memory leaks. If you have many variables, you can just use `delvar all` to delete all variables.

// Example:
delvar all; // delete's all variables created.
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
let isActive = true
```

## Output
The `show` keyword is used to print values to the console.

**Example**:
```korvaq
show "Hello, World!"
```

## Control Structures

### Conditional Statements
The `if` and `else` keywords allow for conditional execution of code blocks.

**Example**:
```korvaq
if (x > 5) {
    show "x is greater than 5"
} else {
    show "x is less than or equal to 5"
}
```

### Loops
The `loop` statement is used for iteration. It requires an identifier, a start value, and an end value.

**Example**:
```korvaq
loop (i, 0, 5) {
    show i; // Displays numbers from 0 to 5
}
```

The `While` statement also does  iteration, but it requires a condition to be met before it stops.

**Example**:
```korvaq
example = false
while (example == false) {
    show "Example is false!"
    example = true
}
```

NOTE: THE LOOPS CAN ALSO CAUSE TROUBLE  IF NOT USED PROPERLY, SO USE THEM WITH CAUTION. BE CAUTIOUS OF INFINITE LOOPS THEY CAN CRASH THE PROGRAM.


## Functions
Functions are declared using the `func` keyword. They can accept parameters and return values.

**Example**:
```korvaq
func addVal(a, b) {
    show a + b // should output 15
}
addVal(5, 10); 
```

### Return
We can use the `return` keyword to stop the execution of an function and return a value. 
We need to use the `call` keyword to call a function inside a variable.

**Example**:
```korvaq
func addVal(a, b) {
    return a + b
}
b = call addVal(5, 10); // call keyword being used
show b // result is 15
```

## Delete Functions
We can use the `delfunc` keyword to delete functions from memory.

**Example**:
```korvaq
func a() {
    show "hi"
}

a() // outputs "hi"

delfunc a // deletes the function from memory.

a() // this would result in an error!
```

If there are many functions in the project, then you can use `delfunc all` to delete all functions.

**Example**:
```korvaq
func a() {
    show "hi"
}

func b() {
    show "bye"
}

a() // outputs "hi"
b() // outputs "bye"

delfunc all // deletes the function from memory.

a() // this would result in an error!
b() // this would also result in an error!
```

## Expressions

### Assignments
Variables can be assigned values using the `=` operator.

**Example**:
```korvaq
let a = 10
let b = 20
a = b; // a is now 20
```

### Binary Expressions
KorvaqScrip supports binary expressions for arithmetic and logical operations.

**Example**:
```korvaq
let total = a + b; // total is 30
let isEqual = (a == b); // isEqual is false
let isTrue = (x > y && y < z); // isTrue evaluates to true if both conditions are met
let isOther = (x > y || y < z); // isOther evaluates to true if at least one condition is met
```

### Function Calls
Functions can be called by their name followed by parentheses, with arguments passed inside.

**Example**:
```korvaq
func add1(a, b) {
    show "example"
    sum = a + b
}

add1(5, 10) // Calls the add function

show sum

delvar all

// NOTE: "ADD" IS A RESTRICTED KEYWORD
```

## Arrays
Arrays are defined using square brackets (`[]`) and can hold multiple values.

**Example**:
```korvaq
let numbers = [1, 2, 3, 4, 5]
```

In korvaq, an array is called as "arr" in shortform for simplicity.
We can add values to an array by using `arradd` for example:
```
exampleArray = ["exampleValue"]
arradd exampleArray "exampleValue2"

show exampleArray // output: ["exampleValue","exampleValue2"]
```

To remove the values in an array, we can use `arrdel`

**Example**:
```korvaq
let example = ["exampleValue"]
arrdel example "exampleValue" // this removes the string value from the array

let example2 = ["exampleValue"]
arrdel example2 0 // this removes the index value from the array

show example // outputs []
show example2 // outputs []
```

We can also get the length of arrays by using `arrsize`

**Example**:
```
let  numbers = [1, 2, 3, 4, 5]
show  arrsize numbers // output: 5

// If you want, then you can do "let x = arraylength numbers" to store the length in a variable
```

To get the value inside an array, we can use `arr arrayName[index]` for example:
```
let example = ["banana", "apple", "cherry"]
let x = arr example[0] // this would get the value as "banana"
let x = arr example[1] // this as "apple"
let x = arr example[2] // this as "cherry"

// "arr" is the keyword that states that you are calling an array and not any variable or other things.
```

If you think that it is a little complex on the arrays, just remember arr for `array`, arrayadd for `arradd`, arraydelete for `arrdel` and arraysize for `arrsize`

## Comments
Comments can be added using `//` for single-line comments.

**Example**:
```korvaq
// This is a comment
let z = 5; // This assigns 5 to z
```

## Linking Files
We can link 2 different .kq files together by using `connect` keyword.


**Example**:

*main.kq:*
```
show "hi"
```

*example.kq:*
```korvaq
connect "./main.kq" // this will output "hi"
```

## Running Asynchronous
Code's can be ran asynchorous by using the `async {}`  keyword.

**Example**:
```
async {
    show "hi" // hi is shown asynchoronous
}
```

## File Management
We can read files using the `read` keywords. 

NOTE: THIS FEATURE IS ONLY AVAILABLE ON THE KORVAQSHELL APPLICATION.

**Example**:
```
let example = read "example.txt"
// OR
read "example.txt" // this would directly show the readed contents on execution.
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

// This is result in even because % operation finds the remainder of a division operation
// So due to this reason, the 4 / 2 = 2 with remainder 0 and as the remainder is 0, it outputs "Even"
```

**Example 2**: A function to calculate the sum of two numbers.
```korvaq
func sum(a, b) {
    return a + b
}

valueGot = sum(6, 2)
show valueGot


// NOTE: "RETURN" IS A RESTRICTED KEYWORD, THATS WHY I USED "RETURNS"
```

**Example 3**: Looping through an array.
```korvaq
let fruits = ["Apple", "Banana", "Cherry"];

loop (i, 0, 2) {
    show fruits // Displays all fruits 2 times
}
```

## Recommended Approaches

### Variable Management
------------------
**Declaring Variables**

Use the let keyword for variable declarations. This will allow you to create variables that are limited to the scope they are declared in.

``` korvaq
let myVariable = 10;
```

***Using delvar and delvar all***

Utilize the delvar command to delete specific variables once they are no longer needed. This helps in managing memory effectively.

```korvaq
delvar myVariable; // Removes myVariable from memory
```

It is recommended to use `delvar all;` at the end of a script to clear all declared variables. This is particularly useful for preventing memory leaks in longer scripts. But `delvar all` may not be suited for all projects , especially those that require persistent data between multiple files.


```korvaq
delvar all; // Cleans up all declared variables
```

***Using delfunc and delfunc all***

Same like `delvar` and `delvar all` use `delfunc` to clean up functions and `delfunc` all to clean up all at once.
Generally,  it is a good practice to use `delfunc all` at the point where you dont need the functions you used till now of a script.

## Extra notes
KorvaqScrip omits any semi-colons (;) that come in the way of the script execution. This is why you dont need to use them in your scripts. This is a feature of KorvaqScrip and not a bug. This would also add an extra layer of security to obfuscated codes if we filled with semi-colons. 


So, this is the end of the beginners tutorial, the next tutorial is an advanced tutorial, you can find it here: [link](https://github.com/Byson94/KorvaqScrip/blob/main/AdvancedTutorial.md)