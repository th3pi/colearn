const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlRoutes = require('./routes/sql_routes')
const userRoutes = require('./routes/user_routes')


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test.json', (req, res) => {
    res.json('Hello world!');
})



app.use('/sql', sqlRoutes);
app.use('/user', userRoutes);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
