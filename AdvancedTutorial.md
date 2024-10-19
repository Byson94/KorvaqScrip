# KorvaqScrip Documentation (advanced tutorial)
Welcome to the advanced tutorial of korvaqscrip!

## Table of Contents

1. [Error and alerts](#error-and-alerts)
2. [JSON](#json)
3. [Return value](#return-value)

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

## Return value
KorvaqScrip supports returning values using `return` keyword. This is useful for functions and other stuff.

**Example**:
```
func a() {
    temporaryVariable = "Hello, World!"
    return temporaryVariable

    show "example" // this wouldnt execute because, the function stops executing once it reaches a return statement.
}

b = call a() // to call a function inside a variable, you need to use the `call` keyword or else, the interpreter would think that you are trying to call another variable.
```