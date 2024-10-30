function compile(korvaqCode) {
    const lines = korvaqCode.split('\n');
    let jsCode = '';

    for (let line of lines) {
        line = line.trim();
        line = line.replace(/(\b(?:sin|cos|tan|sqrt|round|floor)\b)\s+(\d+(\.\d+)?)/g, (match, func, arg) => `Math.${func}(${arg})`);
        line = line.replace(/\bcall\b/g, '');

        if (line.startsWith('let ')) {
            jsCode += line.replace('let ', 'let ') + '\n';
        } else if (line.startsWith('make ')) {
            jsCode += line.replace('make ', 'const ') + '\n'; 
        } else if (line.startsWith('delvar ')) {
            const variable = line.replace('delvar ', '');
            jsCode += `delete ${variable}; // Delete variable\n`; 
        } else if (line.startsWith('show ')) {
            jsCode += line.replace('show ', 'console.log(') + ');\n'; 
        } else if (line.startsWith('if ')) {
            // Find the index of the opening brace
            const conditionStartIndex = line.indexOf('(');
            const conditionEndIndex = line.indexOf(')');
        
            let condition;
            if (conditionStartIndex !== -1 && conditionEndIndex !== -1) {
                condition = line.substring(conditionStartIndex + 1, conditionEndIndex).trim();
            } else {
                const braceIndex = line.indexOf('{');
                condition = line.substring(3, braceIndex).trim();
            }
        
            jsCode += `if (${condition}) {\n`; 
        } else if (line.startsWith('else')) {
            jsCode += line + '\n'; 
        } else if (line.startsWith('loop ')) {
            const loopStartIndex = line.indexOf('(');
            const loopEndIndex = line.indexOf(')');
        
            let loopCondition;
            if (loopStartIndex !== -1 && loopEndIndex !== -1) {
                loopCondition = line.substring(loopStartIndex + 1, loopEndIndex).trim();
            } else {
                const braceIndex = line.indexOf('{');
                loopCondition = line.substring(5, braceIndex).trim();
            }
        
            jsCode += `for (let ${loopCondition}) {\n`;
        } else if (line.startsWith('while ')) {
            const conditionStartIndex = line.indexOf('(');
            const conditionEndIndex = line.indexOf(')');
        
            let condition;
            if (conditionStartIndex !== -1 && conditionEndIndex !== -1) {
                condition = line.substring(conditionStartIndex + 1, conditionEndIndex).trim();
            } else {
                const braceIndex = line.indexOf('{');
                condition = line.substring(6, braceIndex).trim();
            }
        
            jsCode += `while (${condition}) {\n`; 
        } else if (line.startsWith('func ')) {
            const funcName = line.split(' ')[1].split('(')[0];
            jsCode += line.replace('func ', 'function ') + '\n'; 
        } else if (line.startsWith('return ')) {
            jsCode += line.replace('return ', 'return ') + '\n'; 
        } else if (line.startsWith('delfunc ')) {
            const funcName = line.replace('delfunc ', '');
            jsCode += `delete ${funcName}; // Delete function\n`; 
        } else if (line.startsWith('connect ')) {
            const filePath = line.replace('connect ', '');
            jsCode += `// Linking to ${filePath}\n`;
        } else if (line.startsWith('async ')) {
            jsCode += line.replace('async {', 'async function() {') + '\n'; 
        } else if (line.startsWith('//')) {
            jsCode += line + '\n'; 
        } else {
            jsCode += line + '\n';
        }
    }

    return jsCode; 
}
module.exports = { compile };