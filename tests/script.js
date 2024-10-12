import readline from 'readline'; // Import readline module
import Lexer from './lexer.js';     // Update path as needed
import Parser from './parser.js';   // Update path as needed
import Interpreter from './interpreter.js'; // Update path as needed

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Create a single Interpreter instance to maintain state
const interpreter = new Interpreter();

// Function to prompt user for input
function promptInput() {
    rl.question('> ', (input) => {
        if (input.trim().toLowerCase() === '.exit') {
            console.log('Exiting...');
            rl.close();
            return;
        }

        try {
            const lexer = new Lexer(input);
            const parser = new Parser(lexer);
            const statements = parser.parse();
            interpreter.interpret(statements); // Use the same interpreter for all inputs
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }

        promptInput(); // Prompt for new input again
    });
}

// Start the input prompt
console.log('Welcome to KorvaqShell!')
console.log('Type .exit to quit')
promptInput();
