// src/token_type.rs

#[derive(Debug, PartialEq, Clone)]
pub enum TokenType {
    Let,
    Make,
    Show,
    Boolean,
    Equals,
    OpenParen,
    CloseParen,
    Colon,
    OpenBrace,
    CloseBrace,
    OpenBracket,
    CloseBracket,
    Comma,
    BinaryOperator,
    LogicalAnd,
    LogicalOr,
    NotEquals,
    Identifier,
    Number,
    String,
    DelVar,
    BooleanLiteral,
    If, 
    Else, 
    UpperCase,
    LowerCase,
}