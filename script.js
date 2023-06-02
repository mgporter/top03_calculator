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

        if (+num > 9999999999999999) {
            displayMain.textContent = "Error!";
            displayWrapper.style.backgroundColor = '#ff6c6c';
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
        
        prev = Number(prev);
        cur = Number(cur);


        console.log(`${prev} and ${cur}`)

        switch (operation) {
            case "+":
                result = prev + cur;
                break;
            case "-":
                result = prev - cur;
                break;
            case "×":
                result = prev * cur;
                break;
            case "÷":
                result = prev / cur;
                break;
            case "xe":
                result = prev ** cur;
                break;
            default:
                result = cur;
                break;
        }


        this.repeatedNumber = cur
        this.updateDisplay(result, true)
        this.clearOnNextNumber = true;
        return result;
    }
}


let calc = new Calculator(displayMain.textContent)



numberButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        calc.updateDisplay(e.target.querySelector('p').textContent)
        calc.lastPressed = "number";
    });
})

basicOperations.forEach((button) => {
    button.addEventListener('click', (e) => {
        if (calc.lastPressed === "equals") {
            calc.previousNum = calc.compute(calc.previousNum, 
                displayMain.textContent, 
                null);
        } else {
            calc.previousNum = calc.compute(calc.previousNum, 
                displayMain.textContent, 
                calc.previousOp);
        }

        calc.previousOp = e.target.querySelector('p').textContent
        calc.lastPressed = "operation";
    });
})

clearButton.addEventListener('click', (e) => {
    displayMain.textContent = 0;
    calc = new Calculator(displayMain.textContent);
    displayWrapper.style.backgroundColor = 'rgb(210, 210, 210)';
})

negativeButton.addEventListener('click', (e) => {
    calc.toggleNegative();
})

equalsButton.addEventListener('click', (e) => {
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

