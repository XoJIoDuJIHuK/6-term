const { User } = require('./models');
const express = require('express');

const app = express();

app.get('/error', (req, res, next) => {
    next(Error('lmao, error'));
});

app.post('/user', async (req, res) => {
    userName = req.query.userName;
    const user = await User.create({userName});
    res.send(`user ${userName} created`);
});

app.get('/', async (req, res) => {
    const users = (await User.findAll()).map(u => u.dataValues);
    res.send(users);
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(200).send({
        isError: true,
        message: err.message
    });
});

app.listen(3000, 'localhost', () => {
    console.log('app listening on https://localhost:3000');
});