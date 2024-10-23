# KorvaqScrip Documentation (advanced tutorial)
Welcome to the advanced tutorial of korvaqscrip!

## Table of Contents

1. [Error and alerts](#error-and-alerts)
2. [JSON](#json)
3. [Advanced Math](#advanced-math)
   - [Floor](#floor)
   - [Round](#round)
   - [SquareRoot](#square-root)
   - [Sine](#sine)
   - [Cosine](#cosine)
   - [Tangent](#tangent)
   - [Exponentiation](#exponentiation)
   - [Bitwise XOR](#bitwise-xor)
4. [Tokenization](#tokenization)
5. [Upper case and lower case](#upper-case-and-lower-case)
6. [Reverse](#reverse)
7. [Getting input](#getting-input)

## Error and alerts
Like show, we can also show errors and alerts as output. (Useful for webdevelopment)

**Example**:
```
error "This is an error" // throws an error

alert "This is an alert" // throws an alert
```

## JSON (JavaScript Object Notation)
KorvaqScrip supports JSON. It would be mainly used in webdevelopment where we have to interact with API's (Application Programming Interface) and other stuff related to webdevelopment. We will get to that later.

Currently KorvaqScrip supports turning something into JSON and turning JSON into something. (This is called serialization and deserialization)

We can use *tojson* to convert to JSON and *parjson* to parse JSON to store somewhere.

**Example**:
```
// tojson method
let obj = "example" 
let y = parjson obj // converts the value to JSON

// parjson method
let x = "{JSON: true}" // currently in JSON format

let a = parjson x // we convert the JSON into the variable "a"
```

## Advanced Math
### Floor
To remove decimals of a number, we use the `floor` keyword.

**Example**:
```
let a = 3.7 // not a natural number
let b = floor a // b is now 3
```

### Round
The `round` keyword is used to adjust a decimal number to the nearest integer based on certain rules. It does not simply "remove" the decimal; instead, it rounds the number to the nearest whole number:

**Example**:
```
let  a = 3.7 // not a natural number
show round a // outputs 4

// Another example:
let b = 3.4
show round b // outputs 3
```

### SquareRoot
To find the squareroot of a value, use the keyword `sqrt`

**Example**:
```
let x = 9.8
let y = sqrt x // y is now 3.13

show y // outputs 3.13

// We can also do this:
let z = sqrt 2
show z // outputs 1.41
```

### Sine
To calculate the sine of an angle (in radians), use the `sin` keyword.

**Example**:
```
let angle = 30 * (3.14 / 180); // Convert degrees to radians
let sineValue = sin angle; // sineValue is now approximately 0.5

show sineValue // outputs roughly 0.5 because we didnt use a more precise value for pi
```

### Cosine
To calculate the cosine of an angle (in radians), use the `cos` keyword.

**Example**:
```
let angle = 60 * (3.14 / 180); // Convert degrees to radians
let cosineValue = cos angle; // cosineValue is now approximately 0.5

show cosineValue // outputs roughly 0.5 because we didnt use a more precise value for pi

```

### Tangent
To calculate the tangent of an angle (in radians), use the `tan` keyword.

**Example**:
```
let angle = 45 * (3.14 / 180); // Convert degrees to radians
let tangentValue = tan angle; // tangentValue is now approximately 1

show tangentValue // outputs roughly 1 because we didnt use a more precise value for pi
```

### Exponentiation
To raise a number to the power of another number, use the `**` keyword.

**Example**:
```
let base = 3;
let exponent = 2;
let result = base ** exponent; // result is now 9

show result // outputs 9
```

### Bitwise XOR
To perform a bitwise XOR operation between two numbers, use the `^` keyword.

**Example**:
```
let a = 3; // In binary: 011
let b = 2; // In binary: 010
let result = a ^ b; // In binary: 001 (which is 1 in decimal)

show result // outputs 1
```

## Tokenization
KorvaqScrip supports tokenization of texts which can be useful on various scenarios like ml (machine learning). For this, we can use the `tokenize` keyword.

**Example**:
```
let a = "tempvalue"
b = "Hello, world from korvaq"
a = tokenize b

show a // output: ["Hello","world","from","korvaq"]
```

## Upper case and lower case
KorvaqScrip supports upper case and lower case conversion of texts. For this, you can use `uppercase` keyword to uppercase words and `lowercase` to lower case words.

**Example**:
```
let a = "hello, world from korvaq"

show uppercase a // outputs in all caps

let b = "HELLO, WORLD FROM KORVAQ"

show lowercase b
```

## Reverse
We can reverse a string or number by using the `reverse` keyword.

**Example**:
```
let a = "Hello, world from korvaq"

show reverse a // output: qavrok morf dlrow ,olleH

// now lets try with a number...
let b = 1234567890

show reverse b // output: 987654321 

// Quick note
show reverse 0123456789 // this would remove the 0 when reversing because if a 0 comes at the end of a number, it is not considered as a value by the interpreter. So it would remove it. However, if you need the 0 at the end, then you can submit the number as a string like this: "0123456789"
```

## Getting input
We can get an input from the user using `getinput` this is mainly useful on web enviornments.

**Example**:
```
let a = getinput("our question we need to ask...") // if you want you can leave it empty or add a number
show a
```