const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const PORT = 3000;
app.use(express.json());
// Загрузка файла openapi.yaml
const swaggerDocument = YAML.load('./openapi.yaml');

let phoneDirectory = [
    { id: 1, name: "John", phoneNumber: "12345678" },
    { id: 2, name: "Alice", phoneNumber: "98765432" }
];

app.get('/TS', (req, res) => {
    res.json(phoneDirectory);
});

app.post('/TS', (req, res) => {
    const { name, phoneNumber } = req.body;
    
    // Проверяем, что номер телефона содержит ровно 8 цифр
    if (!name || !phoneNumber || !/^\d{8}$/.test(phoneNumber)) {
        return res.status(400).json({ error: "Name and a valid 8-digit phoneNumber are required" });
    }

    const id = phoneDirectory.length + 1;
    const newEntry = { id, name, phoneNumber };
    phoneDirectory.push(newEntry);
    res.status(201).json(newEntry);
});
app.put('/TS', (req, res) => {
    const { id, name, phoneNumber } = req.body;

    if (!id || !name || !phoneNumber) {
        return res.status(400).json({ error: "id, name, and phoneNumber are required in the request body" });
    }

    const entryIndex = phoneDirectory.findIndex(entry => entry.id === id);
    if (entryIndex === -1) {
        return res.status(404).json({ error: "Phone entry not found" });
    }

    phoneDirectory[entryIndex] = { id, name, phoneNumber };
    res.json(phoneDirectory[entryIndex]);
});

app.delete('/TS', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "id is required in the request body" });
    }

    const entryIndex = phoneDirectory.findIndex(entry => entry.id === id);
    if (entryIndex === -1) {
        return res.status(404).json({ error: "Phone entry not found" });
    }

    phoneDirectory.splice(entryIndex, 1);
    res.sendStatus(204);
});



app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
