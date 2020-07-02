/**
 * Repository for SQL Sessions
 */
const randomWords = require('random-words')
const CustomDate = require('../../modules/date')
const date = new CustomDate(new Date());
const admin = require('firebase-admin')

class SqlSessionRepo {
    constructor(db) {
        this.collection = db.collection('sessions');
    }
    create(email) {
        var sessionId = randomWords({ exactly: 4, join: '-' })
        return new Promise((resolve, reject) => {
            this.collection.doc(sessionId).set({
                leader: email,
                sessionId: sessionId,
                createdOn: date.getCurrentDate(),
                lastActive: date.getCurrentDate(),
                language: 'sql',
                pin: Math.round(Math.random() * 9999 + 1000),
            }).then(() => {
                resolve(sessionId)
            }).catch(err => {
                reject(err)
            })
        })
    }

    join(email, sessionId, pin) {
        return new Promise((resolve, reject) => {
            const session = this.collection.doc(sessionId);
            session.get().then(doc => {
                if (doc.exists) {
                    if (doc.data().pin == pin) {
                        session.update({
                            colearners: admin.firestore.FieldValue.arrayUnion(email),
                            lastActive: date.getCurrentDate(),
                        }).then(() => {
                            resolve({
                                message: "New user joined",
                                email: email,
                                code: 1,
                            }).catch(err => {
                                reject({ message: err, code: 2 })
                            })
                        }).catch(err => reject({ message: err, code: 2 }))
                    } else {
                        reject({ message: "Invalid pin", code: 3 })
                    }
                }
            })
        })
    }

    get(sessionId) {
        return new Promise((resolve, reject) => {
            this.collection.doc(sessionId).get().then(doc => {
                if (doc.exists) resolve(doc.data());
                else reject({ message: "Invalid session", code: 0 })
            }).catch(err => reject({ message: err, code: 2 }))
        });
    }
}

module.exports = SqlSessionRepo