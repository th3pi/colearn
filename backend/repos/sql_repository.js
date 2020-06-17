/**
 * Repository for all SQL commands
 */

class SqlRepository {
    /**
     * Establishes a connection to the database
     * @param {SQLite3.Database} db Sqlite3 Database object that creates a connection to the database
     */
    constructor(db) {
        this.db = db;
    }

    sendCommand(command) {
        console.log(command);
        if (command.match(/INSERT/i) || command.match(/CREATE/i)) {
            console.log("Received a RUN command");
            return this.db.run(command);
        } else if (command.match(/SELECT */i)) {
            console.log("Received an ALL command");
            return this.db.all(command);
        } else {
            console.log("Received a GET command");
            return this.db.get(command);
        }
    }

    selectOne(command) {
        console.log("RECEIVED: SELECT command");
        return this.db.get(command);
    }

    select(command) {
        console.log("RECEIVED: SELECT multiple command");
        return this.db.all(command);
    }

    createTable(command) {
        console.log("RECEIVED: CREATE TABLE command");
        return this.db.run(command);
    }

    insertInto(command) {
        console.log("RECEIVED: INSERT command");
        return this.db.run(command);
    }


}

module.exports = SqlRepository;