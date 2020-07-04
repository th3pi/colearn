const app = require("express").Router();
const rateLimit = require("express-rate-limit");
const db = require("../firestore");
const BetaRepo = require("../repos/beta/beta_repo");
const BetaMail = require("../repos/mail/beta_mail");

const mail = new BetaMail("Colearntecha4");
const beta = new BetaRepo(db);

const validateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: "Too many requests",
});

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

const generateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1,
  message: "Already requested",
});

app.post("/generate-beta", generateLimiter, (req, res) => {
  beta
    .generate(req.body.email)
    .then((data) => {
      mail
        .sendBeta(req.body.email, data)
        .then((mailData) => {
          res.status(200).send(mailData);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = app;
