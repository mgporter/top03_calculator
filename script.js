const numberButtons = document.querySelectorAll('.button.number');
const equalsButton = document.getElementById('equals');
const displayMain = document.querySelector('#displaymain > p');
const basicOperations = document.querySelectorAll('.basic-op');
const clearButton = document.getElementById('clear');
const displayWrapper = document.querySelector('#display-wrapper');
const negativeButton = document.querySelector('#negative');

class Calculator {
    constructor(previousNum) {
        this.previousNum = previousNum;
        this.previousOp = null;
        this.clearOnNextNumber = false;
        this.operation = "";
        this.lastPressed = null;
        this.error = false;
    }

    appendNum(num) {
        this.currentNum = num;
        
    }

    appendOp(operation) {
        this.clearOnNextNumber = true;
        
        if (this.operation) {
            this.compute(this.operation)
        }
        
        this.operation = operation;
        
    }

    clearMainDisplay() {
        displayMain.textContent = "";
    }

    updateDisplay(num, clearAfterComputation=false) {
        if (this.clearOnNextNumber) {
            this.clearMainDisplay();
            this.clearOnNextNumber = false;
        }

        if (num.toString().length > 16) {
            displayMain.textContent = "Range Error :(";
            displayWrapper.style.backgroundColor = '#ff6c6c';
            this.error = true;
            return;
        }

        if (displayMain.textContent.includes(".") && num === ".") return;

        if (displayMain.textContent === "0" || clearAfterComputation === true) {
            displayMain.textContent = String(num);
        } else {
            displayMain.textContent = displayMain.textContent + String(num)
        }
    }

    toggleNegative() {
        displayMain.textContent = Number(displayMain.textContent) * -1;
    }

    compute(prev, cur, operation) {
        let result;
        let prevBig = new Big(prev);
        let curBig = new Big(cur);


        console.log(`${prev} and ${cur}`)

        switch (operation) {
            case "+":
                result = prevBig.plus(curBig);
                break;
            case "-":
                result = prevBig.minus(curBig);
                break;
            case "×":
                result = prevBig.times(curBig);
                break;
            case "÷":
                result = prevBig.div(curBig);
                result = result.round(8, Big.roundHalfUp);
                break;
            case "xe":
                
                // Big.js cannot do decimal number exponents, so we must check if the exponent has a decimal
                // and then use the traditional method if it does
                if (String(cur).includes('.')) {
                    result = (+prev) ** +cur;
                    result = new Big(result).round(8, Big.roundHalfUp)
                } else {
                    result = prevBig.pow(+cur);
                }
                break;
            default:
                result = curBig;
                break;
        }


        this.repeatedNumber = cur
        this.updateDisplay(result.toNumber(), true)
        this.clearOnNextNumber = true;
        return result.toNumber();
    }
}


let calc = new Calculator(displayMain.textContent)

const clearAll = function () {
    displayMain.textContent = 0;
    calc = new Calculator(displayMain.textContent);
    displayWrapper.style.backgroundColor = 'rgb(210, 210, 210)';
}


numberButtons.forEach((button) => {    
    button.addEventListener('click', (e) => {
        if (calc.error) clearAll();
        calc.updateDisplay(e.target.querySelector('p').textContent)
        calc.lastPressed = "number";
    });
})

basicOperations.forEach((button) => {
    
    
    button.addEventListener('click', (e) => {
        if (calc.lastPressed === "equals") {
            if (calc.error) clearAll();
            calc.previousNum = calc.compute(calc.previousNum, 
                displayMain.textContent, 
                null);
        } else {
            if (calc.error) clearAll();
            calc.previousNum = calc.compute(calc.previousNum, 
                displayMain.textContent, 
                calc.previousOp);
        }

        calc.previousOp = e.target.querySelector('p').textContent
        calc.lastPressed = "operation";
    });
})

clearButton.addEventListener('click', clearAll)

negativeButton.addEventListener('click', (e) => {
    if (calc.error) clearAll();
    calc.toggleNegative();
})

equalsButton.addEventListener('click', (e) => {
    if (calc.error) clearAll();
    
    if (calc.lastPressed === "equals") {
        calc.previousNum = calc.compute(displayMain.textContent, 
            calc.repeatedNumber, 
            calc.previousOp);
    } else {
        calc.previousNum = calc.compute(calc.previousNum, 
            displayMain.textContent, 
            calc.previousOp);
    }
    
    calc.lastPressed = "equals";
})

