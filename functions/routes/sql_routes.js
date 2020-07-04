const express = require('express');
var serviceAccount = require('../permission.json')
const Dao = require('../dao.js');
const SqlRepository = require('../repos/sql_repository');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "co-learn-a05d9.appspot.com"
})

// Database location
const sqlite3 = new Dao('https://firebasestorage.googleapis.com/v0/b/co-learn-a05d9.appspot.com/o/database%2Ftest1.sqlite3?alt=media&token=95576fb6-91de-420c-a623-d141d029213c')
const repo = new SqlRepository(sqlite3)

const db = require('../firestore')


const app = express.Router();

/**
 * Sends a SQL command to server
 * Request is sent to http://address/?query=[command]
 */
app.get('/local-sql-query', (req, res) => {
    const sql = req.query.query;
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
            await db.collection('sessions').doc(req.body.name).set({ query: req.body.query })
            return res.status(200).send();
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        };
    })();
});

app.post('/reset', (req, res) => {
    (async () => {
        try {
            await db.collection('sessions').doc(req.body.name).set({ query: '' });
            return res.status(200).send('Successfully reset');
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    })();
})

app.post('/sync-session', (req, res) => {
    db.collection('sessions').doc(req.body.name).set({ query: req.body.query }).then(() => {
        res.status(200).send();
    }).catch(err => {
        res.status(500).send(err);
    })
})

module.exports = app;