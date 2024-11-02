// translation from js to rs taking place

mod lexer;       // Declares the lexer module
mod parser;      // Declares the parser module
mod interpreter; // Declares the interpreter module

mod tokenTypes; // This tells Rust to look for a file named tokenTypes.rs in the same directory as main.rs
mod statements

use rustyline::Editor; // Import the rustyline crate for input handling
use std::process;     // Import process for exit functionality
use lexer::Lexer;     // Import Lexer from the current directory
use parser::Parser;   // Import Parser from the current directory
use interpreter::Interpreter; // Import Interpreter from the current directory

fn main() {
    // Create a new rustyline Editor instance
    let mut rl = Editor::<()>::new().unwrap();
    
    // Create a single Interpreter instance to maintain state
    let mut interpreter = Interpreter::new();

    println!("Welcome to KorvaqShell!");
    println!("Type .exit to quit");

    loop {
        // Prompt for user input
        let readline = rl.readline("> ");
        
        match readline {
            Ok(input) => {
                // Handle exit command
                if input.trim().to_lowercase() == ".exit" {
                    println!("Exiting...");
                    process::exit(0);
                }

                // Add input to history
                rl.add_history_entry(input.clone());

                // Process the input
                let lexer = Lexer::new(&input);
                let parser = Parser::new(lexer);
                
                match parser.parse() {
                    Ok(statements) => {
                        interpreter.interpret(statements); // Use the same interpreter for all inputs
                    },
                    Err(error) => {
                        eprintln!("Error: {}", error);
                    }
                }
            },
            Err(_) => {
                // Handle EOF or error
                println!("Exiting...");
                break;
            }
        }
    }
}
