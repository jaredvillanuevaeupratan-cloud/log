// Calculator State
let currentExpression = '';
let lastResult = 0;
let history = [];
let angleMode = 'deg'; // 'deg' or 'rad'

// Constants
const CONSTANTS = {
    pi: Math.PI,
    e: Math.E,
    phi: (1 + Math.sqrt(5)) / 2  // Golden ratio
};

// DOM Elements
const expressionInput = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const historyList = document.getElementById('historyList');
const angleModeSelect = document.getElementById('angleMode');
const currentModeIndicator = document.getElementById('currentMode');

// Initialize
function init() {
    updateMode();
    setupKeyboardSupport();
}

// Update angle mode display
function updateMode() {
    angleMode = angleModeSelect.value;
    currentModeIndicator.textContent = angleMode.toUpperCase();
}

// Add number to expression
function addNumber(num) {
    currentExpression += num;
    updateDisplay();
}

// Add operator to expression
function addOperator(op) {
    if (op === '^') {
        currentExpression += '**';
    } else if (op === 'mod') {
        currentExpression += '%';
    } else {
        currentExpression += op;
    }
    updateDisplay();
}

// Add function to expression
function addFunction(func) {
    if (func === 'factorial') {
        currentExpression += '!';
    } else if (func === 'pow2') {
        currentExpression += '**2';
    } else if (func === 'pow3') {
        currentExpression += '**3';
    } else {
        currentExpression += func + '(';
    }
    updateDisplay();
}

// Add constant to expression
function addConstant(constant) {
    currentExpression += constant;
    updateDisplay();
}

// Clear all
function clearAll() {
    currentExpression = '';
    lastResult = 0;
    updateDisplay();
}

// Clear entry
function clearEntry() {
    currentExpression = '';
    updateDisplay();
}

// Backspace
function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

// Toggle sign
function toggleSign() {
    if (currentExpression.length > 0) {
        // Check if the last character is a number or closing parenthesis
        const lastChar = currentExpression.slice(-1);
        if (/[0-9)]/.test(lastChar)) {
            // Find the start of the last number/expression
            let i = currentExpression.length - 1;
            while (i >= 0 && /[0-9.)]/.test(currentExpression[i])) {
                i--;
            }
            
            // Check if there's already a negative sign
            if (i >= 0 && currentExpression[i] === '-') {
                currentExpression = currentExpression.slice(0, i) + currentExpression.slice(i + 1);
            } else {
                currentExpression = currentExpression.slice(0, i + 1) + '-' + currentExpression.slice(i + 1);
            }
        } else {
            currentExpression = '-' + currentExpression;
        }
        updateDisplay();
    }
}

// Calculate factorial
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Convert angle based on mode
function convertAngle(value) {
    if (angleMode === 'deg') {
        return value * Math.PI / 180;
    }
    return value;
}

// Convert result back from radians if needed
function convertBackAngle(value) {
    if (angleMode === 'deg') {
        return value * 180 / Math.PI;
    }
    return value;
}

