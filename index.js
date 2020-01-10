const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    return res.json({
        success: true,
        message: "working"
    });
});



app.listen(3000);
console.log("Running on 3000");