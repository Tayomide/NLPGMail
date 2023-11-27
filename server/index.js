const express = require('express');

const embed = require('./embed');

const app = express();

app.use(express.json({ limit: "100mb"}));
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
	next();
});

app.post('/embed', embed);

const PORT = 5000;

app.listen(PORT, () => {
	console.log('Server started at');
	console.log(`http://localhost:${PORT}`);
});