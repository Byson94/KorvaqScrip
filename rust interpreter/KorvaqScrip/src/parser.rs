// translation from js to rs taking place

use std::collections::HashMap;
use crate::statements::StatementType;

// Assuming TokenType and Statement types are defined somewhere in your code
pub struct Parser<'a> {
    lexer: &'a mut Lexer,  // Reference to the lexer
    current_token: TokenType,  // Current token
}

impl<'a> Parser<'a> {
    pub fn new(lexer: &'a mut Lexer) -> Self {
        let mut parser = Self {
            lexer,
            current_token: TokenType::EOF,  // Initialize with a default value
        };
        parser.current_token = parser.lexer.next_token();  // Get the first token
        parser
    }

    pub fn parse(&mut self) -> Result<Vec<Statement>, String> {
        let mut statements: Vec<Statement> = Vec::new();
        
        while self.current_token != TokenType::EOF {
            match self.current_token {
                TokenType::Func => statements.push(self.parse_function_declaration()?),
                TokenType::Fetch => statements.push(self.parse_fetch_statement()?),
                TokenType::CurrentTime => statements.push(self.parse_current_time_statement()?),
                TokenType::InputCli => statements.push(self.parse_input_cli()?),
                TokenType::ReverseFunc => statements.push(self.parse_reverse_statement()?),
                TokenType::ToLowerCase => statements.push(self.parse_lower_case_sentence()?),
                TokenType::ToUpperCase => statements.push(self.parse_upper_case_sentence()?),
                TokenType::Tokenize => statements.push(self.parse_tokenize_sentence()?),
                TokenType::Floor => statements.push(self.parse_floor_math()?),
                TokenType::Round => statements.push(self.parse_round_math()?),
                TokenType::SquareRoot => statements.push(self.parse_square_root_math()?),
                TokenType::Cos => statements.push(self.parse_cos_math()?),
                TokenType::Sin => statements.push(self.parse_sin_math()?),
                TokenType::Tan => statements.push(self.parse_tan_math()?),
                TokenType::Call => statements.push(self.parse_function_call()?),
                TokenType::Return => statements.push(self.parse_return_func_statement()?),
                TokenType::ToJSON => statements.push(self.parse_to_json_statement()?),
                TokenType::ParseJSON => statements.push(self.parse_parse_json_statement()?),
                TokenType::If => statements.push(self.parse_if_statement()?),
                TokenType::Connect => statements.push(self.parse_connect_statement()?),
                TokenType::Array => statements.push(self.parse_array_access()?),
                TokenType::ArrayAdd => statements.push(self.parse_array_add()?),
                TokenType::ArrayRemove => statements.push(self.parse_array_remove()?),
                TokenType::ArrayLength => statements.push(self.parse_array_length()?),
                TokenType::Read => statements.push(self.parse_read_statement()?),
                TokenType::Async => statements.push(self.parse_async_statement()?),
                TokenType::DeleteVar => statements.push(self.delete_var_statement()?),
                TokenType::DeleteFunc => statements.push(self.delete_func_statement()?),
                TokenType::Let | TokenType::Make => statements.push(self.parse_variable_declaration()?),
                TokenType::Show => statements.push(self.parse_print_statement()?),
                TokenType::Error => statements.push(self.parse_error_statement()?),
                TokenType::Alert => statements.push(self.parse_alert_statement()?),
                TokenType::While => statements.push(self.parse_while_statement()?),
                TokenType::Loop => statements.push(self.parse_repeat_statement()?),
                TokenType::Identifier => statements.push(self.parse_assignment_or_expression()?),
                _ => return Err(format!("Unexpected token: {:?}", self.current_token)),
            }
            // Get the next token
            self.current_token = self.lexer.next_token();
        }

        Ok(statements)
    }

    // Placeholder for lexer methods
    // Assuming the following methods exist and are implemented appropriately:
    fn parse_function_declaration(&mut self) -> Result<Statement, String> { 
       
    }
    fn parse_fetch_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_current_time_statement(&mut self) -> Result<Statement, String> {
        self.expect(TokenType::CurrentTime)?; // Call expect to check for CurrentTime token
    
        // Construct and return the Statement
        Ok(Statement {
            statement_type: StatementType::ReturnCurrentTime,
        })
    }    
    fn parse_input_cli(&mut self) -> Result<Statement, String> {

    }
    fn parse_reverse_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_lower_case_sentence(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_upper_case_sentence(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_tokenize_sentence(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_floor_math(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_round_math(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_square_root_math(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_cos_math(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_sin_math(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_tan_math(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_function_call(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_return_func_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_to_json_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_parse_json_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_if_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_connect_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_array_access(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_array_add(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_array_remove(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_array_length(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_read_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_async_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn delete_var_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn delete_func_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_variable_declaration(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_print_statement(&mut self) -> Result<Statement, String> {

    }
    fn parse_error_statement(&mut self) -> Result<Statement, String> {

    }
    fn parse_alert_statement(&mut self) -> Result<Statement, String> {

    }
    fn parse_while_statement(&mut self) -> Result<Statement, String> {

    }
    fn parse_repeat_statement(&mut self) -> Result<Statement, String> {
        
    }
    fn parse_assignment_or_expression(&mut self) -> Result<Statement, String> {
        
    }

    fn expect(&mut self, token_type: TokenType) -> Result<Token, String> {
        let token = self.current_token;

        if token == token_type {
            self.current_token = self.lexer.next_token(); // Move to the next token
            Ok(token) // Return the expected token
        } else {
            // Return an error if the expected token type doesn't match
            Err(format!(
                "Expected token type {:?}, but found {:?}",
                token_type,
                token
            ))
        }
    }
}
