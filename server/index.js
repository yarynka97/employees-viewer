const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use('/api', apiRoutes);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
});

module.exports = app;
