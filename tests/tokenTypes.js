const TokenType = {
    If: 'If',
    Else: 'Else',
    Let: 'Let',
    Make: 'Make',
    Show: 'Show',
    Loop: 'Loop',
    OpenParen: 'OpenParen',
    CloseParen: 'CloseParen',
    OpenBrace: 'OpenBrace',
    CloseBrace: 'CloseBrace',
    OpenBracket: 'OpenBracket', // Add this line for '['
    CloseBracket: 'CloseBracket', // Add this line for ']'
    Equals: 'Equals',
    Identifier: 'Identifier',
    Number: 'Number',
    String: 'String',
    Semicolon: 'Semicolon',
    BinaryOperator: 'BinaryOperator',
    Func: 'Func',
    Return: 'Return',
    Comma: 'Comma',
    Boolean: 'Boolean' // Ensure this is present for boolean literals
};

export default TokenType;
