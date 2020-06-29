const express = require('express');
const admin = require('firebase-admin');

const Dao = require('../dao.js');
const SqlRepository = require('../repos/sql_repository');

// Database location
const sqlite3 = new Dao('./database/test1.sqlite3')
const repo = new SqlRepository(sqlite3)
var serviceAccount = require('../permission.json')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://co-learn-a05d9.firebaseio.com"
})
const db = admin.firestore();

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
    }).catch((err) => {
        console.log(err);
        res.send(err);

    });
})

app.post('/session-query', (req, res) => {
    (async () => {
        try {
            await db.collection('session').doc('query').set({ query: req.body.query })
            return res.status(200).send();
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        };
    })();
});

module.exports = app;