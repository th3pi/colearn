const app = require('express').Router();
const db = require('../firestore')
const UserRepo = require('../repos/user_repo')

const user = new UserRepo(db);

app.post('/create-user', (req, res) => {
    user.create(req.body.firstName, req.body.lastName, req.body.email).then((data) => {
        res.status(200).send(data);
    }).catch(err => {
        console.log(err);
    })
})

app.get('/get-user', (req, res) => {
    user.get(req.query.email).then((data) => {
        res.status(200).send(data)
    }).catch(err => {
        console.log(err);
    })
})

module.exports = app;