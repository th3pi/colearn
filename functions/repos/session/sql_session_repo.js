/**
 * Repository for SQL Sessions
 */
const superb = require("superb");
const yesNo = require("yes-no-words");
const admin = require("firebase-admin");

class SqlSessionRepo {
  constructor(db) {
    this.db = db;
  }
  create(email) {
    var sessionId = "" + superb.random() + yesNo.yesRandom() + yesNo.noRandom();
    return new Promise((resolve, reject) => {
      this.db
        .collection("sessions")
        .doc(sessionId)
        .set({
          leader: email,
          sessionId: sessionId,
          createdOn: admin.firestore.FieldValue.serverTimestamp(),
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
          language: "sql",
          pin: Math.round(Math.random() * 9999 + 1000),
        })
        .then(() => {
          this.db
            .collection("users")
            .doc(email)
            .update({
              sqlSessions: admin.firestore.FieldValue.arrayUnion(sessionId),
            })
            .then(() => {
              resolve({ message: sessionId, code: 0 });
            })
            .catch((err) => {
              reject({ message: err, code: 2 });
            });
        })
        .catch((err) => {
          reject({ message: err, code: 2 });
        });
    });
  }

  join(email, sessionId, pin) {
    return new Promise((resolve, reject) => {
      const session = this.db.collection("sessions").doc(sessionId);
      session.get().then((doc) => {
        if (doc.exists) {
          if (doc.data().pin == pin) {
            session
              .update({
                colearners: admin.firestore.FieldValue.arrayUnion(email),
                lastActive: admin.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                resolve({
                  message: "New user joined",
                  email: email,
                  code: 1,
                }).catch((err) => {
                  reject({ message: err, code: 2 });
                });
              })
              .catch((err) => reject({ message: err, code: 2 }));
          } else {
            reject({ message: "Invalid pin", code: 3 });
          }
        }
      });
    });
  }

  get(sessionId) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("sessions")
        .doc(sessionId)
        .get()
        .then((doc) => {
          if (doc.exists) resolve(doc.data());
          else reject({ message: "Invalid session", code: 0 });
        })
        .catch((err) => reject({ message: err, code: 2 }));
    });
  }

  update(sessionId, sessionWork, type) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("sessions")
        .doc(sessionId)
        .update({
          sessionWork: sessionWork,
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
          type: type,
        })
        .then(() => {
          resolve({ message: "Updated sessionWork", code: 0 });
        })
        .catch((err) => {
          reject({ message: err, code: 2 });
        });
    });
  }
}

module.exports = SqlSessionRepo;
