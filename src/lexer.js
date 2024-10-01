import TokenType from './tokenTypes.js';

class Lexer {
    constructor(input) {
        this.pos = 0;
        this.input = input;
    }

    nextToken() {
        while (this.pos < this.input.length) {
            const currentChar = this.input[this.pos];

            if (/\s/.test(currentChar)) {
                this.pos++;
                continue;
            }

            if (currentChar === '/') {
                if (this.input[this.pos + 1] === '/') {
                    while (this.pos < this.input.length && this.input[this.pos] !== '\n') {
                        this.pos++;
                    }
                    this.pos++;
                    continue;
                }
            }

            if (/\d/.test(currentChar)) {
                return this.readNumber();
            }

            if (currentChar === '"' || currentChar === "'") {
                return this.readString(currentChar);
            }

            if (/[a-zA-Z_]/.test(currentChar)) {
                return this.readKeywordOrIdentifier();
            }

            if (currentChar === '=') {
                this.pos++;
                return { value: '=', type: TokenType.Equals };
            }

            if (currentChar === '(') {
                this.pos++;
                return { value: '(', type: TokenType.OpenParen };
            }
            if (currentChar === ')') {
                this.pos++;
                return { value: ')', type: TokenType.CloseParen };
            }

            if (currentChar === ';') {
                this.pos++;
                return { value: ';', type: TokenType.Semicolon };
            }

            if (currentChar === '{') {
                this.pos++;
                return { value: '{', type: TokenType.OpenBrace };
            }

            if (currentChar === '}') {
                this.pos++;
                return { value: '}', type: TokenType.CloseBrace };
            }

            if (['+', '-', '*', '/', '>', '<', '==='].includes(currentChar)) {
                return this.readBinaryOperator(currentChar);
            }

            throw new Error(`Unexpected character: ${currentChar}`);
        }

        return null; 
    }

    readKeywordOrIdentifier() {
        let idStr = '';
        while (this.pos < this.input.length && /[a-zA-Z_]/.test(this.input[this.pos])) {
            idStr += this.input[this.pos++];
        }
    
        switch (idStr) {
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
            case 'start':
                return { value: idStr, type: TokenType.Start };
            case 'end':
                return { value: idStr, type: TokenType.End };
            case 'run':
                return { value: idStr, type: TokenType.Run };
            case 'then':
                return { value: idStr, type: TokenType.Then };
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

        if (currentChar === '>' || currentChar === '<') {
            // Look for additional characters for multi-character operators (e.g., '===')
            if (this.pos < this.input.length && this.input[this.pos] === '=') {
                operator += '=';
                this.pos++;
            }
        }

        return { value: operator, type: TokenType.BinaryOperator };
    }
}

export default Lexer;
