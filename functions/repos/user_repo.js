/**
 * Repository for colearn users
 */

class UserRepo {
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new user entry in the database and updates the user count, in the colearn 
     * stats collection
     * @param {String} firstName First name of the new user
     * @param {String} lastName Last name of the new user
     * @param {String} email email(id) of the new user
     */
    create(firstName, lastName, email) {
        return new Promise((resolve, reject) => {
            const users = this.db.collection('users').doc(email);
            const stats = this.db.collection('stats').doc('users');
            stats.get().then((data) => {
                if (data.exists) {
                    let count = data.get('count');
                    count = count + 1;
                    stats.set({ count: count }).then(() => {
                        users.set({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            userId: ('' + firstName + lastName + (count + 1000)).toLowerCase()
                        }).then((data) => {
                            resolve(data);
                        }).catch(err => {
                            reject(err);
                        })
                    })
                } else {
                    this.db.collection('stats').doc('users').set({
                        count: 1
                    }).then((data) => {
                        resolve(data);
                    }).catch(err => {
                        reject(err);
                    })
                }
            })
        })
    }

    get(email) {
        return new Promise((resolve, reject) => {
            this.db.collection('users').doc(email).get().then((data) => {
                if (data.exists) {
                    let details = {
                        firstName: data.get('firstName'),
                        lastName: data.get('lastName'),
                        userId: data.get('userId')
                    }
                    resolve(details)
                } else {
                    reject("No records found")
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}
module.exports = UserRepo;