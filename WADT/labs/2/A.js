const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/process', (req, res) => {
	const x = parseInt(req.headers['x-value-x']);
	const y = parseInt(req.headers['x-value-y']);
	const sum = x + y;

	res.setHeader('X-Value-z', sum.toString());
	res.send();
});
app.get('/', (req, res) => {
	res.contentType('text/html').send(fs.readFileSync('A.html'))
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});