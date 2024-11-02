// translation from js to rs taking place.

#[derive(Debug, PartialEq, Clone)]
pub enum TokenType {
    If,
    Else,
    Let,
    Make,
    Show,
    Error,
    Alert,
    Loop,
    While,
    Void,
    OpenParen,
    CloseParen,
    OpenBrace,
    CloseBrace,
    OpenBracket,
    CloseBracket,
    Equals, // For =
    NotEquals, // For !=
    GreaterThan,
    EqualsEqual, // For ==
    StrictEquals, // For ===
    StrictNotEquals, // For !==
    LogicalAnd, // For &&
    LogicalOr, // For ||
    Dot,
    Colon,
    RemoveMethod,
    MethodCall,
    Not,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    String(String), // Adding String type with value
    Semicolon,
    BinaryOperator, // This can be generic for any binary operator
    Func,
    Return,
    Comma,
    Boolean(bool), // For boolean values
    DeleteVar,
    DeleteFunc,
    Connect,
    And, // For &&
    Or, // For ||
    Async,
    Read,
    ArrayAdd,
    ArrayLength,
    ArrayRemove,
    Array,
    ToJSON,
    ParseJSON,
    Call,
    Floor,
    Round,
    SquareRoot,
    Cos,
    Sin,
    Tan,
    Tokenize,
    ToLowerCase,
    ToUpperCase,
    ReverseFunc,
    InputCli,
    Fetch,
    GET,
    POST,
    CurrentTime,
}
