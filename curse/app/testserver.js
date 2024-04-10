const express = require('express')
const fs = require('fs');

const app = express();
app.use(express.static('./views/react-front/dist'));
app.get('/', (req, res) => {
    res.contentType('html').send(fs.readFileSync('./views/react-front/dist/index.html'));
})
app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('server is listening');
})