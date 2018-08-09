const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res)=>{
    res.send('Server is running');
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
});

module.exports = app;
