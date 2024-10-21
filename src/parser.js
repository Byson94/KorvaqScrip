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
            } else if (this.currentToken.type === TokenType.ReverseFunc) {
                statements.push(this.parseReverseStatement());
            } else if (this.currentToken.type === TokenType.ToLowerCase) {
                statements.push(this.parseLowerCaseSentence());
            } else if (this.currentToken.type === TokenType.ToUpperCase) {
                statements.push(this.parseUpperCaseSentence());
            } else if (this.currentToken.type === TokenType.Tokenize) {
                statements.push(this.parseTokenizeSentence());
            } else if (this.currentToken.type === TokenType.Floor) {
                statements.push(this.parseFloorMath());
            } else if (this.currentToken.type === TokenType.Round) {
                statements.push(this.parseRoundMath());
            } else if (this.currentToken.type === TokenType.SquareRoot) {
                statements.push(this.parseSquareRootMath());
            } else if (this.currentToken.type === TokenType.Cos) {
                statements.push(this.parseCosMath());
            } else if (this.currentToken.type === TokenType.Sin) {
                statements.push(this.parseSinMath());
            } else if (this.currentToken.type === TokenType.Tan) {
                statements.push(this.parseTanMath());
            } else if (this.currentToken.type === TokenType.Call) {
                statements.push(this.parseFunctionCall());
            } else if (this.currentToken.type === TokenType.Return) {
                statements.push(this.parseReturnFuncStatement());
            } else if (this.currentToken.type === TokenType.ToJSON) {
                statements.push(this.parseToJSONStatement());
            } else if (this.currentToken.type === TokenType.ParseJSON) {
                statements.push(this.parseParseJSONstatement());
            } else if (this.currentToken.type === TokenType.If) {
                statements.push(this.parseIfStatement());
            } else if (this.currentToken.type === TokenType.Connect) {  
                statements.push(this.parseConnectStatement());
            } else if (this.currentToken.type === TokenType.Array) {
                statements.push(this.parseArrayAccess());
            } else if (this.currentToken.type === TokenType.ArrayAdd) {
                statements.push(this.parseArrayAdd());
            } else if (this.currentToken.type === TokenType.ArrayRemove) {
                statements.push(this.parseArrayRemove());
            } else if (this.currentToken.type === TokenType.ArrayLength) {
                statements.push(this.parseArrayLength());
            } else if (this.currentToken.type === TokenType.Read) {  
                statements.push(this.parseReadStatement());
            } else if (this.currentToken.type === TokenType.Async) {
                statements.push(this.parseAsyncStatement());
            } else if (this.currentToken.type === TokenType.DeleteVar) {
                statements.push(this.deleteVarStatement());
            } else if (this.currentToken.type === TokenType.DeleteFunc) {
                statements.push(this.deleteFuncStatement());
            } else if (this.currentToken.type === TokenType.Let || this.currentToken.type === TokenType.Make) {
                statements.push(this.parseVariableDeclaration());
            } else if (this.currentToken.type === TokenType.Show) {
                statements.push(this.parsePrintStatement());
            } else if (this.currentToken.type === TokenType.Error) {
                statements.push(this.parseErrorStatement());
            } else if (this.currentToken.type === TokenType.Alert) {
                statements.push(this.parseAlertStatement());
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

    parseReverseStatement() {
        this.expect(TokenType.ReverseFunc);
        let value = this.parseExpression()

        return {
            type: 'ReverseThings',
            value
        }
    }

    parseLowerCaseSentence() {
        this.expect(TokenType.ToLowerCase)
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else {
            value = this.expect(TokenType.String)
        }

        return {
            type: 'SentenceToLowerCase',
            value
        }
    }

    parseUpperCaseSentence() {
        this.expect(TokenType.ToUpperCase)
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else {
            value = this.expect(TokenType.String)
        }

        return {
            type: 'SentenceToUpperCase',
            value
        }
    }

    parseFloorMath() {
        this.expect(TokenType.Floor);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression();
        } else if (this.currentToken.type === TokenType.Round) {
            value =  this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value =  this.parseSquareRootMath(); 
        } else {
            value = this.expect(TokenType.Number)
        }

        return {
            type: 'FloorMath',
            value
        }
    }

    parseRoundMath() {
        this.expect(TokenType.Round);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression();
        } else if (this.currentToken.type === TokenType.Floor) {
            value =  this.parseFloorMath(); 
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value =  this.parseSquareRootMath(); 
        } else {
            value = this.expect(TokenType.Number)
        }

        return {
            type: 'RoundMath',
            value
        }
    }

    parseSquareRootMath() {
        this.expect(TokenType.SquareRoot);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else if (this.currentToken.type === TokenType.Round) {
            value =  this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.Floor) {
            value =  this.parseFloorMath();
        } else {
            value = this.expect(TokenType.Number)
        }

        return {
            type: 'SqrtMath',
            value
        }
    }

    parseCosMath() {
        this.expect(TokenType.Cos);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else if (this.currentToken.type === TokenType.Round) {
            value =  this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.Floor) {
            value =  this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value =  this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value =  this.parseFloorMath();
        } else {
            value = this.expect(TokenType.Number)
        }

        return {
            type: 'CosMath',
            value
        }
    }

    parseSinMath() {
        this.expect(TokenType.Sin);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else if (this.currentToken.type === TokenType.Round) {
            value =  this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.Floor) {
            value =  this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value =  this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value =  this.parseFloorMath();
        } else {
            value = this.expect(TokenType.Number)
        }

        return {
            type: 'SinMath',
            value
        }
    }

    parseTanMath() {
        this.expect(TokenType.Tan);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else if (this.currentToken.type === TokenType.Round) {
            value =  this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.Floor) {
            value =  this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value =  this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value =  this.parseFloorMath();
        } else {
            value = this.expect(TokenType.Number)
        }

        return {
            type: 'TanMath',
            value
        }
    }

    parseReturnFuncStatement() {
        this.expect(TokenType.Return);
        let identifier
        if (this.currentToken.type === TokenType.Identifier) {
            identifier = this.parseExpression();
        } else {
            identifier = this.parseExpression()
        }

        return {
            type: 'ReturnFromFunc',
            name: identifier
        }
    }

    parseArrayRemove() {
        this.expect(TokenType.ArrayRemove); // Expect the ArrayAdd token
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
            type: 'ArrayRemove', 
            array: arrayIdentifier.value, 
            element: element 
        };
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
        return { type: 'DeleteVariable', name: identifier.value }; // Return a DeleteVariable statement node
    }    

    deleteFuncStatement() {
        this.expect(TokenType.DeleteFunc); // We expect the delete function token
        const identifier = this.expect(TokenType.Identifier);

        return { type: 'DeleteFunction', name: identifier.value };
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
            case TokenType.Func:   // Handle function declaration
                return this.parseFunctionDeclaration();
            case TokenType.Return:
                return this.parseReturnFuncStatement();
            case TokenType.ToJSON:
                return this.parseToJSONStatement();
            case TokenType.ParseJSON:
                return this.parseParseJSONstatement();
            case TokenType.If:
                return this.parseIfStatement();
            case TokenType.Connect:
                return this.parseConnectStatement();
            case TokenType.Array: 
                return this.parseArrayAccess();
            case TokenType.ArrayAdd: 
                return this.parseArrayAdd();
            case TokenType.ArrayRemove: 
                return this.parseArrayRemove();
            case TokenType.ArrayLength: 
                return this.parseArrayLength();
            case TokenType.Read:  
                return this.parseReadStatement();
            case TokenType.Async:
                return this.parseAsyncStatement();
            case TokenType.DeleteVar:
                return this.deleteVarStatement();
            case TokenType.DeleteFunc:  // Fixed duplicate case
                return this.deleteFuncStatement();
            case TokenType.Let:
            case TokenType.Make:
                return this.parseVariableDeclaration();
            case TokenType.Show:
                return this.parsePrintStatement();
            case TokenType.Error:
                return this.parseErrorStatement();
            case TokenType.Alert:
                return this.parseAlertStatement();
            case TokenType.While:  // Handle while
                return this.parseWhileStatement();
            case TokenType.Loop:   // Handle loop
                return this.parseRepeatStatement();
            case TokenType.Identifier:
                return this.parseAssignmentOrExpression();
            case TokenType.Floor:
                return this.parseFloorMath();
            case TokenType.Round:
                return this.parseRoundMath();
            case TokenType.SquareRoot:
                return this.parseSquareRootMath();
            case TokenType.Sin:
                return this.parseSinMath();
            case TokenType.Cos:
                return this.parseCosMath();
            case TokenType.Tan:
                return this.parseTanMath();
            case TokenType.Tokenize:
                return this.parseTokenizeSentence();
            case TokenType.ToLowerCase:
                return this.parseLowerCaseSentence();
            case TokenType.ToUpperCase:
                return this.parseUpperCaseSentence();
            case TokenType.ReverseFunc:
                return this.parseReverseStatement();
            default:
                throw new Error(`Unexpected statement: ${this.currentToken.value}`);
        }
    }   
    
    parseTokenizeSentence() {
        this.expect(TokenType.Tokenize);
        let value;
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression()
        } else {
            value = this.expect(TokenType.String)
        }

        return {
            type: 'TokenizeSentence',
            value
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
        } else if (this.currentToken.type === TokenType.Array) {
            value = this.parseArrayAccess();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } else if (this.currentToken.type === TokenType.ReverseFunc) {
            value = this.parseReverseStatement();
        } else if (this.currentToken.type === TokenType.ToLowerCase) {
            value = this.parseLowerCaseSentence();
        } else if (this.currentToken.type === TokenType.ToUpperCase) {
            value = this.parseUpperCaseSentence();
        } else if (this.currentToken.type === TokenType.Tokenize) {
            value = this.parseTokenizeSentence();
        } else if (this.currentToken.type === TokenType.Floor) {
            value = this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Round) {
            value = this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value = this.parseSquareRootMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value = this.parseCosMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value = this.parseSinMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value = this.parseTanMath();
        } else if (this.currentToken.type === TokenType.Call) {
            value = this.parseFunctionCall();
        } else if (this.currentToken.type === TokenType.ToJSON) {
            value = this.parseToJSONStatement();
        } else if (this.currentToken.type === TokenType.ParseJSON) {
            value = this.parseParseJSONstatement();
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
    
        // If not a function call it’s an assignment
        this.expect(TokenType.Equals); // Use `expect` for assignment
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.Array) {
            value = this.parseArrayAccess();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } else if (this.currentToken.type === TokenType.ReverseFunc) {
            value = this.parseReverseStatement();
        } else if (this.currentToken.type === TokenType.Tokenize) {
            value = this.parseTokenizeSentence();
        } else if (this.currentToken.type === TokenType.Floor) {
            value = this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Round) {
            value = this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value = this.parseSquareRootMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value = this.parseCosMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value = this.parseSinMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value = this.parseTanMath();
        } else if (this.currentToken.type === TokenType.Call) {
            value = this.parseFunctionCall();
        } else if (this.currentToken.type === TokenType.ToJSON) {
            value = this.parseToJSONStatement();
        } else if (this.currentToken.type === TokenType.ParseJSON) {
            value = this.parseParseJSONstatement();
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

    parseToJSONStatement() {
        this.expect(TokenType.ToJSON);
        let value
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression();
        } else if (this.currentToken.type === TokenType.String) {
            value = this.expect(TokenType.String);
        } else {
            throw new Error("Expected Identifier or String for ToJSON conversion.");
        }

        return { 
            type: "ToJSONStatement", 
            value 
        };
    }

    parseFunctionCall() {
        this.expect(TokenType.Call)
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
    }

    parseParseJSONstatement() {
        this.expect(TokenType.ParseJSON);
        let value
        if (this.currentToken.type === TokenType.Identifier) {
            value = this.parseExpression();
        } else if (this.currentToken.type === TokenType.String) {
            value = this.expect(TokenType.String);
        } else {
            throw new Error("Expected Identifier or String for ToJSON conversion.");
        }

        return { 
            type: "ParseJSONStatement", 
            value 
        };
    }

    parseArrayAccess() {
        this.expect(TokenType.Array)
        const identifier = this.expect(TokenType.Identifier);
        
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
    }

    parsePrintStatement() {
        this.expect(TokenType.Show);
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } else if (this.currentToken.type === TokenType.ReverseFunc) {
            value = this.parseReverseStatement();
        } else if (this.currentToken.type === TokenType.Tokenize) {
            value = this.parseTokenizeSentence();
        } else if (this.currentToken.type === TokenType.ToLowerCase) {
            value = this.parseLowerCaseSentence();
        } else if (this.currentToken.type === TokenType.ToUpperCase) {
            value = this.parseUpperCaseSentence();
        } else if (this.currentToken.type === TokenType.Floor) {
            value = this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Round) {
            value = this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value = this.parseSquareRootMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value = this.parseCosMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value = this.parseSinMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value = this.parseTanMath();
        } else if (this.currentToken.type === TokenType.Call) {
            value = this.parseFunctionCall();
        } else if (this.currentToken.type === TokenType.ToJSON) {
            value = this.parseToJSONStatement();
        } else if (this.currentToken.type === TokenType.ParseJSON) {
            value = this.parseParseJSONstatement();
        } else {
            value = this.parseExpression(); // Standard variable assignment
        }
        
        return { type: 'PrintStatement', value };
    }

    parseErrorStatement() {
        this.expect(TokenType.Error);
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.Call) {
            value = this.parseFunctionCall();
        } else if (this.currentToken.type === TokenType.Floor) {
            value = this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.ReverseFunc) {
            value = this.parseReverseStatement();
        } else if (this.currentToken.type === TokenType.ToLowerCase) {
            value = this.parseLowerCaseSentence();
        } else if (this.currentToken.type === TokenType.ToUpperCase) {
            value = this.parseUpperCaseSentence();
        } else if (this.currentToken.type === TokenType.Tokenize) {
            value = this.parseTokenizeSentence();
        } else if (this.currentToken.type === TokenType.Round) {
            value = this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value = this.parseSquareRootMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value = this.parseCosMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value = this.parseSinMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value = this.parseTanMath();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } else if (this.currentToken.type === TokenType.ToJSON) {
            value = this.parseToJSONStatement();
        } else if (this.currentToken.type === TokenType.ParseJSON) {
            value = this.parseParseJSONstatement();
        } else {
            value = this.parseExpression(); // Standard variable assignment
        }
        
        return { type: 'ErrorStatement', value };
    }

    parseAlertStatement() {
        this.expect(TokenType.Alert);
        let value;
        if (this.currentToken.type === TokenType.Read) {
            value = this.parseReadStatement();
        } else if (this.currentToken.type === TokenType.Call) {
            value = this.parseFunctionCall();
        } else if (this.currentToken.type === TokenType.ReverseFunc) {
            value = this.parseReverseStatement();
        } else if (this.currentToken.type === TokenType.ArrayLength) {
            value = this.parseArrayLength();
        } else if (this.currentToken.type === TokenType.ToLowerCase) {
            value = this.parseLowerCaseSentence();
        } else if (this.currentToken.type === TokenType.ToUpperCase) {
            value = this.parseUpperCaseSentence();
        } else if (this.currentToken.type === TokenType.Tokenize) {
            value = this.parseTokenizeSentence();
        } else if (this.currentToken.type === TokenType.Floor) {
            value = this.parseFloorMath();
        } else if (this.currentToken.type === TokenType.Round) {
            value = this.parseRoundMath();
        } else if (this.currentToken.type === TokenType.SquareRoot) {
            value = this.parseSquareRootMath();
        } else if (this.currentToken.type === TokenType.Cos) {
            value = this.parseCosMath();
        } else if (this.currentToken.type === TokenType.Sin) {
            value = this.parseSinMath();
        } else if (this.currentToken.type === TokenType.Tan) {
            value = this.parseTanMath();
        } else if (this.currentToken.type === TokenType.ToJSON) {
            value = this.parseToJSONStatement();
        } else if (this.currentToken.type === TokenType.ParseJSON) {
            value = this.parseParseJSONstatement();
        } else {
            value = this.parseExpression(); // Standard variable assignment
        }
        
        return { type: 'AlertStatement', value };
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