// Evaluate expression
function evaluateExpression(expr) {
    try {
        // Replace constants with their values
        let processedExpr = expr;
        
        // Replace constants
        processedExpr = processedExpr.replace(/pi/g, CONSTANTS.pi.toString());
        processedExpr = processedExpr.replace(/\be\b/g, CONSTANTS.e.toString());
        processedExpr = processedExpr.replace(/phi/g, CONSTANTS.phi.toString());
        
        // Handle factorial (!) - find numbers followed by !
        processedExpr = processedExpr.replace(/(\d+)!/g, (match, number) => {
            return factorial(parseInt(number)).toString();
        });
        
        // Replace trigonometric functions with angle conversion
        processedExpr = processedExpr.replace(/sin\(([^)]+)\)/g, (match, arg) => {
            return `Math.sin(${angleMode === 'deg' ? `(${arg}) * ${Math.PI / 180}` : arg})`;
        });
        processedExpr = processedExpr.replace(/cos\(([^)]+)\)/g, (match, arg) => {
            return `Math.cos(${angleMode === 'deg' ? `(${arg}) * ${Math.PI / 180}` : arg})`;
        });
        processedExpr = processedExpr.replace(/tan\(([^)]+)\)/g, (match, arg) => {
            return `Math.tan(${angleMode === 'deg' ? `(${arg}) * ${Math.PI / 180}` : arg})`;
        });
        
        // Replace inverse trigonometric functions with angle conversion
        processedExpr = processedExpr.replace(/asin\(([^)]+)\)/g, (match, arg) => {
            return angleMode === 'deg' ? `(Math.asin(${arg}) * ${180 / Math.PI})` : `Math.asin(${arg})`;
        });
        processedExpr = processedExpr.replace(/acos\(([^)]+)\)/g, (match, arg) => {
            return angleMode === 'deg' ? `(Math.acos(${arg}) * ${180 / Math.PI})` : `Math.acos(${arg})`;
        });
        processedExpr = processedExpr.replace(/atan\(([^)]+)\)/g, (match, arg) => {
            return angleMode === 'deg' ? `(Math.atan(${arg}) * ${180 / Math.PI})` : `Math.atan(${arg})`;
        });
        
        // Replace other mathematical functions
        processedExpr = processedExpr.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
        processedExpr = processedExpr.replace(/cbrt\(([^)]+)\)/g, 'Math.cbrt($1)');
        processedExpr = processedExpr.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
        processedExpr = processedExpr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
        processedExpr = processedExpr.replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');
        processedExpr = processedExpr.replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');
        processedExpr = processedExpr.replace(/floor\(([^)]+)\)/g, 'Math.floor($1)');
        processedExpr = processedExpr.replace(/ceil\(([^)]+)\)/g, 'Math.ceil($1)');
        processedExpr = processedExpr.replace(/round\(([^)]+)\)/g, 'Math.round($1)');
        
        // Evaluate the expression
        const result = eval(processedExpr);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid result');
        }
        
        return result;
    } catch (error) {
        throw new Error('Invalid expression');
    }
}

// Calculate result
function calculate() {
    if (currentExpression.trim() === '') {
        return;
    }
    
    try {
        const result = evaluateExpression(currentExpression);
        const formattedResult = formatResult(result);
        
        // Add to history
        addToHistory(currentExpression, formattedResult);
        
        // Update displays
        resultDisplay.textContent = formattedResult;
        lastResult = result;
        
        // Store result for potential continuation
        currentExpression = result.toString();
        expressionInput.value = '';
    } catch (error) {
        resultDisplay.textContent = 'Error';
        currentExpression = '';
    }
}

// Format result for display
function formatResult(result) {
    if (typeof result !== 'number') {
        return result.toString();
    }
    
    // Handle very large or very small numbers
    if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-10 && result !== 0)) {
        return result.toExponential(6);
    }
    
    // Round to reasonable precision
    const rounded = parseFloat(result.toFixed(10));
    return rounded.toString();
}

// Add calculation to history
function addToHistory(expression, result) {
    history.unshift({ expression, result });
    
    // Keep only last 20 calculations
    if (history.length > 20) {
        history.pop();
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

// Clear history
function clearHistory() {
    history = [];
    updateHistoryDisplay();
}

// Update display
function updateDisplay() {
    expressionInput.value = currentExpression;
}

// Setup keyboard support
function setupKeyboardSupport() {
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Numbers and basic operators
        if (/[0-9]/.test(key)) {
            addNumber(key);
        } else if (['+', '-', '*', '/', '(', ')', '.', '%', '^'].includes(key)) {
            addOperator(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        } else if (key === 'Backspace') {
            backspace();
        } else if (key === 'Escape') {
            clearAll();
        } else if (key === 'Delete') {
            clearEntry();
        }
    });
}

// Scroll to booking (placeholder function)
function scrollToBooking() {
    console.log('Scroll to booking');
}

// Initialize calculator on page load
init();
