const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('./config/database.config.js');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    dbName: "institute"
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.use(express.static(path.join(__dirname, 'example')));

app.get('/', async (req, res) => {
    //return res.sendFile(__dirname + '/example/index.html');
    return res.json({
        success: true,
        status: "working"
    });
});

require('./api/user/user.routes')(app);

require('./core/api.route')(app, path.join(__dirname, 'uploads'));

app.listen(3000);
console.log("Running on 3000");