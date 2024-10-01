class Interpreter {
    constructor() {
        this.variables = {};
    }

    visitIfStatement(node) {
        const conditionResult = this.visit(node.condition);
        if (conditionResult) {
            this.executeBlock(node.thenBlock);
        } else if (node.elseBlock) {
            this.executeBlock(node.elseBlock);
        }
    }

    executeBlock(statements) {
        for (const statement of statements) {
            this.visit(statement);
        }
    }

    interpret(statements) {
        statements.forEach(statement => {
            this.execute(statement);
        });
    }

    execute(statement) {
        switch (statement.type) {
            case 'VariableDeclaration':
                this.handleVariableDeclaration(statement);
                break;
            case 'Assignment':
                this.handleAssignment(statement);
                break;
            case 'PrintStatement':
                this.handlePrint(statement);
                break;
            case 'RepeatStatement':
                this.handleRepeat(statement);
                break;
            case 'IfStatement':
                this.handleIfStatement(statement);
                break;
            default:
                throw new Error(`Unknown statement type: ${statement.type}`);
        }
    }

    handleIfStatement(statement) {
        const condition = this.evaluate(statement.condition);
        if (condition) {
            this.interpret(statement.thenBlock);
        } else if (statement.elseBlock) {
            this.interpret(statement.elseBlock);
        }
    }

    handleVariableDeclaration(statement) {
        const value = this.evaluate(statement.value);
        this.variables[statement.name] = value;
    }

    handleAssignment(statement) {
        const value = this.evaluate(statement.value);
        this.variables[statement.name] = value;
    }

    handlePrint(statement) {
        const value = this.evaluate(statement.value);
        console.log(value);
    }

    handleRepeat(statement) {
        const start = this.evaluate(statement.startValue);
        const end = this.evaluate(statement.endValue);

        for (let i = start; i <= end; i++) {
            this.variables[statement.identifier.value] = i;
            this.interpret(statement.block);
        }
    }

    evaluate(expression) {
        switch (expression.type) {
            case 'NumberLiteral':
                return expression.value;
            case 'StringLiteral':
                return expression.value;
            case 'Identifier':
                return this.variables[expression.name] || 0;
            case 'BinaryExpression':
                return this.evaluateBinaryExpression(expression);
            default:
                throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    evaluateBinaryExpression(expression) {
        const left = this.evaluate(expression.left);
        const right = this.evaluate(expression.right);

        switch (expression.operator) {
            case '>':
                return left > right;
            case '<':
                return left < right;
            case '===':
                return left === right;
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            default:
                throw new Error(`Unknown operator: ${expression.operator}`);
        }
    }
}

export default Interpreter;
