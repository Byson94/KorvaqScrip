import TokenType from './tokenTypes.js';

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.nextToken();
    }

    parse() {
        const statements = [];
    
        while (this.currentToken) {
            if (this.currentToken.type === TokenType.Func) {
                statements.push(this.parseFunctionDeclaration());
            } else if (this.currentToken.type === TokenType.If) {
                statements.push(this.parseIfStatement());
            } else if (this.currentToken.type === TokenType.Connect) {  
                statements.push(this.parseConnectStatement());
            } else if (this.currentToken.type === TokenType.ArrayAdd) {
                statements.push(this.parseArrayAdd());
            } else if (this.currentToken.type === TokenType.ArrayLength) {
                statements.push(this.parseArrayLength());
            } else if (this.currentToken.type === TokenType.Read) {  
                statements.push(this.parseReadStatement());
            } else if (this.currentToken.type === TokenType.Async) {
                statements.push(this.parseAsyncStatement());
            } else if (this.currentToken.type === TokenType.DeleteVar) {
                statements.push(this.deleteVarStatement());
            } else if (this.currentToken.type === TokenType.Let || this.currentToken.type === TokenType.Make) {
                statements.push(this.parseVariableDeclaration());
            } else if (this.currentToken.type === TokenType.Show) {
                statements.push(this.parsePrintStatement());
            } else if (this.currentToken.type === TokenType.While) {
                statements.push(this.parseWhileStatement());
            } else if (this.currentToken.type === TokenType.Loop) {
                statements.push(this.parseRepeatStatement());
            } else if (this.currentToken.type === TokenType.Identifier) {
                statements.push(this.parseAssignmentOrExpression());
            } else {
                throw new Error(`Unexpected token: ${this.currentToken.value}`);
            }
        }
    
        return statements;
    }

    parseArrayAdd() {
        this.expect(TokenType.ArrayAdd); // Expect the ArrayAdd token
        const arrayIdentifier = this.expect(TokenType.Identifier); // First identifier (array name)
    
        // Parse the second argument, which can be an identifier, a string, or a number
        let element;
        if (this.currentToken.type === TokenType.Identifier) {
            const elementIdentifier = this.expect(TokenType.Identifier);
            element = { type: 'Identifier', value: elementIdentifier.value };
        } else if (this.currentToken.type === TokenType.String) {
            const stringLiteral = this.expect(TokenType.String);
            element = { type: 'StringLiteral', value: stringLiteral.value };
        } else if (this.currentToken.type === TokenType.Number) {
            const numberLiteral = this.expect(TokenType.Number);
            element = { type: 'NumberLiteral', value: numberLiteral.value };
        } else {
            throw new Error("Expected Identifier, String, or Number for array element");
        }
    
        // Return an object representing the ArrayAdd operation
        return { 
            type: 'ArrayAdd', 
            array: arrayIdentifier.value, 
            element: element 
        };
    }
    
    parseArrayLength() {
        this.expect(TokenType.ArrayLength); // Expect the ArrayAdd token
        const arrayIdentifier = this.expect(TokenType.Identifier); // First identifier (array name)
    
        // Return an object representing the ArrayAdd operation
        return { 
            type: 'ArrayLength', 
            array: arrayIdentifier.value, 
        };
    }

    parseReadStatement() {
        this.expect(TokenType.Read)   
        const filePath = this.expect(TokenType.String)

        return { type: 'ReadStatement', filePath: filePath.value }
    }

    parseConnectStatement() {
        this.expect(TokenType.Connect); // Expect the connect token
        const filePath = this.expect(TokenType.String); // Expect a string token for the file path
    
        return { type: 'ConnectStatement', filePath: filePath.value }; // Return a ConnectStatement node
    }
    

    // New expect method for token verification
    expect(tokenType) {
        const token = this.currentToken;
        if (token && token.type === tokenType) {
            this.currentToken = this.lexer.nextToken(); // Move to the next token
            return token;
        }
        throw new Error(`Expected token type ${tokenType}, but found ${token ? token.type : 'none'}`);
    }
    

    deleteVarStatement() {
        this.expect(TokenType.DeleteVar); // Expect the delete token
        const identifier = this.expect(TokenType.Identifier); // Expect the variable name to delete
        if (this.currentToken && this.currentToken.type === TokenType.Semicolon) {
            this.expect(TokenType.Semicolon); // Consume the semicolon if present
        }
        return { type: 'DeleteVariable', name: identifier.value }; // Return a DeleteVariable statement node
    }    

    peek() {
        // Temporarily store the current token
        const current = this.currentToken;
        const nextToken = this.lexer.nextToken(); // Get the next token
        this.currentToken = current; // Restore the current token
        return nextToken; // Return the next token
    }
    

    parseFunctionDeclaration() {
        this.expect(TokenType.Func); // Ensure we see the 'func' token
        const functionName = this.expect(TokenType.Identifier); // Expect an identifier for the function name
        this.expect(TokenType.OpenParen); // Expect opening parenthesis
    
        const params = [];
        // Check if the next token is a CloseParen to allow empty parameter lists
        while (this.currentToken && this.currentToken.type !== TokenType.CloseParen) {
            const param = this.expect(TokenType.Identifier); // Expect an identifier for each parameter
            params.push({ type: 'Identifier', name: param.value });
    
            // Only continue if the next token is a comma
            if (this.currentToken.type === TokenType.Comma) {
                this.expect(TokenType.Comma);
            } else {
                break; // Exit if the next token is not a comma
            }
        }
    
        this.expect(TokenType.CloseParen); // Expect closing parenthesis
        this.expect(TokenType.OpenBrace);  // Expect opening brace for the function body
    
        // Parse the body of the function
        const functionBody = this.parseBlock();  // Adjust to parse multiple statements
    
        this.expect(TokenType.CloseBrace);  // Expect closing brace
    
        return {
            type: 'FunctionDeclaration',
            name: functionName.value,
            params: params,  // Store the parsed parameters
            body: functionBody,
        };
    }
    

    parseBlock() {
        const statements = [];
        while (this.currentToken && this.currentToken.type !== TokenType.CloseBrace) {
            statements.push(this.parseStatement());
        }
        return statements;
    }

    // Parse an async statement
    parseAsyncStatement() {
        this.expect(TokenType.Async); // Expect the async token
        this.expect(TokenType.OpenBrace); // Expect the opening brace

        // Parse the block of statements within the async block
        const statements = this.parseBlock(); // Parse the block of statements

        this.expect(TokenType.CloseBrace); // Expect the closing brace

        return {
            type: 'AsyncBlock',
            statements,
        };
    }

    // General statement parsing
    parseStatement() {
        // Here, ensure you can recognize all statement types, including control flow statements.
        switch (this.currentToken.type) {
            case TokenType.Let:
            case TokenType.Make:
                return this.parseVariableDeclaration();
            case TokenType.DeleteVar:
                return this.deleteVarStatement();
            case TokenType.Show:
                return this.parsePrintStatement();
            case TokenType.If:
                return this.parseIfStatement();
            case TokenType.While:  // Handle while
                return this.parseWhileStatement();
            case TokenType.Loop:   // Handle loop
                return this.parseRepeatStatement();
            case TokenType.Func:   // Handle function declaration
                return this.parseFunctionDeclaration();
            case TokenType.Identifier:
                return this.parseAssignmentOrExpression();
            default:
                throw new Error(`Unexpected statement: ${this.currentToken.value}`);
        }
    }


    parseVariableDeclaration() {
        const isImmutable = this.currentToken.type === TokenType.Make;
        this.expect(isImmutable ? TokenType.Make : TokenType.Let);
        const name = this.expect(TokenType.Identifier);
        this.expect(TokenType.Equals);
        
        // Check if the right-hand side is a `read` statement
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseAssignmentOrExpression();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } 
        else {
            value = this.parseExpression(); // Standard variable assignment
        }
    
        return { type: 'VariableDeclaration', name: name.value, value, isImmutable };
    }

    parseIfStatement() {
        this.consume(TokenType.If);
        this.consume(TokenType.OpenParen);
        const condition = this.parseExpression();
        this.consume(TokenType.CloseParen);
        
        this.consume(TokenType.OpenBrace); // Expecting an opening brace
        const thenBlock = this.parseBlock(); // Parse the block of statements for the "then"
        this.consume(TokenType.CloseBrace); // Expecting a closing brace

        let elseBlock = null;
        if (this.currentToken && this.currentToken.type === TokenType.Else) {
            this.consume(TokenType.Else);
            this.consume(TokenType.OpenBrace); // Expecting an opening brace for else block
            elseBlock = this.parseBlock(); // Parse the block of statements for the "else"
            this.consume(TokenType.CloseBrace); // Expecting a closing brace
        }

        return { type: 'IfStatement', condition, thenBlock, elseBlock };
    }

    parseAssignmentOrExpression() {
        const identifier = this.expect(TokenType.Identifier);
    
        // Check if it's a function call (next token is an open parenthesis)
        if (this.currentToken.type === TokenType.OpenParen) {
            // Consume the '('
            this.expect(TokenType.OpenParen); // Use `expect`
    
            const args = [];
            // Parse function arguments (if any)
            while (this.currentToken.type !== TokenType.CloseParen) {
                args.push(this.parseExpression());
                // Ensure the next token is a comma or the close parenthesis
                if (this.currentToken.type === TokenType.Comma) {
                    this.expect(TokenType.Comma);
                } else if (this.currentToken.type === TokenType.CloseParen) {
                    break; // Exit if it's the closing parenthesis
                }
            }
    
            // Consume the ')'
            this.expect(TokenType.CloseParen); // Use `expect`
    
            return { 
                type: 'FunctionCall', 
                name: identifier.value, 
                args 
            };
        }
    
        // Check if the next token is an open bracket (for array access)
        if (this.currentToken.type === TokenType.OpenBracket) {
            this.expect(TokenType.OpenBracket); // Consume the '['
            
            const index = this.parseExpression(); // Parse the index
            this.expect(TokenType.CloseBracket); // Consume the ']'
    
            return { 
                type: 'ArrayAccess', 
                arrayName: identifier.value, 
                index 
            };
        }
    
        // If not a function call or array access, it’s an assignment
        this.expect(TokenType.Equals); // Use `expect` for assignment
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } else {
            value = this.parseExpression(); // Standard variable assignment
        }
    
        return { 
            type: 'Assignment', 
            name: identifier.value, 
            value 
        };
    }    
    

    parsePrintStatement() {
        this.expect(TokenType.Show);
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } 
        else {
            value = this.parseExpression(); // Standard variable assignment
        }
        
        return { type: 'PrintStatement', value };
    }

    parseRepeatStatement() {
        this.expect(TokenType.Loop);        // 'loop' keyword
        this.expect(TokenType.OpenParen);   // Opening '('
        
        const identifier = this.expect(TokenType.Identifier); // Loop counter variable
        this.expect(TokenType.Comma);
        
        const startValue = this.parseExpression(); // Starting value of loop counter
        this.expect(TokenType.Comma);
        
        const endValue = this.parseExpression();   // Ending value of loop counter
        this.expect(TokenType.CloseParen);         // Closing ')'
        
        // Expect '{' to begin the loop block
        this.expect(TokenType.OpenBrace);          
        
        // Parse the block within the '{ }'
        const block = this.parseBlock();           // Block of code to execute repeatedly
        
        // Expect '}' to close the block
        this.expect(TokenType.CloseBrace);
        
        return { 
            type: 'RepeatStatement', 
            identifier: identifier.value, 
            startValue, 
            endValue, 
            block 
        };
    }
    
    parseWhileStatement() {
        this.expect(TokenType.While);           // Expect 'while' keyword
        this.expect(TokenType.OpenParen);        // Expect '('
        
        const condition = this.parseExpression(); // Parse the condition expression
        this.expect(TokenType.CloseParen);        // Expect ')'

        this.expect(TokenType.OpenBrace);  
        
        const block = this.parseBlock();          // Parse the block of code inside '{}'

        this.expect(TokenType.CloseBrace);
        
        return { 
            type: 'WhileStatement', 
            condition, 
            block 
        };
    }
    
    

    parseExpression() {
        return this.parseBinaryExpression();
    }

    parseBinaryExpression() {
        let left = this.parsePrimary();
        
        while (this.currentToken && (
            // Include all binary operators
            this.currentToken.type === TokenType.BinaryOperator ||
            this.currentToken.type === TokenType.Equals || 
            this.currentToken.type === TokenType.NotEquals || 
            this.currentToken.type === TokenType.EqualsEqual || 
            this.currentToken.type === TokenType.StrictEquals || 
            this.currentToken.type === TokenType.StrictNotEquals || 
            this.currentToken.type === TokenType.GreaterThan ||
            this.currentToken.type === TokenType.GreaterThanOrEqual ||
            this.currentToken.type === TokenType.LessThan ||
            this.currentToken.type === TokenType.LessThanOrEqual ||
            this.currentToken.type === TokenType.LogicalAnd ||
            this.currentToken.type === TokenType.LogicalOr
        )) {
            const operator = this.currentToken;
            this.expect(operator.type); // Consume the operator
            const right = this.parsePrimary();
            left = { type: 'BinaryExpression', left, operator: operator.value, right };
        }
    
        return left;
    }

    parsePrimary() {
        if (this.currentToken.type === TokenType.Number) {
            const number = this.expect(TokenType.Number);
            return { type: 'NumberLiteral', value: parseFloat(number.value) };
        } else if (this.currentToken.type === TokenType.String) {
            const str = this.expect(TokenType.String);
            return { type: 'StringLiteral', value: str.value };
        } else if (this.currentToken.type === TokenType.Boolean) {
            const bool = this.expect(TokenType.Boolean);
            return { type: 'BooleanLiteral', value: bool.value };
        } else if (this.currentToken.type === TokenType.Identifier) {
            const identifier = this.expect(TokenType.Identifier);
            return { type: 'Identifier', name: identifier.value };
        } else if (this.currentToken.type === TokenType.OpenBracket) { // Handle arrays
            return this.parseArray();
        } else if (this.currentToken.type === TokenType.OpenParen) {
            this.expect(TokenType.OpenParen);
            const expr = this.parseExpression();
            this.expect(TokenType.CloseParen);
            return expr;
        }
        throw new Error(`Unexpected token: ${this.currentToken.value}`);
    }

    parseArray() {
        this.expect(TokenType.OpenBracket);
        const elements = [];
        while (this.currentToken && this.currentToken.type !== TokenType.CloseBracket) {
            elements.push(this.parseExpression());
            if (this.currentToken.type === TokenType.Comma) {
                this.expect(TokenType.Comma);
            }
        }
        this.expect(TokenType.CloseBracket);
        return { type: 'ArrayLiteral', elements };
    }

    parseReturnStatement() {
        this.expect(TokenType.Return);
        const value = this.parseExpression();
        this.expect(TokenType.Semicolon);
        return { type: 'ReturnStatement', value };
    }

    consume(tokenType) {
        if (this.currentToken.type === tokenType) {
            const token = this.currentToken;
            this.currentToken = this.lexer.nextToken();
            return token;
        }
        throw new Error(`Expected token type ${tokenType}, got ${this.currentToken.type}`);
    }
}

export default Parser;