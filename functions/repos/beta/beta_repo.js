class BetaRepo {
  constructor(db) {
    this.db = db;
  }

  validate(code) {
    let date = new Date();
    let options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/New_York"
    };
    let validatedOn = date.toLocaleTimeString("en-us", options);
    return new Promise((resolve, reject) => {
      let betaDb = this.db
        .collection("beta")
        .doc(code);
      betaDb.get().then((doc) => {
        if (doc.exists) {
          betaDb.update({
            lastUsed: validatedOn,
            status: 'used',
          })
          resolve(true);
        } else {
          resolve(false);
        }
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  generate(email) {
    let randomCode = Math.round(Math.random() * 9999 + 1000);
    let date = new Date();
    let options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/New_York"
    };
    let generatedOn = date.toLocaleTimeString("en-us", options);
    return new Promise((resolve, reject) => {
      this.db
        .collection("beta")
        .doc("" + randomCode)
        .set({
          status: "unused",
          for: email,
          generatedOn: generatedOn,
        })
        .then(() => {
          resolve("Successfully generated new code: " + randomCode);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = BetaRepo;
