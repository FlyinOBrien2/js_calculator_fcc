const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator_keys');
const output = calculator.querySelector('.calculator_display');

// const displayedNum = output.textContent;
const clearButton = document.getElementById('clear-button');

const OPERATOR = 'operator';
const NUMBER = 'number';
const DECIMAL = 'decimal';
const CALCULATE = 'calculate';
const CLEAR = 'clear';


function calculate(val1, oper, val2) {
	val1 = parseFloat(val1);
	val2 = parseFloat(val2);
	switch (oper) {
		case 'add': return val1 + val2;
		case 'subtract': return val1 - val2;
		case 'multiply': return val1 * val2;
		case 'divide': return val1 / val2;
	}
}

function createResultString(key, displayedNum, state) {
	const value = key.textContent;
	const action = key.dataset.action;
	const firstValue = state.firstValue;
	const modValue = state.modValue;
	const operator = state.operator;
	const previousKeyType = state.previousKeyType;
	
	// handle numbers (0-9)
	if (!action) {
		return (
			displayedNum === 0 ||
			previousKeyType === OPERATOR ||
			previousKeyType === CALCULATE
		)
			? value
			: displayedNum + value
	}

	// handle decimal (.)
	if (action === DECIMAL) {
		if (!displayedNum.includes('.')) return displayedNum + '.';
		if (previousKeyType === OPERATOR || previousKeyType === CALCULATE) {
			return '0.'
		}
		return displayedNum;
	}

	// handle operator (+-*/)
	if (
		action === 'add' ||
		action === 'subtract' ||
		action === 'multiply' ||
		action === 'divide'
	) {

		// const firstValue = calculator.dataset.firstValue;
		// const operator = calculator.dataset.operator;

		return firstValue &&
			operator &&
			calculator.dataset.previousKeyType != OPERATOR &&
			calculator.dataset.previousKeyType !== CALCULATE
			? calculate(firstValue, operator, displayedNum)
			: displayedNum;
	}

	// handle clear button (AC or CE)
	if (action === CLEAR) {
		return 0;
	}

	// handle calculate button (=)
	if (action === CALCULATE) {
		// const firstValue = calculator.dataset.firstValue;
		// const operator = calculator.dataset.operator;
		// const modValue = calculator.dataset.modValue;

		return firstValue 
		? calculator.dataset.previousKeyType === CALCULATE
			? calculate(displayedNum, operator, modValue)
			: calculate(firstValue, operator, displayedNum)
		: displayedNum;
			
		
		return calculate(firstValue, operator, displayedNum)
	}
} // end createResultString

keys.addEventListener('click', e => {
	if (e.target.dataset.action !== 'clear') {
		clearButton.textContent = 'CE';
	}

	if (e.target.matches('button')) {
		const key = e.target;

		Array.from(key.parentNode.children)
			.forEach(k => k.classList.remove('is-depressed'));

		const action = key.dataset.action;
		const displayedNum = output.textContent;
		console.log(action)
		// if no data-action attribute, it must be a number
		if (!action) {
			const value = key.textContent;
			if (
				displayedNum === '0' ||
				calculator.dataset.previousKeyType === OPERATOR ||
				calculator.dataset.previousKeyType === CALCULATE
			) {
				output.textContent = value;
			} else {
				output.textContent = displayedNum + value;
			}
			calculator.dataset.previousKeyType = NUMBER;
		}
		// if there is a data-action attribute, handle +-*/
		if (
			action === 'add' ||
			action === 'subtract' ||
			action === 'multiply' ||
			action === 'divide'
		) {

			if (calculator.dataset.previousKeyType !== CALCULATE) {
				calculator.dataset.firstValue = displayedNum;
				calculator.dataset.operator = action;
				calculator.dataset.previousKeyType = OPERATOR;

				const firstValue = calculator.dataset.firstValue;
				const operator = calculator.dataset.operator;
				const secondValue = displayedNum;

				if (
					firstValue &&
					operator &&
					calculator.dataset.previousKeyType != OPERATOR &&
					calculator.dataset.previousKeyType !== CALCULATE
				) {
					const calcValue = calculate(firstValue, operator, secondValue)
					output.textContent = calcValue;
					calculator.dataset.firstValue = calcValue;
				} else {
					calculator.dataset.firstValue = displayedNum;
				}

				key.classList.add('is-depressed')

				// handle if an operator is clicked before any numbers are entered
				if (displayedNum === '0') {
					setTimeout(() => { key.classList.remove('is-depressed') }, 100)
				}

				calculator.dataset.previousKeyType = OPERATOR;
				calculator.dataset.operator = action;
			}
		}
		// handle the calculate button
		if (action === CALCULATE) {
			let firstValue = calculator.dataset.firstValue;
			const operator = calculator.dataset.operator;
			let secondValue = displayedNum;

			if (firstValue) {
				if (calculator.dataset.previousKeyType === CALCULATE) {
					console.log('CALCULATE')
					firstValue = displayedNum;
					secondValue = calculator.dataset.modValue;
				}
				output.textContent = calculate(firstValue, operator, secondValue)
			}

			calculator.dataset.modValue = secondValue;
			console.log('modValue', calculator.dataset.modValue)
			calculator.dataset.previousKeyType = CALCULATE;
			key.classList.add('is-depressed');
		} // end calculate

		// handle if the decimal button is clicked
		if (action === 'decimal' && !output.textContent.includes('.')) {
			if (calculator.dataset.previousKeyType === 'operator') {
				output.textContent = '0'
			}
			output.textContent += '.'
			calculator.dataset.previousKeyType = DECIMAL;
		}

		// handle if the clear button is clicked
		if (action === 'clear') {
			console.log('action = clear', action)
			console.log(clearButton.textContent)
			if (clearButton.textContent === 'AC') {
				calculator.dataset.firstValue = '';
				calculator.dataset.modValue = '';
				calculator.dataset.operator = '';
				calculator.dataset.previousKeyType = '';
			} else {
				clearButton.textContent = 'AC';
			}
			output.textContent = '0';
			calculator.dataset.previousKeyType = 'clear';
		}
	}
	console.log(calculator.dataset)
})