mod ast;
mod interpreter;
mod lexer;
mod parser;
mod token_type;

use std::io::{self, Write};
use lexer::Lexer;
use parser::Parser;
use interpreter::Interpreter;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    println!("Welcome to KrovaqScrip v1.0.0");
    println!("type `.help` or `.license` for more information");
    let mut interpreter = Interpreter::new(); 

    loop {
        print!(">> ");
        io::stdout().flush()?;

        let mut input = String::new();
        io::stdin().read_line(&mut input)?;

        let input = input.trim();

        if input.is_empty() {
            continue;
        }

        if input == ".exit" {
            break;
        }

        if input == ".help" {
            print_help(); 
            continue;
        }

        if input == ".license" {
            print_license(); 
            continue;
        }

        let mut lexer = Lexer::new(input);
        let mut parser = Parser::new(lexer);

        // Parse the input and handle errors
        let ast = match parser.parse() {
            Ok(ast) => ast,
            Err(e) => {
                eprintln!("Parsing error: {}", e);
                continue;
            }
        };

        // Use the existing interpreter instance to interpret the AST
        if let Err(e) = interpreter.interpret(ast) {
            eprintln!("Interpretation error: {}", e);
        }

        print!("");
    }

    Ok(())
}

fn print_license() {
    println!("-----------------------------------------------------------------");
    println!("KORVAQ LICENSE");
    println!("-----------------------------------------------------------------");
    println!("Copyright (c) 2024 Byson94\n");
    println!("Permission is hereby granted, free of charge, to any person obtaining a copy");
    println!("of this software and associated documentation files (the \"Software\"), to deal");
    println!("in the Software without restriction, including without limitation the rights to");
    println!("use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies");
    println!("of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n");
    
    println!("1. If you use the source code of this software in your project,");
    println!("   you must include the copyright notice and permission notice in all copies");
    println!("   and credit the original project at least once in any of your documentation.\n");

    println!("2. This language is free to use and distribute files made using it. However,");
    println!("   you cannot take the entire project source code and sell or distribute it as your own");
    println!("   without making modifications. If you do make modifications to the source code,");
    println!("   you may then distribute the modified version BUT YOU MUST INCLUDE THIS LICENSE");
    println!("   IN THE MODIFIED VERSION RATHER THAN YOUR OWN LICENSE WHILE DISTRIBUTING ANY MODIFIED SOURCE CODE.\n");

    println!("3. You can freely distribute projects made using this software,");
    println!("   even if you have not modified the source code.\n");

    println!("THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR");
    println!("IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,");
    println!("FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE");
    println!("AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY,");
    println!("WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF, OR IN");
    println!("CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n");
    
    println!("-----------------------------------------------------------------");
}
fn print_help() {
    println!("-----------------------------------------------------------------");
    println!("KROVAQSCRIP HELP");
    println!("-----------------------------------------------------------------");
    println!("Welcome to KorvaqScrip v1.0.0! Here’s a guide to get you started:");
    println!();
    println!("COMMANDS:");
    println!(".help          - Display this help message.");
    println!(".license       - Show the Korvaq License for this software.");
    println!(".exit          - Exit the interpreter.");
    println!();
    println!("USAGE:");
    println!("Type KorvaqScrip commands and expressions directly at the prompt.");
    println!("The interpreter will evaluate and display the result if valid.");
    println!();
    println!("SYNTAX HIGHLIGHTS:");
    println!("let <var> = <value>     - Define a mutable variable.");
    println!("make <const> = <value>  - Define an immutable constant.");
    println!("show <expression>       - Print the result of an expression.");
    println!();
    println!("EXAMPLES:");
    println!("let x = 5               - Creates a variable 'x' with value 5.");
    println!("make PI = 3.14          - Defines a constant 'PI' with value 3.14.");
    println!("show x * 2              - Prints the result of 'x * 2'.");
    println!("\n\n");
    println!("-----------------------------------------------------------------");
    println!("Find full documentation here: https://byson94.github.io/KorvaqScrip-Site/documentation/");
    println!("-----------------------------------------------------------------");
}