/**
 * Repository for all SQL commands
 */

class MasterRepository {
    /**
     * Establishes a connection to the database
     * @param {SQLite3.Database} db Sqlite3 Database object that creates a connection to the database
     */
    constructor(db) {
        this.db = db;
    }


    sendCommand(command) {
        console.log(command);

        if (command.includes('INSERT INTO') || command.includes('CREATE TABLE')) {
            console.log("Received a RUN command");
            this.db.run(command);
        } else if (command.includes(/SELECT */i)) {
            console.log("Received an ALL command");

            this.db.all(command);
        } else {
            console.log("Received a GET command");

            this.db.get(command);
        }
    }
}

module.exports = MasterRepository;