const sqlite3 = require('sqlite3').verbose();

class Dao {
    /**
     * Constructor initializes connection to the database
     * @param {String} dbFilePath A valid filepath to store the database file in - must end in .db
     */
    constructor(dbFilePath) {
        console.log("RECEIVED DATABASE FILEPATH: " + dbFilePath);

        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log("FAILED: Could not connect to database", err);

            } else {
                console.log("SUCCESS: Connected to database");
            }
        })
    }

    /**
     * Runs SQL commands - INSERT, UPDATE, DELETE
     * @param {SQL} sql SQL Command
     * @param {Array} params Parameters to be plugged into the SQL Query
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log("SQL ERROR: " + sql);
                    console.log(err);
                    reject(err)
                } else {
                    resolve("SUCCESS: " + sql);
                }
            })
        })
    }

    /**
     * Gets only 1 SQL query result - SELECT
     * @param {SQL} sql SQL command to get one result
     * @param {Array} params Parameters to be plugged into the SQL Query
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log("SQL ERROR: " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    /**
     * Gets an array SQL query result - SELECT
     * @param {SQL} sql SQL commands to get multiple results
     * @param {Array} params Parameters to be plugged into the SQL Query
     */
    all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, results) => {
                if (err) {
                    console.log("SQL ERROR: " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }
}

module.exports = Dao;