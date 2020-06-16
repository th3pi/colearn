const sqlite3 = require('sqlite3');


const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.log("Could not connect", err);

    } else {
        console.log('Connected to database');

    }
})

// db.run(` CREATE TABLE Persons (
//     PersonIDint,
//     LastName varchar(255),
//     FirstName varchar(255),
//     Address varchar(255),
//     City varchar(255)
// ); `, (err) => {
//     if (err) console.log(err);
//     else console.log("Succ");

// });

// db.run(`INSERT INTO Persons (PersonID, LastName, FirstName, Address, City) VALUES(1, 'Bhuiyan', 'Tanjimul', 'Highland Ave', 'NY');`, (err) => {
//     if (err) console.log(err);
//     else console.log("Succ");
// })

new Promise((resolve, reject) => {
    db.get('SELECT * FROM Persons', (err, result) => {
        if (err) {
            console.log(err);
            reject(err);
        }
        else {
            console.log("From promise", result);
            resolve(err);
        }
    })
})sss