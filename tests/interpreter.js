class Interpreter {
    constructor() {
        this.variables = {};  // Store values
        this.immutables = new Set();  // Track immutable variables
        this.functions = {};  // Store functions
        this.localScope = {};  // Local variables during function execution
    }

    isNode() {
        return (typeof process !== 'undefined' && process.versions != null && process.versions.node != null);
    }
    

    handleFunctionDeclaration(statement) {
        // Save the function with its name, params, and body
        this.functions[statement.name] = {
            params: statement.params,  // Store the function parameters
            body: statement.body,
        };
    }    

    executeFunctionCall(node) {
        const func = this.functions[node.name];
        if (!func) {
            throw new Error(`Function "${node.name}" is not defined.`);
        }
    
        const args = node.args || [];
        const params = func.params || [];
    
        // Populate localScope with arguments or "void"
        for (let i = 0; i < params.length; i++) {
            if (i < args.length) {
                const arg = args[i];
                if (arg.type === 'Identifier') {
                    const value = this.variables[arg.name];
                    this.localScope[params[i].name] = value !== undefined ? value : "void"; // Default to "void" if undefined
                } else {
                    this.localScope[params[i].name] = this.evaluate(arg);
                }
            } else {
                // If no argument provided for this parameter, assign "void"
                this.localScope[params[i].name] = "void";
            }
        }
    
        // Execute the function body with the local scope
        this.executeFunctionBlock(func.body, this.localScope);
    }
    
    executeFunctionBlock(body) {
        for (const statement of body) {
            this.executeStatement(statement); 
        }
    }
    
    executeStatement(statement) {
        if (statement.type === 'PrintStatement') {
            console.log(this.evaluate(statement.value));
        }
    }
    
    evaluate(value) {
        if (value.type === 'Identifier') {
            console.log(`Looking up variable: ${value.name}`);
            if (this.localScope?.[value.name] !== undefined) {
                return this.localScope[value.name];
            }
            if (this.variables?.[value.name] !== undefined) {
                return this.variables[value.name];
            }
            throw new Error(`Variable "${value.name}" is not defined.`);
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
            this.execute(statement);
        }
    }

    interpret(statements) {
        statements.forEach(statement => {
            this.execute(statement);
        });
    }

    async executeAsyncBlock(asyncBlock) {
        // Execute each statement in the async block as an asynchronous operation
        const promises = asyncBlock.statements.map(statement => {
            return Promise.resolve().then(() => this.execute(statement));
        });
        // Wait for all statements to complete
        await Promise.all(promises);
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
            case 'ErrorStatement':
                this.handleError(statement);
                break;
            case 'AlertStatement':
                this.handleAlert(statement);
                break;
            case 'RepeatStatement':
                this.handleRepeat(statement);
                break;
            case 'WhileStatement':
                this.handleWhile(statement);
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
            case 'DeleteFunction':
                this.handleDeleteFunction(statement);
                break;
            case 'ConnectStatement':
                this.handleConnect(statement);
                break;
            case 'AsyncBlock':
                return this.executeAsyncBlock(statement);
            case 'VoidLiteral':
                return 'void'
            case 'ReadStatement':
                this.handleReadStatement(statement);
                break;
            case 'ArrayAdd':
                this.addToArray(statement.array, statement.element);
                break;
            case 'ArrayRemove':
                this.removeFromArray(statement.array, statement.element);
                break;
            case 'ArrayLength':
                this.lengthOfArray(statement.array);
                break;
            case 'ArrayAccess':
                return this.handleArrayAccess(statement);
            case 'ToJSONStatement':
                this.toJSONStatement(statement);
            case 'ParseJSONStatement':
                this.parseJSONStatement(statement)
            default:
                throw new Error(`Unknown statement type: ${statement.type}`);
        }
    }

    handleArrayAccess(statement) {
        const arrayName = statement.arrayName; // The name of the array variable
        const index = this.evaluate(statement.index); // Evaluate the index
    
        // Check if the index is a valid number
        if (typeof index !== 'number' || index < 0) {
            throw new Error(`Invalid index "${index}" for array "${arrayName}".`);
        }
    
        // Get the array element using the new method
        const element = this.getArrayElement(arrayName, index);
        return element; // Return the accessed value if needed
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
        // Check if the variable name is "all"
        if (statement.name === 'all') {
            throw new Error(`Variable name "all" is not allowed.`);
        }
    
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
    
        // Check if the command is to delete all variables
        if (varName === 'all') {
            // Iterate through the variables and delete them
            for (const key in this.variables) {
                if (this.variables.hasOwnProperty(key)) {
                    // Check if the variable is immutable
                    if (this.immutables.has(key)) {
                        throw new Error(`Variable "${key}" is immutable and cannot be deleted.`);
                    }
                    // Delete the variable
                    delete this.variables[key];
                }
            }
            return; // Exit the function after deleting all
        }
    
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
    }

    handleDeleteFunction(statement) {
        const functionName = statement.name;
    
        // Check if the command is to delete all variables
        if (functionName === 'all') {
            // Iterate through the variables and delete them
            for (const key in this.functions) {
                if (this.functions.hasOwnProperty(key)) {
                    // Delete the variable
                    delete this.functions[key];
                }
            }
            return; // Exit the function after deleting all
        }
    
        // Check if function exists
        if (!this.functions.hasOwnProperty(functionName)) {
            throw new Error(`Function "${functionName}" is not defined.`);
        }
    
        // Delete the variable from the variables object
        delete this.functions[functionName];
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
        // Check if the variable name is "all"
        if (statement.name === 'all') {
            throw new Error(`Variable name "all" is not allowed.`);
        }
    
        // Check if the variable is immutable
        if (this.immutables.has(statement.name)) {
            throw new Error(`Variable "${statement.name}" is immutable and cannot be reassigned.`);
        }
    
        // Evaluate the value
        const value = this.evaluate(statement.value);
    
        // If mutable, assign the new value
        this.variables[statement.name] = value;
    }
    
    addToArray(arrayName, value) {
        // Check if the variable is defined
        if (!this.variables.hasOwnProperty(arrayName)) {
            throw new Error(`Array "${arrayName}" is not defined.`);
        }
    
        // Check if the variable is an array
        const array = this.variables[arrayName];
        if (!Array.isArray(array)) {
            throw new Error(`Variable "${arrayName}" is not an array.`);
        }
    
        // Evaluate the value to be added
        const evaluatedValue = this.evaluate(value);
    
        // Push the evaluated value to the array
        array.push(evaluatedValue);
    }    

    removeFromArray(arrayName, value) {
        // Check if the variable is defined
        if (!this.variables.hasOwnProperty(arrayName)) {
            throw new Error(`Array "${arrayName}" is not defined.`);
        }
    
        // Check if the variable is an array
        const array = this.variables[arrayName];
        if (!Array.isArray(array)) {
            throw new Error(`Variable "${arrayName}" is not an array.`);
        }
    
        // Evaluate the value to be removed
        const evaluatedValue = this.evaluate(value);
    
        // Determine the type of the evaluated value
        if (typeof evaluatedValue === 'number') {
            if (evaluatedValue < 0 || evaluatedValue >= array.length) {
                throw new Error(`Index "${evaluatedValue}" is out of bounds.`);
            }
            array.splice(evaluatedValue, 1); // Remove the item at the specified index
        } else if (typeof evaluatedValue === 'string') {
            // If it's a string, remove the first occurrence of that value
            const index = array.indexOf(evaluatedValue);
            if (index !== -1) {
                array.splice(index, 1); 
            } else {
                throw new Error(`Value "${evaluatedValue}" not found in the array.`);
            }
        } else {
            throw new Error(`Unsupported value type. Expected number or string, but received ${typeof evaluatedValue}.`);
        }
    }
    
    toJSONStatement(statement) {
        const holdValue = statement.value;
        if (holdValue === 'String') {
            holdValue.type = 'StringLiteral';
        }
        const value = this.evaluate(holdValue);
        let returnValue = JSON.stringify(value)

        return returnValue;
    }

    parseJSONStatement(statement) {
        const holdValue = statement.value;
        if (holdValue === 'String') {
            holdValue.type = 'StringLiteral';
        }
        const value = this.evaluate(holdValue);
        let returnValue = JSON.parse(value)

        return returnValue;
    }

    lengthOfArray(arrayName) {
        if (!this.variables.hasOwnProperty(arrayName)) {
            throw new Error(`Array "${arrayName}" is not defined.`);
        }
    
        const array = this.variables[arrayName];
        if (!Array.isArray(array)) {
            throw new Error(`Variable "${arrayName}" is not an array.`);
        }
    
        return array.length;
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

    async handleReadStatement(statement) {
        const filePath = statement.filePath;
    
        if (this.isNode()) {
            // For Node.js environment
            const fs = await import('fs').then(module => module.promises);
            try {
                const data = await fs.readFile(filePath, 'utf8');
                return data;
            } catch (error) {
                throw new Error('Error reading file: ' + error.message);
            }
        } else {
            throw new Error('File reading is not supported in the web environment.');
        }
    }
    
    
    handlePrint(statement) {
        const value = this.evaluate(statement.value);
        if (Array.isArray(value)) {
            console.log(JSON.stringify(value));
        } else if (typeof value === 'boolean') {
            console.log(value);
        } else {
            console.log(value);
        }
    }
     
    handleError(statement) {
        const value = this.evaluate(statement.value);
        if (Array.isArray(value)) {
            console.log(JSON.stringify(value));
        } else if (typeof value === 'boolean') {
            console.log(value);
        } else {
            console.error(value);
        }
    }

    handleAlert(statement) {
        const value = this.evaluate(statement.value);
        if (Array.isArray(value)) {
            console.log(JSON.stringify(value));
        } else if (typeof value === 'boolean') {
            console.log(value);
        } else {
            console.warn(value);
        }
    }

    handleRepeat(statement) {
        // Evaluate the start and end values of the loop
        const start = this.evaluate(statement.startValue);
        const end = this.evaluate(statement.endValue);
    
        // Loop through the range from start to end (inclusive)
        for (let i = start; i <= end; i++) {
            // Set the loop variable in the variables context
            this.variables[statement.identifier.value] = i;
    
            // Execute the block of code inside the loop
            this.interpret(statement.block);
        }
    
        // Optionally, delete the loop variable after the loop is done
        delete this.variables[statement.identifier.value];
    }
    
    handleWhile(statement) {
        // Extract the condition and the block from the statement
        const { condition, block } = statement;
    
        // Execute the loop while the condition is true
        while (this.evaluate(condition)) {
            this.executeBlock(block);
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

    // NOTE: THIS IS THE IMPOSTER WHO MANAGES THE VARIABLES BEHIND THE SCENESE!! DONT BELIEVE THIS CODE! IT TRAPPED ME FOR
    // 8 HRS TRYING TO FIND OUT WHY THE CODE IS LOOKING FOR "THIS.VARIABLES" FIRST. BEWARE YOU NAVIGATOR THE BELOW ONE IS SUS.
    evaluate(expression) {
        switch (expression.type) {
            case 'NumberLiteral':
                return Number(expression.value);
            case 'StringLiteral':
                return expression.value;
            case 'BooleanLiteral':
                return expression.value;
            case 'Identifier':
                if (this.localScope.hasOwnProperty(expression.name)) {
                    return this.localScope[expression.name];
                } else if (this.variables.hasOwnProperty(expression.name)) {
                    return this.variables[expression.name];
                } else {
                    throw new Error(`Variable "${expression.name}" is not defined.`);
                }
            case 'ReadStatement':  // Add handling for ReadStatement
                return this.handleReadStatement(expression);
            case 'ArrayLength':
                return this.lengthOfArray(expression.array)
            case 'ArrayAccess':
                return this.handleArrayAccess(expression);
            case 'ToJSONStatement':
                return this.toJSONStatement(expression);
            case 'ParseJSONStatement':
                return this.parseJSONStatement(expression);
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
            case '==':
                return left == right;
            case '!=':
                return left !== right;
            case '!==':
                return left !== right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
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
            case '+': 
                return left + right || String(left) + String(right) ; 
            case '-': 
                return left - right;
            case '*': 
                return left * right;
            case '/': 
                return left / right;
            case '%': 
                return left % right;
            default:
                throw new Error(`Unknown operator: ${expression.operator}`);
        }
    } 
}

export default Interpreter;
