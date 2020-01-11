const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'example')));

app.get('/', async (req, res) => {
    return res.sendFile(__dirname + '/example/index.html');
});

require('./core/api.route')(app, path.join(__dirname, 'uploads'));

app.listen(3000);
console.log("Running on 3000");