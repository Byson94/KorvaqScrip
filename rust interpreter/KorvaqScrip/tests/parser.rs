use crate::ast::ASTNode;
use crate::token_type::TokenType;
use serde_json::Value::Number;
use crate::lexer::{Lexer, Token};

pub struct Parser<'a> {
    lexer: Lexer<'a>,
    current_token: Option<Token>,
}

impl<'a> Parser<'a> {
    pub fn new(mut lexer: Lexer<'a>) -> Self {
        let current_token = lexer.next_token();
        Parser {
            lexer,
            current_token,
        }
    }

    pub fn parse(&mut self) -> Result<Vec<ASTNode>, String> {
        let mut statements = Vec::new();

        while let Some(ref token) = self.current_token {
            match token.token_type {
                TokenType::Let => {
                    statements.push(self.parse_variable_declaration(false)?);
                }
                TokenType::Make => {
                    statements.push(self.parse_variable_declaration(true)?);
                }
                TokenType::Show => {
                    statements.push(self.parse_show_statement()?);
                }
                TokenType::DelVar => {
                    statements.push(self.parse_delvar_statement()?);
                }
                TokenType::UpperCase => {
                    statements.push(self.parse_to_uppercase_statement()?);
                }
                TokenType::LowerCase => {
                    statements.push(self.parse_to_lowercase_statement()?);
                }
                TokenType::Identifier => {
                    statements.push(self.parse_statement_or_identifier()?);
                }
                TokenType::BooleanLiteral => {
                    let bool_value = match token.value.as_str() {
                        "true" => true,
                        "false" => false,
                        _ => return Err("Invalid boolean literal".to_string()),
                    };
                    statements.push(ASTNode::ValueBool { value: bool_value });
                }
                _ => return Err(format!("Unexpected token: {:?}", token.token_type)),
            }

            self.next_token(); // Move to the next token after processing each statement
        }

        Ok(statements)
    }

    fn parse_to_uppercase_statement(&mut self) -> Result<ASTNode, String> {
        // Check if the next token is an opening parenthesis
        if let Some(Token { token_type: TokenType::OpenParen, .. }) = self.current_token {
            self.next_token(); // Skip '('
    
            // Parse the expression inside the parentheses (it could be a variable or string literal)
            let expr = self.parse_expression(0)?;
    
            // Ensure we have a closing parenthesis
            if let Some(Token { token_type: TokenType::CloseParen, .. }) = self.current_token {
                self.next_token(); // Skip ')'
            } else {
                return Err("Expected ')' after uppercase expression".to_string());
            }
    
            // Return an ASTNode for the uppercase operation
            Ok(ASTNode::Uppercase { expr: Box::new(expr) })
        } else {
            Err("Expected '(' after 'uppercase'".to_string())
        }
    }
    

    fn parse_to_lowercase_statement(&mut self) -> Result<ASTNode, String> {
        // Check if the next token is an opening parenthesis
        if let Some(Token { token_type: TokenType::OpenParen, .. }) = self.current_token {
            self.next_token(); // Skip '('
    
            // Parse the expression inside the parentheses (it could be a variable or string literal)
            let expr = self.parse_expression(0)?;
    
            // Ensure we have a closing parenthesis
            if let Some(Token { token_type: TokenType::CloseParen, .. }) = self.current_token {
                self.next_token(); // Skip ')'
            } else {
                return Err("Expected ')' after lowercase expression".to_string());
            }
    
            // Return an ASTNode for the lowercase operation
            Ok(ASTNode::Lowercase { expr: Box::new(expr) })
        } else {
            Err("Expected '(' after 'lowercase'".to_string())
        }
    }
    
    fn parse_block(&mut self) -> Result<Vec<ASTNode>, String> {
        let mut statements = Vec::new();
        
        // While there are more tokens and we don't hit the closing brace
        while let Some(ref token) = self.current_token {
            if token.token_type == TokenType::CloseBrace {
                break; // Stop if we encounter a closing brace
            }
            
            // Parse the next statement and extend it to the statements vector
            statements.extend(self.parse()?); // Flatten the structure using `extend`
    
            // Move to the next token
            self.next_token();
        }
    
        Ok(statements)
    }    

    fn parse_delvar_statement(&mut self) -> Result<ASTNode, String> {
        self.next_token(); // Move to the identifier
    
        if let Some(ref token) = self.current_token {
            match token.token_type {
                TokenType::Identifier => {
                    let name = token.value.clone(); // Clone the value
                    self.next_token(); // Move past the identifier
                    Ok(ASTNode::DelVar { name })
                }
                _ => Err("Expected identifier after 'delvar'".to_string()),
            }
        } else {
            Err("Expected identifier after 'delvar'".to_string())
        }
    }

    fn parse_variable_declaration(&mut self, is_constant: bool) -> Result<ASTNode, String> {
        self.next_token(); // Move past 'let' or 'make'

        let var_name = if let Some(ref token) = self.current_token {
            if token.token_type == TokenType::Identifier {
                token.value.clone()
            } else {
                return Err("Expected variable name after 'let' or 'make'".to_string());
            }
        } else {
            return Err("Expected variable name after 'let' or 'make'".to_string());
        };

        self.next_token(); // Move to the next token

        if let Some(ref token) = self.current_token {
            if token.token_type == TokenType::Equals {
                self.next_token(); // Move past '='
                let value_node = self.parse_expression(0)?;
                return Ok(ASTNode::VariableDeclaration {
                    name: var_name,
                    is_constant,
                    value: Box::new(value_node),
                });
            } else {
                return Err("Expected '=' after variable name".to_string());
            }
        }

        Err("Invalid variable declaration".to_string())
    }

