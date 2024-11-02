// translation from js to rs taking place

// Importing the TokenType enum
use crate::tokenTypes::TokenType;

pub struct Lexer<'a> {
    pos: usize,
    input: &'a str,
    restricted_keywords: std::collections::HashSet<&'static str>,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        let mut restricted_keywords = std::collections::HashSet::new();
        restricted_keywords.insert("var");
        restricted_keywords.insert("const");
        restricted_keywords.insert("for");
        restricted_keywords.insert("switch");
        restricted_keywords.insert("case");
        restricted_keywords.insert("break");
        restricted_keywords.insert("continue");
        restricted_keywords.insert("default");
        restricted_keywords.insert("class");
        restricted_keywords.insert("extends");
        restricted_keywords.insert("super");
        restricted_keywords.insert("this");
        restricted_keywords.insert("typeof");
        restricted_keywords.insert("instanceof");
        restricted_keywords.insert("delete");
        restricted_keywords.insert("new");
        restricted_keywords.insert("in");
        restricted_keywords.insert("try");
        restricted_keywords.insert("catch");
        restricted_keywords.insert("finally");
        restricted_keywords.insert("throw");
        restricted_keywords.insert("debugger");

        Self {
            pos: 0,
            input,
            restricted_keywords,
        }
    }

    pub fn next_token(&mut self) -> Option<(String, TokenType)> {
        while self.pos < self.input.len() {
            let current_char = self.input[self.pos..].chars().next().unwrap();

            // Skip whitespace
            if current_char.is_whitespace() {
                self.pos += 1;
                continue;
            }

            // Check for single-line comments
            if current_char == '/' && self.pos + 1 < self.input.len() && self.input[self.pos + 1..].starts_with("//") {
                while self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap() != '\n' {
                    self.pos += 1;
                }
                self.pos += 1; // Move past the newline
                continue;
            }

            // Check for boolean literals
            if self.input[self.pos..].starts_with("true") {
                self.pos += 4; // Move position past "true"
                return Some((String::from("true"), TokenType::Boolean));
            }
            if self.input[self.pos..].starts_with("false") {
                self.pos += 5; // Move position past "false"
                return Some((String::from("false"), TokenType::Boolean));
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
            match current_char {
                '=' => {
                    self.pos += 1;
                    if self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap() == '=' {
                        self.pos += 1;
                        if self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap() == '=' {
                            self.pos += 1;
                            return Some((String::from("==="), TokenType::Equals)); // Handle strict equality
                        }
                        return Some((String::from("=="), TokenType::Equals)); // Handle loose equality
                    }
                    return Some((String::from("="), TokenType::Equals)); // Assignment
                }
                '(' => {
                    self.pos += 1;
                    return Some((String::from("("), TokenType::OpenParen));
                }
                ')' => {
                    self.pos += 1;
                    return Some((String::from(")"), TokenType::CloseParen));
                }
                ';' => {
                    self.pos += 1;
                    continue; // Skip semicolon
                }
                ':' => {
                    self.pos += 1;
                    return Some((String::from(":"), TokenType::Colon));
                }
                '{' => {
                    self.pos += 1;
                    return Some((String::from("{"), TokenType::OpenBrace));
                }
                '}' => {
                    self.pos += 1;
                    return Some((String::from("}"), TokenType::CloseBrace));
                }
                '[' => {
                    self.pos += 1;
                    return Some((String::from("["), TokenType::OpenBracket));
                }
                ']' => {
                    self.pos += 1;
                    return Some((String::from("]"), TokenType::CloseBracket));
                }
                ',' => {
                    self.pos += 1;
                    return Some((String::from(","), TokenType::Comma));
                }
                '*' if self.pos + 1 < self.input.len() && self.input[self.pos + 1..].starts_with("*") => {
                    self.pos += 2; // Move past '**'
                    return Some((String::from("**"), TokenType::BinaryOperator));
                }
                '+' | '-' | '*' | '/' | '%' | '^' => {
                    return Some(self.read_binary_operator(current_char));
                }
                '>' => {
                    return Some(self.read_comparison_operator('>'));
                }
                '<' => {
                    return Some(self.read_comparison_operator('<'));
                }
                '&' if self.pos + 1 < self.input.len() && self.input[self.pos + 1..].starts_with("&") => {
                    self.pos += 2; // Move past '&&'
                    return Some((String::from("&&"), TokenType::LogicalAnd));
                }
                '|' if self.pos + 1 < self.input.len() && self.input[self.pos + 1..].starts_with("|") => {
                    self.pos += 2; // Move past '||'
                    return Some((String::from("||"), TokenType::LogicalOr));
                }
                '!' if self.pos + 1 < self.input.len() && self.input[self.pos + 1..].starts_with("=") => {
                    self.pos += 2; // Move past '!='
                    return Some((String::from("!="), TokenType::NotEquals));
                }
                _ => {
                    panic!("Unexpected character: {}", current_char);
                }
            }
        }

        None // End of input
    }

    fn read_keyword_or_identifier(&mut self) -> (String, TokenType) {
        let mut id_str = String::new();

        // Allow the first character to be a letter or underscore
        if self.pos < self.input.len() && (self.input[self.pos..].chars().next().unwrap().is_alphabetic() || self.input[self.pos..].chars().next().unwrap() == '_') {
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
        if self.restricted_keywords.contains(id_str.as_str()) && id_str != "delvar all" {
            panic!("Restricted keyword used: {}", id_str);
        }

        // Token identification
        match id_str.as_str() {
            "delvar" => (id_str, TokenType::DeleteVar),
            "delfunc" => (id_str, TokenType::DeleteFunc),
            "func" => (id_str, TokenType::Func),
            "return" => (id_str, TokenType::Return),
            "if" => (id_str, TokenType::If),
            "else" => (id_str, TokenType::Else),
            "let" => (id_str, TokenType::Let),
            "make" => (id_str, TokenType::Make),
            "show" => (id_str, TokenType::Show),
            "error" => (id_str, TokenType::Error),
            "alert" => (id_str, TokenType::Alert),
            "loop" => (id_str, TokenType::Loop),
            "while" => (id_str, TokenType::While),
            "connect" => (id_str, TokenType::Connect),
            "async" => (id_str, TokenType::Async),
            "arradd" => (id_str, TokenType::ArrayAdd),
            "arrsize" => (id_str, TokenType::ArrayLength),
            "arrdel" => (id_str, TokenType::ArrayRemove),
            "read" => (id_str, TokenType::Read),
            "arr" => (id_str, TokenType::Array),
            "tojson" => (id_str, TokenType::ToJSON),
            "parjson" => (id_str, TokenType::ParseJSON),
            "floor" => (id_str, TokenType::Floor),
            "round" => (id_str, TokenType::Round),
            "sqrt" => (id_str, TokenType::SquareRoot),
            "sin" => (id_str, TokenType::Sin),
            "cos" => (id_str, TokenType::Cos),
            "tan" => (id_str, TokenType::Tan),
            "tokenize" => (id_str, TokenType::Tokenize),
            "tolower" => (id_str, TokenType::ToLowerCase),
            "toupper" => (id_str, TokenType::ToUpperCase),
            "reverse" => (id_str, TokenType::ReverseFunc),
            "inputcli" => (id_str, TokenType::InputCli),
            "fetch" => (id_str, TokenType::Fetch),
            "currenttime" => (id_str, TokenType::CurrentTime),
            _ => (id_str, TokenType::Identifier),
        }
    }

    fn read_number(&mut self) -> (String, TokenType) {
        let start_pos = self.pos;
        while self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap().is_digit(10) {
            self.pos += 1;
        }

        let number_str = &self.input[start_pos..self.pos];
        (number_str.to_string(), TokenType::Number)
    }

    fn read_string(&mut self, quote_char: char) -> (String, TokenType) {
        let start_pos = self.pos;
        self.pos += 1; // Skip the opening quote

        while self.pos < self.input.len() {
            let current_char = self.input[self.pos..].chars().next().unwrap();
            if current_char == quote_char {
                break; // End of the string
            }
            self.pos += 1;
        }

        let string_str = &self.input[start_pos + 1..self.pos];
        self.pos += 1; // Skip the closing quote
        (string_str.to_string(), TokenType::String)
    }

    fn read_binary_operator(&mut self, current_char: char) -> (String, TokenType) {
        self.pos += 1; // Move past the operator
        let operator = match current_char {
            '+' => String::from("+"),
            '-' => String::from("-"),
            '*' => String::from("*"),
            '/' => String::from("/"),
            '%' => String::from("%"),
            '^' => String::from("^"),
            _ => unreachable!(),
        };
        (operator, TokenType::BinaryOperator)
    }

    fn read_comparison_operator(&mut self, operator: char) -> (String, TokenType) {
        self.pos += 1; // Move past the operator
        if self.pos < self.input.len() && self.input[self.pos..].chars().next().unwrap() == '=' {
            self.pos += 1; // Move past the '='
            return (format!("{}=", operator), TokenType::NotEquals);
        }
        (operator.to_string(), TokenType::BinaryOperator) // Default case
    }
}
