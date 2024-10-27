# Base plan of the language

## Assigning variables
```
let example = 5;
make example = 5;
example = 5;
```

## Deleting variables and functions
```
func a() {
    let b = "value";
}
x = 7;
delvar x; // Variable now removed!
delfunc b; // Function now removed!


show x; // Output: Variable "x" is not defined.
```

## Showing information
```
show('Hey');
show "Hello";

error('Hey');
error "Hello";

alert('Hey');
alert "Hello";
```

## If/Else
```
example = 5;
if (example == 5) {
    show('example is equal to 5'); // Or can just use show 'example is equal to 5'
} else {
    show "example is not equal to 5"
}

// or

if example == 5 {
    show('example is equal to 5'); // Or can just use show 'example is equal to 5'
} else {
    show "example is not equal to 5"
}
```

## Functions 
```
function greet(txt) {
    show txt
    return "a value"
}

greet("Hey!")

show call greet() // call is important
```

## Loops
```
a = true
while a == true {
    show "hi"
    a = false
}
```

Full design on the documentation!