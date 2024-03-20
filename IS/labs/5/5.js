function getStartingIndexes(i, n) {
	if (i < n) {
		return [i, 0]
	} else {
		return [n - 1, i - n + 1]
	}
}

function cipherSnake(text) {
	text = text.split('')
	const n = Math.ceil(Math.sqrt(text.length))
	const table = []
	for (let i = 0; i < n; i++) {
		table.push(text.splice(0, n))
	}
	const result = []
	let direction = 1
	let diagonalLength = 1
	
	for (let i = 0; i < 2 * n - 1; i++) {
		const startingIndexes = getStartingIndexes(i, n)
		let [rowIndex, columnIndex] = direction === 1 ? startingIndexes : startingIndexes.toReversed()
		for (let j = 0; j < diagonalLength; j++) {
			result.push(table[rowIndex - direction * j][columnIndex + direction * j])
		}
		direction *= -1

		if (i < n - 1) {
			diagonalLength++
		} else {
			diagonalLength--
		}
	}

	return result
}

function decipherSnake(text) {
	const n = Math.ceil(Math.sqrt(text.length))
	const result = []
	for (let i = 0; i < n; i++) {
		const row = []
		for (let j = 0; j < n; j++) {
			row.push(undefined)
		}
		result.push(row)
	}

	let charIndex = 0
	let direction = 1
	let diagonalLength = 1
	
	for (let i = 0; i < 2 * n - 1; i++) {
		const startingIndexes = getStartingIndexes(i, n)
		let [rowIndex, columnIndex] = direction === 1 ? startingIndexes : startingIndexes.toReversed()
		for (let j = 0; j < diagonalLength; j++) {
			result[rowIndex - direction * j][columnIndex + direction * j] = text[charIndex++]
		}
		direction *= -1

		if (i < n - 1) {
			diagonalLength++
		} else {
			diagonalLength--
		}
	}

	return result
}
const result = cipherSnake('Hello, World!')
console.log(result.join(' '))
console.log(decipherSnake(result).map(e => e.join('')).join(''))

const engAlphabet = "abcdefghijklmnopqrstuvwxyz"
				   //01234567890123456789012345
function keyToNumber(key) {
	let result = []
	for (let i = 0; i < key.length; i++) {
		let index
		index = engAlphabet.indexOf(key[i])
		while (result.find(e => e.value === index)) {
			index = index >= engAlphabet.length ? 0 : index + 1
		}
		result.push({char: key[i], value: index})
	}
	return result
}
function getNextIndex(lastValue, arr) {
	let min = Infinity
	let result = -1
	for (let i = 0; i < arr.length; i++) {
		const value = arr[i].value
		if (value > lastValue && value < min && min > lastValue) {
			min = value
			result = i
		}
	}
	return result
}
function cipherMulti(text, key1, key2) {
	text = text.split('')
	const [numKey1, numKey2] = [keyToNumber(key1), keyToNumber(key2)]
	const table = []
	const result = []
	for (let i = 0; i < key2.length; i++) {
		table.push(text.splice(0, key1.length))
	}
	let lastColumnValue = -1
	for (let i = 0; i < key1.length; i++) {
		const columnIndex = getNextIndex(lastColumnValue, numKey1)
		lastColumnValue = numKey1[columnIndex].value
		let lastRowValue = -1
		for (let j = 0; j < key2.length; j++) {
			const rowIndex = getNextIndex(lastRowValue, numKey2)
			lastRowValue = numKey2[rowIndex].value
			result.push(table[rowIndex][columnIndex])
		}
	}
	return result
}
function decipherMulti(arr, key1, key2) {
	const [numKey1, numKey2] = [keyToNumber(key1), keyToNumber(key2)]
	const table = Array.from({length: key2.length})
	for (let i = 0; i < key2.length; i++) {
		table[i] = Array.from({length: key1.length})
	}
	const result = []
	let lastColumnValue = -1
	let charIndex = 0
	for (let i = 0; i < key1.length; i++) {
		const columnIndex = getNextIndex(lastColumnValue, numKey1)
		lastColumnValue = numKey1[columnIndex].value
		let lastRowValue = -1
		for (let j = 0; j < key2.length; j++) {
			const rowIndex = getNextIndex(lastRowValue, numKey2)
			lastRowValue = numKey2[rowIndex].value
			table[rowIndex][columnIndex] = arr[charIndex++]
		}
	}
	return table.map(e => e.join('')).join('')
}

const multiResult = cipherMulti('there once was a ship that p', 'aleh', 'tachyla')
console.log(multiResult.join(''))
console.log(decipherMulti(multiResult, 'aleh', 'tachyla'))