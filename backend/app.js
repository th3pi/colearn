const express = require('express');
const cors = require('cors');
const path = require('path');

const sqlRoutes = require('./routes/sql_routes')

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sql', sqlRoutes);

app.listen(8282);

/**
 * Backend run checker
 * Send get request to http://localhost:8282/
 * returns HELLO WORLD!
 */
app.get('', (req, res) => {
    res.send("HELLO WORLD!");
})


module.exports = app;