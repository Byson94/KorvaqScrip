import TokenType from './tokenTypes.js';

class Lexer {
    constructor(input) {
        this.pos = 0;
        this.input = input;
        this.restrictedKeywords = new Set([
            'var', 'const', 'for', 'switch', 'case', 'break', 
            'continue', 'default', 'class', 'extends', 'super', 'this', 
            'typeof', 'instanceof', 'delete', 'new', 'in', 
            'try', 'catch', 'finally', 'throw', 'debugger',
        ]);
    }

    nextToken() {
        while (this.pos < this.input.length) {
            const currentChar = this.input[this.pos];
    
            // Skip whitespace
            if (/\s/.test(currentChar)) {
                this.pos++;
                continue;
            }
    
            // Check for single-line comments
            if (currentChar === '/') {
                if (this.input[this.pos + 1] === '/') {
                    while (this.pos < this.input.length && this.input[this.pos] !== '\n') {
                        this.pos++;
                    }
                    this.pos++; // Move past the newline
                    continue;
                }
            }
    
            // Check for boolean literals
            if (this.input.startsWith('true', this.pos)) {
                this.pos += 4; // Move position past "true"
                return { value: true, type: TokenType.Boolean };
            }
            if (this.input.startsWith('false', this.pos)) {
                this.pos += 5; // Move position past "false"
                return { value: false, type: TokenType.Boolean };
            }
    
            // Check for numbers, strings, keywords, operators, and punctuation
            if (/\d/.test(currentChar)) {
                return this.readNumber();
            }
            if (currentChar === '"' || currentChar === "'") {
                return this.readString(currentChar);
            }
            if (/[a-zA-Z_]/.test(currentChar)) {
                return this.readKeywordOrIdentifier();
            }
    
            // Handle operators and punctuation
            if (currentChar === '=') {
                this.pos++;
                if (this.input[this.pos] === '=') {
                    this.pos++;
                    return { value: '==', type: TokenType.Equals }; // Handle equality
                }
                return { value: '=', type: TokenType.Equals }; // Assignment
            }
            if (currentChar === '(') {
                this.pos++;
                return { value: '(', type: TokenType.OpenParen };
            }
            if (currentChar === ')') {
                this.pos++;
                return { value: ')', type: TokenType.CloseParen };
            }
            // Ignore semicolon
            if (currentChar === ';') {
                this.pos++;
                continue; // Skip semicolon
            }
            if (currentChar === '{') {
                this.pos++;
                return { value: '{', type: TokenType.OpenBrace };
            }
            if (currentChar === '}') {
                this.pos++;
                return { value: '}', type: TokenType.CloseBrace };
            }
    
            // Handle array syntax
            if (currentChar === '[') {
                this.pos++;
                return { value: '[', type: TokenType.OpenBracket };
            }
            if (currentChar === ']') {
                this.pos++;
                return { value: ']', type: TokenType.CloseBracket };
            }
            if (currentChar === ',') {
                this.pos++;
                return { value: ',', type: TokenType.Comma };
            }
    
            // Handle binary operators
            if (['+', '-', '*', '/', '%'].includes(currentChar)) {
                return this.readBinaryOperator(currentChar);
            }
    
            // Handle comparison operators
            if (currentChar === '>') {
                return this.readComparisonOperator('>');
            }
            if (currentChar === '<') {
                return this.readComparisonOperator('<');
            }

            if (currentChar === '*' && this.input[this.pos + 1] === '*') {
                this.pos += 2; // Move past '**'
                return { value: '**', type: TokenType.BinaryOperator };
            }
    
            // Handle logical operators
            if (currentChar === '&' && this.input[this.pos + 1] === '&') {
                this.pos += 2; // Move past '&&'
                return { value: '&&', type: TokenType.LogicalAnd };
            }
            if (currentChar === '|' && this.input[this.pos + 1] === '|') {
                this.pos += 2; // Move past '||'
                return { value: '||', type: TokenType.LogicalOr };
            }

            // Handle not equal operator
            if (currentChar === '!' && this.input[this.pos + 1] === '=') {
                this.pos += 2; // Move past '!='
                return { value: '!=', type: TokenType.NotEquals };
            }
    
            throw new Error(`Unexpected character: ${currentChar}`);
        }
    
        return null; 
    }

