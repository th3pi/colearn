class BetaRepo {
  constructor(db) {
    this.db = db;
  }

  validate(code) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("beta")
        .doc(code)
        .get()
        .then((doc) => {
          if (doc.exists) {
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

  generate() {
    let randomCode = Math.round(Math.random() * 9999 + 1000);
    return new Promise((resolve, reject) => {
      this.db
        .collection("beta")
        .doc("" + randomCode)
        .set({
          status: "unused",
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
