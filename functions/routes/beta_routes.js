const app = require("express").Router();
const db = require("../firestore");
const BetaRepo = require("../repos/beta/beta_repo");
const BetaMail = require('../repos/mail/beta_mail')


// const mail = new BetaMail('CHANGE PASSWORD')
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
    .generate(req.body.email)
    .then((data) => {
      mail.sendBeta(req.body.email, data).then((mailData) => {
        res.status(200).send(mailData);
      }).catch(err => {
        res.status(500).send(err);

      })
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = app;
