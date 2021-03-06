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

    /**
     * Sends command, API handles the command and returns back result
     * @param {String} command a valid sql command
     */
    sendCommand(command) {
        //RegEx match "CREATE" commands, because database.run(...) only accepts these
        if (command.match(/INSERT/i) || command.match(/CREATE/i) || command.match(/UPDATE/i) || command.match(/DELETE/i) || command.match(/ALTER/i)) {
            console.log("RECEIVED (RUN): " + command);
            return this.db.run(command);
        }

        //RegEx match "SELECT" commands that return multiple results
        else if (command.match(/SELECT/i) || command.match(/PRAGMA/i)) {
            console.log("RECEIVED (ALL): " + command);
            return this.db.all(command);
        } else {
            console.log("RECEIVED (GET): " + command);
            return this.db.get(command);
        }
    }

}

module.exports = SqlRepository;