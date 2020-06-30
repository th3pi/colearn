const app = require("express").Router();
const db = require("../firestore");
const BetaRepo = require("../repos/beta/beta_repo");

const beta = new BetaRepo(db);

app.get("/validate-beta", (req, res) => {
  beta
    .validate(req.query.code)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/generate-beta", (req, res) => {
  beta
    .generate()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = app;
