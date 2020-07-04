const app = require("express").Router();
const db = require("../firestore");
const SqlSessionRepo = require("../repos/session/sql_session_repo");

const session = new SqlSessionRepo(db);

app.post("/sql/create-session", (req, res) => {
    session
        .create(req.body.email)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.post("/sql/join-session", (req, res) => {
    session
        .join(req.body.email, req.body.sessionId, req.body.pin)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.get("/sql/fetch-session", (req, res) => {
    session
        .get(req.query.sessionId)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.put("/sql/update-work", (req, res) => {
    session
        .update(req.body.sessionId, req.body.sessionWork, req.body.type)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = app;
