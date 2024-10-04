class Interpreter {
    constructor() {
        this.variables = {};  // Store values
        this.immutables = new Set();  // Track immutable variables
        this.functions = {};  // Store functions
    }

    isNode() {
        return (typeof process !== 'undefined' && process.versions != null && process.versions.node != null);
    }
    

    handleFunctionDeclaration(statement) {
        this.functions[statement.name] = statement;
    }

    executeFunctionCall(node) {
        const func = this.functions[node.name];
        if (!func) {
            throw new Error(`Function "${node.name}" is not defined.`);
        }
        
        const localScope = {};
        if (func.params) {
            for (let i = 0; i < func.params.length; i++) {
                localScope[func.params[i].name] = this.evaluate(node.arguments[i]);
            }
        }
        
        return this.executeFunctionBlock(func.body, localScope);
    }
    
    
    executeFunctionBlock(statements, localScope) {
        for (const statement of statements) {
            if (statement.type === 'ReturnStatement') {
                return this.evaluate(statement.value, localScope);
            }
            this.execute(statement, localScope);
        }
    }

    visitIfStatement(node) {
        // Evaluate the condition using the newly added comparisons
        const conditionResult = this.evaluate(node.condition);
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
            case 'FunctionDeclaration':
                this.handleFunctionDeclaration(statement);
                break;
            case 'FunctionCall':
                this.executeFunctionCall(statement);
                break;
            case 'DeleteVariable':
                this.handleDeleteVariable(statement);
                break;
            case 'ConnectStatement':  // Add this case to handle "connect" statement
                this.handleConnect(statement);
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
        // Ensure we're directly evaluating the value
        const value = this.evaluate(statement.value);
        
        // Check if the variable is already immutable
        if (this.immutables.has(statement.name)) {
            throw new Error(`Variable "${statement.name}" is immutable and cannot be redeclared.`);
        }
    
        // If it's declared with "make", mark it as immutable
        if (statement.isImmutable) {
            if (this.variables.hasOwnProperty(statement.name)) {
                throw new Error(`Variable "${statement.name}" already exists and cannot be redeclared.`);
            }
            this.immutables.add(statement.name);
        }
    
        // Assign the evaluated value to the variable
        this.variables[statement.name] = value;
    }
    
    handleDeleteVariable(statement) {
        const varName = statement.name;
        
        // Check if the variable exists
        if (!this.variables.hasOwnProperty(varName)) {
            throw new Error(`Variable "${varName}" is not defined.`);
        }
        
        // Check if the variable is immutable
        if (this.immutables.has(varName)) {
            throw new Error(`Variable "${varName}" is immutable and cannot be deleted.`);
        }
        
        // Delete the variable from the variables object
        delete this.variables[varName];
        console.log(this.variables[varName])
    }
    
    // Add a new method to access elements in an array
    getArrayElement(arrayName, index) {
        const array = this.variables[arrayName];
        if (!Array.isArray(array)) {
            throw new Error(`Variable "${arrayName}" is not an array.`);
        }
        return array[index];
    }    
    
    handleAssignment(statement) {
        // Check if the variable is immutable
        if (this.immutables.has(statement.name)) {
            throw new Error(`Variable "${statement.name}" is immutable and cannot be reassigned.`);
        }
        
        // If mutable, assign the new value
        const value = this.evaluate(statement.value);
        this.variables[statement.name] = value;
    }

    async handleConnect(statement) {
        const filePath = statement.filePath;
    
        // Ensure it's a .kq file
        if (!filePath.endsWith('.kq')) {
            throw new Error(`Only .kq files can be connected. Provided: ${filePath}`);
        }
    
        if (this.isNode()) {
            // Node.js environment
            const { promises: fs } = await import('fs');
            const path = (await import('path')).default;
    
            // Dynamically import Lexer and Parser
            const { default: Lexer } = await import('./lexer.js');
            const { default: Parser } = await import('./parser.js');
    
            const absolutePath = path.resolve(filePath);
    
            // Read the file contents in Node.js
            try {
                const fileContents = await fs.readFile(absolutePath, 'utf-8');
                const lexer = new Lexer(fileContents);
                const parser = new Parser(lexer);
                const statements = parser.parse();
    
                this.interpret(statements);
            } catch (error) {
                throw new Error(`Failed to load and execute file: ${error.message}`);
            }
    
        } else {
            // Browser environment
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to load file: ${filePath}`);
                }
                const fileContents = await response.text();
                const { default: Lexer } = await import('./lexer.js');
                const { default: Parser } = await import('./parser.js');
    
                const lexer = new Lexer(fileContents);
                const parser = new Parser(lexer);
                const statements = parser.parse();
    
                this.interpret(statements);
            } catch (error) {
                throw new Error(`Failed to load and execute file: ${error.message}`);
            }
        }
    }
    
    handlePrint(statement) {
        const value = this.evaluate(statement.value);
        if (Array.isArray(value)) {
            console.log(`[${value.join(', ')}]`); // Correctly formats the array
        } else if (typeof value === 'boolean') {
            console.log(value); // Directly print the boolean
        } else {
            console.log(value); // Print the value directly for non-array and non-boolean types
        }
    }    

    handleRepeat(statement) {
        const start = this.evaluate(statement.startValue);
        const end = this.evaluate(statement.endValue);

        for (let i = start; i <= end; i++) {
            this.variables[statement.identifier.value] = i;
            this.interpret(statement.block);
        }
    }

    handleReturn(statement) {
        return this.evaluate(statement.value);
    }
    
    executeFunctionBlock(statements, localScope) {
        for (const statement of statements) {
            if (statement.type === 'ReturnStatement') {
                return this.handleReturn(statement);
            }
            this.execute(statement, localScope);
        }
    }

    evaluate(expression) {
        switch (expression.type) {
            case 'NumberLiteral':
                return expression.value;
            case 'StringLiteral':
                return expression.value;
            case 'BooleanLiteral':
                return expression.value;  // Ensure it returns the boolean value
            case 'Identifier':
                // Check if the variable exists
                if (this.variables.hasOwnProperty(expression.name)) {
                    return this.variables[expression.name]; // Return the exact value
                }
                throw new Error(`Variable "${expression.name}" is not defined.`);
            case 'BinaryExpression':
                return this.evaluateBinaryExpression(expression);
            case 'FunctionCall':
                return this.executeFunctionCall(expression);
            case 'ArrayLiteral':
                return expression.elements.map(element => this.evaluate(element));
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
            case '==':  // Add this case for equality comparison
                return left == right;  // Note that this uses coercion
            case '!=':
                return left !== right;
            case '!==':  // Optionally add strict inequality
                return left !== right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
            case '=>':
                return left >= right;
            case '&&':
                return left && right;
            case '||':
                return left || right;
            case '!':
                return !left;
            case '%':
                return left % right;
            case '**':
                return left ** right;
            default:
                throw new Error(`Unknown operator: ${expression.operator}`);
        }
    }    
}

export default Interpreter;