    readKeywordOrIdentifier() {
        let idStr = '';
        
        // Allow the first character to be a letter or underscore
        if (/[a-zA-Z_]/.test(this.input[this.pos])) {
            idStr += this.input[this.pos++];
        } else {
            throw new Error(`Invalid identifier start: ${this.input[this.pos - 1]} at position ${this.pos - 1}`);
        }
    
        // Allow subsequent characters to be letters, digits, or underscores
        while (this.pos < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.pos])) {
            idStr += this.input[this.pos++];
        }
    
        // Check for restricted keywords
        if (this.restrictedKeywords.has(idStr) && idStr !== 'delvar all') {
            throw new Error(`Restricted keyword used: ${idStr}`);
        }

        if (idStr === 'add' || idStr === 'remove') {
            return { value: idStr, type: TokenType.MethodCall };
        }
    
        // Token identification
        switch (idStr) {
            case 'delvar':
                return { value: idStr, type: TokenType.DeleteVar };
            case 'delfunc':
                return { value: idStr, type: TokenType.DeleteFunc };
            case 'func':
                return { value: idStr, type: TokenType.Func };
            case 'return':
                return { value: idStr, type: TokenType.Return };
            case 'if':
                return { value: idStr, type: TokenType.If };
            case 'else':
                return { value: idStr, type: TokenType.Else };
            case 'let':
                return { value: idStr, type: TokenType.Let };
            case 'make':
                return { value: idStr, type: TokenType.Make };
            case 'show':
                return { value: idStr, type: TokenType.Show };
            case 'loop':
                return { value: idStr, type: TokenType.Loop };
            case 'while':
                return { value: idStr, type: TokenType.While };
            case 'start':
                return { value: idStr, type: TokenType.Start };
            case 'end':
                return { value: idStr, type: TokenType.End };
            case 'run':
                return { value: idStr, type: TokenType.Run };
            case 'then':
                return { value: idStr, type: TokenType.Then };
            case 'connect':
                return { value: idStr, type: TokenType.Connect };
            case 'async':
                return { value: idStr, type: TokenType.Async };
            case 'arrayadd':
                return { value: idStr, type: TokenType.ArrayAdd };
            case 'arraylength':
                return { value: idStr, type: TokenType.ArrayLength };
            case 'arrayremove':
                return { value: idStr, type: TokenType.ArrayRemove };
            case 'read':
                return { value: idStr, type: TokenType.Read };
            default:
                return { value: idStr, type: TokenType.Identifier };
        }
    }

    readNumber() {
        let numStr = '';
        while (this.pos < this.input.length && /\d/.test(this.input[this.pos])) {
            numStr += this.input[this.pos++];
        }
        return { value: numStr, type: TokenType.Number };
    }

    readString(quoteType) {
        let str = '';
        this.pos++;
        while (this.pos < this.input.length && this.input[this.pos] !== quoteType) {
            str += this.input[this.pos++];
        }
        if (this.pos < this.input.length) {
            this.pos++;
        } else {
            throw new Error('Unterminated string literal');
        }
        return { value: str, type: TokenType.String };
    }

    readBinaryOperator(currentChar) {
        let operator = currentChar;
        this.pos++;
        return { value: operator, type: TokenType.BinaryOperator };
    }

    readComparisonOperator(currentChar) {
        let operator = currentChar;
        this.pos++;

        // Check for multi-character operators (e.g., '>=', '<=', '==', '!=')
        if (this.pos < this.input.length && this.input[this.pos] === '=') {
            operator += '=';
            this.pos++;
        }

        return { value: operator, type: TokenType.BinaryOperator };
    }
}

export default Lexer;
