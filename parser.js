import TokenType from './tokenTypes.js';

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.nextToken();
    }

    parse() {
        const statements = [];
    
        while (this.currentToken) {
            if (this.currentToken.type === TokenType.If) {
                statements.push(this.parseIfStatement());
            } else if (this.currentToken.type === TokenType.Let || this.currentToken.type === TokenType.Make) {
                statements.push(this.parseVariableDeclaration());
            } else if (this.currentToken.type === TokenType.Show) {
                statements.push(this.parsePrintStatement());
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


    parseBlock() {
        const statements = [];
        while (this.currentToken && this.currentToken.type !== TokenType.CloseBrace) {
            statements.push(this.parseStatement());
        }
        return statements;
    }

    parseStatement() {
        if (this.currentToken.type === TokenType.Let || this.currentToken.type === TokenType.Make) {
            return this.parseVariableDeclaration();
        } else if (this.currentToken.type === TokenType.Show) {
            return this.parsePrintStatement();
        } else if (this.currentToken.type === TokenType.If) {
            return this.parseIfStatement();
        } else if (this.currentToken.type === TokenType.Loop) {
            return this.parseRepeatStatement();
        } else if (this.currentToken.type === TokenType.Identifier) {
            return this.parseAssignmentOrExpression();
        }
        throw new Error(`Unexpected statement: ${this.currentToken.value}`);
    }

    parseVariableDeclaration() {
        const type = this.currentToken.type;
        this.consume(type); // consume let or make
        const name = this.consume(TokenType.Identifier);
        this.consume(TokenType.Equals);
        const value = this.parseExpression();
    
        // OPTIONAL: Check if the next token is a semicolon and consume it if present
        if (this.currentToken && this.currentToken.type === TokenType.Semicolon) {
            this.consume(TokenType.Semicolon);
        }
        
        return { type: 'VariableDeclaration', name: name.value, value };
    }
    
    parseAssignmentOrExpression() {
        const identifier = this.consume(TokenType.Identifier);
        this.consume(TokenType.Equals); // Consume '=' for assignment
        const value = this.parseExpression();
    
        // OPTIONAL: Check if the next token is a semicolon and consume it if present
        if (this.currentToken && this.currentToken.type === TokenType.Semicolon) {
            this.consume(TokenType.Semicolon);
        }
        
        return { type: 'Assignment', name: identifier.value, value };
    }
    
    parsePrintStatement() {
        this.consume(TokenType.Show);
        const value = this.parseExpression();
    
        // OPTIONAL: Check if the next token is a semicolon and consume it if present
        if (this.currentToken && this.currentToken.type === TokenType.Semicolon) {
            this.consume(TokenType.Semicolon);
        }
        
        return { type: 'PrintStatement', value };
    }

    parseRepeatStatement() {
        this.consume(TokenType.Loop);
        this.consume(TokenType.OpenParen);
        const identifier = this.consume(TokenType.Identifier);
        this.consume(TokenType.Comma);
        const startValue = this.parseExpression();
        this.consume(TokenType.Comma);
        const endValue = this.parseExpression();
        this.consume(TokenType.CloseParen);
        const block = this.parseBlock();
        
        return { type: 'RepeatStatement', identifier, startValue, endValue, block };
    }

    parseExpression() {
        return this.parseBinaryExpression();
    }

    parseBinaryExpression() {
        let left = this.parsePrimary();

        while (this.currentToken && this.currentToken.type === TokenType.BinaryOperator) {
            const operator = this.currentToken;
            this.consume(TokenType.BinaryOperator);
            const right = this.parsePrimary();
            left = { type: 'BinaryExpression', left, operator: operator.value, right };
        }

        return left;
    }

    parsePrimary() {
        if (this.currentToken.type === TokenType.Number) {
            const number = this.consume(TokenType.Number);
            return { type: 'NumberLiteral', value: parseFloat(number.value) };
        } else if (this.currentToken.type === TokenType.String) {
            const str = this.consume(TokenType.String);
            return { type: 'StringLiteral', value: str.value };
        } else if (this.currentToken.type === TokenType.Identifier) {
            const identifier = this.consume(TokenType.Identifier);
            return { type: 'Identifier', name: identifier.value };
        } else if (this.currentToken.type === TokenType.OpenParen) {
            this.consume(TokenType.OpenParen);
            const expr = this.parseExpression();
            this.consume(TokenType.CloseParen);
            return expr;
        }

        throw new Error(`Unexpected token: ${this.currentToken.value}`);
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
