# Base plan of the language

## Assigning variables
```
let example = 5;
make example = 5;
example = 5;
```

## Deleting variables
```
x = 7;
delvar x; // Variable now removed!

show x; // Output: Variable "x" is not defined.
```

## Showing information
```
show('Hey');
show "Hello";
```

## If/Else
```
example = 5;
If (example == 5) {
    show('example is equal to 5'); // Or can just use show 'example is equal to 5'
}
```

## Functions 
```
function greet(txt) {
    show txt
}

greet("Hey!")
```

## Loops
```
// nothing added yet
```