    fn parse_statement_or_identifier(&mut self) -> Result<ASTNode, String> {
        if let Some(Token { value: var_name, token_type }) = &self.current_token {
            if *token_type == TokenType::Identifier {
                let var_name = var_name.clone();
                self.next_token(); // Move past the identifier

                // Check if the next token is an `=` for assignment
                if let Some(Token { token_type: TokenType::Equals, .. }) = self.current_token {
                    self.next_token(); // Move past `=`
                    let value_node = self.parse_expression(0)?; // Parse the right-hand side expression
                    return Ok(ASTNode::VariableDeclaration {
                        name: var_name,
                        is_constant: false, // Treat it as mutable if using `x = 1` form
                        value: Box::new(value_node),
                    });
                } else {
                    return Err("Expected '=' after identifier for assignment.".to_string());
                }
            }
        }

        Err("Expected statement or identifier".to_string())
    }

    fn parse_show_statement(&mut self) -> Result<ASTNode, String> {
        self.next_token(); // Move past 'show'
        
        // Check if the next token is an open parenthesis
        if let Some(ref token) = self.current_token {
            if token.token_type == TokenType::OpenParen {
                self.next_token(); // Skip '('
                let value_node = self.parse_expression(0)?; // Parse the expression inside the parentheses
                
                // Ensure we have a closing parenthesis
                if let Some(Token { token_type: TokenType::CloseParen, .. }) = self.current_token {
                    self.next_token(); // Skip ')'
                    return Ok(ASTNode::ShowStatement {
                        value: Box::new(value_node),
                    });
                } else {
                    return Err("Expected ')' after expression".to_string());
                }
            }
        }
        
        // If there's no open parenthesis, parse the expression directly
        let value_node = self.parse_expression(0)?;
        
        Ok(ASTNode::ShowStatement {
            value: Box::new(value_node),
        })
    }

    fn get_precedence(&self, token_type: &TokenType) -> i32 {
        match token_type {
            TokenType::BinaryOperator => {
                match &self.current_token.as_ref().unwrap().value[..] {
                    "+" | "-" => 1,               // Lowest precedence for addition and subtraction
                    "^" => 2,                     // Medium precedence for bitwise XOR
                    "*" | "/" | "%" => 3,         // Higher precedence for multiplication, division, and modulo
                    "**" => 4,                    // Highest precedence for exponentiation
                    _ => 0,                       // Default precedence for unknown or unhandled operators
                }
            }
            _ => 0,
        }
    }

    fn parse_expression(&mut self, precedence: i32) -> Result<ASTNode, String> {
        let mut left = self.parse_primary()?; // Parse the left operand
    
        while let Some(ref token) = self.current_token {
            let token_precedence = self.get_precedence(&token.token_type);
            
            if token_precedence < precedence {
                break; // Stop if the current operator has lower precedence
            }
    
            // If we have a binary operator, parse it
            if token.token_type == TokenType::BinaryOperator {
                let operator = token.value.clone();
                self.next_token(); // Move past the operator
                let right = self.parse_expression(token_precedence + 1)?; // Parse the right operand
                left = ASTNode::BinaryOperation {
                    left: Box::new(left),
                    operator,
                    right: Box::new(right),
                };
            } else {
                break;
            }
        }
    
        Ok(left)
    }

    fn parse_primary(&mut self) -> Result<ASTNode, String> {
        if let Some(token) = self.current_token.take() {
            match token.token_type {
                TokenType::Number => {
                    self.next_token(); // Advance the token
                    let num_value: f64 = token.value.parse().map_err(|_| "Invalid number format")?; 
                    Ok(ASTNode::ValueNum { value: num_value })
                }
                TokenType::String => {
                    self.next_token(); // Advance the token
                    Ok(ASTNode::Value { value: token.value })
                }
                TokenType::BooleanLiteral => {
                    let bool_value = match token.value.as_str() {
                        "true" => true,
                        "false" => false,
                        _ => return Err("Invalid boolean literal".to_string()),
                    };
                    Ok(ASTNode::ValueBool { value: bool_value })
                },
                TokenType::Identifier => {
                    self.next_token(); // Advance the token
                    Ok(ASTNode::Variable { name: token.value })
                }
                TokenType::OpenParen => {
                    self.next_token(); // Skip '('
                    let expr = self.parse_expression(0)?; // Recursively parse inner expression
                    if let Some(Token { token_type: TokenType::CloseParen, .. }) = self.current_token {
                        self.next_token(); // Skip ')'
                        Ok(expr)
                    } else {
                        Err("Expected ')'".to_string())
                    }
                }
                _ => Err("Unexpected token in primary expression".to_string()),
            }
        } else {
            Err("Unexpected end of input in primary expression".to_string())
        }
    }

    fn next_token(&mut self) {
        self.current_token = self.lexer.next_token();
    }
}
