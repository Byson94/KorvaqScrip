use std::collections::HashSet;
use crate::token_type::TokenType;

#[derive(Debug, Clone)]
pub struct Token {
    pub value: String,
    pub token_type: TokenType,
}

pub struct Lexer<'a> {
    pos: usize,
    input: &'a str,
    restricted_keywords: HashSet<String>,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        let restricted_keywords = [
            "var", "const", "for", "switch", "case", "break",
            "continue", "default", "class", "extends", "super", "this",
            "typeof", "instanceof", "delete", "new", "in",
            "try", "catch", "finally", "throw", "debugger",
        ].iter().cloned().map(String::from).collect();

        Lexer {
            pos: 0,
            input,
            restricted_keywords,
        }
    }

    pub fn next_token(&mut self) -> Option<Token> {
        while self.pos < self.input.len() {
            let current_char = self.input[self.pos..].chars().next().unwrap();

            // Skip whitespace
            if current_char.is_whitespace() {
                self.pos += 1;
                continue;
            }

            // Check for single-line comments
            if current_char == '/' && self.input.get(self.pos + 1..).map_or(false, |s| s.starts_with('/')) {
                while self.pos < self.input.len() && self.input.chars().nth(self.pos).unwrap() != '\n' {
                    self.pos += 1;
                }
                self.pos += 1; // Move past the newline
                continue;
            }

            // Check for boolean literals
            if self.input.get(self.pos..).map_or(false, |s| s.starts_with("true")) {
                self.pos += 4; // Move position past "true"
                return Some(Token { value: "true".to_string(), token_type: TokenType::BooleanLiteral });
            }
            if self.input.get(self.pos..).map_or(false, |s| s.starts_with("false")) {
                self.pos += 5; // Move position past "false"
                return Some(Token { value: "false".to_string(), token_type: TokenType::BooleanLiteral });
            }

            // Check for numbers, strings, keywords, operators, and punctuation
            if current_char.is_digit(10) {
                return Some(self.read_number());
            }
            if current_char == '"' || current_char == '\'' || current_char == '`' {
                return Some(self.read_string(current_char));
            }
            if current_char.is_alphabetic() || current_char == '_' {
                return Some(self.read_keyword_or_identifier());
            }

            // Handle operators and punctuation
            if current_char == '=' {
                self.pos += 1;
                if self.pos < self.input.len() && self.input.chars().nth(self.pos).unwrap() == '=' {
                    self.pos += 1;
                    if self.pos < self.input.len() && self.input.chars().nth(self.pos).unwrap() == '=' {
                        self.pos += 1;
                        return Some(Token { value: "===" .to_string(), token_type: TokenType::Equals });
                    }
                    return Some(Token { value: "==" .to_string(), token_type: TokenType::Equals });
                }
                return Some(Token { value: "=" .to_string(), token_type: TokenType::Equals });
            }
            if current_char == '(' {
                self.pos += 1;
                return Some(Token { value: "(".to_string(), token_type: TokenType::OpenParen });
            }
            if current_char == ')' {
                self.pos += 1;
                return Some(Token { value: ")".to_string(), token_type: TokenType::CloseParen });
            }
            // Ignore semicolon
            if current_char == ';' {
                self.pos += 1;
                continue; // Skip semicolon
            }
            if current_char == ':' {
                self.pos += 1;
                return Some(Token { value: ":".to_string(), token_type: TokenType::Colon });
            }
            if current_char == '{' {
                self.pos += 1;
                return Some(Token { value: "{".to_string(), token_type: TokenType::OpenBrace });
            }
            if current_char == '}' {
                self.pos += 1;
                return Some(Token { value: "}".to_string(), token_type: TokenType::CloseBrace });
            }

            // Handle array syntax
            if current_char == '[' {
                self.pos += 1;
                return Some(Token { value: "[".to_string(), token_type: TokenType::OpenBracket });
            }
            if current_char == ']' {
                self.pos += 1;
                return Some(Token { value: "]".to_string(), token_type: TokenType::CloseBracket });
            }
            if current_char == ',' {
                self.pos += 1;
                return Some(Token { value: ",".to_string(), token_type: TokenType::Comma });
            }

            if current_char == '*' && self.input.get(self.pos + 1..).map_or(false, |s| s.starts_with("*")) {
                self.pos += 2; // Move past '**'
                return Some(Token { value: "**".to_string(), token_type: TokenType::BinaryOperator });
            }

            // Handle binary operators
            if ['+', '-', '*', '/', '%', '^'].contains(&current_char) {
                return Some(self.read_binary_operator(current_char));
            }

            // Handle comparison operators
            if current_char == '>' {
                return Some(self.read_comparison_operator('>'));
            }
            if current_char == '<' {
                return Some(self.read_comparison_operator('<'));
            }

            // Handle logical operators
            if current_char == '&' && self.input.get(self.pos + 1..).map_or(false, |s| s.starts_with("&")) {
                self.pos += 2; // Move past '&&'
                return Some(Token { value: "&&".to_string(), token_type: TokenType::LogicalAnd });
            }
            if current_char == '|' && self.input.get(self.pos + 1..).map_or(false, |s| s.starts_with("|")) {
                self.pos += 2; // Move past '||'
                return Some(Token { value: "||".to_string(), token_type: TokenType::LogicalOr });
            }

            // Handle not equal operator
            if current_char == '!' && self.input.get(self.pos + 1..).map_or(false, |s| s.starts_with("=")) {
                self.pos += 2; // Move past '!='
                return Some(Token { value: "!=".to_string(), token_type: TokenType::NotEquals });
            }

            panic!("Unexpected character: {}", current_char);
        }

        None
    }

    fn read_keyword_or_identifier(&mut self) -> Token {
        let mut id_str = String::new();

        // Allow the first character to be a letter or underscore
        if self.input[self.pos..].chars().next().unwrap().is_alphabetic() || self.input[self.pos..].chars().next().unwrap() == '_' {
            id_str.push(self.input[self.pos..].chars().next().unwrap());
            self.pos += 1;
        } else {
            panic!("Invalid identifier start: {} at position {}", self.input[self.pos..].chars().next().unwrap(), self.pos);
        }

        // Allow subsequent characters to be letters, digits, or underscores
        while self.pos < self.input.len() && (self.input[self.pos..].chars().next().unwrap().is_alphanumeric() || self.input[self.pos..].chars().next().unwrap() == '_') {
            id_str.push(self.input[self.pos..].chars().next().unwrap());
            self.pos += 1;
        }

        // Check for restricted keywords
        if self.restricted_keywords.contains(&id_str) && id_str != "let" {
            panic!("Using a restricted keyword: {}", id_str);
        }

        match id_str.as_str() {
            "let" => Token { value: id_str, token_type: TokenType::Let },
            "make" => Token { value: id_str, token_type: TokenType::Make },
            "show" => Token { value: id_str, token_type: TokenType::Show }, 
            "delvar" => Token { value: id_str, token_type: TokenType::DelVar },
            "if" => Token { value: id_str, token_type: TokenType::If },
            "else" => Token { value: id_str, token_type: TokenType::Else },
            "uppercase" => Token { value: id_str, token_type: TokenType::UpperCase },
            "lowercase" => Token { value: id_str, token_type: TokenType::LowerCase },
            _ => Token { value: id_str, token_type: TokenType::Identifier },
        }
    }

    fn read_number(&mut self) -> Token {
        let start_pos = self.pos;
        while self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap().is_digit(10) {
            self.pos += 1;
        }

        let number_str = &self.input[start_pos..self.pos];
        Token { value: number_str.to_string(), token_type: TokenType::Number }
    }

    fn read_string(&mut self, quote_char: char) -> Token {
        self.pos += 1; // Skip the opening quote
        let start_pos = self.pos;

        while self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap() != quote_char {
            self.pos += 1;
        }

        let string_content = &self.input[start_pos..self.pos];
        self.pos += 1; // Skip the closing quote
        Token { value: string_content.to_string(), token_type: TokenType::String }
    }

    fn read_binary_operator(&mut self, op: char) -> Token {
        self.pos += 1; // Move past operator
        Token { value: op.to_string(), token_type: TokenType::BinaryOperator }
    }

    fn read_comparison_operator(&mut self, op: char) -> Token {
        self.pos += 1; // Move past operator
        Token { value: op.to_string(), token_type: TokenType::BinaryOperator }
    }
}
