const express = require('express');

const Dao = require('../src/dao');
const SqlRepository = require('../repos/sql_repository');

// Database location
const db = new Dao('./database/test1.sqlite3')
const repo = new SqlRepository(db)

const app = express.Router();

/**
 * Sends a SQL command to server
 * Request is sent to http://address/?sql=[command]
 */
app.get('/sql-query', (req, res) => {
    const sql = req.query.sql;
    console.log("API REQUEST ON: /sql/sql-query");

    repo.sendCommand(sql).then((result) => {
        res.send(result);
    })
})

module.exports = app;