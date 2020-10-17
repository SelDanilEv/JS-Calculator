const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');

const equalsButton = document.querySelector('[data-equals]');
const delButton = document.querySelector('[data-delete]');
const clearAllButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const sqrtOperationButtons = document.querySelector('[data-unar-sqrt-operation]');
const messageBox = document.getElementsByClassName('message')[0];

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        console.log("Calc constructor");
        this.clear();
    }

    writeMessage(message) {
        messageBox.innerHTML = message;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => messageBox.innerHTML = "", 4000);
        calculator.currentOperand = calculator.previousOperand;
        calculator.previousOperand = '';
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetCalc = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '-0') this.currentOperand = '-';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if ((+this.currentOperand).toString().length > 15) return;
        if (this.currentOperand === '-') this.currentOperand += '0';
        if (number === '.' && this.currentOperand === '') this.currentOperand = '0';
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') {
            if (operation === '-') {
                this.currentOperand = '-';
            }
            return;
        }
        if (this.currentOperand === '-') return;
        if (this.previousOperand !== '') {
            if (this.previousOperand === '-') {
                this.previousOperand = '0';
            }
            this.calculate();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.resetCalc = false;
    }

    calculate_sqrt() {
        let result;
        const prev = parseFloat(this.previousOperand);
        if (isNaN(prev)) return;
        if (prev < 0) {
            this.writeMessage("Negative number");
            this.currentOperand = prev;
        } else {
            result = Math.sqrt(prev);
            this.currentOperand = result;
        }
        this.endCalculation();
    }

    calculate() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                result = prev + current;
                break
            case '-':
                result = prev - current;
                break
            case '*':
                result = prev * current;
                break
            case '÷':
                if (current === 0) {
                    this.writeMessage("Divide by zero");
                    result = prev;
                } else {
                    result = prev / current;
                }
                break
            case '^':
                result = Math.pow(prev, current);
                break
            default:
                return;
        }
        this.currentOperand = result;
        this.endCalculation();
    }

    endCalculation() {
        this.operation = undefined;
        this.previousOperand = '';
        this.resetCalc = true;
    }

    getDisplayNumber(number) {
        if (number === '-') {
            return '-';
        }
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        isNaN(integerDigits) ?
            integerDisplay = '' :
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
        let rc;
        (decimalDigits != null) ?
            rc = `${integerDisplay}.${decimalDigits}` :
            rc = integerDisplay;
        return rc;
    }

    updateDisplay() {
        if (this.currentOperand.toString().length > 14 && !this.currentOperand.toString().includes('e'))
            this.currentOperand = +this.currentOperand.toString().substr(0, 15);

        if (this.previousOperand.toString().length > 14 && !this.previousOperand.toString().includes('e'))
            this.previousOperand = +this.previousOperand.toString().substr(0, 15);


        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)


numberButtons
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                if (calculator.resetCalc) {
                    calculator.currentOperand = '';
                    calculator.resetCalc = false;
                }
                calculator.appendNumber(button.innerText)
                calculator.updateDisplay();
            })
    })

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', button => {
    calculator.calculate();
    calculator.updateDisplay();
})

clearAllButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

delButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})

sqrtOperationButtons.addEventListener('click', button => {
    calculator.calculate_sqrt();
    calculator.updateDisplay();
})