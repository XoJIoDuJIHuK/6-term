const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function generateRandomNumbers(n) {
	const count = Math.floor(Math.random() * 5 + 5);
	const numbers = [];

	for (let i = 0; i < count; i++) {
		const number = Math.floor(Math.random() * (2 * n - 1) - n + 1);
		numbers.push(number);
	}

	return numbers;
}

app.post('/processA', (req, res) => {
	const x = parseInt(req.headers['x-value-x']);
	const y = parseInt(req.headers['x-value-y']);
	const sum = x + y;
	res.setHeader('X-Value-z', sum.toString());
	setTimeout(() => {
        res.send();
    }, 10e3)
});
app.post('/processB', (req, res) => {
	const n = parseInt(req.headers['x-rand-n']);
	const numbers = generateRandomNumbers(n);
	setTimeout(() => {
        res.json(numbers);
    }, 1e3)
});
app.get('/', (req, res) => {
	res.contentType('text/html').send(fs.readFileSync('C.html'))
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});