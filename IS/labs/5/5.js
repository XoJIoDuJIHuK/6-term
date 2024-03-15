
const columns = 5

function cipherSnake(text) {
	const rows = Math.ceil(text.length / 5)
	const columns = 5
	const result = []
	for (let i = 0; i < rows; i++) {
		const row = []
		for (let j = 0; j < columns; j++) {
			row.push(undefined)
		}
		result.push(row)
	}

	let rowIndex = 0
	let columnIndex = 0
	let direction = 1
	
	for (let i = 0; i < text.length; i++) {
	
		result[rowIndex][columnIndex] = text[i]
	
		if (direction === 1) {
			if (rowIndex === 0 && columnIndex < columns - 1) {
				columnIndex++
			} else if (columnIndex === columns - 1) {
				columnIndex--
			}
		}
		if (rowIndex === 0 || rowIndex === rows - 1) {
			direction *= -1
		}
	}

	return result
}
const result = cipherSnake('Hello, World!')
console.log()
//Hello world
//He, d
//lowl!
//lorNN