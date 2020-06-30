const admin = require('firebase-admin');
var serviceAccount = require('./permission.json')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://co-learn-a05d9.firebaseio.com"
})
const db = admin.firestore();

module.exports = db;