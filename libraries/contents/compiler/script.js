const fs = require('fs');                
const path = require('path');            
const readline = require('readline');    
const { compile } = require('./compiler.js');

function promptPath() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const askForInput = (question) => {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    };

    async function getFilePath() {
        while (true) { 
            const input = await askForInput('Please enter the path to your KQ file (or type "exit" to quit): ');
            if (input.toLowerCase() === 'exit') {
                console.log('Exiting the application.');
                rl.close();
                return;
            }
            if (fs.existsSync(input)) {
                const outputDir = await askForInput('Please enter the output directory (leave blank for same as input): ');
                const fileName = await askForInput('Please enter the output file name (leave blank for default): ');
                processFile(input, outputDir, fileName);
                break; 
            } else {
                console.error('Error: File does not exist.');
            }
        }
        rl.close();
    }

    getFilePath();
}

function processFile(filePath, outputDir, fileName = 'compiledKQcode.js') {
    try {
        const kqCode = fs.readFileSync(filePath, 'utf-8');
        const jsCode = compile(kqCode); 

        const finalFileName = fileName.trim() === '' ? 'compiledKQcode.js' : ensureJsExtension(fileName);
        writeOutputFile(filePath, jsCode, outputDir, finalFileName);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

function ensureJsExtension(fileName) {
    if (!fileName.endsWith('.js')) {
        return `${fileName}.js`;
    }
    return fileName;
}

function writeOutputFile(originalPath, jsCode, outputDir, fileName) {
    const outputDirectory = outputDir.trim() === '' ? path.dirname(originalPath) : outputDir;
    const outputPath = path.join(outputDirectory, fileName); 

    try {
        fs.writeFileSync(outputPath, jsCode, 'utf-8');
        console.log(`JavaScript code has been written to ${outputPath}`);
    } catch (writeError) {
        console.error(`Error writing to file: ${writeError.message}`);
    }
}

console.log('Welcome to KorvaqFileProcessor!');
promptPath();
